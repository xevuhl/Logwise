// ============ INPUT VALIDATION ============
// Server-side validation for all API endpoints.
// Each validator returns { valid: true } or { valid: false, errors: [...] }.

// --- Helpers ---

function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function isOptionalString(val) {
  return val === undefined || val === null || typeof val === 'string';
}

function isOptionalArrayOfStrings(val) {
  return val === undefined || val === null || (Array.isArray(val) && val.every(v => typeof v === 'string'));
}

function isOneOf(val, allowed) {
  return allowed.includes(val);
}

function maxLength(val, max) {
  return typeof val !== 'string' || val.length <= max;
}

function collectErrors(checks) {
  const errors = [];
  for (const [condition, message] of checks) {
    if (!condition) errors.push(message);
  }
  return errors;
}

function result(errors) {
  return errors.length === 0
    ? { valid: true }
    : { valid: false, errors };
}

// --- Allowed values (mirroring client/src/constants.js) ---

const VALID_STATUSES = ['collected', 'partial', 'planned', 'not-collected', 'blocked'];

const VALID_CATEGORIES = [
  'Network', 'Endpoint', 'Cloud', 'Database', 'Virtualization',
  'EDR', 'NDR', 'Email Security', 'IAM', 'CASB', 'DLP', 'Vulnerability', 'PAM',
  'WAF', 'CDN', 'Proxy', 'DNS',
  'Application', 'SaaS', 'DevOps', 'Collaboration',
  'Physical Security', 'IoT',
  'Custom', 'Other',
];

const VALID_LOG_TYPES = [
  'syslog', 'windows-event', 'json', 'cef', 'leef', 'csv', 'xml',
  'netflow', 'pcap', 'api', 'database', 'file', 'cloud-native', 'other',
];

const VALID_CRITICALITY_TIERS = ['tier-1', 'tier-2', 'tier-3', 'tier-4'];

const VALID_TARGET_TYPES = [
  'siem', 'soar', 'data-lake', 'log-collector', 'cloud-storage',
  'xdr', 'edr', 'ndr', 'ticketing', 'archive', 'analytics', 'other',
];

const VALID_TARGET_STATUSES = [
  'active', 'maintenance', 'degraded', 'offline', 'planned', 'decommissioned',
];

const VALID_RELATIONSHIP_TYPES = [
  'feeds', 'enriches', 'triggers', 'depends-on',
  'aggregates', 'normalizes', 'correlates', 'mirrors',
  // Legacy values from data-models.md
  'filters', 'transforms', 'replicates',
];

const VALID_SOURCE_TYPES = ['source', 'target'];

const VALID_ASSESSMENT_RESPONSES = ['yes', 'partial', 'no', 'na'];

const VALID_CAMPAIGN_STATUSES = ['active', 'completed', 'draft'];

const VALID_INTEGRATION_TYPES = ['cribl', 'adx'];
const VALID_AUTH_TYPES = ['oauth', 'bearer', 'basic'];

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_NOTES_LENGTH = 10000;
const MAX_FIELD_LENGTH = 2000;
const MAX_BULK_IMPORT = 500;

// --- Validators ---

