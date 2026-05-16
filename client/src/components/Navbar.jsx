import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container-wide flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">LeadAudit</span>
        </Link>

        {pathname === '/' && (
          <Link
            to="/submit"
            className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-1.5 rounded-lg transition-colors"
          >
            Get started
          </Link>
        )}
      </div>
    </nav>
  );
}
