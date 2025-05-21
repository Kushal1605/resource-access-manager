
import { Software, AccessRequest, User, AccessLevel, RequestStatus, UserRole } from '../types';

// Mock data
let softwareData: Software[] = [
  {
    id: 1,
    name: 'Project Management Tool',
    description: 'Enterprise-level project management software with Gantt charts and collaboration features',
    accessLevels: ['Read', 'Write', 'Admin']
  },
  {
    id: 2,
    name: 'CRM System',
    description: 'Customer relationship management system to track sales and customer interactions',
    accessLevels: ['Read', 'Write', 'Admin']
  },
  {
    id: 3,
    name: 'Financial Dashboard',
    description: 'Executive financial reporting tool with real-time data visualizations',
    accessLevels: ['Read', 'Write', 'Admin']
  }
];

let requestsData: AccessRequest[] = [
  {
    id: 1,
    userId: 1,
    softwareId: 1,
    accessType: 'Read',
    reason: 'Need to view project timelines',
    status: 'Pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 1,
    softwareId: 2,
    accessType: 'Write',
    reason: 'Need to update client records',
    status: 'Approved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock users data
const usersData: User[] = [
  { id: 1, username: 'employee', role: 'Employee' },
  { id: 2, username: 'manager', role: 'Manager' },
  { id: 3, username: 'admin', role: 'Admin' }
];

// Helper function to get user by ID
const getUserById = (id: number): User | undefined => {
  return usersData.find(user => user.id === id);
};

// Helper function to get software by ID
const getSoftwareById = (id: number): Software | undefined => {
  return softwareData.find(software => software.id === id);
};

// Software API
export const softwareApi = {
  getAll: async (): Promise<Software[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...softwareData];
  },
  
  getById: async (id: number): Promise<Software | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const software = softwareData.find(s => s.id === id);
    return software || null;
  },
  
  create: async (softwareData: Omit<Software, 'id'>): Promise<Software> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newSoftware: Software = {
      ...softwareData,
      id: Math.max(0, ...softwareData.map(s => s.id)) + 1
    };
    
    softwareData.push(newSoftware);
    return newSoftware;
  }
};

// Request API
export const requestApi = {
  getAll: async (): Promise<AccessRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Add user and software details to each request
    const enrichedRequests = requestsData.map(request => ({
      ...request,
      user: getUserById(request.userId),
      software: getSoftwareById(request.softwareId)
    }));
    
    return enrichedRequests;
  },
  
  getByUser: async (userId: number): Promise<AccessRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter by user and add software details
    const userRequests = requestsData
      .filter(request => request.userId === userId)
      .map(request => ({
        ...request,
        software: getSoftwareById(request.softwareId)
      }));
      
    return userRequests;
  },
  
  create: async (requestData: Omit<AccessRequest, 'id' | 'status' | 'createdAt'>): Promise<AccessRequest> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRequest: AccessRequest = {
      ...requestData,
      id: Math.max(0, ...requestsData.map(r => r.id)) + 1,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    requestsData.push(newRequest);
    return {
      ...newRequest,
      software: getSoftwareById(newRequest.softwareId)
    };
  },
  
  updateStatus: async (requestId: number, status: RequestStatus): Promise<AccessRequest | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = requestsData.findIndex(r => r.id === requestId);
    if (index === -1) return null;
    
    requestsData[index] = {
      ...requestsData[index],
      status
    };
    
    return {
      ...requestsData[index],
      user: getUserById(requestsData[index].userId),
      software: getSoftwareById(requestsData[index].softwareId)
    };
  }
};

// User API (for admin purposes)
export const userApi = {
  getAll: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...usersData];
  }
};