export function validateSource(body, { isUpdate = false } = {}) {
  const errors = collectErrors([
    // Name is required on create, optional on update
    [isUpdate || isNonEmptyString(body.name), 'name is required and must be a non-empty string'],
    [!body.name || maxLength(body.name, MAX_NAME_LENGTH), `name must be at most ${MAX_NAME_LENGTH} characters`],

    // Optional strings with length limits
    [isOptionalString(body.description), 'description must be a string'],
    [!body.description || maxLength(body.description, MAX_DESCRIPTION_LENGTH), `description must be at most ${MAX_DESCRIPTION_LENGTH} characters`],

    // Enum fields — only validate when provided
    [!body.status || isOneOf(body.status, VALID_STATUSES), `status must be one of: ${VALID_STATUSES.join(', ')}`],
    [!body.category || isOneOf(body.category, VALID_CATEGORIES), `category must be one of: ${VALID_CATEGORIES.join(', ')}`],
    [!body.logType || isOneOf(body.logType, VALID_LOG_TYPES), `logType must be one of: ${VALID_LOG_TYPES.join(', ')}`],
    [!body.criticalityTier || isOneOf(body.criticalityTier, VALID_CRITICALITY_TIERS), `criticalityTier must be one of: ${VALID_CRITICALITY_TIERS.join(', ')}`],

    // Tags
    [isOptionalArrayOfStrings(body.tags), 'tags must be an array of strings'],

    // Optional text fields
    [isOptionalString(body.ownerTeam), 'ownerTeam must be a string'],
    [isOptionalString(body.ownerContact), 'ownerContact must be a string'],
    [isOptionalString(body.collectionMethod), 'collectionMethod must be a string'],
    [isOptionalString(body.networkRequirements), 'networkRequirements must be a string'],
    [isOptionalString(body.credentials), 'credentials must be a string'],
    [isOptionalString(body.validationPlan), 'validationPlan must be a string'],
    [isOptionalString(body.expectedFields), 'expectedFields must be a string'],
    [isOptionalString(body.sampleQuery), 'sampleQuery must be a string'],
    [isOptionalString(body.retention), 'retention must be a string'],
    [isOptionalString(body.notes), 'notes must be a string'],
    [!body.notes || maxLength(body.notes, MAX_NOTES_LENGTH), `notes must be at most ${MAX_NOTES_LENGTH} characters`],

    // Disallow client setting system fields
    [body.id === undefined, 'id cannot be set by the client'],
    [body.createdAt === undefined, 'createdAt cannot be set by the client'],
    [body.updatedAt === undefined, 'updatedAt cannot be set by the client'],
  ]);
  return result(errors);
}

export function validateBulkImport(body) {
  const errors = [];

  if (!body.sources && !Array.isArray(body)) {
    errors.push('Request body must contain a "sources" array');
    return result(errors);
  }

  const sourceList = body.sources || body;
  if (!Array.isArray(sourceList)) {
    errors.push('"sources" must be an array');
    return result(errors);
  }

  if (sourceList.length === 0) {
    errors.push('sources array cannot be empty');
    return result(errors);
  }

  if (sourceList.length > MAX_BULK_IMPORT) {
    errors.push(`Cannot import more than ${MAX_BULK_IMPORT} sources at a time`);
    return result(errors);
  }

  // Validate each source has at least a name
  sourceList.forEach((source, i) => {
    if (!isNonEmptyString(source.name)) {
      errors.push(`sources[${i}].name is required and must be a non-empty string`);
    }
    if (source.status && !isOneOf(source.status, VALID_STATUSES)) {
      errors.push(`sources[${i}].status is invalid`);
    }
    if (source.category && !isOneOf(source.category, VALID_CATEGORIES)) {
      errors.push(`sources[${i}].category is invalid`);
    }
  });

  // Cap error count to avoid huge responses
  if (errors.length > 20) {
    return result([...errors.slice(0, 20), `...and ${errors.length - 20} more errors`]);
  }
  return result(errors);
}

export function validateSourceOrder(body) {
  const errors = collectErrors([
    [body.orderedIds !== undefined, 'orderedIds is required'],
    [Array.isArray(body.orderedIds), 'orderedIds must be an array'],
    [!Array.isArray(body.orderedIds) || body.orderedIds.every(id => typeof id === 'string'), 'orderedIds must be an array of strings'],
  ]);
  return result(errors);
}

