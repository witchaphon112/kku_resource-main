import React, { createContext, useContext, useState, useEffect } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string | string[];
  fileUrl: string;
  thumbnailUrl: string;
  uploadedBy: string;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ResourceContextType {
  resources: Resource[];
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  getUserUploadCount: (userId: string) => number;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    // Load initial resources
    fetch('/mock/resources.json')
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => console.error('Error loading resources:', error));
  }, []);

  const addResource = (resource: Resource) => {
    setResources(prev => [...prev, resource]);
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const updateResource = (id: string, updatedData: Partial<Resource>) => {
    setResources(prev => prev.map(resource => 
      resource.id === id ? { ...resource, ...updatedData } : resource
    ));
  };

  const getUserUploadCount = (userId: string) => {
    return resources.filter(resource => resource.uploadedBy === userId).length;
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      addResource,
      removeResource,
      updateResource,
      getUserUploadCount
    }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
}; 