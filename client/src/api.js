const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  });

  if (response.status === 401) {
    // Redirect to login
    window.dispatchEvent(new CustomEvent('logwise-auth-required'));
    throw new Error('Authentication required');
  }

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

// ============ AUTH ============

export const authAPI = {
  check: () => fetch(`${API_BASE}/auth/check`, { credentials: 'same-origin' }).then(r => r.json()),
  login: (username, password) => fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ username, password }),
  }).then(r => r.json().then(data => ({ ...data, ok: r.ok }))),
  logout: () => fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'same-origin',
  }).then(r => r.json()),
};

// ============ USERS (admin) ============

export const usersAPI = {
  getAll: () => fetchAPI('/users'),
  create: (user) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(user) }),
  update: (id, updates) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  delete: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
};

// ============ LOG SOURCES ============

export const sourcesAPI = {
  getAll: () => fetchAPI('/sources'),
  
  getById: (id) => fetchAPI(`/sources/${id}`),
  
  getActivity: (id) => fetchAPI(`/sources/${id}/activity`),
  
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
  
  // Cleanup orphaned relationships (where source or target no longer exists)
  cleanup: () => fetchAPI('/relationships/cleanup', {
    method: 'POST',
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

// ============ INTEGRATIONS ============

export const integrationsAPI = {
  // Get all integrations
  getAll: () => fetchAPI('/integrations'),
  
  // Get single integration
  getById: (id) => fetchAPI(`/integrations/${id}`),
  
  // Create integration
  create: (integration) => fetchAPI('/integrations', {
    method: 'POST',
    body: JSON.stringify(integration),
  }),
  
  // Update integration
  update: (id, integration) => fetchAPI(`/integrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(integration),
  }),
  
  // Delete integration
  delete: (id) => fetchAPI(`/integrations/${id}`, {
    method: 'DELETE',
  }),
  
  // Test integration connection
  test: (id) => fetchAPI(`/integrations/${id}/test`, {
    method: 'POST',
  }),
  
  // Get sync history
  getHistory: (id) => fetchAPI(`/integrations/${id}/history`),
  
  // Preview sources (without importing)
  preview: (id) => fetchAPI(`/integrations/${id}/preview`, {
    method: 'POST',
  }),
  
  // Sync sources from integration
  sync: (id, options) => fetchAPI(`/integrations/${id}/sync`, {
    method: 'POST',
    body: JSON.stringify(options),
  }),
  
  // ADX-specific: Get table details including schema, mappings, and sample data
  getAdxTableDetails: (id, tableName) => fetchAPI(`/integrations/${id}/adx/table/${encodeURIComponent(tableName)}`),
  
  // ADX-specific: Get all ingestion mappings grouped by table
  getAdxMappings: (id) => fetchAPI(`/integrations/${id}/adx/mappings`),
};
