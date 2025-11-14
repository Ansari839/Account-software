'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Package2, Users, ShoppingCart, Package, DollarSign, FileText, Settings, BarChart3, Warehouse, Truck, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type NavItem = {
  title: string;
  href?: string;
  icon: React.ReactNode;
  items?: NavSubItem[];
};

type NavSubItem = {
  title: string;
  href: string;
};

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  {
    title: 'Sales',
    icon: <DollarSign className="h-4 w-4" />,
    items: [
      { title: 'Sales Order', href: '/sales/orders' },
      { title: 'Sales Return', href: '/sales/order-return' },
      { title: 'Delivery Challan', href: '/sales/delivery-challan' },
      { title: 'Customer Ledger', href: '/sales/customer-ledger' },
    ]
  },
  { title: 'Purchase', href: '/purchase', icon: <ShoppingCart className="h-4 w-4" /> },
  { title: 'Inventory', href: '/inventory', icon: <Package className="h-4 w-4" /> },
  {
  title: 'Accounts',
  icon: <FileText className="h-4 w-4" />,
  items: [
    { title: 'Chart of Accounts', href: '/accounts/chart-of-accounts' },
    { title: 'Journal Voucher', href: '/accounts/journal-voucher' },
    { title: 'Cash Book', href: '/accounts/cash-book' },
    { title: 'Bank Book', href: '/accounts/bank-book' },
    { title: 'General Ledger', href: '/accounts/general-ledger' },
    { title: 'Trial Balance', href: '/accounts/trial-balance' },
    { title: 'Profit & Loss', href: '/accounts/profit-loss' },
    { title: 'Balance Sheet', href: '/accounts/balance-sheet' },
  ]
},
  {
  title: 'Dispatch',
  icon: <Truck className="h-4 w-4" />,
  items: [
    { title: 'Dispatch Entry', href: '/dispatch/dispatch-entry' },
    { title: 'Gatepass', href: '/dispatch/gatepass' },
    { title: 'Vehicle Assignment', href: '/dispatch/vehicle-assignment' },
    { title: 'Delivery Status', href: '/dispatch/delivery-status' },
  ]
},
  { title: 'Reports', href: '/reports', icon: <BarChart3 className="h-4 w-4" /> },
  {
    title: 'RBAC',
    icon: <Users className="h-4 w-4" />,
    items: [
      { title: 'Roles', href: '/rbac/roles' },
      { title: 'Permissions', href: '/rbac/permissions' },
      { title: 'Role-Permissions', href: '/rbac/role-permissions' },
      { title: 'User-Roles', href: '/rbac/user-roles' },
    ]
  },
  { title: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
];

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Helper function to check if any submenu item is active
  const isMenuActive = (subItems: NavSubItem[], currentPath: string) => {
    return subItems.some(subItem => currentPath.startsWith(subItem.href));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2">
            <Package2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">ERP System</span>
          </Link>
        </div>

        <nav className="mt-6">
          <ul className="space-y-1 px-4">
            {navItems.map((item) => (
              <li key={item.href || item.title}>
                {item.items ? (
                  // Menu item with sub-items
                  <div>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`flex items-center justify-between w-full rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isMenuActive(item.items, pathname) 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {expandedMenus[item.title] ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </button>
                    {expandedMenus[item.title] && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <li key={subItem.href}>
                            <Link href={subItem.href}>
                              <div className={`rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-colors ${
                                pathname === subItem.href
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}>
                                {subItem.title}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Menu item without sub-items
                  <Link href={item.href!}>
                    <div className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-colors hover:text-gray-900 dark:hover:text-gray-100 ${
                      pathname === item.href
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {getPathNameFromUrl(pathname)}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

function getPathNameFromUrl(pathname: string) {
  // Remove leading slash and split by remaining slashes
  const pathParts = pathname.split('/').filter(Boolean);

  // Convert path parts to readable titles
  if (pathParts.length === 0) return 'Dashboard';

  const lastPart = pathParts[pathParts.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}