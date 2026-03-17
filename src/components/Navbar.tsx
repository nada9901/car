import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, LogOut, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

// Bilingual translations
const translations = {
  en: {
    home: 'Home',
    fleet: 'Our Fleet',
    adminDashboard: 'Admin Dashboard',
    myDashboard: 'My Dashboard',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    brand: 'CarRental Pro',
    brandAr: 'برو لتأجير السيارات'
  },
  ar: {
    home: 'الرئيسية',
    fleet: 'أسطولنا',
    adminDashboard: 'لوحة التحكم',
    myDashboard: 'لوحتي',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    brand: 'برو لتأجير السيارات',
    brandAr: 'CarRental Pro'
  }
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [lang, setLang] = useState<'en' | 'ar'>('ar');
    const t = translations[lang];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'ar' : 'en');
    };

    return (
        <nav className="glass-nav sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-electric-500/20 rounded-xl flex items-center justify-center group-hover:bg-electric-500/30 transition-all">
                            <Car className="h-5 w-5 text-electric-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white leading-tight">{t.brand}</span>
                            <span className="text-xs text-electric-400/70 leading-tight">{t.brandAr}</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-electric-400 transition-colors rounded-lg hover:bg-white/5">
                            {t.home}
                        </Link>
                        <Link to="/fleet" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-electric-400 transition-colors rounded-lg hover:bg-white/5">
                            {t.fleet}
                        </Link>
                        
                        {user ? (
                            <>
                                {user.role === 'Admin' ? (
                                    <Link to="/admin" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-electric-400 transition-colors rounded-lg hover:bg-white/5">
                                        {t.adminDashboard}
                                    </Link>
                                ) : (
                                    <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-electric-400 transition-colors rounded-lg hover:bg-white/5">
                                        {t.myDashboard}
                                    </Link>
                                )}
                                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                                    <span className="text-sm text-white/60">{user.full_name}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={handleLogout}
                                        className="text-white/60 hover:text-electric-400 hover:bg-electric-500/10"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
                                <Button variant="ghost" asChild className="text-white/70 hover:text-electric-400 hover:bg-electric-500/10">
                                    <Link to="/login">{t.login}</Link>
                                </Button>
                                <Button asChild className="bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green">
                                    <Link to="/register">{t.register}</Link>
                                </Button>
                            </div>
                        )}
                        
                        {/* Language Toggle */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={toggleLang}
                            className="ml-2 text-white/60 hover:text-electric-400 hover:bg-white/5"
                        >
                            <Globe className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white/70 hover:text-electric-400"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-2">
                            <Link 
                                to="/" 
                                className="px-4 py-3 text-white/70 hover:text-electric-400 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.home}
                            </Link>
                            <Link 
                                to="/fleet" 
                                className="px-4 py-3 text-white/70 hover:text-electric-400 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.fleet}
                            </Link>
                            
                            {user ? (
                                <>
                                    {user.role === 'Admin' ? (
                                        <Link 
                                            to="/admin" 
                                            className="px-4 py-3 text-white/70 hover:text-electric-400 hover:bg-white/5 rounded-lg transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {t.adminDashboard}
                                        </Link>
                                    ) : (
                                        <Link 
                                            to="/dashboard" 
                                            className="px-4 py-3 text-white/70 hover:text-electric-400 hover:bg-white/5 rounded-lg transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {t.myDashboard}
                                        </Link>
                                    )}
                                    <Button 
                                        variant="ghost" 
                                        onClick={handleLogout} 
                                        className="justify-start text-white/70 hover:text-electric-400 hover:bg-white/5"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        {t.logout}
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 px-4">
                                    <Button variant="ghost" asChild className="justify-start text-white/70">
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>{t.login}</Link>
                                    </Button>
                                    <Button asChild className="bg-electric-500 hover:bg-electric-400 text-white">
                                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>{t.register}</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
