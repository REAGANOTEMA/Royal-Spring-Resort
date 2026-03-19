// RBAC (Role-Based Access Control) Utilities

export type StaffLevel = 'director' | 'manager' | 'supervisor' | 'staff';

interface StaffPermissions {
  canViewAll: boolean;
  canManageOwnDept: boolean;
  canManageStaffInDept: boolean;
  canAccessFinancial: boolean;
  canAccessPayroll: boolean;
}

export const staffPermissions: Record<StaffLevel, StaffPermissions> = {
  director: {
    canViewAll: true,
    canManageOwnDept: true,
    canManageStaffInDept: true,
    canAccessFinancial: true,
    canAccessPayroll: true,
  },
  manager: {
    canViewAll: false,
    canManageOwnDept: true,
    canManageStaffInDept: true,
    canAccessFinancial: true,
    canAccessPayroll: true,
  },
  supervisor: {
    canViewAll: false,
    canManageOwnDept: true,
    canManageStaffInDept: false,
    canAccessFinancial: false,
    canAccessPayroll: false,
  },
  staff: {
    canViewAll: false,
    canManageOwnDept: false,
    canManageStaffInDept: false,
    canAccessFinancial: false,
    canAccessPayroll: false,
  },
};

/**
 * Check if user has permission to view a page
 */
export const canAccessPage = (userRole: StaffLevel, department: string, requiredRole?: StaffLevel[]): boolean => {
  if (!userRole) return false;
  
  // Directors can access everything
  if (userRole === 'director') return true;
  
  // If specific roles required, check if user's role is in that list
  if (requiredRole && !requiredRole.includes(userRole)) return false;
  
  return true;
};

/**
 * Check if user can manage staff
 */
export const canManageStaff = (userRole: StaffLevel, targetUserDept?: string, userDept?: string): boolean => {
  const permissions = staffPermissions[userRole];
  
  if (userRole === 'director') return true;
  
  if (permissions.canManageStaffInDept) {
    return userDept === targetUserDept;
  }
  
  return false;
};

/**
 * Check if user can view staff in department
 */
export const canViewDepartmentStaff = (userRole: StaffLevel, viewingDept: string, userDept: string): boolean => {
  if (userRole === 'director') return true;
  if (userRole === 'manager' || userRole === 'supervisor') {
    return userDept === viewingDept;
  }
  return false;
};

/**
 * Check if user can access financial data
 */
export const canAccessFinancial = (userRole: StaffLevel): boolean => {
  return staffPermissions[userRole].canAccessFinancial;
};

/**
 * Check if user can access payroll data
 */
export const canAccessPayroll = (userRole: StaffLevel): boolean => {
  return staffPermissions[userRole].canAccessPayroll;
};

/**
 * Get allowed pages for user role
 */
export const getAllowedPages = (userRole: StaffLevel): string[] => {
  const basePages = ['/dashboard', '/profile'];
  
  const rolePages: Record<StaffLevel, string[]> = {
    director: [
      ...basePages,
      '/rooms',
      '/bookings',
      '/guests',
      '/billing',
      '/payroll',
      '/staff',
      '/hr',
      '/inventory',
      '/kitchen',
      '/housekeeping',
      '/maintenance',
      '/incidents',
      '/security',
      '/reports',
      '/media',
      '/messages',
      '/settings',
    ],
    manager: [
      ...basePages,
      '/rooms',
      '/bookings',
      '/guests',
      '/billing',
      '/payroll',
      '/staff',
      '/inventory',
      '/housekeeping',
      '/incidents',
      '/messages',
    ],
    supervisor: [
      ...basePages,
      '/bookings',
      '/guests',
      '/housekeeping',
      '/incidents',
      '/messages',
    ],
    staff: [
      ...basePages,
      '/guests',
      '/messages',
    ],
  };
  
  return rolePages[userRole] || basePages;
};

/**
 * Get pages that should be hidden for user role
 */
