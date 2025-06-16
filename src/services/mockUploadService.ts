export interface MockResource {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'graphic';
  category: 'medical' | 'education' | 'campus';
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  uploadedBy: string;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// อ่านข้อมูลจาก localStorage
const getResources = (): MockResource[] => {
  try {
    const stored = localStorage.getItem('mockResources');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading resources:', error);
    return [];
  }
};

// บันทึกข้อมูลลง localStorage
const saveResources = (resources: MockResource[]) => {
  try {
    localStorage.setItem('mockResources', JSON.stringify(resources));
  } catch (error) {
    console.error('Error saving resources:', error);
    throw new Error('Failed to save resources');
  }
};

// นำเข้าข้อมูล mock
import resourcesData from "../mock/resources.json";

export const uploadMockFile = async (file: File, metadata: {
  title: string;
  description: string;
  type: 'image' | 'video' | 'graphic';
  category: 'medical' | 'education' | 'campus';
  uploadedBy: string;
}): Promise<MockResource> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // อ่านข้อมูลเดิม
      const resources = getResources();
      
      // สร้าง URL สำหรับไฟล์
      const fileUrl = URL.createObjectURL(file);
      
      // สร้างข้อมูลใหม่
      const newResource: MockResource = {
        id: `r${String(resources.length + 1).padStart(4, '0')}`,
        fileUrl,
        thumbnailUrl: fileUrl,
        tags: [],
        downloadCount: 0,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...metadata
      };

      // เพิ่มข้อมูลใหม่
      resources.push(newResource);
      
      // บันทึกข้อมูล
      saveResources(resources);
      
      resolve(newResource);
    }, 1000);
  });
};

export const getMockResources = async (): Promise<MockResource[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // ดึงข้อมูลที่อัปโหลดจาก localStorage
      const uploadedResources = getResources();
      
      // แปลง mock data ให้ตรงกับ interface MockResource
      const mockResources = resourcesData.resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description || '',
        type: resource.type as 'image' | 'video' | 'graphic',
        category: resource.category as 'medical' | 'education' | 'campus',
        tags: resource.tags || [],
        fileUrl: resource.fileUrl,
        thumbnailUrl: resource.thumbnailUrl,
        uploadedBy: resource.uploadedBy,
        downloadCount: resource.downloadCount || 0,
        viewCount: resource.viewCount || 0,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt
      })) as MockResource[];
      
      // รวมข้อมูลจาก mock data และ uploaded data
      const allResources = [...mockResources, ...uploadedResources];
      
      resolve(allResources);
    }, 500);
  });
};

export const deleteMockResource = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resources = getResources();
      const filtered = resources.filter(r => r.id !== id);
      saveResources(filtered);
      resolve();
    }, 500);
  });
}; 