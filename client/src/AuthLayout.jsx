export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-10 overflow-hidden">
        {/* signature motif: ascending bars, quiet nod to lesson progress */}
        <svg
          className="absolute -bottom-10 -right-10 opacity-20"
          width="320" height="320" viewBox="0 0 320 320" fill="none"
        >
          <rect x="40" y="220" width="30" height="60" rx="4" fill="white" />
          <rect x="90" y="180" width="30" height="100" rx="4" fill="white" />
          <rect x="140" y="130" width="30" height="150" rx="4" fill="white" />
          <rect x="190" y="80" width="30" height="200" rx="4" fill="white" />
          <rect x="240" y="40" width="30" height="240" rx="4" fill="white" />
        </svg>

        <div className="relative z-10">
          <span className="text-white text-xl font-semibold tracking-tight">Lessonly</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="text-white text-3xl font-semibold leading-snug mb-3">
            {title}
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="relative z-10 text-blue-200 text-xs">
          Every lesson tracked, every student on top of it.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}