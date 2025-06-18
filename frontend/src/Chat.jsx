import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Send, MessageCircle, Bot, User, ArrowLeft, Search, BookOpen, Zap, Eye, Sparkles, ExternalLink, RefreshCw, AlertTriangle, Stethoscope, Users, FileText, Plus, Filter, Target, TrendingUp, Calendar, Pill, Activity, Brain, Shuffle, Clock, Heart, Grid } from 'lucide-react';

// API Configuration
const API_BASE = 'http://localhost:8000/api';

// Patient Data - John Doe
const patientData = {
  name: "John Doe", 
  age: 45,
  conditions: "Type 2 Diabetes Mellitus, Hypertension, Prediabetic Neuropathy",
  medications: "Metformin 1000mg BID, Lisinopril 10mg daily, Atorvastatin 20mg daily",
  recent_concerns: "HbA1c 8.2%, frequent hypoglycemic episodes, tingling in feet",
  upcoming_events: "endocrinologist appointment March 15, 2025, diabetic eye exam scheduled",
  last_labs: "HbA1c: 8.2%, fasting glucose: 165 mg/dL, eGFR: 78 mL/min"
};

// Conversation Topics and Guided Prompts - Multiple sets for reroll functionality
const conversationTopics = {
  "Treatment Options": {
    icon: Pill,
    color: "blue",
    promptSets: [
      // Set 1 - Original
      [
        {
          title: "GLP-1 Receptor Agonists",
          prompt: "What are the latest clinical trial results for GLP-1 receptor agonists like semaglutide and tirzepatide for Type 2 diabetes management? Include any 2024 studies.",
          rationale: "Stay updated on cutting-edge diabetes treatments",
          type: "research",
          priority: "high",
          tags: ["diabetes-drugs", "weight-loss", "time-sensitive"]
        },
        {
          title: "Combination Therapy Options",
          prompt: "What combination therapies work best with Metformin for Type 2 diabetes patients with HbA1c above 8%?",
          rationale: "Explore personalized treatment for better glucose control",
          type: "research",
          priority: "high",
          tags: ["personalized-medicine", "treatment-options"]
        },
        {
          title: "Insulin Therapy Timing",
          prompt: "Given my current HbA1c of 8.2% and frequent hypoglycemic episodes, when should I consider adding insulin therapy?",
          rationale: "Determine optimal timing for insulin initiation",
          type: "personalized",
          priority: "critical",
          tags: ["insulin-therapy", "time-sensitive", "hypoglycemia"]
        }
      ],
      // Set 2 - Alternative prompts
      [
        {
          title: "Continuous Glucose Monitoring",
          prompt: "How can continuous glucose monitors (CGMs) help improve diabetes management and reduce hypoglycemic episodes?",
          rationale: "Explore technology-driven glucose monitoring",
          type: "research"
        },
        {
          title: "SGLT-2 Inhibitors Benefits",
          prompt: "What are the cardiovascular and kidney benefits of SGLT-2 inhibitors for Type 2 diabetes patients with hypertension?",
          rationale: "Understand multi-system benefits beyond glucose control",
          type: "planning"
        },
        {
          title: "Personalized Diabetes Management",
          prompt: "How can my specific health profile (age 45, hypertension, neuropathy) guide personalized diabetes treatment decisions?",
          rationale: "Leverage your unique health status for optimal care",
          type: "personalized"
        }
      ],
      // Set 3 - More alternatives
      [
        {
          title: "Diabetes Technology Integration",
          prompt: "What are the latest advances in diabetes management technology, including smart insulin pens and automated dosing systems?",
          rationale: "Understand modern diabetes management tools",
          type: "research"
        },
        {
          title: "Natural Diabetes Management",
          prompt: "What evidence-based natural supplements and lifestyle interventions can complement diabetes medications?",
          rationale: "Learn about holistic diabetes management approaches",
          type: "research"
        },
        {
          title: "Diabetes Monitoring Optimization",
          prompt: "What blood glucose testing schedule and targets are recommended for Type 2 diabetes patients on multiple medications?",
          rationale: "Optimize monitoring for better control",
          type: "actionable"
        }
      ]
    ]
  },
  "Blood Sugar Management": {
    icon: Brain,
    color: "purple",
    promptSets: [
      // Set 1 - Original
      [
        {
          title: "Hypoglycemia Prevention",
          prompt: "What strategies can prevent frequent hypoglycemic episodes in Type 2 diabetes patients on Metformin?",
          rationale: "Better understand and prevent dangerous low blood sugars",
          type: "research",
          priority: "high",
          tags: ["hypoglycemia", "prevention"]
        },
        {
          title: "HbA1c Optimization",
          prompt: "How can I safely lower my HbA1c from 8.2% to target range without increasing hypoglycemic risk?",
          rationale: "Achieve better glucose control safely",
          type: "research",
          priority: "moderate",
          tags: ["glucose-control", "optimization"]
        },
        {
          title: "Lifestyle Modifications",
          prompt: "What evidence-based lifestyle changes can improve blood sugar control in Type 2 diabetes patients?",
          rationale: "Implement non-pharmaceutical interventions",
          type: "actionable",
          priority: "moderate",
          tags: ["lifestyle", "prevention"]
        }
      ],
      // Set 2 - Alternative prompts
      [
        {
          title: "Emergency Glucose Management",
          prompt: "What emergency supplies should I have available for severe hypoglycemia, and when exactly should I use them?",
          rationale: "Prepare for diabetes emergencies effectively",
          type: "actionable",
          priority: "critical",
          tags: ["emergency-care", "lifesaving-drugs", "hypoglycemia"]
        },
        {
          title: "Sleep and Blood Sugar",
          prompt: "How does sleep quality affect blood sugar control in diabetes patients, and what sleep strategies can help?",
          rationale: "Optimize sleep for better glucose control",
          type: "actionable"
        },
        {
          title: "Blood Sugar Tracking Apps",
          prompt: "What digital tools and smartphone apps can help me track and predict blood sugar patterns more effectively?",
          rationale: "Use technology to improve diabetes management",
          type: "actionable"
        }
      ],
      // Set 3 - More alternatives
      [
        {
          title: "Diabetic Diet Planning",
          prompt: "What meal planning strategies and carbohydrate counting methods work best for Type 2 diabetes management?",
          rationale: "Explore nutritional approaches to glucose control",
          type: "research"
        },
        {
          title: "Stress and Blood Sugar",
          prompt: "What stress reduction techniques are most effective for improving blood sugar control in diabetes patients?",
          rationale: "Address psychological factors affecting glucose",
          type: "actionable"
        },
        {
          title: "Exercise and Diabetes Safety",
          prompt: "What types of exercise are safe and beneficial for someone with Type 2 diabetes and frequent hypoglycemia?",
          rationale: "Maintain fitness while managing diabetes safely",
          type: "actionable"
        }
      ]
    ]
  },
  "Complication Prevention": {
    icon: Activity,
    color: "green",
    promptSets: [
      // Set 1 - Original
      [
        {
          title: "Diabetic Neuropathy Management",
          prompt: "What are the most effective treatments for diabetic neuropathy causing tingling in feet, and how can progression be prevented?",
          rationale: "Address current neuropathy symptoms and prevent worsening",
          type: "research",
          priority: "critical",
          tags: ["neuropathy", "time-sensitive"]
        },
        {
          title: "Kidney Protection Strategies",
          prompt: "How can I protect my kidney function with current eGFR of 78 mL/min while managing diabetes and hypertension?",
          rationale: "Prevent diabetic kidney disease progression",
          type: "actionable",
          priority: "critical",
          tags: ["kidney-protection", "prevention", "time-sensitive"]
        },
        {
          title: "Eye Exam Preparation",
          prompt: "What should I expect during my upcoming diabetic eye exam, and what signs of diabetic retinopathy should I watch for?",
          rationale: "Prepare for comprehensive eye screening",
          type: "planning"
        }
      ],
      // Set 2 - Alternative prompts
      [
        {
          title: "Cardiovascular Risk Reduction",
          prompt: "What strategies can reduce cardiovascular risk in diabetes patients with hypertension and elevated cholesterol?",
          rationale: "Address heart disease prevention comprehensively",
          type: "research"
        },
        {
          title: "Foot Care Prevention",
          prompt: "What daily foot care routine should diabetes patients with neuropathy follow to prevent complications?",
          rationale: "Prevent serious foot complications",
          type: "actionable"
        },
        {
          title: "Blood Pressure Management",
          prompt: "How should blood pressure targets differ for diabetes patients, and is my current Lisinopril dose optimal?",
          rationale: "Optimize blood pressure control for diabetes",
          type: "actionable"
        }
      ],
      // Set 3 - More alternatives
      [
        {
          title: "Diabetes Care Coordination",
          prompt: "How should my primary care doctor, endocrinologist, and other specialists coordinate my diabetes care?",
          rationale: "Ensure comprehensive team-based care",
          type: "actionable"
        },
        {
          title: "Medication Side Effects",
          prompt: "What are the potential side effects of my current diabetes medications, and when should I be concerned?",
          rationale: "Understand medication safety and monitoring",
          type: "planning"
        },
        {
          title: "Long-term Diabetes Planning",
          prompt: "What long-term health monitoring and preventive care is recommended for Type 2 diabetes patients?",
          rationale: "Plan for comprehensive long-term diabetes care",
          type: "planning"
        }
      ]
    ]
  },
  "Diabetes Genetics": {
    icon: FileText,
    color: "indigo",
    promptSets: [
      // Set 1 - Original
      [
        {
          title: "Type 2 Diabetes Risk Factors",
          prompt: "What genetic and environmental factors contribute to Type 2 diabetes development and progression?",
          rationale: "Understand your diabetes risk profile",
          type: "research"
        },
        {
          title: "Family History Impact",
          prompt: "How does family history of diabetes affect my treatment options and risk for complications?",
          rationale: "Leverage family health history for better care",
          type: "research"
        },
        {
          title: "Hereditary Risk Assessment",
          prompt: "What screening recommendations exist for my family members given my Type 2 diabetes diagnosis?",
          rationale: "Consider family diabetes prevention",
          type: "preventive"
        }
      ],
      // Set 2 - Alternative prompts
      [
        {
          title: "Genetic Testing for Diabetes",
          prompt: "What genetic tests are available to better understand my diabetes subtype and medication response?",
          rationale: "Stay current with diabetes genetic testing",
          type: "research"
        },
        {
          title: "Personalized Medicine",
          prompt: "How can genetic factors guide personalized diabetes treatment and medication selection?",
          rationale: "Understand genetic influences on treatment",
          type: "research"
        },
        {
          title: "Family Diabetes Prevention",
          prompt: "What prevention strategies should my family members consider based on my diabetes diagnosis?",
          rationale: "Help family members prevent diabetes",
          type: "preventive"
        }
      ],
      // Set 3 - More alternatives
      [
        {
          title: "Pharmacogenomics for Diabetes",
          prompt: "How might my genetics affect how I respond to different diabetes medications like Metformin?",
          rationale: "Optimize medication selection through genetics",
          type: "research"
        },
        {
          title: "Diabetes Medication Genetics",
          prompt: "What genetic factors influence the effectiveness of GLP-1 agonists and SGLT-2 inhibitors?",
          rationale: "Personalize diabetes medication choices",
          type: "personalized"
        },
        {
          title: "Research Participation",
          prompt: "How can I contribute to diabetes research that might help other patients with similar genetic backgrounds?",
          rationale: "Support diabetes research while potentially benefiting",
          type: "opportunities"
        }
      ]
    ]
  },
  "Quality of Life": {
    icon: User,
    color: "amber",
    promptSets: [
      // Set 1 - Original
      [
        {
          title: "Diabetes and Mental Health",
          prompt: "How can I manage diabetes-related stress, anxiety, and depression while maintaining good glucose control?",
          rationale: "Address psychological aspects of diabetes",
          type: "research"
        },
        {
          title: "Work-Life Balance",
          prompt: "How do other diabetes patients manage career demands while dealing with glucose monitoring and medication schedules?",
          rationale: "Learn from patient experiences",
          type: "community"
        },
        {
          title: "Long-term Planning",
          prompt: "What should I consider for long-term life planning with Type 2 diabetes and potential complications?",
          rationale: "Make informed decisions about the future",
          type: "planning"
        }
      ],
      // Set 2 - Alternative prompts
      [
        {
          title: "Relationship Management",
          prompt: "How can I maintain healthy relationships and communicate effectively about my diabetes with family and friends?",
          rationale: "Strengthen your support network",
          type: "community"
        },
        {
          title: "Diabetes Burnout",
          prompt: "What strategies help prevent and overcome diabetes burnout and management fatigue?",
          rationale: "Address psychological challenges of chronic disease",
          type: "actionable"
        },
        {
          title: "Independence Strategies",
          prompt: "What strategies can help me maintain independence while managing diabetes complications like neuropathy?",
          rationale: "Preserve quality of life and self-determination",
          type: "actionable"
        }
      ],
      // Set 3 - More alternatives
      [
        {
          title: "Travel and Recreation",
          prompt: "What precautions and preparations should I consider for travel and recreational activities with diabetes?",
          rationale: "Maintain an active and fulfilling lifestyle",
          type: "actionable"
        },
        {
          title: "Financial Planning",
          prompt: "What financial considerations and resources should I be aware of for managing long-term diabetes care costs?",
          rationale: "Plan for financial stability with chronic disease",
          type: "planning"
        },
        {
          title: "Advocacy and Support Groups",
          prompt: "How can I connect with other diabetes patients and advocacy organizations for support and information?",
          rationale: "Build community and find peer support",
          type: "community"
        }
      ]
    ]
  },
  "Latest Research": {
    icon: TrendingUp,
    color: "red",
    promptSets: [
      // Set 1 - Original
      [
        {
          title: "2024 Diabetes Breakthroughs",
          prompt: "What are the most significant diabetes research breakthroughs and treatment advances published in 2024?",
          rationale: "Stay current with diabetes medical advances",
          type: "research"
        },
        {
          title: "Clinical Trial Opportunities",
          prompt: "What diabetes clinical trials are currently recruiting patients with Type 2 diabetes and my specific complications?",
          rationale: "Access cutting-edge diabetes treatments",
          type: "opportunities"
        },
        {
          title: "Diabetes Technology Advances",
          prompt: "What new diabetes monitoring and treatment technologies are being studied for better glucose management?",
          rationale: "Understand emerging diabetes technology",
          type: "research"
        }
      ],
      // Set 2 - Alternative prompts
      [
        {
          title: "Artificial Intelligence in Diabetes",
          prompt: "How is AI being used to improve diabetes diagnosis, treatment planning, and glucose prediction?",
          rationale: "Explore technology-driven diabetes advances",
          type: "research"
        },
        {
          title: "International Diabetes Research",
          prompt: "What major international diabetes research initiatives are studying Type 2 diabetes complications, and how might I benefit?",
          rationale: "Access global diabetes research opportunities",
          type: "opportunities"
        },
        {
          title: "Precision Diabetes Medicine",
          prompt: "What precision medicine approaches are being developed specifically for patients with my diabetes profile?",
          rationale: "Find treatments tailored to your specific diabetes characteristics",
          type: "research"
        }
      ],
      // Set 3 - More alternatives
      [
        {
          title: "Novel Diabetes Drug Targets",
          prompt: "What new drug targets and mechanisms are being investigated for Type 2 diabetes beyond current therapies?",
          rationale: "Learn about future diabetes treatment possibilities",
          type: "research"
        },
        {
          title: "Diabetes Cure Research",
          prompt: "What promising research is being conducted toward finding a cure for Type 2 diabetes?",
          rationale: "Stay informed about potential breakthrough treatments",
          type: "research"
        },
        {
          title: "Quality of Life Research",
          prompt: "What recent research focuses on improving quality of life and long-term outcomes for diabetes patients?",
          rationale: "Find evidence-based approaches to living well with diabetes",
          type: "research"
        }
      ]
    ]
  }
};

