// Please Uncomment Line 156 to line 168 to add decorative blurs
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Button } from "../ui/button";

const navigation = [
  { name: "Solutions", href: "#" },
  { name: "Features", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Resources", href: "#" },
];
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  // Add scroll detection for navbar animation
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <span className="sr-only">Fusion</span>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white&shade=600"
                className="h-6 w-auto"
              />
            </div>
            <span className="font-bold text-xl text-gray-900">Fusion</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-full p-2.5 text-gray-700 hover:bg-gray-100"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>
        {session ? (
          <div className="">
            <Button className="text-blue-600" variant={"ghost"} asChild>
              <Link href={"/dashboard"}>Dashboard</Link>
            </Button>
          </div>
        ) : (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors flex items-center"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
            >
              Sign up free
            </Link>
          </div>
        )}
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white&shade=600"
                  className="h-6 w-auto"
                />
              </div>
              <span className="font-bold text-xl text-gray-900">Fusion</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-full p-2.5 text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6 space-y-3">
                <a
                  href="#"
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
                <a
                  href="#"
                  className="block rounded-full px-3 py-2.5 text-base font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                  Sign up free
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
