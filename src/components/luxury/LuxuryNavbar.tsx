import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';

export default function LuxuryNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/fleet', label: 'Fleet' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-carbon-300/80 backdrop-glass border-b border-white/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="relative w-10 h-10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-electric-500 to-electric-700 rounded-xl transform rotate-3 group-hover:rotate-6 transition-transform" />
                <div className="absolute inset-0 bg-carbon rounded-xl flex items-center justify-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 text-electric-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-bold text-white tracking-tight">
                  APEX
                </span>
                <span className="text-[10px] font-medium text-electric-400 tracking-[0.2em] uppercase">
                  Drive
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link relative ${isActive(link.path) ? 'text-electric-400' : ''}`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-electric-500 to-electric-700"
                    />
                  )}
                </Link>
              ))}
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 pl-4 border-l border-white/10"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric-500/20 to-electric-700/20 border border-electric-500/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-electric-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{user.full_name}</p>
                      <p className="text-xs text-metallic-500">{user.role}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-metallic-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden"
                      >
                        <div className="p-2">
                          {user.role === 'Admin' ? (
                            <Link
                              to="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <svg className="w-5 h-5 text-electric-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                              </svg>
                              <span className="text-sm text-white">Admin Dashboard</span>
                            </Link>
                          ) : (
                            <Link
                              to="/dashboard"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <svg className="w-5 h-5 text-electric-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                              </svg>
                              <span className="text-sm text-white">My Dashboard</span>
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                          >
                            <LogOut className="w-5 h-5 text-red-400" />
                            <span className="text-sm text-red-400">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-metallic-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-neon text-sm py-2.5 px-5"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-carbon-300/95 backdrop-glass" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-obsidian border-l border-white/10 p-6 pt-24"
            >
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                      isActive(link.path) 
                        ? 'bg-electric-500/10 text-electric-400' 
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-xl text-center font-medium text-white bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full"
                  >
                    <button className="btn-neon w-full py-3">Get Started</button>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
