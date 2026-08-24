export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-screen flex bg-gray-50">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-3/10 relative bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-10 overflow-hidden">
        <div className="relative z-10">
          <span className="text-white text-xl font-semibold tracking-tight">HelpMeTutor!</span>
        </div>

        <div className="relative z-0 max-w-sm">
          <h1 className="text-white text-3xl font-semibold leading-snug mb-3">
            {title}
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="relative z-10 text-blue-200 text-xs">
          Vidhyabhushan Balaji 2026.
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