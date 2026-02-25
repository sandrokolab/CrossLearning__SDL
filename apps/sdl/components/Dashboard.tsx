import React from 'react';
import { Course, UserRole, Academy } from '../types';
import { Clock, TrendingUp, Users, Award, BookOpen, PenTool, Zap, Video } from 'lucide-react';

interface DashboardProps {
  userRole: UserRole;
  academy: Academy | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole, academy }) => {
  const activeCourses: Course[] = [
    {
      id: '1',
      title: 'Advanced Project Management',
      description: 'Master agile methodologies and team leadership.',
      category: 'Business',
      progress: 75,
      thumbnail: 'https://picsum.photos/400/200?random=1',
      students: 1204
    },
    {
      id: '2',
      title: 'Digital Content Creation Strategy',
      description: 'Learn to build engaging content for modern platforms.',
      category: 'Marketing',
      progress: 30,
      thumbnail: 'https://picsum.photos/400/200?random=2',
      students: 850
    },
    {
      id: '3',
      title: 'Mobile Learning Architecture',
      description: 'Designing educational experiences for mobile first.',
      category: 'Tech',
      progress: 10,
      thumbnail: 'https://picsum.photos/400/200?random=3',
      students: 540
    }
  ];

  const getStats = () => {
    switch (userRole) {
      case UserRole.EDUCATOR:
        return [
          { label: 'Students Active', value: '1,240', icon: Users, color: 'bg-blue-500' },
          { label: 'Course Rating', value: '4.8', icon: Award, color: 'bg-yellow-500' },
          { label: 'Assignments', value: '32', icon: BookOpen, color: 'bg-green-500' },
          { label: 'Live Sessions', value: '12h', icon: Video, color: 'bg-purple-500' },
        ];
      case UserRole.CREATOR:
        return [
          { label: 'Assets Created', value: '145', icon: PenTool, color: 'bg-pink-500' },
          { label: 'Downloads', value: '3.2k', icon: TrendingUp, color: 'bg-blue-500' },
          { label: 'Collabs', value: '8', icon: Users, color: 'bg-indigo-500' },
          { label: 'Storage Used', value: '45%', icon: Zap, color: 'bg-orange-500' },
        ];
      default: // Student
        return [
          { label: 'Hours Learned', value: '32.5h', icon: Clock, color: 'bg-blue-500' },
          { label: 'Course Progress', value: '12%', icon: TrendingUp, color: 'bg-green-500' },
          { label: 'Active Peers', value: '450+', icon: Users, color: 'bg-purple-500' },
          { label: 'Certificates', value: '4', icon: Award, color: 'bg-orange-500' },
        ];
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome, {userRole}</h2>
            <p className="text-slate-500 mt-2">
              {userRole === UserRole.STUDENT 
                ? "Continue your journey of interaction and discovery." 
                : "Manage your educational impact and resources."}
            </p>
          </div>
          {academy && (
             <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Current Academy</p>
                <p className="text-slate-900 font-bold flex items-center gap-2">
                   <span className="text-xl">{academy.icon}</span> {academy.name}
                </p>
             </div>
          )}
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats().map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
              <stat.icon className="w-6 h-6 text-current" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Active Courses / Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            {userRole === UserRole.CREATOR ? 'Recent Projects' : 'Active Learning Paths'}
          </h3>
          <button className="text-blue-600 font-medium hover:text-blue-700">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700">
                  {course.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-bold text-lg text-slate-900 mb-2 truncate">{course.title}</h4>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>{userRole === UserRole.CREATOR ? 'Completion' : 'Progress'}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};