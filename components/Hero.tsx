import { ArrowRightIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

export default function Hero() {
  return (
    <div className="relative isolate pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32 px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-[999] transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-green-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Badge for tutorial announcement */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-12 flex justify-center">
          <div className="relative flex items-center gap-x-2 rounded-full px-4 py-2 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 bg-white/50 backdrop-blur-sm">
            <ShieldCheckIcon
              className="h-4 w-4 text-blue-600"
              aria-hidden="true"
            />
            <span className="font-medium">Complete Free Course</span>
            <a
              href="www.nextjsacademy.com"
              className="flex items-center gap-x-1 font-semibold text-blue-600"
            >
              <span>Start learning</span>
              <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
              <span className="absolute inset-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Main hero content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 leading-tight">
            Next.js and
            <br />
            Better Auth Crash Course
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Learn how to implement secure, scalable authentication and
            authorization in your Next.js applications. Together with Prisma,
            Superbase(Postgress) .
          </p>

          {/* Improved CTAs with better visual hierarchy */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <a
              href="#tutorial"
              className="rounded-full bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-1 flex-none w-full sm:w-auto"
            >
              Start tutorial
            </a>
            <a
              href="#demo"
              className="rounded-full px-6 py-3.5 text-base font-medium text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-x-2 flex-none w-full sm:w-auto"
            >
              View demo
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>

          {/* Tutorial features/highlights */}
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Secure Authentication
              </span>
              <span className="text-sm text-gray-500 mt-2">
                Implement OAuth, JWT, and session management with Better Auth
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Next.js Integration
              </span>
              <span className="text-sm text-gray-500 mt-2">
                Seamless setup with App Router, middleware, and server
                components
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Production Ready
              </span>
              <span className="text-sm text-gray-500 mt-2">
                Learn best practices for deployment and scaling your auth system
              </span>
            </div>
          </div>

          {/* What you'll learn section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What You will Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <span className="text-gray-600">
                  Setting up Better Auth in Next.js
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <span className="text-gray-600">
                  Configuring OAuth providers
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <span className="text-gray-600">
                  Protecting routes and API endpoints
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <span className="text-gray-600">Managing user roles</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <span className="text-gray-600">
                  Database and ORM integration
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-600 to-green-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