// Follow-up conversation paths
const conversationPaths = {
  consultation: {
    icon: Stethoscope,
    title: "Consultation",
    description: "Questions to ask your doctor",
    prompts: [
      "What questions should I ask my doctor about this?",
      "How should I discuss this with my healthcare team?",
      "What information should I prepare for my next appointment?",
      "When should I schedule a follow-up consultation?",
      "What warning signs should prompt immediate medical attention?"
    ]
  },
  research: {
    icon: Search,
    title: "Research",
    description: "Evidence-based information",
    prompts: [
      "What does the latest research say about this?",
      "Are there any recent clinical trials I should know about?",
      "What are the current treatment guidelines?",
      "What do medical experts recommend for this situation?",
      "What peer-reviewed studies support this approach?"
    ]
  },
  context: {
    icon: FileText,
    title: "Context",
    description: "Additional helpful information",
    prompts: [
      "What additional information would be helpful to know?",
      "How does this relate to my other health conditions?",
      "What background information should I understand?",
      "Are there related topics I should explore?",
      "What context am I missing about this situation?"
    ]
  }
};

// API Client
class ConversationAPI {
  async askMedicalQuestion(question, patientContext = {}, conversationHistory = []) {
    try {
      const response = await fetch(`${API_BASE}/medical/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          patient_context: patientContext,
          conversation_history: conversationHistory,
          include_sources: true
        })
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return this.getFallbackResponse(question);
    }
  }

  async modifyResponse(responseId, modificationType, patientContext = {}) {
    try {
      const response = await fetch(`${API_BASE}/medical/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_id: responseId,
          modification_type: modificationType,
          patient_context: patientContext
        })
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Modification Error:', error);
      throw error;
    }
  }

  getFallbackResponse(question) {
    return {
      id: `fallback_${Date.now()}`,
      content: `I'd be happy to help answer "${question}". For the most accurate medical information, I recommend consulting with healthcare professionals who can provide personalized guidance.`,
      sources: [],
      confidence_level: "low",
      evidence_quality: "insufficient",
      follow_up_prompts: [
        { category: "consultation", prompt: "What questions should I ask my doctor about this?", rationale: "Professional guidance" },
        { category: "research", prompt: "What should I research before my appointment?", rationale: "Preparation" },
        { category: "context", prompt: "What additional information would be helpful?", rationale: "Context gathering" }
      ],
      safety_notes: "This is a fallback response. Please consult healthcare professionals for reliable medical information.",
      type: "research"
    };
  }
}

