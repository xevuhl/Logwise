import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read/write JSON files
function readData(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeData(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============ LOG SOURCES ============

export const sources = {
  getAll() {
    return readData('sources.json');
  },
  
  getById(id) {
    const all = this.getAll();
    return all.find(s => s.id === id);
  },
  
  create(source) {
    const all = this.getAll();
    const newSource = {
      id: generateId(),
      ...source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sortOrder: all.length
    };
    all.push(newSource);
    writeData('sources.json', all);
    return newSource;
  },
  
  update(id, updates) {
    const all = this.getAll();
    const index = all.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    all[index] = {
      ...all[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    writeData('sources.json', all);
    return all[index];
  },
  
  delete(id) {
    let all = this.getAll();
    all = all.filter(s => s.id !== id);
    writeData('sources.json', all);
    return true;
  },
  
  bulkCreate(sources) {
    const all = this.getAll();
    const newSources = sources.map((source, i) => ({
      id: generateId(),
      ...source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sortOrder: all.length + i
    }));
    writeData('sources.json', [...all, ...newSources]);
    return newSources;
  },
  
  updateOrder(orderedIds) {
    const all = this.getAll();
    orderedIds.forEach((id, index) => {
      const source = all.find(s => s.id === id);
      if (source) source.sortOrder = index;
    });
    writeData('sources.json', all);
    return true;
  }
};

// ============ ASSESSMENTS ============

export const assessments = {
  getAll() {
    return readData('assessments.json');
  },
  
  getByQuestionId(questionId) {
    const all = this.getAll();
    return all.find(a => a.questionId === questionId);
  },
  
  save(questionId, data) {
    const all = this.getAll();
    const index = all.findIndex(a => a.questionId === questionId);
    
    const record = {
      questionId,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    if (index === -1) {
      record.createdAt = new Date().toISOString();
      all.push(record);
    } else {
      all[index] = { ...all[index], ...record };
    }
    
    writeData('assessments.json', all);
    return record;
  },
  
  saveAll(assessments) {
    const all = this.getAll();
    
    assessments.forEach(({ questionId, ...data }) => {
      const index = all.findIndex(a => a.questionId === questionId);
      const record = {
        questionId,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      if (index === -1) {
        record.createdAt = new Date().toISOString();
        all.push(record);
      } else {
        all[index] = { ...all[index], ...record };
      }
    });
    
    writeData('assessments.json', all);
    return all;
  }
};

// ============ AUDIT LOG ============

export const auditLog = {
  getAll() {
    return readData('audit.json');
  },
  
  add(action, sourceName, details = null) {
    const all = this.getAll();
    const entry = {
      id: generateId(),
      action,
      sourceName,
      details: details ? JSON.stringify(details) : null,
      timestamp: new Date().toISOString()
    };
    all.push(entry);
    writeData('audit.json', all);
    return entry;
  }
};

// ============ SAVED VIEWS ============

export const savedViews = {
  getAll() {
    return readData('views.json');
  },
  
  create(view) {
    const all = this.getAll();
    const newView = {
      id: generateId(),
      ...view,
      createdAt: new Date().toISOString()
    };
    all.push(newView);
    writeData('views.json', all);
    return newView;
  },
  
  delete(id) {
    let all = this.getAll();
    all = all.filter(v => v.id !== id);
    writeData('views.json', all);
    return true;
  }
};

// ============ VALIDATION TESTS ============

export const validationTests = {
  getAll() {
    return readData('validation-tests.json');
  },
  
  getByTestId(testId) {
    const all = this.getAll();
    return all.find(t => t.testId === testId);
  },
  
  getByCampaign(campaignId) {
    const all = this.getAll();
    return all.filter(t => t.campaignId === campaignId);
  },
  
  getHistory(testId) {
    const history = readData('validation-history.json');
    return history.filter(h => h.testId === testId).sort((a, b) => 
      new Date(b.testedAt) - new Date(a.testedAt)
    );
  },
  
  save(testId, data) {
    const all = this.getAll();
    const index = all.findIndex(t => t.testId === testId && t.campaignId === data.campaignId);
    
    const record = {
      testId,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    if (index === -1) {
      record.id = generateId();
      record.createdAt = new Date().toISOString();
      all.push(record);
    } else {
      all[index] = { ...all[index], ...record };
    }
    
    writeData('validation-tests.json', all);
    
    // Also save to history
    const history = readData('validation-history.json');
    history.push({
      id: generateId(),
      testId,
      ...data,
      savedAt: new Date().toISOString()
    });
    writeData('validation-history.json', history);
    
    return record;
  },
  
  delete(testId) {
    let all = this.getAll();
    all = all.filter(t => t.testId !== testId);
    writeData('validation-tests.json', all);
    return true;
  }
};

// ============ VALIDATION CAMPAIGNS ============

export const validationCampaigns = {
  getAll() {
    return readData('validation-campaigns.json');
  },
  
  getById(id) {
    const all = this.getAll();
    return all.find(c => c.id === id);
  },
  
  create(campaign) {
    const all = this.getAll();
    const newCampaign = {
      id: generateId(),
      ...campaign,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    all.push(newCampaign);
    writeData('validation-campaigns.json', all);
    return newCampaign;
  },
  
  update(id, updates) {
    const all = this.getAll();
    const index = all.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    all[index] = {
      ...all[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    writeData('validation-campaigns.json', all);
    return all[index];
  },
  
  delete(id) {
    let all = this.getAll();
    all = all.filter(c => c.id !== id);
    writeData('validation-campaigns.json', all);
    return true;
  },
  
  getStats(campaignId) {
    const tests = validationTests.getByCampaign(campaignId);
    return {
      total: tests.length,
      passed: tests.filter(t => t.logCaptured && t.detectionFired).length,
      partial: tests.filter(t => t.logCaptured && !t.detectionFired).length,
      failed: tests.filter(t => !t.logCaptured).length
    };
  }
};

// ============ SOURCE RELATIONSHIPS ============

export const relationships = {
  getAll() {
    return readData('relationships.json');
  },
  
  getById(id) {
    const all = this.getAll();
    return all.find(r => r.id === id);
  },
  
  getBySourceId(sourceId) {
    const all = this.getAll();
    return all.filter(r => r.sourceId === sourceId || r.targetId === sourceId);
  },
  
  create(relationship) {
    const all = this.getAll();
    const newRelationship = {
      id: generateId(),
      ...relationship,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    all.push(newRelationship);
    writeData('relationships.json', all);
    return newRelationship;
  },
  
  update(id, updates) {
    const all = this.getAll();
    const index = all.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    all[index] = {
      ...all[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    writeData('relationships.json', all);
    return all[index];
  },
  
  delete(id) {
    let all = this.getAll();
    all = all.filter(r => r.id !== id);
    writeData('relationships.json', all);
    return true;
  },
  
  deleteBySourceId(sourceId) {
    let all = this.getAll();
    all = all.filter(r => r.sourceId !== sourceId && r.targetId !== sourceId);
    writeData('relationships.json', all);
    return true;
  }
};

// ============ TARGETS (Ingestion Destinations) ============

export const targets = {
  getAll() {
    return readData('targets.json');
  },
  
  getById(id) {
    const all = this.getAll();
    return all.find(t => t.id === id);
  },
  
  create(target) {
    const all = this.getAll();
    const newTarget = {
      id: generateId(),
      ...target,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    all.push(newTarget);
    writeData('targets.json', all);
    return newTarget;
  },
  
  update(id, updates) {
    const all = this.getAll();
    const index = all.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    all[index] = {
      ...all[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    writeData('targets.json', all);
    return all[index];
  },
  
  delete(id) {
    let all = this.getAll();
    all = all.filter(t => t.id !== id);
    writeData('targets.json', all);
    return true;
  }
};

// ============ SOURCE HEALTH VALIDATIONS ============

export const sourceHealth = {
  getAll() {
    return readData('source-health.json');
  },
  
  getBySourceId(sourceId) {
    const all = this.getAll();
    return all.filter(h => h.sourceId === sourceId).sort((a, b) => 
      new Date(b.runAt) - new Date(a.runAt)
    );
  },
  
  getLatestBySourceId(sourceId) {
    const history = this.getBySourceId(sourceId);
    return history.length > 0 ? history[0] : null;
  },
  
  getAllLatest() {
    const all = this.getAll();
    // Group by sourceId and get latest for each
    const bySource = {};
    all.forEach(record => {
      if (!bySource[record.sourceId] || 
          new Date(record.runAt) > new Date(bySource[record.sourceId].runAt)) {
        bySource[record.sourceId] = record;
      }
    });
    return Object.values(bySource);
  },
  
  save(sourceId, checkResults) {
    const all = this.getAll();
    
    // Calculate overall status from check results
    const statuses = checkResults.map(c => c.status);
    let overallStatus = 'pass';
    if (statuses.includes('fail')) overallStatus = 'fail';
    else if (statuses.includes('warn')) overallStatus = 'warn';
    
    const record = {
      id: generateId(),
      sourceId,
      runAt: new Date().toISOString(),
      checks: checkResults,
      overallStatus,
    };
    
    all.push(record);
    writeData('source-health.json', all);
    return record;
  },
  
  deleteBySourceId(sourceId) {
    let all = this.getAll();
    all = all.filter(h => h.sourceId !== sourceId);
    writeData('source-health.json', all);
    return true;
  }
};

// ============ SOURCE VALIDATION CONFIGS ============

export const sourceValidationConfigs = {
  getAll() {
    return readData('source-validation-configs.json');
  },
  
  getBySourceId(sourceId) {
    const all = this.getAll();
    return all.find(c => c.sourceId === sourceId);
  },
  
  save(sourceId, config) {
    const all = this.getAll();
    const index = all.findIndex(c => c.sourceId === sourceId);
    
    const record = {
      sourceId,
      ...config,
      updatedAt: new Date().toISOString()
    };
    
    if (index === -1) {
      record.id = generateId();
      record.createdAt = new Date().toISOString();
      all.push(record);
    } else {
      all[index] = { ...all[index], ...record };
    }
    
    writeData('source-validation-configs.json', all);
    return record;
  },
  
  delete(sourceId) {
    let all = this.getAll();
    all = all.filter(c => c.sourceId !== sourceId);
    writeData('source-validation-configs.json', all);
    return true;
  }
};

console.log('Data storage initialized at:', DATA_DIR);
