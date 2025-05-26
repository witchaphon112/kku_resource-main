import React, { createContext, useContext, useState } from "react";

export interface DownloadItem {
  id: string;
  title: string;
  type: string;
  date: string;
  url: string;
}

interface DownloadHistoryContextType {
  getDownloads: (userId: string) => DownloadItem[];
  addDownload: (userId: string, item: DownloadItem) => void;
}

const DownloadHistoryContext = createContext<DownloadHistoryContextType | undefined>(undefined);

export const useDownloadHistory = () => {
  const ctx = useContext(DownloadHistoryContext);
  if (!ctx) throw new Error("useDownloadHistory must be used within DownloadHistoryProvider");
  return ctx;
};

export const DownloadHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloadsByUser, setDownloadsByUser] = useState<Record<string, DownloadItem[]>>({});

  const addDownload = (userId: string, item: DownloadItem) => {
    setDownloadsByUser((prev) => ({
      ...prev,
      [userId]: [item, ...(prev[userId] || [])],
    }));
  };

  const getDownloads = (userId: string) => downloadsByUser[userId] || [];

  return (
    <DownloadHistoryContext.Provider value={{ getDownloads, addDownload }}>
      {children}
    </DownloadHistoryContext.Provider>
  );
};