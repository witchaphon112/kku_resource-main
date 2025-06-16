import React, { createContext, useContext, useState, useEffect } from 'react';

interface ViewContextType {
  viewCounts: { [key: string]: number };
  incrementView: (resourceId: string) => void;
  getViewCount: (resourceId: string) => number;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewCounts, setViewCounts] = useState<{ [key: string]: number }>({});

  // Load view counts from localStorage on mount
  useEffect(() => {
    const loadViewCounts = () => {
      const counts: { [key: string]: number } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('view_')) {
          const resourceId = key.replace('view_', '');
          counts[resourceId] = parseInt(localStorage.getItem(key) || '0');
        }
      }
      setViewCounts(counts);
    };
    loadViewCounts();
  }, []);

  const incrementView = (resourceId: string) => {
    const lastViewTime = parseInt(localStorage.getItem(`view_time_${resourceId}`) || '0');
    const now = Date.now();
    
    // Only count view if more than 30 minutes have passed since last view
    if (now - lastViewTime > 30 * 60 * 1000) {
      const newCount = (viewCounts[resourceId] || 0) + 1;
      setViewCounts(prev => ({
        ...prev,
        [resourceId]: newCount
      }));
      localStorage.setItem(`view_${resourceId}`, newCount.toString());
      localStorage.setItem(`view_time_${resourceId}`, now.toString());
    }
  };

  const getViewCount = (resourceId: string) => {
    return viewCounts[resourceId] || 0;
  };

  return (
    <ViewContext.Provider value={{ viewCounts, incrementView, getViewCount }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useViews = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useViews must be used within a ViewProvider');
  }
  return context;
}; 