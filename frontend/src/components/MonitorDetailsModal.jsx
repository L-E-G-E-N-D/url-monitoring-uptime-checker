import { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';
import { parseApiError } from '../utils/http'

function MonitorDetailsModal({ monitorId, onClose }) {
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchMonitorDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/monitors/${monitorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
           if (response.status === 401 || response.status === 403) {
             logout();
             throw new Error('Session expired. Please login again.');
           }
           const msg = await parseApiError(response, 'Failed to load details')
           throw new Error(msg)
        }

        const data = await response.json();
        setMonitor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (monitorId && token) {
      fetchMonitorDetails();
    }
  }, [monitorId, token, logout]);

  if (!monitorId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-[#0a0a0f] rounded-3xl shadow-[0_0_50px_rgba(147,51,234,0.15)] border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
        
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white truncate pr-4">
            {monitor?.url || 'Monitor Details'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
             <div className="flex justify-center p-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-900/30">
              {error}
            </div>
          ) : monitor ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">Status</div>
                  <div className="font-medium text-white flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${monitor.recentChecks?.[0]?.status === 'UP' ? 'bg-[#ccff00]' : monitor.recentChecks?.[0]?.status === 'DOWN' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                     {monitor.recentChecks?.[0]?.status || 'PENDING'}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">Uptime (24h)</div>
                  <div className="font-medium text-white">
                    {monitor.uptimePercent !== null ? `${monitor.uptimePercent}%` : 'N/A'}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">Interval</div>
                  <div className="font-medium text-white">{monitor.checkIntervalMinutes}m</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">State</div>
                  <div className="font-medium text-white">{monitor.isActive ? 'Active' : 'Paused'}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Recent Checks</h3>
                {monitor.recentChecks && monitor.recentChecks.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead className="bg-white/5">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Response Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-transparent divide-y divide-white/10">
                        {monitor.recentChecks.map((check, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  check.status === 'UP' ? 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20' :
                                  check.status === 'DOWN' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                  'bg-white/5 text-slate-300 border-white/10'
                                }`}>
                                {check.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                              {check.responseTime}ms
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                              {new Date(check.checkedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No checks recorded yet.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MonitorDetailsModal;
