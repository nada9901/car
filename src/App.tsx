import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Luxury Components
import LuxuryNavbar from '@/components/luxury/LuxuryNavbar';
import LuxuryFooter from '@/components/luxury/LuxuryFooter';

// Pages
import LuxuryHomePage from '@/pages/LuxuryHomePage';
import LuxuryFleetBrowser from '@/pages/LuxuryFleetBrowser';
import LuxuryCarDetailsPage from '@/pages/LuxuryCarDetailsPage';
import LuxuryUserDashboard from '@/pages/LuxuryUserDashboard';
import LuxuryAdminDashboard from '@/pages/LuxuryAdminDashboard';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (requireAdmin && user.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-carbon flex flex-col">
                    <LuxuryNavbar />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<LuxuryHomePage />} />
                            <Route path="/fleet" element={<LuxuryFleetBrowser />} />
                            <Route path="/car/:id" element={<LuxuryCarDetailsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <LuxuryUserDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/admin/*" 
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <LuxuryAdminDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </main>
                    <LuxuryFooter />
                    <Toaster 
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: 'rgba(28, 28, 30, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                color: '#fff',
                            },
                        }}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
