import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Pill, AlertTriangle, Activity, FileText, Brain, User, Stethoscope, MessageCircle } from 'lucide-react';

// Patient Data - John Doe
const patientData = {
  name: "John Doe", 
  age: 34,
  conditions: "IDH1-mutant grade 2-3 astrocytoma",
  mutations: "TP53, ATRX loss, MGMT methylation",
  medications: "vorasidenib 40mg daily, lamotrigine 200mg BID, clonazepam 0.5mg PRN",
  recent_concerns: "biweekly focal seizures, 1.6cm lung nodule",
  upcoming_events: "robotic lung surgery June 23, 2025"
};

// Patient Header Component
function PatientHeader({ patient }) {
  return (
    <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-3xl p-8 mb-8 shadow-2xl" style={{backdropFilter: 'blur(16px)'}}>
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
          <User className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{patient.name}</h1>
          <div className="flex items-center space-x-6 text-gray-600">
            <span className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Age {patient.age}</span>
            </span>
            <span className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Active Patient</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-green-100 bg-opacity-50 text-green-700 px-4 py-2 rounded-xl font-medium">
            Records Updated
          </div>
          <p className="text-sm text-gray-500 mt-1">Last sync: Today</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard Card Component
function DashboardCard({ icon: Icon, title, content, color = "indigo" }) {
  const colorClasses = {
    indigo: "from-indigo-500 to-purple-500",
    red: "from-red-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    amber: "from-amber-500 to-orange-500"
  };

  return (
    <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1" style={{backdropFilter: 'blur(16px)'}}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
          <div className="text-gray-700 leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}



// Navigation Component
function Navigation() {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-2xl p-2 shadow-xl" style={{backdropFilter: 'blur(16px)'}}>
        <div className="flex space-x-1">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className="px-6 py-3 text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-xl font-medium transition-all"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-200 to-teal-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl shadow-2xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Patient Health Dashboard
              </h1>
              <p className="text-xl text-gray-600 mt-1">Comprehensive Health Overview</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Patient Header */}
        <PatientHeader patient={patientData} />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            icon={FileText}
            title="Primary Condition"
            content={
              <div>
                <p className="font-semibold text-gray-900 mb-2">{patientData.conditions}</p>
                <p className="text-sm text-gray-600">Genetic Profile: {patientData.mutations}</p>
              </div>
            }
            color="red"
          />
          
          <DashboardCard
            icon={Pill}
            title="Current Medications"
            content={
              <div className="space-y-2">
                {patientData.medications.split(', ').map((med, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">• {med}</span>
                  </div>
                ))}
              </div>
            }
            color="blue"
          />
          
          <DashboardCard
            icon={AlertTriangle}
            title="Recent Concerns"
            content={
              <div>
                <p className="text-gray-800">{patientData.recent_concerns}</p>
              </div>
            }
            color="amber"
          />
          
          <DashboardCard
            icon={Calendar}
            title="Upcoming Events"
            content={
              <div>
                <p className="font-semibold text-gray-900 mb-1">Robotic Lung Surgery</p>
                <p className="text-sm text-gray-600">Scheduled: June 23, 2025</p>
                <div className="mt-3 px-3 py-1 bg-blue-100 bg-opacity-50 rounded-full text-xs text-blue-700 font-medium inline-block">
                  Upcoming Procedure
                </div>
              </div>
            }
            color="green"
          />
          
          <DashboardCard
            icon={Activity}
            title="Health Metrics"
            content={
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Seizure Frequency</span>
                  <span className="text-sm font-medium">Biweekly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Assessment</span>
                  <span className="text-sm font-medium">Recent MRI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Treatment Response</span>
                  <span className="text-sm font-medium text-green-600">Stable</span>
                </div>
              </div>
            }
            color="indigo"
          />
          
          <DashboardCard
            icon={Brain}
            title="Chat Insights"
            content={
              <div>
                <p className="text-sm text-gray-700 mb-3">Get personalized medical insights based on your health profile.</p>
                <Link 
                  to="/chat"
                  className="inline-flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 bg-opacity-50 px-4 py-2 rounded-xl hover:bg-indigo-100 hover:bg-opacity-50 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start Conversation</span>
                </Link>
              </div>
            }
            color="indigo"
          />
        </div>



        {/* Quick Actions */}
        <div className="bg-white bg-opacity-40 border border-white border-opacity-20 rounded-3xl p-8 shadow-2xl" style={{backdropFilter: 'blur(16px)'}}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/chat"
              className="group p-6 bg-gradient-to-r from-blue-50 to-indigo-50 bg-opacity-50 rounded-2xl border border-blue-200 border-opacity-30 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center space-x-3 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-700">Start Chat</span>
              </div>
              <p className="text-sm text-blue-600">Get personalized medical insights and answers</p>
            </Link>
            
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 bg-opacity-50 rounded-2xl border border-green-200 border-opacity-30">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Schedule</span>
              </div>
              <p className="text-sm text-green-600">View upcoming appointments and procedures</p>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 bg-opacity-50 rounded-2xl border border-purple-200 border-opacity-30">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-700">Records</span>
              </div>
              <p className="text-sm text-purple-600">Access complete medical history and reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 