
import { Software, AccessRequest, User, AccessLevel, RequestStatus, UserRole } from '../types';

// TODO: Replace this mock data with PostgreSQL database tables using TypeORM entities
// Example TypeORM entity for Software:
// @Entity()
// export class SoftwareEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column()
//   name: string;
//
//   @Column('text')
//   description: string;
//
//   @Column('simple-array')
//   accessLevels: string[];
// }

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

// Changed from const to let to allow modifications
let usersData: User[] = [
  { id: 1, username: 'employee', role: 'Employee' },
  { id: 2, username: 'manager', role: 'Manager' },
  { id: 3, username: 'admin', role: 'Admin' }
];

// TODO: Replace these helper functions with TypeORM repository methods
// Example: 
// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private userRepository: Repository<UserEntity>,
//   ) {}
//
//   async findById(id: number): Promise<UserEntity | undefined> {
//     return this.userRepository.findOne({ where: { id } });
//   }
// }

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
  // TODO: Replace with TypeORM repository method
  // Example: return this.softwareRepository.find();
  getAll: async (): Promise<Software[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...softwareData];
  },
  
  // TODO: Replace with TypeORM repository method
  // Example: return this.softwareRepository.findOne({ where: { id } });
  getById: async (id: number): Promise<Software | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const software = softwareData.find(s => s.id === id);
    return software || null;
  },
  
  // TODO: Replace with TypeORM repository method
  // Example: const newSoftware = this.softwareRepository.create(softwareData);
  // return this.softwareRepository.save(newSoftware);
  create: async (newSoftware: Omit<Software, 'id'>): Promise<Software> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newId = Math.max(0, ...softwareData.map(s => s.id)) + 1;
    
    const createdSoftware: Software = {
      ...newSoftware,
      id: newId
    };
    
    softwareData.push(createdSoftware);
    return createdSoftware;
  },
  
  // TODO: Replace with TypeORM repository method
  // Example: await this.softwareRepository.update(id, updatedSoftware);
  // return this.softwareRepository.findOne({ where: { id } });
  update: async (id: number, updatedSoftware: Partial<Software>): Promise<Software | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = softwareData.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    softwareData[index] = {
      ...softwareData[index],
      ...updatedSoftware
    };
    
    return softwareData[index];
  },
  
  // Fixed delete method to avoid reassigning to const variable
  delete: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const initialLength = softwareData.length;
    // Modified to use splice instead of reassignment
    const index = softwareData.findIndex(s => s.id === id);
    if (index !== -1) {
      softwareData.splice(index, 1);
    }
    
    return softwareData.length < initialLength;
  }
};

// Request API
export const requestApi = {
  // TODO: Replace with TypeORM repository method with relations
  // Example: return this.requestRepository.find({ relations: ['user', 'software'] });
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
  
  // TODO: Replace with TypeORM repository method with where clause
  // Example: return this.requestRepository.find({ 
  //   where: { user: { id: userId } },
  //   relations: ['software']
  // });
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
  
  // TODO: Replace with TypeORM repository method
  // Example: const newRequest = this.requestRepository.create({
  //   ...requestData,
  //   status: 'Pending',
  //   createdAt: new Date()
  // });
  // return this.requestRepository.save(newRequest);
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
  
  // TODO: Replace with TypeORM repository method
  // Example: await this.requestRepository.update(requestId, { status });
  // return this.requestRepository.findOne({ 
  //   where: { id: requestId },
  //   relations: ['user', 'software']  
  // });
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
  // TODO: Replace with TypeORM repository method
  // Example: return this.userRepository.find();
  getAll: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...usersData];
  },
  
  // TODO: Replace with TypeORM repository method
  // Example: return this.userRepository.findOne({ where: { id } });
  getById: async (id: number): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = usersData.find(u => u.id === id);
    return user || null;
  },
  
  // TODO: Replace with TypeORM repository method
  // Example: const newUser = this.userRepository.create(userData);
  // return this.userRepository.save(newUser);
  create: async (userData: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      ...userData,
      id: Math.max(0, ...usersData.map(u => u.id)) + 1
    };
    
    usersData.push(newUser);
    return newUser;
  },
  
  // TODO: Replace with TypeORM repository method
  // Example: await this.userRepository.update(id, updatedUserData);
  // return this.userRepository.findOne({ where: { id } });
  update: async (id: number, updatedUserData: Partial<User>): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = usersData.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    usersData[index] = {
      ...usersData[index],
      ...updatedUserData
    };
    
    return usersData[index];
  },
  
  // Fixed delete method to avoid reassigning to const variable
  delete: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const initialLength = usersData.length;
    // Modified to use splice instead of filter + reassignment
    const index = usersData.findIndex(u => u.id !== id);
    if (index !== -1) {
      usersData.splice(index, 1);
    }
    
    return usersData.length < initialLength;
  },
  
  // TODO: Replace with proper TypeORM query with password hashing
  // Example: const user = await this.userRepository.findOne({ 
  //   where: { username: username }
  // });
  // return user && await bcrypt.compare(password, user.passwordHash);
  validateCredentials: async (username: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // This is ONLY for demo purposes - in a real app, never store passwords in plain text
    // or handle authentication this way
    const mockUsers = [
      { id: 1, username: 'employee', password: 'password', role: 'Employee' as UserRole },
      { id: 2, username: 'manager', password: 'password', role: 'Manager' as UserRole },
      { id: 3, username: 'admin', password: 'password', role: 'Admin' as UserRole }
    ];
    
    const foundUser = mockUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (!foundUser) return null;
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  }
};

// TODO: Create TypeORM entities for each model
/*
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string; // Store hashed passwords only!

  @Column({
    type: 'enum',
    enum: ['Employee', 'Manager', 'Admin'],
    default: 'Employee'
  })
  role: UserRole;

  @OneToMany(() => AccessRequestEntity, request => request.user)
  requests: AccessRequestEntity[];
}

@Entity()
export class SoftwareEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  accessLevels: string[];

  @OneToMany(() => AccessRequestEntity, request => request.software)
  requests: AccessRequestEntity[];
}

@Entity()
export class AccessRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.requests)
  user: UserEntity;

  @ManyToOne(() => SoftwareEntity, software => software.requests)
  software: SoftwareEntity;

  @Column({
    type: 'enum',
    enum: ['Read', 'Write', 'Admin']
  })
  accessType: AccessLevel;

  @Column('text')
  reason: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  })
  status: RequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
*/
