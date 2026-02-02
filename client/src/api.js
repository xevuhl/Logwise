const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ============ LOG SOURCES ============

export const sourcesAPI = {
  getAll: () => fetchAPI('/sources'),
  
  getById: (id) => fetchAPI(`/sources/${id}`),
  
  create: (source) => fetchAPI('/sources', {
    method: 'POST',
    body: JSON.stringify(source),
  }),
  
  update: (id, source) => fetchAPI(`/sources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(source),
  }),
  
  delete: (id) => fetchAPI(`/sources/${id}`, {
    method: 'DELETE',
  }),
  
  bulkImport: (sources, replaceAll = false) => fetchAPI('/sources/bulk', {
    method: 'POST',
    body: JSON.stringify({ sources, replaceAll }),
  }),
  
  updateOrder: (orderedIds) => fetchAPI('/sources/order', {
    method: 'PUT',
    body: JSON.stringify({ orderedIds }),
  }),
};

// ============ ASSESSMENTS ============

export const assessmentsAPI = {
  getAll: () => fetchAPI('/assessments'),
  
  save: (questionId, response) => fetchAPI(`/assessments/${questionId}`, {
    method: 'POST',
    body: JSON.stringify(response),
  }),
  
  saveAll: (responses) => fetchAPI('/assessments/bulk', {
    method: 'POST',
    body: JSON.stringify(responses),
  }),
};

// ============ AUDIT LOG ============

export const auditAPI = {
  getAll: () => fetchAPI('/audit'),
};

// ============ SAVED VIEWS ============

export const viewsAPI = {
  getAll: () => fetchAPI('/views'),
  
  create: (view) => fetchAPI('/views', {
    method: 'POST',
    body: JSON.stringify(view),
  }),
  
  delete: (id) => fetchAPI(`/views/${id}`, {
    method: 'DELETE',
  }),
};

// ============ EXPORT ============

export const exportAPI = {
  getAll: () => fetchAPI('/export'),
};

// ============ VALIDATION TESTS ============

export const validationAPI = {
  getAll: () => fetchAPI('/validation'),
  
  save: (testId, result) => fetchAPI(`/validation/${testId}`, {
    method: 'POST',
    body: JSON.stringify(result),
  }),
  
  delete: (testId) => fetchAPI(`/validation/${testId}`, {
    method: 'DELETE',
  }),
  
  getHistory: (testId) => fetchAPI(`/validation/${testId}/history`),
};

// ============ VALIDATION CAMPAIGNS ============

export const campaignsAPI = {
  getAll: () => fetchAPI('/campaigns'),
  
  getById: (id) => fetchAPI(`/campaigns/${id}`),
  
  create: (campaign) => fetchAPI('/campaigns', {
    method: 'POST',
    body: JSON.stringify(campaign),
  }),
  
  update: (id, campaign) => fetchAPI(`/campaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(campaign),
  }),
  
  delete: (id) => fetchAPI(`/campaigns/${id}`, {
    method: 'DELETE',
  }),
  
  getTests: (id) => fetchAPI(`/campaigns/${id}/tests`),
};

// ============ RELATIONSHIPS ============

export const relationshipsAPI = {
  getAll: () => fetchAPI('/relationships'),
  
  getBySource: (sourceId) => fetchAPI(`/relationships/source/${sourceId}`),
  
  create: (relationship) => fetchAPI('/relationships', {
    method: 'POST',
    body: JSON.stringify(relationship),
  }),
  
  update: (id, relationship) => fetchAPI(`/relationships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(relationship),
  }),
  
  delete: (id) => fetchAPI(`/relationships/${id}`, {
    method: 'DELETE',
  }),
};

// ============ TARGETS ============

export const targetsAPI = {
  getAll: () => fetchAPI('/targets'),
  
  getById: (id) => fetchAPI(`/targets/${id}`),
  
  create: (target) => fetchAPI('/targets', {
    method: 'POST',
    body: JSON.stringify(target),
  }),
  
  update: (id, target) => fetchAPI(`/targets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(target),
  }),
  
  delete: (id) => fetchAPI(`/targets/${id}`, {
    method: 'DELETE',
  }),
};

// ============ SOURCE HEALTH VALIDATION ============

export const sourceHealthAPI = {
  // Get latest health status for all sources
  getAll: () => fetchAPI('/source-health'),
  
  // Get health history for a specific source
  getHistory: (sourceId) => fetchAPI(`/source-health/${sourceId}`),
  
  // Get latest health for a specific source
  getLatest: (sourceId) => fetchAPI(`/source-health/${sourceId}/latest`),
  
  // Save a health check result
  save: (sourceId, checks) => fetchAPI(`/source-health/${sourceId}`, {
    method: 'POST',
    body: JSON.stringify({ checks }),
  }),
  
  // Delete health history for a source
  delete: (sourceId) => fetchAPI(`/source-health/${sourceId}`, {
    method: 'DELETE',
  }),
};

// ============ SOURCE VALIDATION CONFIGS ============

export const sourceValidationConfigsAPI = {
  // Get all validation configs
  getAll: () => fetchAPI('/source-validation-configs'),
  
  // Get validation config for a specific source
  getBySourceId: (sourceId) => fetchAPI(`/source-validation-configs/${sourceId}`),
  
  // Save validation config for a source
  save: (sourceId, config) => fetchAPI(`/source-validation-configs/${sourceId}`, {
    method: 'POST',
    body: JSON.stringify(config),
  }),
  
  // Delete validation config for a source
  delete: (sourceId) => fetchAPI(`/source-validation-configs/${sourceId}`, {
    method: 'DELETE',
  }),
};
