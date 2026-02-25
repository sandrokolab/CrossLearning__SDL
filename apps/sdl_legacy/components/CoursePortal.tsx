import React from 'react';
import { Search, Filter, Star, BookOpen, Users, PlayCircle, MessageCircle } from 'lucide-react';
import { Course } from '../types';

export const CoursePortal: React.FC = () => {
  const courses = Array(6).fill(null).map((_, i) => ({
    id: i.toString(),
    title: `SLP Module ${i + 1}: ${['Mobile Learning', 'Social Integration', 'Analytics', 'Content Creation', 'Project Mgmt', 'Video Conf'][i]}`,
    description: "A comprehensive guide to modern learning strategies.",
    rating: (4 + Math.random()).toFixed(1),
    reviews: Math.floor(Math.random() * 500),
    price: i % 2 === 0 ? 'Free' : '$49.99',
    image: `https://picsum.photos/400/250?random=${i + 10}`,
    stages: {
        autonomous: true,
        guided: i % 2 === 0,
        practical: true,
        interaction: true
    }
  }));

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Course Portal</h2>
          <p className="text-slate-500">Explore autonomous reading, guided inquiry, and practical applications.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Methodology Legend */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-wrap gap-4 text-sm text-blue-800">
        <span className="font-bold flex items-center"><BookOpen className="w-4 h-4 mr-1"/> Autonomous Exploration</span>
        <span className="font-bold flex items-center"><Users className="w-4 h-4 mr-1"/> Guided Inquiry</span>
        <span className="font-bold flex items-center"><PlayCircle className="w-4 h-4 mr-1"/> Practical Application</span>
        <span className="font-bold flex items-center"><MessageCircle className="w-4 h-4 mr-1"/> Synch/Diachronic Interaction</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors flex flex-col group">
            <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                     <div className="flex gap-2 justify-end">
                        {course.stages.autonomous && <BookOpen className="w-4 h-4 text-white/90" title="Reading Material" />}
                        {course.stages.guided && <Users className="w-4 h-4 text-white/90" title="Tutor Guided" />}
                        {course.stages.practical && <PlayCircle className="w-4 h-4 text-white/90" title="Practical Lab" />}
                     </div>
                </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-slate-900">{course.rating}</span>
                <span className="text-sm text-slate-400">({course.reviews} reviews)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                <span className={`font-bold ${course.price === 'Free' ? 'text-green-600' : 'text-slate-900'}`}>
                  {course.price}
                </span>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
