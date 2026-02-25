import React, { useState } from 'react';
import {
    Users,
    Upload,
    UserPlus,
    BarChart,
    Settings,
    MessageSquare,
    Bell,
    FileText,
    Layout,
    Activity,
    Layers,
    PieChart
} from 'lucide-react';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

type AdminTab = 'DASHBOARD' | 'USERS' | 'REPORTS' | 'COMMUNICATION';

export const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');

    // Mock Data for Charts
    const connectionData = [
        { time: '08:00', users: 120 },
        { time: '10:00', users: 340 },
        { time: '12:00', users: 560 },
        { time: '14:00', users: 450 },
        { time: '16:00', users: 620 },
        { time: '18:00', users: 380 },
    ];

    const renderDashboard = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connection Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-600" /> User Connections (Today)
                        </h3>
                        <button className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">Configure Params</button>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={connectionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Configurable Widgets Preview */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">Active Student Widgets</h3>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg mb-1">Upcoming Exam: Project Mgmt</h4>
                                <p className="text-white/80 text-sm">Tomorrow, 10:00 AM</p>
                            </div>
                            <Bell className="w-6 h-6 text-white/90" />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold transition-colors">Edit Widget</button>
                            <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold transition-colors">Target Audience</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2">Community Pulse Widget</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-slate-100 rounded-lg h-2 overflow-hidden">
                                <div className="bg-green-500 h-full w-3/4"></div>
                            </div>
                            <span className="text-xs font-bold text-slate-600">75% Engagement</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Visible to: All Students</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Create Single User */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <UserPlus className="w-5 h-5 mr-2 text-blue-600" /> Manual Creation
                    </h3>
                    <div className="space-y-3">
                        <input type="text" placeholder="Full Name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="email" placeholder="Email Address" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600">
                            <option>Assign Group...</option>
                            <option>Group A - Engineering</option>
                            <option>Group B - Design</option>
                        </select>
                        <div className="pt-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Custom Fields</label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <input type="text" placeholder="Department" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                                <input type="text" placeholder="Employee ID" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                            </div>
                        </div>
                        <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                            Create User
                        </button>
                    </div>
                </div>

                {/* Bulk Import */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <Upload className="w-5 h-5 mr-2 text-green-600" /> Mass Import
                    </h3>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                        <FileText className="w-10 h-10 text-slate-400 mb-2" />
                        <p className="text-sm font-bold text-slate-700">Drop CSV file here</p>
                        <p className="text-xs text-slate-500 mt-1">or click to browse</p>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        <p className="font-bold mb-1">Supported Columns:</p>
                        <code>name, email, role, group_id, custom_field_1</code>
                    </div>
                </div>

                {/* Session & Group Management */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <Layers className="w-5 h-5 mr-2 text-purple-600" /> Organization
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-bold text-sm text-slate-900">Engineering 2024</p>
                                <p className="text-xs text-slate-500">124 Members • Active Session</p>
                            </div>
                            <button className="text-blue-600 text-xs font-bold">Manage</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-bold text-sm text-slate-900">Creative Onboarding</p>
                                <p className="text-xs text-slate-500">56 Members • Active Session</p>
                            </div>
                            <button className="text-blue-600 text-xs font-bold">Manage</button>
                        </div>
                        <button className="w-full border border-dashed border-slate-300 py-2 rounded-lg text-sm text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                            + Create New Group/Session
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );

    const renderReports = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comparative Analysis */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900">Student vs. Group Performance</h3>
                        <div className="flex gap-2">
                            <select className="text-sm border border-slate-200 rounded-lg px-2 py-1"><option>Select Student</option></select>
                            <select className="text-sm border border-slate-200 rounded-lg px-2 py-1"><option>Select Metric</option></select>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={[
                                { topic: 'Module 1', student: 85, group: 70 },
                                { topic: 'Module 2', student: 65, group: 75 },
                                { topic: 'Module 3', student: 90, group: 60 },
                                { topic: 'Module 4', student: 55, group: 80 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="student" name="Selected Student" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="group" name="Group Average" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Custom Report Builder */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Custom Report Generator
                    </h3>
                    <div className="space-y-3">
                        <p className="text-sm text-slate-500 mb-2">Select parameters to generate a downloadable PDF/CSV report.</p>
                        <div className="flex flex-wrap gap-2">
                            {['Course Completion', 'Time Spent', 'Quiz Scores', 'Social Engagement', 'Login History'].map(tag => (
                                <label key={tag} className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer">
                                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                    <span className="text-xs font-bold text-slate-700">{tag}</span>
                                </label>
                            ))}
                        </div>
                        <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors">
                            Generate Report
                        </button>
                    </div>
                </div>

                {/* Detailed Consumption */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-orange-600" /> Content Consumption
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Video Lessons</span>
                            <span className="font-bold text-slate-900">45%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Interactive Quizzes</span>
                            <span className="font-bold text-slate-900">30%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">PDF Readings</span>
                            <span className="font-bold text-slate-900">15%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Social Forum</span>
                            <span className="font-bold text-slate-900">10%</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderCommunication = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Direct Messaging */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" /> Send Message
                    </h3>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <button className="flex-1 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">Individual</button>
                            <button className="flex-1 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded hover:bg-slate-100">Bulk / Group</button>
                        </div>
                        <input type="text" placeholder="Recipient / Group Name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="text" placeholder="Subject" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <textarea placeholder="Write your message here..." className="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
                            Send Notification
                        </button>
                    </div>
                </div>

                {/* Automation Rules */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-slate-600" /> Automation Rules
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Welcome New User</p>
                                <p className="text-xs text-slate-500">Trigger: Account Creation</p>
                            </div>
                            <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Inactivity Reminder (7 days)</p>
                                <p className="text-xs text-slate-500">Trigger: Last Login &gt; 7 days</p>
                            </div>
                            <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Course Completion Congrats</p>
                                <p className="text-xs text-slate-500">Trigger: Progress = 100%</p>
                            </div>
                            <div className="w-10 h-5 bg-slate-300 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <button className="text-blue-600 text-xs font-bold mt-2 hover:underline">+ Add New Rule</button>
                    </div>
                </div>

                {/* Social Learning Moderation */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-green-600" /> Social Learning Overview
                    </h3>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-green-50 p-4 rounded-lg">
                            <p className="text-xs text-green-800 font-bold uppercase mb-1">Total Posts</p>
                            <p className="text-2xl font-bold text-green-900">1,245</p>
                        </div>
                        <div className="flex-1 bg-blue-50 p-4 rounded-lg">
                            <p className="text-xs text-blue-800 font-bold uppercase mb-1">Reported</p>
                            <p className="text-2xl font-bold text-blue-900">12</p>
                        </div>
                        <div className="flex-1 bg-purple-50 p-4 rounded-lg">
                            <p className="text-xs text-purple-800 font-bold uppercase mb-1">Active Groups</p>
                            <p className="text-2xl font-bold text-purple-900">34</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="pb-12 h-full flex flex-col">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Administrator Panel</h2>
                <p className="text-slate-500">Platform configuration, user management, and advanced analytics.</p>
            </header>

            {/* Admin Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-8 w-fit">
                {[
                    { id: 'DASHBOARD', label: 'Dashboard', icon: Layout },
                    { id: 'USERS', label: 'Users & Groups', icon: Users },
                    { id: 'REPORTS', label: 'Analytics', icon: BarChart },
                    { id: 'COMMUNICATION', label: 'Communication', icon: MessageSquare }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as AdminTab)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1">
                {activeTab === 'DASHBOARD' && renderDashboard()}
                {activeTab === 'USERS' && renderUsers()}
                {activeTab === 'REPORTS' && renderReports()}
                {activeTab === 'COMMUNICATION' && renderCommunication()}
            </div>
        </div>
    );
};