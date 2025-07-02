"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getRoutesByGroup } from "./protected-routes";
import { signOut } from "@/lib/auth-client";
import Logo from "@/components/global/Logo";
import { UserRole } from "@prisma/client";

interface SidebarProps {
  role: UserRole;
}

export default function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const routeGroups = getRoutesByGroup(role);

  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: ["80px", "280px"] },
    collapsed: { width: ["280px", "80px"] },
  };

  const mobileMenuVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo & Header */}
      <div className="flex h-16 items-center border-b border-border/50 px-4">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center w-full" : ""
          )}
        >
          <Logo href="/dashboard" isCollapsed={isCollapsed} />
        </div>

        <button
          onClick={toggleSidebar}
          className="hidden md:flex ml-auto h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed ? "rotate-180" : ""
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 lg:px-4">
          {Array.from(routeGroups.entries()).map(([group, routes]) => (
            <div
              key={group}
              className={cn(
                "space-y-1 mb-4",
                isCollapsed && "flex flex-col items-center"
              )}
            >
              {group !== "Other" && !isCollapsed && (
                <h4 className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                  {group}
                </h4>
              )}

              {routes.map((route, i) => {
                const Icon = route.icon;
                const isActive = route.href === pathname;

                return (
                  <TooltipProvider key={i} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={route.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-primary",
                            isCollapsed && "justify-center px-0"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center rounded-md",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-primary"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <AnimatePresence>
                            {!isCollapsed && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-medium"
                              >
                                {route.title}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {!isCollapsed && route.isNew && (
                            <Badge
                              variant="default"
                              className="ml-auto text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary"
                            >
                              New
                            </Badge>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          <p>{route.title}</p>
                          {route.isNew && (
                            <Badge
                              variant="default"
                              className="ml-1 text-[10px] px-1 py-0.5"
                            >
                              New
                            </Badge>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 p-4">
        <Button
          onClick={handleLogout}
          size="sm"
          variant="outline"
          className={cn(
            "w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors",
            isCollapsed && "justify-center px-0 aspect-square"
          )}
        >
          <LogOut className="h-4 w-4" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );

  // Mobile menu button that appears in the header on small screens
  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileSidebar}
      className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border"
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle Menu</span>
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:block h-screen border-r border-border/50 bg-background fixed top-0 left-0 z-30"
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {renderSidebarContent()}
      </motion.aside>

      {/* Mobile Menu Button - shown in header */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <MobileMenuButton />
      </div>

      {/* Mobile Sidebar - slides in from left */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileSidebar}
            />
            <motion.aside
              className="fixed top-0 left-0 h-screen w-[280px] bg-background z-50 md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileSidebar}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content padding when sidebar is expanded */}
      <div
        className={cn(
          "hidden md:block",
          isCollapsed ? "md:pl-[80px]" : "md:pl-[280px]"
        )}
      />
    </>
  );
}
