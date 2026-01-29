import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sources, assessments, auditLog, savedViews, validationTests, validationCampaigns, relationships, targets } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
}

// ============ LOG SOURCES API ============

// Get all log sources
app.get('/api/sources', (req, res) => {
  try {
    const allSources = sources.getAll();
    res.json(allSources);
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

// Get single log source
app.get('/api/sources/:id', (req, res) => {
  try {
    const source = sources.getById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: 'Source not found' });
    }
    res.json(source);
  } catch (error) {
    console.error('Error fetching source:', error);
    res.status(500).json({ error: 'Failed to fetch source' });
  }
});

// Create log source
app.post('/api/sources', (req, res) => {
  try {
    const newSource = sources.create(req.body);
    auditLog.add('created', newSource.name);
    res.status(201).json(newSource);
  } catch (error) {
    console.error('Error creating source:', error);
    res.status(500).json({ error: 'Failed to create source' });
  }
});

// Update log source
app.put('/api/sources/:id', (req, res) => {
  try {
    const existing = sources.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Source not found' });
    }
    
    const updated = sources.update(req.params.id, req.body);
    
    // Log status changes specifically
    if (existing.status !== req.body.status) {
      auditLog.add('status_changed', updated.name, {
        field: 'status',
        oldValue: existing.status,
        newValue: req.body.status
      });
    } else {
      auditLog.add('updated', updated.name);
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating source:', error);
    res.status(500).json({ error: 'Failed to update source' });
  }
});

// Delete log source
app.delete('/api/sources/:id', (req, res) => {
  try {
    const existing = sources.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Source not found' });
    }
    
    sources.delete(req.params.id);
    auditLog.add('deleted', existing.name);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting source:', error);
    res.status(500).json({ error: 'Failed to delete source' });
  }
});

// Bulk import sources
app.post('/api/sources/bulk', (req, res) => {
  try {
    const { sources: sourceList, replaceAll } = req.body;
    
    if (replaceAll) {
      // Clear existing sources
      const existing = sources.getAll();
      existing.forEach(s => sources.delete(s.id));
    }
    
    sources.bulkCreate(sourceList);
    auditLog.add('imported', 'Bulk Import', { count: sourceList.length });
    
    res.json({ imported: sourceList.length });
  } catch (error) {
    console.error('Error bulk importing:', error);
    res.status(500).json({ error: 'Failed to import sources' });
  }
});

