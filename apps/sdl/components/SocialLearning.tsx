import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Users, 
  Video, 
  MessageCircle, 
  Award, 
  TrendingUp, 
  Bell, 
  Hash, 
  Send,
  MoreHorizontal
} from 'lucide-react';

export const SocialLearning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'communities'>('feed');

  // Mock Data
  const recognitions = [
    { id: 1, name: 'Collaboration', icon: '🤝', level: 3, color: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Innovation', icon: '💡', level: 1, color: 'bg-yellow-100 text-yellow-600' },
    { id: 3, name: 'Leadership', icon: '👑', level: 2, color: 'bg-purple-100 text-purple-600' },
    { id: 4, name: 'Excellence', icon: '⭐', level: 4, color: 'bg-green-100 text-green-600' },
    { id: 5, name: 'Mentorship', icon: '🎓', level: 1, color: 'bg-red-100 text-red-600' },
  ];

  const posts = [
    {
      id: 1,
      author: 'Sarah Jenkins',
      role: 'Student',
      avatar: 'https://picsum.photos/40?random=1',
      content: 'Just finished the "Advanced Project Management" module. The section on Agile methodologies really changed how I view my current team projects! #Agile #Leadership',
      likes: 24,
      comments: 5,
      time: '2 hours ago',
      tags: ['Agile', 'Leadership']
    },
    {
      id: 2,
      author: 'Dr. Aris Thorne',
      role: 'Educator',
      avatar: 'https://picsum.photos/40?random=2',
      content: 'Great discussion in the Live Session today. Remember, innovation often comes from cross-disciplinary collaboration. Check out this article on collective intelligence.',
      likes: 56,
      comments: 12,
      time: '5 hours ago',
      tags: ['Innovation', 'CollectiveIntelligence']
    }
  ];

  const communities = [
    { id: 1, name: 'Digital Creators Hub', members: 1240, active: true },
    { id: 2, name: 'Python Developers', members: 850, active: true },
    { id: 3, name: 'Sustainable Biz', members: 420, active: false },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Social Learning</h2>
          <p className="text-slate-500">Connect, collaborate, and grow with your community.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('feed')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'feed' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                My Feed
            </button>
            <button 
                onClick={() => setActiveTab('communities')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'communities' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                Communities
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Work Group & Stats */}
        <div className="lg:col-span-3 space-y-6">
            
            {/* My Work Group */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" /> My Work Group
                </h3>
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        <span className="flex items-center"><Video className="w-4 h-4 mr-2"/> Video Conference</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium">
                        <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-2"/> Team Chat</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium">
                        <span className="flex items-center"><Send className="w-4 h-4 mr-2"/> Direct Message</span>
                    </button>
                </div>
            </div>

            {/* Performance Notification */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <TrendingUp size={80} />
                </div>
                <div className="relative z-10">
                    <h4 className="font-bold text-lg mb-2 flex items-center"><Bell className="w-4 h-4 mr-2" /> Progress Alert</h4>
                    <p className="text-sm opacity-90 mb-4">
                        You are in the top <span className="font-bold text-yellow-300">15%</span> of your group this week! Keep up the momentum.
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-right opacity-75">Your Score: 850 pts</p>
                </div>
            </div>

            {/* Communities Mini List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-900 mb-4">Active Communities</h3>
                 <div className="space-y-4">
                    {communities.map(c => (
                        <div key={c.id} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">{c.name}</p>
                                <p className="text-xs text-slate-500">{c.members} members</p>
                            </div>
                            <button className="text-blue-600 text-xs font-bold hover:underline">View</button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>

        {/* Center Column: Feed */}
        <div className="lg:col-span-6 space-y-6">
            
            {/* Promotional Banner */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 bg-red-500 h-full"></div>
                <div className="p-6 bg-gradient-to-r from-orange-50 to-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase">Trending Content</span>
                            <h3 className="text-xl font-bold text-slate-900 mt-2">AI Ethics in Modern Business</h3>
                            <p className="text-slate-600 text-sm mt-1">This campaign is receiving high engagement (98% Likes).</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-500 mr-1 fill-current" /> 1.2k
                            </div>
                            <span className="text-xs text-slate-500">Likes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Creator */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0">
                         <img src="https://picsum.photos/40" className="rounded-full" alt="User" />
                    </div>
                    <div className="flex-1">
                        <textarea 
                            placeholder="Share your learning experience..." 
                            className="w-full resize-none border-none focus:ring-0 text-slate-700 bg-transparent text-sm min-h-[60px]"
                        ></textarea>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <select className="text-xs bg-slate-100 border-none rounded-md py-1 pl-2 pr-6 text-slate-600 font-medium">
                                    <option>Public</option>
                                    <option>My Work Group</option>
                                    <option>Educators Only</option>
                                </select>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed Stream */}
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in-up">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{post.author}</h4>
                                    <p className="text-xs text-slate-500">{post.role} • {post.time}</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed mb-4">
                            {post.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">#{tag}</span>
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                             <div className="flex gap-6">
                                <button className="flex items-center text-slate-500 text-sm hover:text-red-500 transition-colors">
                                    <Heart className="w-4 h-4 mr-1.5" /> {post.likes}
                                </button>
                                <button className="flex items-center text-slate-500 text-sm hover:text-blue-500 transition-colors">
                                    <MessageSquare className="w-4 h-4 mr-1.5" /> {post.comments}
                                </button>
                             </div>
                             <button className="flex items-center text-slate-500 text-sm hover:text-slate-900 transition-colors">
                                <Share2 className="w-4 h-4 mr-1.5" /> Share
                             </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>

        {/* Right Column: Gamification & Knowledge */}
        <div className="lg:col-span-3 space-y-6">
             
             {/* Recognitions */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Recognitions</h3>
                    <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-4">
                    {recognitions.map(rec => (
                        <div key={rec.id} className="flex items-center gap-3 group">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${rec.color} group-hover:scale-110 transition-transform`}>
                                {rec.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-slate-800">{rec.name}</span>
                                    <span className="text-xs font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Lvl {rec.level}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                    <div className="bg-slate-300 h-1.5 rounded-full" style={{ width: `${rec.level * 20}%`}}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Collective Knowledge / Tags */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                    <Hash className="w-4 h-4 mr-2" /> Collective Knowledge
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {['MachineLearning', 'ProjectMgmt', 'DesignThinking', 'RemoteWork', 'ReactJS', 'SoftSkills'].map(tag => (
                        <span key={tag} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-100">
                     <p className="text-xs text-slate-500 italic">
                         Discussed topics can be converted into new Learning Units by Educators.
                     </p>
                 </div>
             </div>

        </div>

      </div>
    </div>
  );
};