import React from 'react';
import { Smartphone, Tablet, WifiOff, Layers, Download, ArrowRight, Edit3, UploadCloud, QrCode, RefreshCw, Video } from 'lucide-react';

export const MobileApps: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="text-center max-w-2xl mx-auto mb-12 pt-8">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Mobile Ecosystem</h2>
        <p className="text-slate-500 text-lg">
          Extend your learning and creativity with our native applications for iOS and Android.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* SmartLearning_APP */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col hover:shadow-2xl transition-shadow duration-300">
           <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-bold">SmartLearning_APP</h3>
                 <p className="text-blue-100 mt-1 font-medium">Online & Offline Training</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Tablet size={40} className="text-white" />
              </div>
           </div>
           <div className="p-8 flex-1 flex flex-col">
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Consume content online and offline without losing interactivity or data. Deploy training even with limited connectivity. Activities sync automatically as soon as connection is available, giving you full flexibility to meet your training goals.
              </p>
              
              <div className="space-y-6 mb-8 flex-1">
                 <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <WifiOff className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900 text-lg">Offline Capability & Sync</h4>
                       <p className="text-slate-500">Full offline course access with automatic progress synchronization when connectivity returns. Receive notifications for new content.</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900 text-lg">QR Access & Attendance</h4>
                       <p className="text-slate-500">Simplified login via QR code and instant attendance scanning features. Enjoy a graphic, personalized interface.</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <RefreshCw className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900 text-lg">Intuitive Experience</h4>
                       <p className="text-slate-500">Guided user assistance and automatic status updates ensure a seamless learning journey.</p>
                    </div>
                 </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                 <button className="w-full py-4 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold hover:bg-slate-800 transition-all transform hover:scale-[1.02]">
                    <Download className="w-5 h-5 mr-2" /> Download App
                 </button>
                 <div className="flex justify-center mt-4 space-x-4 text-xs text-slate-400 font-medium">
                    <span>iPad & Android Tablets</span>
                    <span>•</span>
                    <span>Offline Mode</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Skill UP */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col hover:shadow-2xl transition-shadow duration-300">
           <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-bold">Skill UP</h3>
                 <p className="text-purple-100 mt-1 font-medium">For Creators & Instructors</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                 <Smartphone size={40} className="text-white" />
              </div>
           </div>
           <div className="p-8 flex-1 flex flex-col">
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Create a culture of knowledge sharing. Skill UP allows users to generate content, share best practices, and produce video storytelling directly from their smartphones.
              </p>
              
              <div className="space-y-6 mb-8 flex-1">
                 <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4">
                        <Edit3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900 text-lg">Video Storytelling & Templates</h4>
                       <p className="text-slate-500">Pre-loaded smart templates with instructor guidance allow you to create 4-minute videos without technical editing skills.</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4">
                        <UploadCloud className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900 text-lg">Instant Integration</h4>
                       <p className="text-slate-500">Native integration with web creation tools. Export to MP4 or publish directly to Course Learning Units.</p>
                    </div>
                 </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                 <button className="w-full py-4 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold hover:bg-slate-800 transition-all transform hover:scale-[1.02]">
                    <Download className="w-5 h-5 mr-2" /> Download Skill UP
                 </button>
                 <div className="flex justify-center mt-4 space-x-4 text-xs text-slate-400 font-medium">
                    <span>iOS & Android</span>
                    <span>•</span>
                    <span>Smartphone Optimized</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
             <h4 className="text-xl font-bold text-slate-900">Seamless Ecosystem</h4>
             <p className="text-slate-600">Your progress, creations, and media sync automatically across SmartLearning_APP, Skill UP, and the Web Platform.</p>
          </div>
          <button className="text-blue-600 font-bold flex items-center hover:text-blue-700">
             Learn more about sync <ArrowRight className="w-4 h-4 ml-2" />
          </button>
      </div>
    </div>
  );
};