// Update source order (drag and drop)
app.put('/api/sources/order', (req, res) => {
  try {
    const { orderedIds } = req.body;
    sources.updateOrder(orderedIds);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// ============ ASSESSMENTS API ============

// Get all assessment responses
app.get('/api/assessments', (req, res) => {
  try {
    const allAssessments = assessments.getAll();
    res.json(allAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Save assessment response
app.post('/api/assessments/:questionId', (req, res) => {
  try {
    assessments.save(req.params.questionId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving assessment:', error);
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// Bulk save assessments
app.post('/api/assessments/bulk', (req, res) => {
  try {
    assessments.saveAll(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving assessments:', error);
    res.status(500).json({ error: 'Failed to save assessments' });
  }
});

// ============ AUDIT LOG API ============

// Get audit log
app.get('/api/audit', (req, res) => {
  try {
    const log = auditLog.getAll();
    res.json(log);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// ============ SAVED VIEWS API ============

// Get saved views
app.get('/api/views', (req, res) => {
  try {
    const views = savedViews.getAll();
    res.json(views);
  } catch (error) {
    console.error('Error fetching views:', error);
    res.status(500).json({ error: 'Failed to fetch views' });
  }
});

// Create saved view
app.post('/api/views', (req, res) => {
  try {
    const newView = savedViews.create(req.body);
    res.status(201).json(newView);
  } catch (error) {
    console.error('Error creating view:', error);
    res.status(500).json({ error: 'Failed to create view' });
  }
});

// Delete saved view
app.delete('/api/views/:id', (req, res) => {
  try {
    savedViews.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting view:', error);
    res.status(500).json({ error: 'Failed to delete view' });
  }
});

// ============ EXPORT API ============

// Export all data
app.get('/api/export', (req, res) => {
  try {
    const data = {
      exportDate: new Date().toISOString(),
      exportedBy: 'Logwise - Security Log Source Tracker',
      version: '1.0',
      data: {
        logSources: sources.getAll(),
        assessments: assessments.getAll(),
        validationTests: validationTests.getAll(),
        auditLog: auditLog.getAll(),
        savedViews: savedViews.getAll()
      }
    };
    res.json(data);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// ============ VALIDATION TESTS API ============

// Get all validation test results
app.get('/api/validation', (req, res) => {
  try {
    const allTests = validationTests.getAll();
    res.json(allTests);
  } catch (error) {
    console.error('Error fetching validation tests:', error);
    res.status(500).json({ error: 'Failed to fetch validation tests' });
  }
});

// Save validation test result
app.post('/api/validation/:testId', (req, res) => {
  try {
    const result = validationTests.save(req.params.testId, req.body);
    auditLog.add('validation_test', req.params.testId, {
      logCaptured: req.body.logCaptured,
      detectionFired: req.body.detectionFired
    });
    res.json(result);
  } catch (error) {
    console.error('Error saving validation test:', error);
    res.status(500).json({ error: 'Failed to save validation test' });
  }
});

// Delete validation test result
app.delete('/api/validation/:testId', (req, res) => {
  try {
    validationTests.delete(req.params.testId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting validation test:', error);
    res.status(500).json({ error: 'Failed to delete validation test' });
  }
});

// Get test history
app.get('/api/validation/:testId/history', (req, res) => {
  try {
    const history = validationTests.getHistory(req.params.testId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({ error: 'Failed to fetch test history' });
  }
});

// ============ VALIDATION CAMPAIGNS API ============

// Get all campaigns
app.get('/api/campaigns', (req, res) => {
  try {
    const allCampaigns = validationCampaigns.getAll();
    // Add stats to each campaign
    const campaignsWithStats = allCampaigns.map(campaign => ({
      ...campaign,
      stats: validationCampaigns.getStats(campaign.id)
    }));
    res.json(campaignsWithStats);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get single campaign
app.get('/api/campaigns/:id', (req, res) => {
  try {
    const campaign = validationCampaigns.getById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    campaign.stats = validationCampaigns.getStats(campaign.id);
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Create campaign
app.post('/api/campaigns', (req, res) => {
  try {
    const newCampaign = validationCampaigns.create(req.body);
    auditLog.add('campaign_created', req.body.name);
    res.status(201).json(newCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
app.put('/api/campaigns/:id', (req, res) => {
  try {
    const updated = validationCampaigns.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign
app.delete('/api/campaigns/:id', (req, res) => {
  try {
    const existing = validationCampaigns.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    validationCampaigns.delete(req.params.id);
    auditLog.add('campaign_deleted', existing.name);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// Get campaign tests
app.get('/api/campaigns/:id/tests', (req, res) => {
  try {
    const tests = validationTests.getByCampaign(req.params.id);
    res.json(tests);
  } catch (error) {
    console.error('Error fetching campaign tests:', error);
    res.status(500).json({ error: 'Failed to fetch campaign tests' });
  }
});

// ============ RELATIONSHIPS API ============

// Get all relationships
app.get('/api/relationships', (req, res) => {
  try {
    const allRelationships = relationships.getAll();
    res.json(allRelationships);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    res.status(500).json({ error: 'Failed to fetch relationships' });
  }
});

// Get relationships for a specific source
app.get('/api/relationships/source/:sourceId', (req, res) => {
  try {
    const sourceRelationships = relationships.getBySourceId(req.params.sourceId);
    res.json(sourceRelationships);
  } catch (error) {
    console.error('Error fetching source relationships:', error);
    res.status(500).json({ error: 'Failed to fetch source relationships' });
  }
});

// Create relationship
app.post('/api/relationships', (req, res) => {
  try {
    const newRelationship = relationships.create(req.body);
    const source = sources.getById(req.body.sourceId);
    const target = sources.getById(req.body.targetId);
    auditLog.add('relationship_created', `${source?.name} → ${target?.name}`, {
      type: req.body.type,
      sourceId: req.body.sourceId,
      targetId: req.body.targetId
    });
    res.status(201).json(newRelationship);
  } catch (error) {
    console.error('Error creating relationship:', error);
    res.status(500).json({ error: 'Failed to create relationship' });
  }
});

// Update relationship
app.put('/api/relationships/:id', (req, res) => {
  try {
    const existing = relationships.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    const updated = relationships.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating relationship:', error);
    res.status(500).json({ error: 'Failed to update relationship' });
  }
});

// Delete relationship
app.delete('/api/relationships/:id', (req, res) => {
  try {
    const existing = relationships.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    relationships.delete(req.params.id);
    auditLog.add('relationship_deleted', `Relationship removed`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting relationship:', error);
    res.status(500).json({ error: 'Failed to delete relationship' });
  }
});

// ============ TARGETS API ============

// Get all targets
app.get('/api/targets', (req, res) => {
  try {
    const allTargets = targets.getAll();
    res.json(allTargets);
  } catch (error) {
    console.error('Error fetching targets:', error);
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
});

// Get single target
app.get('/api/targets/:id', (req, res) => {
  try {
    const target = targets.getById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }
    res.json(target);
  } catch (error) {
    console.error('Error fetching target:', error);
    res.status(500).json({ error: 'Failed to fetch target' });
  }
});

// Create target
app.post('/api/targets', (req, res) => {
  try {
    const newTarget = targets.create(req.body);
    auditLog.add('target_created', `Target created: ${newTarget.name}`);
    res.status(201).json(newTarget);
  } catch (error) {
    console.error('Error creating target:', error);
    res.status(500).json({ error: 'Failed to create target' });
  }
});

// Update target
app.put('/api/targets/:id', (req, res) => {
  try {
    const existing = targets.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Target not found' });
    }
    const updated = targets.update(req.params.id, req.body);
    auditLog.add('target_updated', `Target updated: ${updated.name}`);
    res.json(updated);
  } catch (error) {
    console.error('Error updating target:', error);
    res.status(500).json({ error: 'Failed to update target' });
  }
});

// Delete target
app.delete('/api/targets/:id', (req, res) => {
  try {
    const existing = targets.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Target not found' });
    }
    targets.delete(req.params.id);
    auditLog.add('target_deleted', `Target deleted: ${existing.name}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting target:', error);
    res.status(500).json({ error: 'Failed to delete target' });
  }
});

// SPA fallback for production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🔶 Logwise Server Running                           ║
║   Security Log Source Tracker                         ║
║                                                       ║
║   Local:   http://localhost:${PORT}                    ║
║   API:     http://localhost:${PORT}/api                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
