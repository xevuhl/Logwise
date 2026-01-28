import { useState } from 'react';
import { CheckCircle, Circle, AlertCircle, HelpCircle, ChevronDown, ChevronRight, Link } from 'lucide-react';
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
      updatedAt: new Date().toISOString()
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Logging Maturity Assessment</h2>
          <p className="text-gray-600 dark:text-gray-400">Evaluate your organization's logging capabilities</p>
        </div>
        
        {/* Progress summary */}
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{overallScore}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalAnswered} of {assessmentQuestions.length} answered
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {totalAnswered}/{assessmentQuestions.length}
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${(totalAnswered / assessmentQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions by category */}
      <div className="space-y-4">
        {Object.entries(questionsByCategory).map(([category, questions]) => {
          const { answered, total } = getCategoryProgress(category);
          const isExpanded = expandedCategory === category;
          
          return (
            <div 
              key={category}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Category header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category}</h3>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400">
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
                      <div key={question.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <ResponseIcon response={response?.response} />
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-white font-medium">
                              {question.question}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {question.description}
                            </p>
                            
                            {/* Response buttons */}
                            <div className="flex gap-2 mt-4">
                              {assessmentResponseOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => handleResponse(question.id, option.value)}
                                  disabled={saving === question.id}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                            <div className="mt-4">
                              <textarea
                                placeholder="Add notes or evidence..."
                                value={response?.notes || ''}
                                onChange={(e) => handleNotes(question.id, e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                              />
                            </div>

                            {/* Related sources */}
                            {relatedSources.length > 0 && (
                              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  <Link className="h-4 w-4" />
                                  Related Log Sources
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {relatedSources.map(source => (
                                    <span 
                                      key={source.id}
                                      className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300"
                                    >
                                      {source.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
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
    return <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />;
  }
  
  switch (response) {
    case 'yes':
      return <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />;
    case 'partial':
      return <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />;
    case 'no':
      return <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />;
    case 'na':
      return <HelpCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />;
    default:
      return <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />;
  }
}

function CategoryProgressRing({ answered, total }) {
  const percentage = total > 0 ? (answered / total) * 100 : 0;
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-900 dark:text-white">
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

export default Assessment;
