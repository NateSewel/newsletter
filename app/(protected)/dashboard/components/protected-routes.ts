/* eslint-disable @typescript-eslint/no-explicit-any */
// config/routes.ts

import { UserRole } from "@prisma/client";
import {
  Home,
  Database,
  FolderOpen,
  UserPen,
  BarChart3,
  Activity,
  FileText,
  HomeIcon,
} from "lucide-react";

export type Route = {
  title: string;
  href: string;
  icon: any;
  roles?: UserRole[]; // Which roles can access this route
  group?: string; // Optional grouping for related routes
  isNew?: boolean; // Optional flag for new features
};

export const routes: Route[] = [
  // Dashboard - accessible to all
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["USER", "ADMIN"],
  },

  // API Management - main features
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
    roles: ["USER", "ADMIN"],
    group: "API Management",
  },

  {
    title: "API Keys",
    href: "/dashboard/api-keys",
    icon: Database,
    roles: ["USER", "ADMIN"],
    group: "API Management",
  },

  // Analytics and Monitoring
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["USER", "ADMIN"],
    group: "Analytics",
  },

  {
    title: "API Usage",
    href: "/dashboard/api-usage",
    icon: Activity,
    roles: ["USER", "ADMIN"],
    group: "Analytics",
  },

  // Documentation
  {
    title: "API Documentation",
    href: "/dashboard/docs",
    icon: FileText,
    roles: ["USER", "ADMIN"],
    group: "Resources",
  },

  // Admin only features
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: UserPen,
    roles: ["ADMIN"],
    group: "Administration",
  },

  {
    title: "System Logs",
    href: "/dashboard/logs",
    icon: Activity,
    roles: ["ADMIN"],
    group: "Administration",
  },

  // Settings
  // {
  //   title: "Profile Settings",
  //   href: "/dashboard/settings/profile",
  //   icon: UserPen,
  //   roles: ["USER", "ADMIN"],
  //   group: "Settings",
  // },

  // {
  //   title: "API Settings",
  //   href: "/dashboard/settings/api",
  //   icon: Settings,
  //   roles: ["USER", "ADMIN"],
  //   group: "Settings",
  // },

  // External links
  {
    title: "Home",
    href: "/",
    icon: HomeIcon,
    roles: ["USER", "ADMIN"],
    group: "External",
  },
];

// Helper function to get routes for a specific role
export const getRoutesByRole = (role: UserRole) => {
  return routes.filter((route) => route.roles?.includes(role));
};

// Helper function to get routes by group for a specific role
export const getRoutesByGroup = (role: UserRole) => {
  const userRoutes = getRoutesByRole(role);
  const groups = new Map<string, Route[]>();

  userRoutes.forEach((route) => {
    const group = route.group || "Other";
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)?.push(route);
  });

  return groups;
};

// Helper to check if a user has access to a specific route
export const hasRouteAccess = (route: Route, role: UserRole) => {
  return route.roles?.includes(role);
};

// Helper to get primary navigation items (most commonly used)
export const getPrimaryRoutes = (role: UserRole) => {
  const primaryRouteHrefs = [
    "/dashboard",
    "/dashboard/projects",
    "/dashboard/endpoints",
    "/dashboard/analytics",
  ];

  return routes.filter(
    (route) =>
      primaryRouteHrefs.includes(route.href) && route.roles?.includes(role)
  );
};

// Helper to get grouped routes excluding primary ones
export const getSecondaryRoutesByGroup = (role: UserRole) => {
  const primaryRouteHrefs = [
    "/dashboard",
    "/dashboard/projects",
    "/dashboard/endpoints",
    "/dashboard/analytics",
  ];

  const secondaryRoutes = routes.filter(
    (route) =>
      !primaryRouteHrefs.includes(route.href) && route.roles?.includes(role)
  );

  const groups = new Map<string, Route[]>();

  secondaryRoutes.forEach((route) => {
    const group = route.group || "Other";
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)?.push(route);
  });

  return groups;
};
