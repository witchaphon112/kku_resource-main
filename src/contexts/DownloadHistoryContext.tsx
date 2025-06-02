import React, { createContext, useContext, useState } from "react";

export interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  fileUrl: string;
  downloadedAt: string;
}

interface DownloadHistoryContextType {
  downloads: DownloadItem[];
  addDownload: (userId: string, item: DownloadItem) => void;
  removeDownload: (itemId: string) => void;
}

const DownloadHistoryContext = createContext<DownloadHistoryContextType | undefined>(undefined);

export const useDownloadHistory = () => {
  const ctx = useContext(DownloadHistoryContext);
  if (!ctx) throw new Error("useDownloadHistory must be used within DownloadHistoryProvider");
  return ctx;
};

export const DownloadHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const addDownload = (userId: string, item: DownloadItem) => {
    setDownloads(prev => [item, ...prev]);
  };

  const removeDownload = (itemId: string) => {
    setDownloads(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <DownloadHistoryContext.Provider value={{ downloads, addDownload, removeDownload }}>
      {children}
    </DownloadHistoryContext.Provider>
  );
};