export function validateTarget(body, { isUpdate = false } = {}) {
  const errors = collectErrors([
    [isUpdate || isNonEmptyString(body.name), 'name is required and must be a non-empty string'],
    [!body.name || maxLength(body.name, MAX_NAME_LENGTH), `name must be at most ${MAX_NAME_LENGTH} characters`],
    [isOptionalString(body.description), 'description must be a string'],
    [!body.description || maxLength(body.description, MAX_DESCRIPTION_LENGTH), `description must be at most ${MAX_DESCRIPTION_LENGTH} characters`],

    [!body.type || isOneOf(body.type, VALID_TARGET_TYPES), `type must be one of: ${VALID_TARGET_TYPES.join(', ')}`],
    [!body.status || isOneOf(body.status, VALID_TARGET_STATUSES), `status must be one of: ${VALID_TARGET_STATUSES.join(', ')}`],

    [isOptionalString(body.vendor), 'vendor must be a string'],
    [isOptionalString(body.version), 'version must be a string'],
    [isOptionalString(body.endpoint), 'endpoint must be a string'],
    [isOptionalString(body.port), 'port must be a string'],
    [isOptionalString(body.protocol), 'protocol must be a string'],
    [isOptionalString(body.credentials), 'credentials must be a string'],
    [isOptionalString(body.retentionDays), 'retentionDays must be a string'],
    [isOptionalString(body.capacityGB), 'capacityGB must be a string'],
    [isOptionalString(body.notes), 'notes must be a string'],
    [!body.notes || maxLength(body.notes, MAX_NOTES_LENGTH), `notes must be at most ${MAX_NOTES_LENGTH} characters`],

    [body.id === undefined, 'id cannot be set by the client'],
    [body.createdAt === undefined, 'createdAt cannot be set by the client'],
    [body.updatedAt === undefined, 'updatedAt cannot be set by the client'],
  ]);
  return result(errors);
}

export function validateRelationship(body, { isUpdate = false } = {}) {
  const errors = collectErrors([
    [isUpdate || isNonEmptyString(body.sourceId), 'sourceId is required'],
    [isUpdate || isNonEmptyString(body.targetId), 'targetId is required'],

    // sourceType defaults to 'source', targetType defaults to 'target'
    [!body.sourceType || isOneOf(body.sourceType, VALID_SOURCE_TYPES), `sourceType must be one of: ${VALID_SOURCE_TYPES.join(', ')}`],
    [!body.targetType || isOneOf(body.targetType, ['target']), 'targetType must be "target"'],

    [!body.type || isOneOf(body.type, VALID_RELATIONSHIP_TYPES), `type must be one of: ${VALID_RELATIONSHIP_TYPES.join(', ')}`],

    [isOptionalString(body.description), 'description must be a string'],
    [isOptionalString(body.dataFlow), 'dataFlow must be a string'],
    [isOptionalString(body.protocol), 'protocol must be a string'],

    // Prevent self-referencing
    [!body.sourceId || !body.targetId || body.sourceId !== body.targetId || body.sourceType !== body.targetType,
      'A relationship cannot reference the same entity as both source and target'],

    [body.id === undefined, 'id cannot be set by the client'],
  ]);
  return result(errors);
}

export function validateAssessment(body) {
  const errors = collectErrors([
    [!body.response || isOneOf(body.response, VALID_ASSESSMENT_RESPONSES), `response must be one of: ${VALID_ASSESSMENT_RESPONSES.join(', ')}`],
    [isOptionalString(body.notes), 'notes must be a string'],
    [!body.notes || maxLength(body.notes, MAX_NOTES_LENGTH), `notes must be at most ${MAX_NOTES_LENGTH} characters`],
    [isOptionalArrayOfStrings(body.linkedSources), 'linkedSources must be an array of strings'],
  ]);
  return result(errors);
}

export function validateBulkAssessments(body) {
  if (!Array.isArray(body)) {
    return result(['Request body must be an array of assessment responses']);
  }
  const errors = [];
  body.forEach((item, i) => {
    if (!isNonEmptyString(item.questionId)) {
      errors.push(`[${i}].questionId is required`);
    }
    if (item.response && !isOneOf(item.response, VALID_ASSESSMENT_RESPONSES)) {
      errors.push(`[${i}].response is invalid`);
    }
  });
  if (errors.length > 20) {
    return result([...errors.slice(0, 20), `...and ${errors.length - 20} more errors`]);
  }
  return result(errors);
}

