import { useState, useEffect } from 'react';

export interface SyncState {
  isOnline: boolean;
  lastSynced: Date;
  status: 'SYNCED' | 'SYNCING' | 'OFFLINE' | 'CONFLICT';
  pendingChanges: number;
}

// Mock offline storage
const STORAGE_KEY = '1000fires_offline_store';

export const useOfflineSync = () => {
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline: navigator.onLine,
    lastSynced: new Date(),
    status: navigator.onLine ? 'SYNCED' : 'OFFLINE',
    pendingChanges: 0
  });

  const [showConflictModal, setShowConflictModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true, status: 'SYNCING' }));
      // Simulate sync delay
      setTimeout(() => {
        // Randomly simulate a conflict for demonstration
        if (Math.random() > 0.7) {
          setSyncState(prev => ({ ...prev, status: 'CONFLICT' }));
          setShowConflictModal(true);
        } else {
          setSyncState(prev => ({ 
            ...prev, 
            status: 'SYNCED', 
            lastSynced: new Date(),
            pendingChanges: 0 
          }));
        }
      }, 2000);
    };

    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false, status: 'OFFLINE' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const resolveConflict = (strategy: 'local' | 'server') => {
    // Logic to merge data based on strategy
    console.log(`Resolving conflict using: ${strategy}`);
    setSyncState(prev => ({ 
      ...prev, 
      status: 'SYNCED', 
      lastSynced: new Date(),
      pendingChanges: 0 
    }));
    setShowConflictModal(false);
  };

  const simulateChange = () => {
    if (!syncState.isOnline) {
      setSyncState(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
    }
  };

  return {
    syncState,
    resolveConflict,
    showConflictModal,
    simulateChange,
    toggleOnlineStatus: () => {
        // For debugging/demo purposes
        if (syncState.isOnline) {
            window.dispatchEvent(new Event('offline'));
        } else {
            window.dispatchEvent(new Event('online'));
        }
    }
  };
};