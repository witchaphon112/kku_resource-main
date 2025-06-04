import React, { createContext, useContext, useState, useEffect } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  fileUrl: string;
  thumbnailUrl: string;
  uploadedBy: string;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface ResourceContextType {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  getUserUploadCount: (userId: string) => number;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

const mockResources = {
  "resources": [
    {
      "id": "1",
      "title": "ตัวอย่างทรัพยากร",
      "description": "คำอธิบายตัวอย่าง",
      "type": "รูปภาพ",
      "category": "education",
      "fileUrl": "/sample.jpg",
      "thumbnailUrl": "/sample-thumb.jpg",
      "uploadedBy": "admin",
      "downloadCount": 0,
      "viewCount": 0,
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z",
      "tags": ["การศึกษา", "ตัวอย่าง"]
    }
  ]
};

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ใช้ข้อมูล mock ชั่วคราว
        setResources(mockResources.resources);
        
        /* TODO: เมื่อมี API จริง ให้ใช้โค้ดนี้แทน
        const response = await fetch('/api/resources');
        if (!response.ok) {
          throw new Error('Failed to load resources');
        }
        const data = await response.json();
        setResources(data.resources);
        */
        
      } catch (err) {
        console.error('Error loading resources:', err);
        setError(err instanceof Error ? err.message : 'Failed to load resources');
        setResources(mockResources.resources); // Fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };

    loadResources();
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
      loading,
      error,
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