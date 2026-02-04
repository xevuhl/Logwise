import { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  FileText,
  Users,
  Tag,
  Settings,
  ClipboardCheck,
  Eye,
  AlertCircle,
  HelpCircle,
  Save
} from 'lucide-react';
import { 
  onboardingSteps, 
  categoryOptions, 
  statusOptions,
  logTypeOptions, 
  criticalityTierOptions, 
  retentionOptions,
  defaultTagOptions 
} from '../constants';

function Onboarding({ sources, onCreate, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Network',
    description: '',
    logType: '',
    ownerTeam: '',
    ownerContact: '',
    criticalityTier: '',
    tags: [],
    retention: '',
    collectionMethod: '',
    networkRequirements: '',
    credentials: '',
    validationPlan: '',
    expectedFields: '',
    sampleQuery: '',
    status: 'planned',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const stepIcons = {
    identify: FileText,
    ownership: Users,
    compliance: Tag,
    technical: Settings,
    validation: ClipboardCheck,
    review: Eye
  };

  const validateStep = (stepId) => {
    const stepErrors = {};
    const step = onboardingSteps.find(s => s.id === stepId);
    
    if (stepId === 'identify') {
      if (!formData.name.trim()) {
        stepErrors.name = 'Source name is required';
      }
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    const stepId = onboardingSteps[currentStep].id;
    if (validateStep(stepId)) {
      setCurrentStep(prev => Math.min(prev + 1, onboardingSteps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onCreate(formData);
      if (onClose) onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleStepClick = (index) => {
    // Only allow going to previous steps or staying on current
    if (index <= currentStep) {
      setCurrentStep(index);
    }
  };

  const getStepStatus = (index) => {
    if (index < currentStep) return 'complete';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const currentStepData = onboardingSteps[currentStep];
  const StepIcon = stepIcons[currentStepData.id] || FileText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Plus className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Log Source</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Complete the wizard to onboard a new log source</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content with Left Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar Navigation */}
          <div className="w-56 flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <nav className="p-3 space-y-1">
              {onboardingSteps.map((step, index) => {
                const status = getStepStatus(index);
                const Icon = stepIcons[step.id] || FileText;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    disabled={index > currentStep}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      index > currentStep 
                        ? 'cursor-not-allowed opacity-50' 
                        : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                    } ${
                      status === 'current'
                        ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700'
                        : status === 'complete'
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      status === 'complete' 
                        ? 'bg-green-500 text-white' 
                        : status === 'current'
                        ? 'bg-gradient-brand text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {status === 'complete' ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        status === 'current' 
                          ? 'text-primary-700 dark:text-primary-400' 
                          : status === 'complete'
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-500 truncate">
                        Step {index + 1}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <StepIcon className="h-5 w-5 text-primary-500" />
                {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentStepData.description}</p>
            </div>

            {/* Step Forms */}
            {currentStepData.id === 'identify' && (
              <StepIdentify formData={formData} setFormData={setFormData} errors={errors} />
            )}
            
            {currentStepData.id === 'ownership' && (
              <StepOwnership formData={formData} setFormData={setFormData} errors={errors} />
            )}
            
            {currentStepData.id === 'compliance' && (
              <StepCompliance formData={formData} setFormData={setFormData} errors={errors} />
            )}
            
            {currentStepData.id === 'technical' && (
              <StepTechnical formData={formData} setFormData={setFormData} errors={errors} />
            )}
            
            {currentStepData.id === 'validation' && (
              <StepValidation formData={formData} setFormData={setFormData} errors={errors} />
            )}
            
            {currentStepData.id === 'review' && (
              <StepReview formData={formData} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep + 1} of {onboardingSteps.length}
          </div>

          {currentStep < onboardingSteps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium btn-gradient text-white rounded"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving || !formData.name.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Creating...' : 'Create Source'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
function StepIdentify({ formData, setFormData, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Palo Alto Firewall, CrowdStrike EDR"
            className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            autoFocus
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name}
            </p>
          )}
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Describe what this log source provides and why it's important for security monitoring..."
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Log Type
        </label>
        <select
          value={formData.logType}
          onChange={(e) => setFormData({ ...formData, logType: e.target.value })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select log format...</option>
          {logTypeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      
      <Tip>
        Be specific with the source name. Include the vendor and product name to make it easily identifiable.
      </Tip>
    </div>
  );
}

function StepOwnership({ formData, setFormData, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Owner Team
          </label>
          <input
            type="text"
            value={formData.ownerTeam}
            onChange={(e) => setFormData({ ...formData, ownerTeam: e.target.value })}
            placeholder="e.g., Security Operations, Network Team"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Owner Contact
          </label>
          <input
            type="text"
            value={formData.ownerContact}
            onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
            placeholder="e.g., soc@company.com, #security-ops"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Criticality Tier
        </label>
        <div className="space-y-2">
          {criticalityTierOptions.map(opt => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${
                formData.criticalityTier === opt.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
            >
              <input
                type="radio"
                name="criticalityTier"
                value={opt.value}
                checked={formData.criticalityTier === opt.value}
                onChange={(e) => setFormData({ ...formData, criticalityTier: e.target.value })}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{opt.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{opt.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <Tip>
        Assign clear ownership to ensure accountability for log collection and monitoring.
      </Tip>
    </div>
  );
}

function StepCompliance({ formData, setFormData, errors }) {
  const toggleTag = (tagValue) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tagValue)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tagValue) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tagValue] });
    }
  };

  // Group tags by type
  const complianceTags = defaultTagOptions.filter(t => 
    ['pci-dss', 'hipaa', 'sox', 'gdpr', 'compliance-required'].includes(t.value)
  );
  const categoryTags = defaultTagOptions.filter(t => 
    ['critical-asset', 'cloud', 'on-prem', 'legacy', 'new', 'high-volume', 'low-volume'].includes(t.value)
  );
  const statusTags = defaultTagOptions.filter(t => 
    ['needs-review', 'validated', 'deprecated'].includes(t.value)
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compliance Requirements
        </label>
        <div className="flex flex-wrap gap-2">
          {complianceTags.map(tag => (
            <TagButton
              key={tag.value}
              tag={tag}
              isSelected={(formData.tags || []).includes(tag.value)}
              onClick={() => toggleTag(tag.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Source Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {categoryTags.map(tag => (
            <TagButton
              key={tag.value}
              tag={tag}
              isSelected={(formData.tags || []).includes(tag.value)}
              onClick={() => toggleTag(tag.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {statusTags.map(tag => (
            <TagButton
              key={tag.value}
              tag={tag}
              isSelected={(formData.tags || []).includes(tag.value)}
              onClick={() => toggleTag(tag.value)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Retention Period
        </label>
        <select
          value={formData.retention}
          onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select retention period...</option>
          {retentionOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      
      <Tip>
        Tag sources with compliance frameworks they support. This helps with audit reporting and coverage analysis.
      </Tip>
    </div>
  );
}

function StepTechnical({ formData, setFormData, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Collection Method
        </label>
        <input
          type="text"
          value={formData.collectionMethod}
          onChange={(e) => setFormData({ ...formData, collectionMethod: e.target.value })}
          placeholder="e.g., Syslog forwarding, API polling, Agent-based"
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Network Requirements
        </label>
        <textarea
          value={formData.networkRequirements}
          onChange={(e) => setFormData({ ...formData, networkRequirements: e.target.value })}
          rows={2}
          placeholder="e.g., Firewall rules needed, ports to open, VPN requirements..."
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Credentials / API Keys
        </label>
        <textarea
          value={formData.credentials}
          onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
          rows={2}
          placeholder="Document required credentials (do not store actual secrets here)..."
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Never store actual credentials here. Reference secure vault locations instead.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Initial Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      
      <Tip>
        Document technical requirements thoroughly to help with future troubleshooting and knowledge transfer.
      </Tip>
    </div>
  );
}

function StepValidation({ formData, setFormData, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Validation Plan
        </label>
        <textarea
          value={formData.validationPlan}
          onChange={(e) => setFormData({ ...formData, validationPlan: e.target.value })}
          rows={2}
          placeholder="How will you validate that logs are being collected correctly? What tests will you run?"
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Expected Fields
        </label>
        <textarea
          value={formData.expectedFields}
          onChange={(e) => setFormData({ ...formData, expectedFields: e.target.value })}
          rows={2}
          placeholder="List key fields that should be present in the logs (e.g., timestamp, source_ip, user, action, status)"
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Sample Query
        </label>
        <textarea
          value={formData.sampleQuery}
          onChange={(e) => setFormData({ ...formData, sampleQuery: e.target.value })}
          rows={2}
          placeholder="Provide a sample SIEM query to verify log collection..."
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Additional Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
          placeholder="Any additional notes, known issues, or considerations..."
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <Tip>
        Define clear validation criteria to ensure logs are collected completely and accurately.
      </Tip>
    </div>
  );
}

function StepReview({ formData }) {
  const getTagLabel = (tagValue) => {
    const tag = defaultTagOptions.find(t => t.value === tagValue);
    return tag?.label || tagValue;
  };

  const getTagColor = (tagValue) => {
    const tag = defaultTagOptions.find(t => t.value === tagValue);
    return tag?.color || 'gray';
  };

  const colorClasses = {
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
          <Check className="h-4 w-4" />
          Ready to create log source
        </div>
        <p className="text-xs text-green-600 dark:text-green-300 mt-1">
          Review the information below and click "Create Source" to add this log source to your inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <ReviewSection title="Basic Information">
          <ReviewItem label="Name" value={formData.name} required />
          <ReviewItem label="Category" value={formData.category} />
          <ReviewItem label="Log Type" value={logTypeOptions.find(o => o.value === formData.logType)?.label || formData.logType} />
          <ReviewItem label="Status" value={statusOptions.find(o => o.value === formData.status)?.label || formData.status} />
        </ReviewSection>

        {/* Ownership */}
        <ReviewSection title="Ownership">
          <ReviewItem label="Owner Team" value={formData.ownerTeam} />
          <ReviewItem label="Owner Contact" value={formData.ownerContact} />
          <ReviewItem label="Criticality" value={criticalityTierOptions.find(o => o.value === formData.criticalityTier)?.label || formData.criticalityTier} />
        </ReviewSection>

        {/* Compliance */}
        <ReviewSection title="Compliance & Tags">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tags</div>
            {formData.tags && formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map(tag => (
                  <span key={tag} className={`px-2 py-0.5 text-xs rounded ${colorClasses[getTagColor(tag)]}`}>
                    {getTagLabel(tag)}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">None</span>
            )}
          </div>
          <ReviewItem label="Retention" value={retentionOptions.find(o => o.value === formData.retention)?.label || formData.retention} />
        </ReviewSection>

        {/* Technical */}
        <ReviewSection title="Technical Details">
          <ReviewItem label="Collection Method" value={formData.collectionMethod} />
          <ReviewItem label="Network Requirements" value={formData.networkRequirements} />
        </ReviewSection>
      </div>

      {/* Description */}
      {formData.description && (
        <ReviewSection title="Description">
          <p className="text-sm text-gray-700 dark:text-gray-300">{formData.description}</p>
        </ReviewSection>
      )}

      {/* Validation */}
      <ReviewSection title="Validation">
        <ReviewItem label="Validation Plan" value={formData.validationPlan} />
        <ReviewItem label="Expected Fields" value={formData.expectedFields} />
        <ReviewItem label="Sample Query" value={formData.sampleQuery} />
      </ReviewSection>

      {/* Notes */}
      {formData.notes && (
        <ReviewSection title="Notes">
          <p className="text-sm text-gray-700 dark:text-gray-300">{formData.notes}</p>
        </ReviewSection>
      )}
    </div>
  );
}

// Helper Components
function TagButton({ tag, isSelected, onClick }) {
  const colorClasses = {
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300 dark:border-pink-700',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-600',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded border-2 transition-all ${colorClasses[tag.color]} ${
        isSelected ? 'ring-2 ring-primary-500 ring-offset-1' : 'opacity-60 hover:opacity-100'
      }`}
    >
      {isSelected && <Check className="h-3 w-3 inline mr-1" />}
      {tag.label}
    </button>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{title}</div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function ReviewItem({ label, value, required }) {
  return (
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className={`text-sm ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
        {value || (required ? <span className="text-red-500">Required</span> : 'Not specified')}
      </div>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
      <HelpCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-blue-700 dark:text-blue-300">{children}</p>
    </div>
  );
}

export default Onboarding;
