import React from 'react';
import { Trash2, CheckCircle, RefreshCcw, Map, AlertOctagon } from 'lucide-react';
import { MOCK_LNT_TASKS } from '../constants';

const LNTModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl flex items-start gap-4">
        <div className="bg-green-500/20 p-2 rounded-lg">
          <Trash2 className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-green-500">Leave No Trace (LNT) Plan</h3>
          <p className="text-sm text-green-200/70">
            Camp Entropy has a current MOOP Score of <span className="text-white font-bold">85/100</span>. 
            Remember: Don't let it hit the ground.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MOOP Map Grid */}
        <div className="bg-night-800 rounded-xl border border-white/5 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Map className="w-5 h-5 mr-2" />
              Camp MOOP Map
            </h3>
            <span className="text-xs text-gray-400">Click to toggle status</span>
          </div>
          
          <div className="aspect-square bg-black/50 rounded-lg border border-white/10 p-2 relative grid grid-cols-3 grid-rows-3 gap-1">
             {/* Simulated Grid for Camp Areas */}
             {['Kitchen', 'Lounge', 'Tents A', 'Tents B', 'Dance Floor', 'Bar', 'Frontage', 'Generator', 'Storage'].map((area, idx) => (
               <button 
                key={idx}
                className={`
                  rounded flex flex-col items-center justify-center p-2 transition-colors border
                  ${idx === 6 ? 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30' : 
                    idx === 4 ? 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30' :
                    'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'}
                `}
               >
                 <span className={`text-xs font-medium ${idx === 6 ? 'text-red-400' : idx === 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                   {area}
                 </span>
                 {idx === 6 && <AlertOctagon className="w-4 h-4 text-red-500 mt-1" />}
               </button>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 px-2">
            <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> Clean</span>
            <span className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div> Moderate</span>
            <span className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div> High MOOP</span>
          </div>
        </div>

        {/* Cleanup Tasks */}
        <div className="bg-night-800 rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <RefreshCcw className="w-5 h-5 mr-2" />
            Cleanup Tasks
          </h3>
          <div className="space-y-3">
            {MOCK_LNT_TASKS.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center">
                  <button className={`mr-3 ${task.status === 'CLEAN' ? 'text-green-500' : 'text-gray-600'}`}>
                    {task.status === 'CLEAN' ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current"></div>}
                  </button>
                  <div>
                    <p className={`font-medium ${task.status === 'CLEAN' ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {task.area}
                    </p>
                    <p className="text-xs text-gray-500">
                      Assigned: {task.assignedTo || 'Unassigned'}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  task.status === 'CLEAN' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  task.status === 'DIRTY' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {task.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-brand-500 text-sm font-medium py-2 rounded-lg border border-white/10 border-dashed">
            + Add Line Sweep
          </button>
        </div>
      </div>
    </div>
  );
};

export default LNTModule;