const api = new ConversationAPI();

// Navigation Component
function Navigation() {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-2xl p-2 shadow-xl" style={{backdropFilter: 'blur(16px)'}}>
        <div className="flex space-x-1">
          <Link
            to="/"
            className="px-6 py-3 text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-xl font-medium transition-all"
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

// Guided Prompt Component
function GuidedPrompt({ prompt, onSelect }) {
  const typeColors = {
    research: "bg-blue-50 border-blue-200 text-blue-700",
    personalized: "bg-purple-50 border-purple-200 text-purple-700",
    actionable: "bg-green-50 border-green-200 text-green-700",
    planning: "bg-amber-50 border-amber-200 text-amber-700",
    community: "bg-pink-50 border-pink-200 text-pink-700",
    preventive: "bg-indigo-50 border-indigo-200 text-indigo-700",
    opportunities: "bg-red-50 border-red-200 text-red-700"
  };

  const priorityColors = {
    critical: "bg-red-500 text-white",
    high: "bg-orange-500 text-white", 
    moderate: "bg-blue-500 text-white",
    low: "bg-gray-500 text-white"
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-3 h-3" />;
      case 'high': return <Zap className="w-3 h-3" />;
      case 'moderate': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col h-full" style={{backdropFilter: 'blur(16px)'}}>
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{prompt.title}</h4>
        <div className="flex flex-col space-y-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[prompt.type] || typeColors.research}`}>
            {prompt.type}
          </div>
          {prompt.priority && (
            <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${priorityColors[prompt.priority]}`}>
              {getPriorityIcon(prompt.priority)}
              <span>{prompt.priority}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Priority Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 bg-opacity-60 text-gray-700 rounded-md text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{prompt.rationale}</p>
      <div className="bg-gray-50 bg-opacity-50 rounded-xl p-4 mb-4 flex-grow">
        <p className="text-gray-800 text-sm leading-relaxed italic">"{prompt.prompt}"</p>
      </div>
      <button
        onClick={() => onSelect(prompt)}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2 mt-auto"
      >
        <Search className="w-4 h-4" />
        <span>Explore This Topic</span>
      </button>
    </div>
  );
}

// Conversation Path Button
function ConversationPath({ path, pathKey, onSelect, isExpanded, expandedPrompts }) {
  const Icon = path.icon;

  return (
    <div className="space-y-3">
      <button
        onClick={() => onSelect(pathKey)}
        className="w-full p-4 bg-white bg-opacity-60 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 hover:bg-opacity-80 transition-all flex items-center space-x-3 text-gray-700"
        style={{backdropFilter: 'blur(8px)'}}
      >
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900">{path.title}</div>
          <div className="text-sm text-gray-600">{path.description}</div>
        </div>
        <div className="p-1 bg-gray-200 rounded-full">
          <Plus className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
        </div>
      </button>
      
      {isExpanded && (
        <div className="space-y-2 pl-4">
          {expandedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onSelect(pathKey, prompt)}
              className="w-full p-3 bg-white bg-opacity-60 border border-gray-200 rounded-lg text-left text-sm text-gray-700 hover:bg-opacity-80 hover:border-gray-300 transition-all"
              style={{backdropFilter: 'blur(8px)'}}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Medical Response Component
function MedicalResponse({ response, onModify, onPathSelect }) {
  const [isModifying, setIsModifying] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [expandedPath, setExpandedPath] = useState(null);

  const handleModify = async (type) => {
    setIsModifying(true);
    try {
      await onModify(response.id, type);
    } catch (error) {
      console.error('Modification failed:', error);
    } finally {
      setIsModifying(false);
    }
  };

  const handlePathSelect = (pathKey, prompt = null) => {
    if (prompt) {
      onPathSelect(prompt);
      setExpandedPath(null);
    } else {
      setExpandedPath(expandedPath === pathKey ? null : pathKey);
    }
  };

  const getConfidenceColor = (level) => {
    switch (level) {
      case 'high': return 'from-emerald-500 to-green-500 text-white';
      case 'moderate': return 'from-amber-500 to-orange-500 text-white';
      case 'low': return 'from-rose-500 to-red-500 text-white';
      default: return 'from-gray-400 to-gray-500 text-white';
    }
  };

  const getEvidenceColor = (quality) => {
    switch (quality) {
      case 'strong': return 'text-emerald-600 bg-emerald-100 bg-opacity-50';
      case 'moderate': return 'text-amber-600 bg-amber-100 bg-opacity-50';
      case 'limited': return 'text-orange-600 bg-orange-100 bg-opacity-50';
      case 'insufficient': return 'text-rose-600 bg-rose-100 bg-opacity-50';
      default: return 'text-gray-600 bg-gray-100 bg-opacity-50';
    }
  };

  return (
    <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-3xl p-6 mb-6 shadow-2xl" style={{backdropFilter: 'blur(16px)'}}>
      {/* Response Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">AI Medical Response</h3>
          <p className="text-xs text-gray-600">Powered by Perplexity AI + OpenAI</p>
        </div>
        <div className="text-right">
          <div className="bg-blue-100 bg-opacity-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            Evidence-Based
          </div>
        </div>
      </div>

      {/* Response Content */}
      <div className="prose prose-sm max-w-none mb-4">
        <div className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
          {response.content}
        </div>
      </div>

      {/* Response Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getConfidenceColor(response.confidence_level)} shadow-lg`}>
          <Sparkles className="w-3 h-3 inline mr-1" />
          {response.confidence_level} confidence
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getEvidenceColor(response.evidence_quality)} border border-current border-opacity-20`}>
          {response.evidence_quality} evidence
        </div>
        {response.priority_level && (
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
            response.priority_level === 'critical' ? 'bg-red-500 text-white' :
            response.priority_level === 'high' ? 'bg-orange-500 text-white' :
            response.priority_level === 'moderate' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {response.priority_level === 'critical' && <AlertTriangle className="w-3 h-3" />}
            {response.priority_level === 'high' && <Zap className="w-3 h-3" />}
            {response.priority_level === 'moderate' && <Clock className="w-3 h-3" />}
            <span>{response.priority_level} priority</span>
          </div>
        )}
        {response.sources && response.sources.length > 0 && (
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 bg-opacity-50 text-blue-700 rounded-full hover:bg-blue-200 hover:bg-opacity-50 transition-all border border-blue-200 border-opacity-50 text-xs font-medium"
          >
            <BookOpen className="w-3 h-3" />
            <span>{response.sources.length} sources</span>
          </button>
        )}
        {response.priority_tags && response.priority_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {response.priority_tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-red-100 bg-opacity-60 text-red-700 rounded-md text-xs font-medium border border-red-200 border-opacity-50">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sources */}
      {showSources && response.sources && (
        <div className="mb-4 p-4 bg-blue-50 bg-opacity-50 rounded-xl border border-blue-200 border-opacity-30" style={{backdropFilter: 'blur(4px)'}}>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
            Sources & References
          </h4>
          <ul className="space-y-2">
            {response.sources.map((source, i) => (
              <li key={i} className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-gray-700 leading-relaxed text-xs">{source.title || source}</span>
                  {source.url && (
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* OpenAI Modification Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleModify('simplify')}
          disabled={isModifying}
          className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none text-xs font-medium"
        >
          <Zap className="w-3 h-3" />
          <span>Simplify</span>
        </button>
        <button
          onClick={() => handleModify('detail')}
          disabled={isModifying}
          className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none text-xs font-medium"
        >
          <Eye className="w-3 h-3" />
          <span>More Detail</span>
        </button>
        <button
          onClick={() => handleModify('personalize')}
          disabled={isModifying}
          className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none text-xs font-medium"
        >
          <User className="w-3 h-3" />
          <span>Personalize</span>
        </button>
        {isModifying && (
          <div className="flex items-center space-x-1 px-3 py-2 bg-gray-100 bg-opacity-50 rounded-lg border border-gray-200 border-opacity-50">
            <RefreshCw className="w-3 h-3 animate-spin text-gray-600" />
            <span className="text-gray-600 text-xs font-medium">Modifying...</span>
          </div>
        )}
      </div>

      {/* Safety Notes */}
      {response.safety_notes && (
        <div className="bg-amber-50 bg-opacity-50 border border-amber-200 border-opacity-50 rounded-xl p-4 mb-6" style={{backdropFilter: 'blur(4px)'}}>
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-amber-500 rounded-lg shadow-sm">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 text-sm mb-1">Safety Information</h4>
              <p className="text-amber-700 text-xs leading-relaxed">{response.safety_notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Continue Exploring Paths */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Continue exploring:</h4>
        <div className="space-y-3">
          {Object.entries(conversationPaths).map(([pathKey, path]) => (
            <ConversationPath
              key={pathKey}
              path={path}
              pathKey={pathKey}
              onSelect={handlePathSelect}
              isExpanded={expandedPath === pathKey}
              expandedPrompts={path.prompts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Treatment Options");
  const [searchQuery, setSearchQuery] = useState("");
  const [promptSetIndex, setPromptSetIndex] = useState(0);
  const [selectedPriority, setSelectedPriority] = useState("recommended");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle URL parameters for guided prompts
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const prompt = urlParams.get('prompt');
    
    if (prompt) {
      setCurrentMessage(decodeURIComponent(prompt));
    }
  }, [location]);

  const handleSend = async (messageText = currentMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Get AI response with patient context
      const response = await api.askMedicalQuestion(messageText, patientData, messages);
      
      // Add AI message
      const aiMessage = { 
        id: Date.now() + 1,
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: api.getFallbackResponse(messageText),
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const modifyResponse = async (responseId, modificationType) => {
    try {
      const modifiedResponse = await api.modifyResponse(responseId, modificationType, patientData);
      
      // Update the message with modified content
      setMessages(prev => prev.map(msg => {
        if (msg.role === 'assistant' && msg.content.id === responseId) {
          return {
            ...msg,
            content: {
              ...msg.content,
              content: modifiedResponse.content,
              follow_up_prompts: modifiedResponse.follow_up_prompts,
              id: modifiedResponse.id
            }
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Failed to modify response:', error);
    }
  };

  const handlePromptSelect = (prompt) => {
    setCurrentMessage(prompt.prompt);
    handleSend(prompt.prompt);
  };

  const handlePathSelect = (prompt) => {
    setCurrentMessage(prompt);
    handleSend(prompt);
  };

  const handleReroll = () => {
    const maxSets = conversationTopics[selectedTopic]?.promptSets?.length || 1;
    setPromptSetIndex(prev => (prev + 1) % maxSets);
  };

  // Get current prompt set
  const currentPromptSet = conversationTopics[selectedTopic]?.promptSets?.[promptSetIndex] || [];
  
  const filteredPrompts = currentPromptSet.filter(prompt => {
    // Search filter
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Priority filter
    let matchesPriority = true;
    if (selectedPriority === 'recommended') {
      // Show critical and high priority, plus items with lifesaving/surgery-prep tags
      matchesPriority = prompt.priority === 'critical' || 
                       prompt.priority === 'high' ||
                       (prompt.tags && (prompt.tags.includes('lifesaving-drugs') || 
                                       prompt.tags.includes('surgery-prep') ||
                                       prompt.tags.includes('emergency-care')));
    } else if (selectedPriority !== 'all') {
      matchesPriority = prompt.priority === selectedPriority;
    }
    
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-200 to-teal-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-2xl">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smart Medical Conversation Engine
              </h1>
              <p className="text-gray-600">AI-guided health conversations for {patientData.name}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Initial Experience - Search, Topic Filter, and Guided Prompts */}
        {messages.length === 0 && (
          <>
            {/* Search */}
            <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-2xl p-4 mb-8 shadow-xl" style={{backdropFilter: 'blur(16px)'}}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-60 border border-white border-opacity-30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                  style={{backdropFilter: 'blur(8px)'}}
                />
              </div>
            </div>

            {/* Topic Filter */}
            <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-3xl p-6 mb-8 shadow-xl" style={{backdropFilter: 'blur(16px)'}}>
              <div className="flex items-center space-x-4 mb-6">
                <Filter className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Filter by Topic</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(conversationTopics).map(([topic, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedTopic === topic;
                  return (
                    <button
                      key={topic}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setPromptSetIndex(0); // Reset to first set when changing topics
                      }}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-300 shadow-lg'
                          : 'bg-white bg-opacity-50 text-gray-700 border-gray-200 border-opacity-50 hover:bg-opacity-70'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      <div className="text-sm font-medium text-center">{topic}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-3xl p-6 mb-8 shadow-xl" style={{backdropFilter: 'blur(16px)'}}>
              <div className="flex items-center space-x-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Priority Filter</h2>
                <div className="bg-red-100 bg-opacity-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                  Recommended First
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedPriority('recommended')}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedPriority === 'recommended'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300 shadow-lg'
                      : 'bg-white bg-opacity-50 text-gray-700 border-gray-200 border-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <Heart className={`w-5 h-5 mx-auto mb-2 ${selectedPriority === 'recommended' ? 'text-white' : 'text-red-600'}`} />
                  <div className="text-sm font-medium text-center">Priority Recommended</div>
                  <div className="text-xs opacity-80 mt-1">Urgent & Lifesaving</div>
                </button>
                <button
                  onClick={() => setSelectedPriority('all')}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedPriority === 'all'
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-300 shadow-lg'
                      : 'bg-white bg-opacity-50 text-gray-700 border-gray-200 border-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <Grid className={`w-5 h-5 mx-auto mb-2 ${selectedPriority === 'all' ? 'text-white' : 'text-gray-600'}`} />
                  <div className="text-sm font-medium text-center">All Topics</div>
                  <div className="text-xs opacity-80 mt-1">Complete View</div>
                </button>
                {/* Collapsed advanced filters */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  </button>
                </div>
              </div>
              
              {/* Advanced Filters - Collapsible */}
              {showAdvancedFilters && (
                <div className="mt-4 p-4 bg-gray-50 bg-opacity-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Priority Level</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedPriority('critical')}
                      className={`p-3 rounded-lg border text-sm transition-all ${
                        selectedPriority === 'critical'
                          ? 'bg-red-500 text-white border-red-300 shadow-md'
                          : 'bg-white bg-opacity-50 text-gray-700 border-gray-200 hover:bg-opacity-70'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 mx-auto mb-1 ${selectedPriority === 'critical' ? 'text-white' : 'text-red-600'}`} />
                      Critical
                    </button>
                    <button
                      onClick={() => setSelectedPriority('high')}
                      className={`p-3 rounded-lg border text-sm transition-all ${
                        selectedPriority === 'high'
                          ? 'bg-orange-500 text-white border-orange-300 shadow-md'
                          : 'bg-white bg-opacity-50 text-gray-700 border-gray-200 hover:bg-opacity-70'
                      }`}
                    >
                      <Zap className={`w-4 h-4 mx-auto mb-1 ${selectedPriority === 'high' ? 'text-white' : 'text-orange-600'}`} />
                      High
                    </button>
                    <button
                      onClick={() => setSelectedPriority('moderate')}
                      className={`p-3 rounded-lg border text-sm transition-all ${
                        selectedPriority === 'moderate'
                          ? 'bg-blue-500 text-white border-blue-300 shadow-md'
                          : 'bg-white bg-opacity-50 text-gray-700 border-gray-200 hover:bg-opacity-70'
                      }`}
                    >
                      <Clock className={`w-4 h-4 mx-auto mb-1 ${selectedPriority === 'moderate' ? 'text-white' : 'text-blue-600'}`} />
                      Moderate
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Guided Prompts */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-r ${conversationTopics[selectedTopic]?.color === 'blue' ? 'from-blue-500 to-cyan-500' : 
                    conversationTopics[selectedTopic]?.color === 'purple' ? 'from-purple-500 to-pink-500' :
                    conversationTopics[selectedTopic]?.color === 'green' ? 'from-green-500 to-emerald-500' :
                    conversationTopics[selectedTopic]?.color === 'amber' ? 'from-amber-500 to-orange-500' :
                    conversationTopics[selectedTopic]?.color === 'red' ? 'from-red-500 to-pink-500' :
                    'from-indigo-500 to-purple-500'} rounded-2xl shadow-lg`}>
                    {React.createElement(conversationTopics[selectedTopic]?.icon || Target, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTopic}</h2>
                    <p className="text-gray-600">Recommended prompts for your exploration</p>
                  </div>
                </div>
                
                {/* Reroll Button */}
                <button
                  onClick={handleReroll}
                  className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-60 border border-white border-opacity-30 rounded-xl hover:bg-opacity-80 transition-all shadow-lg text-gray-700 hover:text-gray-900"
                  style={{backdropFilter: 'blur(8px)'}}
                  title="Generate new prompt suggestions"
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="text-sm font-medium">Reroll</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((prompt, index) => (
                  <GuidedPrompt
                    key={`${prompt.title}-${promptSetIndex}-${index}`}
                    prompt={prompt}
                    onSelect={handlePromptSelect}
                  />
                ))}
              </div>

              {filteredPrompts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-2xl flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No prompts found</h3>
                  <p className="text-gray-600">Try adjusting your search or selecting a different topic.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="space-y-6 mb-8">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl max-w-2xl shadow-xl">
                      <div className="flex items-start space-x-3">
                        <div className="p-1 bg-white bg-opacity-20 rounded-lg">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-opacity-90 text-xs mb-1">You asked</p>
                          <p className="text-white leading-relaxed text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <MedicalResponse
                    response={message.content}
                    onModify={modifyResponse}
                    onPathSelect={handlePathSelect}
                  />
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white bg-opacity-60 border border-white border-opacity-30 px-6 py-4 rounded-2xl shadow-lg" style={{backdropFilter: 'blur(8px)'}}>
                  <div className="flex items-center space-x-3">
                    <Bot className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Analyzing your question...</p>
                      <p className="text-xs text-gray-600">Researching evidence-based information</p>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 