export function validateCampaign(body, { isUpdate = false } = {}) {
  const errors = collectErrors([
    [isUpdate || isNonEmptyString(body.name), 'name is required and must be a non-empty string'],
    [!body.name || maxLength(body.name, MAX_NAME_LENGTH), `name must be at most ${MAX_NAME_LENGTH} characters`],
    [isOptionalString(body.description), 'description must be a string'],
    [!body.status || isOneOf(body.status, VALID_CAMPAIGN_STATUSES), `status must be one of: ${VALID_CAMPAIGN_STATUSES.join(', ')}`],
    [!body.sourceIds || isOptionalArrayOfStrings(body.sourceIds), 'sourceIds must be an array of strings'],
    [isOptionalString(body.startDate), 'startDate must be a string'],
    [isOptionalString(body.endDate), 'endDate must be a string'],

    [body.id === undefined, 'id cannot be set by the client'],
  ]);
  return result(errors);
}

export function validateValidationTest(body) {
  const errors = collectErrors([
    [isOptionalString(body.campaignId), 'campaignId must be a string'],
    [body.logCaptured === undefined || typeof body.logCaptured === 'boolean', 'logCaptured must be a boolean'],
    [body.detectionFired === undefined || typeof body.detectionFired === 'boolean', 'detectionFired must be a boolean'],
    [isOptionalString(body.notes), 'notes must be a string'],
    [!body.notes || maxLength(body.notes, MAX_NOTES_LENGTH), `notes must be at most ${MAX_NOTES_LENGTH} characters`],
    [isOptionalString(body.testedBy), 'testedBy must be a string'],
  ]);
  return result(errors);
}

export function validateSavedView(body) {
  const errors = collectErrors([
    [isNonEmptyString(body.name), 'name is required and must be a non-empty string'],
    [!body.name || maxLength(body.name, MAX_NAME_LENGTH), `name must be at most ${MAX_NAME_LENGTH} characters`],
    [body.filters === undefined || (typeof body.filters === 'object' && !Array.isArray(body.filters)),
      'filters must be an object'],
    [body.id === undefined, 'id cannot be set by the client'],
  ]);
  return result(errors);
}

export function validateIntegration(body, { isUpdate = false } = {}) {
  const errors = collectErrors([
    [isUpdate || isNonEmptyString(body.name), 'name is required and must be a non-empty string'],
    [!body.name || maxLength(body.name, MAX_NAME_LENGTH), `name must be at most ${MAX_NAME_LENGTH} characters`],

    [isUpdate || isOneOf(body.type, VALID_INTEGRATION_TYPES), `type must be one of: ${VALID_INTEGRATION_TYPES.join(', ')}`],

    [isOptionalString(body.baseUrl), 'baseUrl must be a string'],
    [isOptionalString(body.clusterUrl), 'clusterUrl must be a string'],
    [isOptionalString(body.database), 'database must be a string'],
    [isOptionalString(body.tenantId), 'tenantId must be a string'],
    [isOptionalString(body.workerGroup), 'workerGroup must be a string'],
    [!body.authType || isOneOf(body.authType, VALID_AUTH_TYPES), `authType must be one of: ${VALID_AUTH_TYPES.join(', ')}`],

    // Credential fields are optional strings
    [isOptionalString(body.clientId), 'clientId must be a string'],
    [isOptionalString(body.clientSecret), 'clientSecret must be a string'],
    [isOptionalString(body.bearerToken), 'bearerToken must be a string'],
    [isOptionalString(body.username), 'username must be a string'],
    [isOptionalString(body.password), 'password must be a string'],

    [body.id === undefined, 'id cannot be set by the client'],
  ]);

  // Type-specific required fields on create
  if (!isUpdate && body.type === 'cribl') {
    if (!isNonEmptyString(body.baseUrl)) errors.push('baseUrl is required for Cribl integrations');
  }
  if (!isUpdate && body.type === 'adx') {
    if (!isNonEmptyString(body.clusterUrl)) errors.push('clusterUrl is required for ADX integrations');
    if (!isNonEmptyString(body.database)) errors.push('database is required for ADX integrations');
  }

  return result(errors);
}

// --- Middleware helper ---

/**
 * Express middleware factory that validates req.body against a validator function.
 * Usage: app.post('/api/sources', validate(validateSource), (req, res) => { ... })
 */
export function validate(validatorFn, options = {}) {
  return (req, res, next) => {
    const { valid, errors } = validatorFn(req.body, options);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    next();
  };
}
