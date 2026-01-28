import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sources, assessments, auditLog, savedViews } from './db.js';

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
