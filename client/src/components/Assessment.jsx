import { useState, useRef, useEffect } from 'react';
import { CheckCircle, Circle, AlertCircle, HelpCircle, ChevronDown, ChevronRight, Link, X, Plus } from 'lucide-react';
import { assessmentQuestions, assessmentResponseOptions } from '../constants';

function Assessment({ assessments, onSave, sources }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [saving, setSaving] = useState(null);

  // Group questions by category
  const questionsByCategory = assessmentQuestions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  // Calculate category progress
  const getCategoryProgress = (category) => {
    const questions = questionsByCategory[category];
    const answered = questions.filter(q => assessments[q.id]?.response).length;
    return { answered, total: questions.length };
  };

  // Calculate overall progress
  const totalAnswered = assessmentQuestions.filter(q => assessments[q.id]?.response).length;
  const overallScore = calculateScore(assessments);

  // Find sources that might relate to a question
  const getRelatedSources = (question) => {
    const keywords = question.question.toLowerCase().split(' ');
    const relevantKeywords = ['log', 'siem', 'collect', 'store', 'detect', 'alert', 'incident'];
    
    return sources.filter(source => {
      const sourceLower = source.name.toLowerCase();
      const categoryLower = source.category?.toLowerCase() || '';
      
      // Check for keyword matches
      return relevantKeywords.some(kw => 
        sourceLower.includes(kw) || categoryLower.includes(kw)
      ) || source.status === 'collected';
    }).slice(0, 5);
  };

  async function handleResponse(questionId, response) {
    setSaving(questionId);
    try {
      await onSave(questionId, {
        response,
        notes: assessments[questionId]?.notes || '',
        linkedSources: assessments[questionId]?.linkedSources || [],
        updatedAt: new Date().toISOString()
      });
    } finally {
      setSaving(null);
    }
  }

  async function handleNotes(questionId, notes) {
    await onSave(questionId, {
      response: assessments[questionId]?.response || '',
      notes,
      linkedSources: assessments[questionId]?.linkedSources || [],
      updatedAt: new Date().toISOString()
    });
  }

  async function handleLinkedSources(questionId, linkedSources) {
    await onSave(questionId, {
      response: assessments[questionId]?.response || '',
      notes: assessments[questionId]?.notes || '',
      linkedSources,
      updatedAt: new Date().toISOString()
    });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Logging Maturity Assessment</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Evaluate your organization's logging capabilities</p>
        </div>
        
        {/* Progress summary */}
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{overallScore}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {totalAnswered} of {assessmentQuestions.length} answered
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-800 rounded p-3 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {totalAnswered}/{assessmentQuestions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-sm transition-all duration-500"
            style={{ width: `${(totalAnswered / assessmentQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions by category */}
      <div className="space-y-3">
        {Object.entries(questionsByCategory).map(([category, questions]) => {
          const { answered, total } = getCategoryProgress(category);
          const isExpanded = expandedCategory === category;
          
          return (
            <div 
              key={category}
              className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Category header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{category}</h3>
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                    {answered}/{total}
                  </span>
                </div>
                <CategoryProgressRing answered={answered} total={total} />
              </button>

              {/* Questions */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                  {questions.map((question) => {
                    const response = assessments[question.id];
                    const relatedSources = getRelatedSources(question);
                    
                    return (
                      <div key={question.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <ResponseIcon response={response?.response} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white font-medium">
                              {question.question}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {question.description}
                            </p>
                            
                            {/* Response buttons */}
                            <div className="flex gap-1.5 mt-3">
                              {assessmentResponseOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => handleResponse(question.id, option.value)}
                                  disabled={saving === question.id}
                                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                    response?.response === option.value
                                      ? getSelectedClass(option.value)
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  {saving === question.id ? '...' : option.label}
                                </button>
                              ))}
                            </div>

                            {/* Notes input */}
                            <div className="mt-3">
                              <textarea
                                placeholder="Add notes or evidence..."
                                value={response?.notes || ''}
                                onChange={(e) => handleNotes(question.id, e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                              />
                            </div>

                            {/* Linked Log Sources - Multi-select */}
                            <div className="mt-3">
                              <LinkedSourcesSelect
                                sources={sources}
                                selectedSources={response?.linkedSources || []}
                                onChange={(linkedSources) => handleLinkedSources(question.id, linkedSources)}
                                suggestedSources={relatedSources}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResponseIcon({ response }) {
  if (!response) {
    return <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />;
  }
  
  switch (response) {
    case 'yes':
      return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />;
    case 'partial':
      return <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />;
    case 'no':
      return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />;
    case 'na':
      return <HelpCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />;
    default:
      return <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />;
  }
}

function CategoryProgressRing({ answered, total }) {
  const percentage = total > 0 ? (answered / total) * 100 : 0;
  const circumference = 2 * Math.PI * 14;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-9 h-9">
      <svg className="w-9 h-9 transform -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-gray-900 dark:text-white">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

function getSelectedClass(value) {
  switch (value) {
    case 'yes':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-2 ring-green-500';
    case 'partial':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-2 ring-yellow-500';
    case 'no':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-2 ring-red-500';
    case 'na':
      return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 ring-2 ring-gray-500';
    default:
      return '';
  }
}

function calculateScore(assessments) {
  let totalScore = 0;
  let maxScore = 0;
  
  assessmentQuestions.forEach(q => {
    const response = assessments[q.id];
    if (response && response.response !== 'na' && response.response) {
      maxScore += 2;
      if (response.response === 'yes') totalScore += 2;
      else if (response.response === 'partial') totalScore += 1;
    }
  });
  
  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

function LinkedSourcesSelect({ sources, selectedSources, onChange, suggestedSources = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter sources based on search
  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(search.toLowerCase()) ||
    source.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Group sources by category
  const groupedSources = filteredSources.reduce((acc, source) => {
    const category = source.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(source);
    return acc;
  }, {});

  // Filter suggested sources that aren't already selected
  const unselectedSuggestions = suggestedSources.filter(
    source => !selectedSources.includes(source.id)
  );

  const handleToggleSource = (sourceId) => {
    if (selectedSources.includes(sourceId)) {
      onChange(selectedSources.filter(id => id !== sourceId));
    } else {
      onChange([...selectedSources, sourceId]);
    }
  };

  const handleRemoveSource = (sourceId, e) => {
    e.stopPropagation();
    onChange(selectedSources.filter(id => id !== sourceId));
  };

  // Get source details for selected sources
  const selectedSourceDetails = selectedSources
    .map(id => sources.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        <Link className="h-3 w-3 inline mr-1" />
        Linked Log Sources
      </label>
      
      {/* Selected sources display / trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[38px] px-2.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      >
        {selectedSourceDetails.length === 0 ? (
          <span className="text-xs text-gray-500 dark:text-gray-400">Click to link log sources...</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedSourceDetails.map(source => (
              <span
                key={source.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs"
              >
                {source.name}
                <button
                  onClick={(e) => handleRemoveSource(source.id, e)}
                  className="hover:text-primary-900 dark:hover:text-primary-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-72 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sources..."
              className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>

          {/* Source list */}
          <div className="max-h-52 overflow-y-auto">
            {/* Suggested sources section */}
            {unselectedSuggestions.length > 0 && !search && (
              <div>
                <div className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-xs font-medium text-yellow-700 dark:text-yellow-400 sticky top-0 flex items-center gap-1">
                  <span>⭐</span> Suggested for this question
                </div>
                {unselectedSuggestions.map(source => {
                  const isSelected = selectedSources.includes(source.id);
                  return (
                    <label
                      key={`suggested-${source.id}`}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors ${
                        isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSource(source.id)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className={`text-xs flex-1 ${isSelected ? 'text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                        {source.name}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        source.status === 'collected'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : source.status === 'partial'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                      }`}>
                        {source.status}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* All sources by category */}
            {Object.keys(groupedSources).length === 0 ? (
              <div className="p-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                No sources found
              </div>
            ) : (
              Object.entries(groupedSources).map(([category, categorySources]) => (
                <div key={category}>
                  <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-600 dark:text-gray-400 sticky top-0">
                    {category}
                  </div>
                  {categorySources.map(source => {
                    const isSelected = selectedSources.includes(source.id);
                    return (
                      <label
                        key={source.id}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSource(source.id)}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className={`text-xs flex-1 ${isSelected ? 'text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                          {source.name}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          source.status === 'collected'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : source.status === 'partial'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}>
                          {source.status}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {selectedSources.length} selected
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assessment;
