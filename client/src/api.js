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
};