export const getHiddenPages = (userRole: StaffLevel): string[] => {
  const allPages = [
    '/dashboard',
    '/rooms',
    '/bookings',
    '/guests',
    '/billing',
    '/payroll',
    '/staff',
    '/hr',
    '/inventory',
    '/kitchen',
    '/housekeeping',
    '/maintenance',
    '/incidents',
    '/security',
    '/reports',
    '/media',
    '/messages',
    '/settings',
    '/profile',
    '/finance',
    '/accountant',
    '/careers',
    '/help',
    '/job-postings',
    '/login',
    '/user-management',
  ];
  
  const allowedPages = getAllowedPages(userRole);
  return allPages.filter(page => !allowedPages.includes(page));
};

/**
 * Utility to get sidebar menu items based on role
 */
export const getSidebarMenuItems = (userRole: StaffLevel) => {
  const baseItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/profile', label: 'My Profile', icon: 'User' },
  ];
  
  const roleMenus: Record<StaffLevel, typeof baseItems> = {
    director: [
      { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { href: '/rooms', label: 'Rooms', icon: 'Home' },
      { href: '/bookings', label: 'Bookings', icon: 'Calendar' },
      { href: '/guests', label: 'Guests', icon: 'Users' },
      { href: '/billing', label: 'Billing', icon: 'ReceiptText' },
      { href: '/payroll', label: 'Payroll', icon: 'DollarSign' },
      { href: '/staff', label: 'Staff', icon: 'Users' },
      { href: '/inventory', label: 'Inventory', icon: 'Package' },
      { href: '/kitchen', label: 'Kitchen', icon: 'UtensilsCrossed' },
      { href: '/housekeeping', label: 'Housekeeping', icon: 'Sparkles' },
      { href: '/maintenance', label: 'Maintenance', icon: 'Wrench' },
      { href: '/incidents', label: 'Incidents', icon: 'AlertCircle' },
      { href: '/security', label: 'Security', icon: 'Shield' },
      { href: '/reports', label: 'Reports', icon: 'BarChart3' },
      { href: '/messages', label: 'Messages', icon: 'MessageSquare' },
      { href: '/settings', label: 'Settings', icon: 'Settings' },
      { href: '/profile', label: 'My Profile', icon: 'User' },
    ],
    manager: [
      { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { href: '/rooms', label: 'Rooms', icon: 'Home' },
      { href: '/bookings', label: 'Bookings', icon: 'Calendar' },
      { href: '/guests', label: 'Guests', icon: 'Users' },
      { href: '/billing', label: 'Billing', icon: 'ReceiptText' },
      { href: '/payroll', label: 'Payroll', icon: 'DollarSign' },
      { href: '/staff', label: 'Staff', icon: 'Users' },
      { href: '/inventory', label: 'Inventory', icon: 'Package' },
      { href: '/housekeeping', label: 'Housekeeping', icon: 'Sparkles' },
      { href: '/incidents', label: 'Incidents', icon: 'AlertCircle' },
      { href: '/messages', label: 'Messages', icon: 'MessageSquare' },
      { href: '/profile', label: 'My Profile', icon: 'User' },
    ],
    supervisor: [
      { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { href: '/bookings', label: 'Bookings', icon: 'Calendar' },
      { href: '/guests', label: 'Guests', icon: 'Users' },
      { href: '/housekeeping', label: 'Housekeeping', icon: 'Sparkles' },
      { href: '/incidents', label: 'Incidents', icon: 'AlertCircle' },
      { href: '/messages', label: 'Messages', icon: 'MessageSquare' },
      { href: '/profile', label: 'My Profile', icon: 'User' },
    ],
    staff: [
      { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { href: '/guests', label: 'Guests', icon: 'Users' },
      { href: '/messages', label: 'Messages', icon: 'MessageSquare' },
      { href: '/profile', label: 'My Profile', icon: 'User' },
    ],
  };
  
  return roleMenus[userRole] || baseItems;
};
