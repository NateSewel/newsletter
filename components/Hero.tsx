"use client";

import { useState, useEffect } from "react";
import {
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="bg-black min-h-screen text-white/90 overflow-hidden">
      {/* Fixed header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-white"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Solution
            </a>
            <a
              href="#"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              About
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="text-sm font-medium text-white/80 hover:text-white"
            >
              Login
            </a>
            <a
              href="#"
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* Mobile menu, show/hide based on mobile menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-50"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full bg-black/95 backdrop-blur-md px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10 overflow-y-auto">
              <div className="flex items-center justify-between">
                <a href="#" className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-white"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white/70"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-white/10">
                  <div className="space-y-2 py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10"
                    >
                      Features
                    </a>
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10"
                    >
                      Solution
                    </a>
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10"
                    >
                      Pricing
                    </a>
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10"
                    >
                      About
                    </a>
                  </div>
                  <div className="py-6 space-y-3">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10"
                    >
                      Login
                    </a>
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-white/10 hover:bg-white/20"
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <div className="relative">
          {/* Gradient background effects */}
          <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-80 h-80 bg-yellow-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

          <div className="max-w-7xl mx-auto px-4 py-28 sm:px-6 lg:px-8 relative z-10 pt-32 pb-16 sm:pb-32">
            {/* Announcement badge */}
            <div className="mx-auto max-w-fit mb-10">
              <div className="flex items-center gap-x-1.5 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
                <p className="font-medium">Introducing Support for AI Models</p>
                <ChevronRightIcon className="h-4 w-4" />
              </div>
            </div>

            {/* Hero content */}
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
                Modern Solutions for Customer Engagement
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
                Highly customizable components for building modern websites and
                applications that look and feel the way you mean it.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#"
                  className="rounded-md bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 ring-1 ring-white/20 w-full sm:w-auto"
                >
                  Start Building
                </a>
                <a
                  href="#"
                  className="rounded-md px-4 py-2.5 text-sm font-semibold text-white hover:text-white/80 w-full sm:w-auto text-center"
                >
                  Request a demo
                </a>
              </div>
            </div>

            {/* Product showcase */}
            <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
              <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
                {/* Email inbox UI mockup */}
                <div className="flex flex-col h-96 sm:h-[420px]">
                  {/* Email header */}
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm font-medium">Inbox</div>
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-white/20 rounded"></div>
                      <div className="w-4 h-4 bg-white/20 rounded"></div>
                      <div className="w-4 h-4 bg-white/20 rounded"></div>
                    </div>
                  </div>

                  {/* Email content */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 hidden sm:block border-r border-white/10 bg-black/30">
                      <div className="p-3 border-b border-white/10">
                        <div className="w-full h-8 bg-white/10 rounded-md"></div>
                      </div>
                      <div className="p-3">
                        <div className="space-y-2">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <div className="h-4 w-24 bg-white/10 rounded"></div>
                              <div className="h-4 w-6 bg-white/10 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Email list */}
                    <div className="w-full sm:w-auto sm:flex-1 border-r border-white/10 bg-black/20 hidden sm:block">
                      <div className="p-3 border-b border-white/10">
                        <div className="w-full h-8 bg-white/10 rounded-md"></div>
                      </div>
                      <div className="p-3 space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              i === 0 ? "bg-white/10" : "hover:bg-white/5"
                            } cursor-pointer`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="h-4 w-32 bg-white/20 rounded"></div>
                              <div className="h-3 w-16 bg-white/10 rounded"></div>
                            </div>
                            <div className="h-3 w-full bg-white/10 rounded mb-1"></div>
                            <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Email view for mobile */}
                    <div className="flex-1 bg-black/10 p-4 overflow-hidden">
                      <div className="sm:hidden text-center text-sm text-gray-400 h-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="h-8 w-8 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p>Select an email to view</p>
                      </div>

                      {/* Email view for desktop */}
                      <div className="hidden sm:block">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-white/20"></div>
                            <div>
                              <div className="h-4 w-32 bg-white/20 rounded"></div>
                              <div className="h-3 w-24 bg-white/10 rounded mt-1"></div>
                            </div>
                          </div>
                          <div className="h-4 w-20 bg-white/10 rounded"></div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="h-4 w-full bg-white/10 rounded"></div>
                          <div className="h-4 w-full bg-white/10 rounded"></div>
                          <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                        </div>
                        <div className="h-px w-full bg-white/10 my-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-white/10 rounded"></div>
                          <div className="h-4 w-full bg-white/10 rounded"></div>
                          <div className="h-4 w-2/3 bg-white/10 rounded"></div>
                        </div>
                        <div className="mt-6">
                          <div className="h-8 w-24 rounded-md bg-white/20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted by logos */}
            <div className="mt-24 sm:mt-32">
              <p className="text-center text-sm font-semibold text-gray-500 mb-6">
                TRUSTED BY INNOVATIVE COMPANIES
              </p>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-6">
                <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                  <img
                    src="/api/placeholder/100/40"
                    alt="Company logo"
                    className="h-8 object-contain"
                  />
                </div>
                <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                  <img
                    src="/api/placeholder/100/40"
                    alt="Company logo"
                    className="h-8 object-contain"
                  />
                </div>
                <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                  <img
                    src="/api/placeholder/100/40"
                    alt="Company logo"
                    className="h-8 object-contain"
                  />
                </div>
                <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
                  <img
                    src="/api/placeholder/100/40"
                    alt="Company logo"
                    className="h-8 object-contain"
                  />
                </div>
                <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
                  <img
                    src="/api/placeholder/100/40"
                    alt="Company logo"
                    className="h-8 object-contain"
                  />
                </div>
                <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
                  <img
                    src="/api/placeholder/100/40"
                    alt="Company logo"
                    className="h-8 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
