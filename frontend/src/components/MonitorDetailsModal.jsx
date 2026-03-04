import { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';

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
           const errData = await response.json().catch(() => ({}));
           throw new Error(errData.error?.message || errData.message || 'Failed to load details');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white truncate pr-4">
            {monitor?.url || 'Monitor Details'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Status</div>
                  <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${monitor.recentChecks?.[0]?.status === 'UP' ? 'bg-green-500' : monitor.recentChecks?.[0]?.status === 'DOWN' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                     {monitor.recentChecks?.[0]?.status || 'PENDING'}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Uptime (24h)</div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {monitor.uptimePercent !== null ? `${monitor.uptimePercent}%` : 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Interval</div>
                  <div className="font-medium text-slate-900 dark:text-white">{monitor.checkIntervalMinutes}m</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">State</div>
                  <div className="font-medium text-slate-900 dark:text-white">{monitor.isActive ? 'Active' : 'Paused'}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Recent Checks</h3>
                {monitor.recentChecks && monitor.recentChecks.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Response Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {monitor.recentChecks.map((check, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  check.status === 'UP' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  check.status === 'DOWN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                  'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                }`}>
                                {check.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                              {check.responseTime}ms
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                              {new Date(check.checkedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No checks recorded yet.</p>
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
