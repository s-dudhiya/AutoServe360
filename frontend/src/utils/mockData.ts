export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'mechanic';
  phone?: string;
}

export interface JobCard {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  serviceType: string;
  status: 'In Queue' | 'Under Service' | 'Awaiting Parts' | 'QC' | 'Completed';
  assignedMechanic?: string;
  createdAt: string;
  estimatedCompletion: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'admin@autoserve360.com',
    role: 'admin',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike@autoserve360.com',
    role: 'mechanic',
    phone: '+1 (555) 234-5678'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah@autoserve360.com',
    role: 'mechanic',
    phone: '+1 (555) 345-6789'
  }
];

// Mock Job Cards
export const mockJobCards: JobCard[] = [
  {
    id: 'JC001',
    customerName: 'Robert Smith',
    customerPhone: '+1 (555) 987-6543',
    vehicleNumber: 'ABC-123',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Camry 2020',
    serviceType: 'Oil Change & Inspection',
    status: 'Under Service',
    assignedMechanic: 'Mike Rodriguez',
    createdAt: '2024-01-15T08:30:00Z',
    estimatedCompletion: '2024-01-15T12:00:00Z',
    description: 'Regular oil change and 30-point inspection',
    priority: 'Medium'
  },
  {
    id: 'JC002',
    customerName: 'Maria Garcia',
    customerPhone: '+1 (555) 876-5432',
    vehicleNumber: 'XYZ-789',
    vehicleBrand: 'Honda',
    vehicleModel: 'Civic 2019',
    serviceType: 'Brake Service',
    status: 'Awaiting Parts',
    assignedMechanic: 'Sarah Johnson',
    createdAt: '2024-01-15T09:15:00Z',
    estimatedCompletion: '2024-01-16T14:00:00Z',
    description: 'Replace brake pads and check brake fluid',
    priority: 'High'
  },
  {
    id: 'JC003',
    customerName: 'David Wilson',
    customerPhone: '+1 (555) 765-4321',
    vehicleNumber: 'DEF-456',
    vehicleBrand: 'Ford',
    vehicleModel: 'F-150 2021',
    serviceType: 'Engine Diagnostic',
    status: 'In Queue',
    createdAt: '2024-01-15T10:00:00Z',
    estimatedCompletion: '2024-01-16T16:00:00Z',
    description: 'Check engine light diagnostic and repair',
    priority: 'High'
  },
  {
    id: 'JC004',
    customerName: 'Lisa Brown',
    customerPhone: '+1 (555) 654-3210',
    vehicleNumber: 'GHI-789',
    vehicleBrand: 'BMW',
    vehicleModel: 'X3 2022',
    serviceType: 'Annual Service',
    status: 'Completed',
    assignedMechanic: 'Mike Rodriguez',
    createdAt: '2024-01-14T08:00:00Z',
    estimatedCompletion: '2024-01-14T17:00:00Z',
    description: 'Annual comprehensive service and maintenance',
    priority: 'Low'
  }
];

// Mock Inventory
export const mockInventory: InventoryItem[] = [
  {
    id: 'INV001',
    name: 'Engine Oil 5W-30',
    category: 'Oils & Fluids',
    stock: 45,
    minStock: 20,
    price: 24.99,
    supplier: 'Mobil'
  },
  {
    id: 'INV002',
    name: 'Brake Pads Set',
    category: 'Brake Parts',
    stock: 12,
    minStock: 15,
    price: 89.99,
    supplier: 'Brembo'
  },
  {
    id: 'INV003',
    name: 'Air Filter',
    category: 'Filters',
    stock: 28,
    minStock: 10,
    price: 19.99,
    supplier: 'K&N'
  },
  {
    id: 'INV004',
    name: 'Spark Plugs Set',
    category: 'Engine Parts',
    stock: 8,
    minStock: 12,
    price: 32.99,
    supplier: 'NGK'
  }
];

// Current user (for demo purposes)
export const getCurrentUser = (): User => {
  const userRole = localStorage.getItem('userRole') || 'admin';
  return mockUsers.find(user => user.role === userRole) || mockUsers[0];
};

// Helper functions
export const getJobsByMechanic = (mechanicName: string): JobCard[] => {
  return mockJobCards.filter(job => job.assignedMechanic === mechanicName);
};

export const getLowStockItems = (): InventoryItem[] => {
  return mockInventory.filter(item => item.stock <= item.minStock);
};

export const getStatsOverview = () => {
  const totalActiveJobs = mockJobCards.filter(job => job.status !== 'Completed').length;
  const completedJobs = mockJobCards.filter(job => job.status === 'Completed').length;
  const pendingParts = mockJobCards.filter(job => job.status === 'Awaiting Parts').length;
  const todayRevenue = completedJobs * 150; // Mock calculation

  return {
    totalActiveJobs,
    completedJobs,
    pendingParts,
    todayRevenue
  };
};