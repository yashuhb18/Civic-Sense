import React from 'react';
import Sidebar from '../components/Sidebar';
import { Activity as ActivityIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Activity = () => {
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/issues/my-issues');
        // Convert issues to activity format
        const issueActivities = (response.data.issues || []).map(issue => ({
          id: issue._id,
          type: issue.status,
          title: issue.title,
          time: new Date(issue.createdAt).toLocaleDateString(),
          description: issue.description,
          icon: issue.status === 'resolved' ? CheckCircle : (issue.status === 'pending' ? Clock : AlertCircle),
          color: issue.status === 'resolved' ? 'text-emerald-500' : (issue.status === 'pending' ? 'text-amber-500' : 'text-indigo-500'),
          bg: issue.status === 'resolved' ? 'bg-emerald-50' : (issue.status === 'pending' ? 'bg-amber-50' : 'bg-indigo-50')
        }));
        setActivities(issueActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="flex bg-[#F9FBFA] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72 p-10 pt-20 lg:pt-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recent Activity</h1>
            <p className="text-slate-500 font-medium mt-2">Track the status of your reports and community updates.</p>
          </div>
          
          <div className="atlas-card p-8 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-[#E3FCF7] border-t-[#00684A] rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing activity log...</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-6">
                {activities.map((act) => (
                  <div key={act.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-full ${act.bg} flex items-center justify-center ${act.color} shrink-0`}>
                      <act.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-[#00684A] transition-colors">{act.title}</h4>
                      <p className="text-sm font-medium text-slate-500">{act.time} • {act.type.toUpperCase()}</p>
                    </div>
                    <Link to={`/complaint/${act.id}`} className="px-4 py-2 text-sm font-bold text-[#00684A] bg-[#E3FCF7] rounded-lg hover:bg-[#00684A] hover:text-white transition-all w-full sm:w-auto text-center">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <ActivityIcon size={48} className="text-slate-200" />
                <p className="text-slate-500 font-bold">No recent activity detected.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
