import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Download } from 'lucide-react';

const dataEngagement = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 4.2 },
  { name: 'Thu', hours: 1.5 },
  { name: 'Fri', hours: 5.0 },
  { name: 'Sat', hours: 6.2 },
  { name: 'Sun', hours: 3.1 },
];

const dataCategories = [
  { name: 'Business', value: 400 },
  { name: 'Tech', value: 300 },
  { name: 'Design', value: 300 },
  { name: 'Science', value: 200 },
];

const dataProgress = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 78 },
  { name: 'Week 4', score: 85 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Reports</h2>
          <p className="text-slate-500">Analyze student engagement and course effectiveness.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Learning Hours</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataEngagement}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Course Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-600 mt-2">
            {dataCategories.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Assessment Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataProgress}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 100]} />
                <Tooltip 
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
