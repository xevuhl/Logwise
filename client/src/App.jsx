import { useState, useEffect, useCallback } from 'react';
import { sourcesAPI, assessmentsAPI, auditAPI, viewsAPI, exportAPI, validationAPI, campaignsAPI, relationshipsAPI, targetsAPI } from './api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import Inventory from './components/Inventory';
import AuditLog from './components/AuditLog';
import Validation from './components/Validation';
import Reports from './components/Reports';
import Onboarding from './components/Onboarding';
import Relationships from './components/Relationships';
import Targets from './components/Targets';
import MitreCoverage from './components/MitreCoverage';
import { assessmentQuestions } from './constants';

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('logwise-darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Data state
  const [sources, setSources] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [validationTests, setValidationTests] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [targets, setTargets] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [savedViews, setSavedViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('logwise-darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sourcesData, assessmentsData, validationData, campaignsData, relationshipsData, targetsData, auditData, viewsData] = await Promise.all([
          sourcesAPI.getAll(),
          assessmentsAPI.getAll(),
          validationAPI.getAll(),
          campaignsAPI.getAll(),
          relationshipsAPI.getAll(),
          targetsAPI.getAll(),
          auditAPI.getAll(),
          viewsAPI.getAll(),
        ]);
        setSources(sourcesData);
        
        // Convert assessments array to object keyed by questionId
        const assessmentsObj = {};
        assessmentsData.forEach(a => {
          assessmentsObj[a.questionId] = a;
        });
        setAssessments(assessmentsObj);
        
        setValidationTests(validationData);
        setCampaigns(campaignsData);
        setRelationships(relationshipsData);
        setTargets(targetsData);
        setAuditLog(auditData);
        setSavedViews(viewsData);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to connect to server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      // Only handle if no input is focused
      if (document.activeElement.tagName === 'INPUT' || 
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'SELECT') {
        return;
      }

      if (e.key === '1') setActiveTab('dashboard');
      if (e.key === '2') setActiveTab('inventory');
      if (e.key === '3') setActiveTab('targets');
      if (e.key === '4') setActiveTab('relationships');
      if (e.key === '5') setActiveTab('assessment');
      if (e.key === '6') setActiveTab('validation');
      if (e.key === '7') setActiveTab('reports');
      if (e.key === '8') setActiveTab('audit');
      if (e.key === 'd') setDarkMode(prev => !prev);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Source CRUD operations
  const handleCreateSource = useCallback(async (source) => {
    try {
      const newSource = await sourcesAPI.create(source);
      setSources(prev => [...prev, newSource]);
      // Refresh audit log
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
      return newSource;
    } catch (err) {
      console.error('Failed to create source:', err);
      throw err;
    }
  }, []);

  const handleUpdateSource = useCallback(async (id, updates) => {
    try {
      const updated = await sourcesAPI.update(id, updates);
      setSources(prev => prev.map(s => s.id === id ? updated : s));
      // Refresh audit log
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
      return updated;
    } catch (err) {
      console.error('Failed to update source:', err);
      throw err;
    }
  }, []);

  const handleDeleteSource = useCallback(async (id) => {
    try {
      await sourcesAPI.delete(id);
      setSources(prev => prev.filter(s => s.id !== id));
      // Refresh audit log
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
    } catch (err) {
      console.error('Failed to delete source:', err);
      throw err;
    }
  }, []);

  const handleBulkImport = useCallback(async (importedSources, replaceAll) => {
    try {
      await sourcesAPI.bulkImport(importedSources, replaceAll);
      // Refresh sources
      const sourcesData = await sourcesAPI.getAll();
      setSources(sourcesData);
      // Refresh audit log
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
    } catch (err) {
      console.error('Failed to import sources:', err);
      throw err;
    }
  }, []);

  // Assessment operations
  const handleSaveAssessment = useCallback(async (questionId, response) => {
    try {
      await assessmentsAPI.save(questionId, response);
      setAssessments(prev => ({
        ...prev,
        [questionId]: { questionId, ...response }
      }));
    } catch (err) {
      console.error('Failed to save assessment:', err);
      throw err;
    }
  }, []);

  // Validation test operations
  const handleSaveValidation = useCallback(async (testId, result) => {
    try {
      const saved = await validationAPI.save(testId, result);
      setValidationTests(prev => {
        const existing = prev.findIndex(t => t.testId === testId && t.campaignId === result.campaignId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = saved;
          return updated;
        }
        return [...prev, saved];
      });
      // Refresh campaigns to update stats
      const campaignsData = await campaignsAPI.getAll();
      setCampaigns(campaignsData);
      // Refresh audit log
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
    } catch (err) {
      console.error('Failed to save validation test:', err);
      throw err;
    }
  }, []);

  // Campaign operations
  const handleCreateCampaign = useCallback(async (campaign) => {
    try {
      const newCampaign = await campaignsAPI.create(campaign);
      setCampaigns(prev => [...prev, newCampaign]);
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
      return newCampaign;
    } catch (err) {
      console.error('Failed to create campaign:', err);
      throw err;
    }
  }, []);

  const handleUpdateCampaign = useCallback(async (id, updates) => {
    try {
      const updated = await campaignsAPI.update(id, updates);
      setCampaigns(prev => prev.map(c => c.id === id ? { ...updated, stats: c.stats } : c));
      return updated;
    } catch (err) {
      console.error('Failed to update campaign:', err);
      throw err;
    }
  }, []);

  const handleDeleteCampaign = useCallback(async (id) => {
    try {
      await campaignsAPI.delete(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      throw err;
    }
  }, []);

  // Relationship operations
  const handleCreateRelationship = useCallback(async (relationship) => {
    try {
      const newRelationship = await relationshipsAPI.create(relationship);
      setRelationships(prev => [...prev, newRelationship]);
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
      return newRelationship;
    } catch (err) {
      console.error('Failed to create relationship:', err);
      throw err;
    }
  }, []);

  const handleUpdateRelationship = useCallback(async (id, updates) => {
    try {
      const updated = await relationshipsAPI.update(id, updates);
      setRelationships(prev => prev.map(r => r.id === id ? updated : r));
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
      return updated;
    } catch (err) {
      console.error('Failed to update relationship:', err);
      throw err;
    }
  }, []);

  const handleDeleteRelationship = useCallback(async (id) => {
    try {
      await relationshipsAPI.delete(id);
      setRelationships(prev => prev.filter(r => r.id !== id));
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
    } catch (err) {
      console.error('Failed to delete relationship:', err);
      throw err;
    }
  }, []);

  // Target operations
  const handleCreateTarget = useCallback(async (target) => {
    try {
      const newTarget = await targetsAPI.create(target);
      setTargets(prev => [...prev, newTarget]);
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
      return newTarget;
    } catch (err) {
      console.error('Failed to create target:', err);
      throw err;
    }
  }, []);

  const handleUpdateTarget = useCallback(async (id, updates) => {
    try {
      const updated = await targetsAPI.update(id, updates);
      setTargets(prev => prev.map(t => t.id === id ? updated : t));
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
      return updated;
    } catch (err) {
      console.error('Failed to update target:', err);
      throw err;
    }
  }, []);

  const handleDeleteTarget = useCallback(async (id) => {
    try {
      await targetsAPI.delete(id);
      setTargets(prev => prev.filter(t => t.id !== id));
      const auditData = await auditAPI.getAll();
      setAuditLog(auditData);
    } catch (err) {
      console.error('Failed to delete target:', err);
      throw err;
    }
  }, []);

  // Export data
  const handleExport = useCallback(async () => {
    try {
      const data = await exportAPI.getAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logwise-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
      throw err;
    }
  }, []);

  // Calculate stats for dashboard
  const stats = {
    totalSources: sources.length,
    collected: sources.filter(s => s.status === 'collected').length,
    partial: sources.filter(s => s.status === 'partial').length,
    planned: sources.filter(s => s.status === 'planned').length,
    notCollected: sources.filter(s => s.status === 'not-collected').length,
    blocked: sources.filter(s => s.status === 'blocked').length,
    byCategory: sources.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {}),
    assessmentScore: calculateAssessmentScore(assessments),
  };

  function calculateAssessmentScore(assessmentResponses) {
    let totalScore = 0;
    let maxScore = 0;
    
    assessmentQuestions.forEach(q => {
      const response = assessmentResponses[q.id];
      if (response && response.response !== 'na') {
        maxScore += 2;
        if (response.response === 'yes') totalScore += 2;
        else if (response.response === 'partial') totalScore += 1;
      }
    });
    
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Logwise...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 btn-gradient text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        onExport={handleExport}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          stats={stats}
        />
        
        <main className={`flex-1 p-4 pt-3 transition-all duration-300 ${sidebarCollapsed ? 'ml-14' : 'ml-52'}`}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              sources={sources}
              assessments={assessments}
              validationTests={validationTests}
            />
          )}
          
          {activeTab === 'assessment' && (
            <Assessment
              assessments={assessments}
              onSave={handleSaveAssessment}
              sources={sources}
            />
          )}
          
          {activeTab === 'inventory' && (
            <Inventory
              sources={sources}
              onCreate={handleCreateSource}
              onUpdate={handleUpdateSource}
              onDelete={handleDeleteSource}
              onBulkImport={handleBulkImport}
              savedViews={savedViews}
              onOpenOnboarding={() => setShowOnboarding(true)}
            />
          )}
          
          {activeTab === 'validation' && (
            <Validation
              validationTests={validationTests}
              onSaveResult={handleSaveValidation}
              sources={sources}
              campaigns={campaigns}
              onCreateCampaign={handleCreateCampaign}
              onUpdateCampaign={handleUpdateCampaign}
              onDeleteCampaign={handleDeleteCampaign}
            />
          )}
          
          {activeTab === 'mitre' && (
            <MitreCoverage
              sources={sources}
              validationTests={validationTests}
            />
          )}
          
          {activeTab === 'reports' && (
            <Reports
              sources={sources}
              assessments={assessments}
              validationTests={validationTests}
            />
          )}
          
          {activeTab === 'relationships' && (
            <Relationships
              sources={sources}
              targets={targets}
              relationships={relationships}
              onCreate={handleCreateRelationship}
              onUpdate={handleUpdateRelationship}
              onDelete={handleDeleteRelationship}
            />
          )}
          
          {activeTab === 'targets' && (
            <Targets
              targets={targets}
              sources={sources}
              relationships={relationships}
              onCreate={handleCreateTarget}
              onUpdate={handleUpdateTarget}
              onDelete={handleDeleteTarget}
            />
          )}
          
          {activeTab === 'audit' && (
            <AuditLog entries={auditLog} />
          )}
        </main>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <Onboarding
          sources={sources}
          onCreate={handleCreateSource}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}

export default App;
