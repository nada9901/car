import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BentoStatsGrid from '@/components/luxury/BentoStats';
import { 
    LayoutDashboard, 
    Car, 
    Calendar, 
    DollarSign, 
    Users,
    CheckCircle,
    XCircle,
    Download
} from 'lucide-react';
import { 
    getDashboardStats, 
    getAllBookings, 
    getAllPayments, 
    getAllUsers, 
    updateBookingStatus, 
    verifyPayment 
} from '@/services/api';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import * as Papa from 'papaparse';
import type { DashboardStats, Booking, Payment, User } from '@/types';
import LuxuryCarManagement from '@/components/luxury/LuxuryCarManagement';

// Bookings Management
function BookingsManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            const data = await getAllBookings();
            setBookings(data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStatus(id: number, status: string) {
        try {
            await updateBookingStatus(id, status);
            toast.success('Booking status updated');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update booking');
        }
    }

    function exportToCSV() {
        const csv = Papa.unparse(bookings.map(b => ({
            ID: b.id,
            Customer: b.full_name,
            Email: b.email,
            Car: `${b.brand} ${b.model}`,
            'Start Date': b.start_date,
            'End Date': b.end_date,
            'Total Days': b.total_days,
            'Total Price': b.total_price,
            Status: b.status,
        })));
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.csv';
        a.click();
    }

    function exportToPDF() {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Bookings Report', 20, 20);
        doc.setFontSize(12);
        let y = 40;
        bookings.forEach((b, i) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(`${i + 1}. ${b.full_name} - ${b.brand} ${b.model} - $${b.total_price} - ${b.status}`, 20, y);
            y += 10;
        });
        doc.save('bookings.pdf');
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white">Booking Requests</h2>
                <div className="flex gap-2">
                    <button onClick={exportToCSV} className="btn-neon-outline text-sm py-2 px-4 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        CSV
                    </button>
                    <button onClick={exportToPDF} className="btn-neon-outline text-sm py-2 px-4 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {bookings.map((booking) => (
                    <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-5"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={booking.image_url || '/placeholder-car.jpg'}
                                        alt={`${booking.brand} ${booking.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-display font-semibold text-white">
                                            {booking.brand} {booking.model}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            booking.status === 'Confirmed' ? 'bg-acid-500/15 text-acid-500' :
                                            booking.status === 'Pending' ? 'bg-yellow-500/15 text-yellow-500' :
                                            booking.status === 'Cancelled' ? 'bg-red-500/15 text-red-500' :
                                            'bg-electric-500/15 text-electric-500'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-metallic-500">{booking.full_name} ({booking.email})</p>
                                    <p className="text-sm text-metallic-400 mt-1">
                                        {format(parseISO(booking.start_date), 'MMM dd')} - {format(parseISO(booking.end_date), 'MMM dd')} • {booking.total_days} days • ${booking.total_price}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {booking.status === 'Pending' && (
                                    <>
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                                            className="btn-neon text-sm py-2 px-4 flex items-center gap-1"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}
                                            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Payments Management
function PaymentsManagement() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    async function fetchPayments() {
        try {
            const data = await getAllPayments();
            setPayments(data);
        } catch (error) {
            toast.error('Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(id: number) {
        try {
            await verifyPayment(id);
            toast.success('Payment verified');
            fetchPayments();
        } catch (error) {
            toast.error('Failed to verify payment');
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Payment Verification</h2>
            <div className="space-y-4">
                {payments.map((payment) => (
                    <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-electric-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-white text-lg">${payment.amount_paid}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            payment.status === 'Verified' ? 'bg-acid-500/15 text-acid-500' : 'bg-yellow-500/15 text-yellow-500'
                                        }`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-metallic-500">{payment.full_name} ({payment.email})</p>
                                    <p className="text-sm text-metallic-400">{payment.brand} {payment.model} • {format(parseISO(payment.payment_date), 'MMM dd, yyyy')}</p>
                                </div>
                            </div>
                            <div>
                                {payment.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleVerify(payment.id)}
                                        className="btn-neon text-sm py-2 px-4 flex items-center gap-1"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Verify
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Users Management
function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">User Management</h2>
            <div className="grid gap-4">
                {users.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500/20 to-electric-700/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-electric-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-white">{user.full_name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'Admin' ? 'bg-electric-500/15 text-electric-400' : 'bg-metallic-500/15 text-metallic-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <p className="text-sm text-metallic-500">{user.email}</p>
                                    <p className="text-sm text-metallic-400">Age: {user.age} {user.license_number && `• License: ${user.license_number}`}</p>
                                </div>
                            </div>
                            <p className="text-sm text-metallic-600">
                                Joined {format(parseISO(user.created_at), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Overview Component
function Overview({ stats }: { stats: DashboardStats | null }) {
    if (!stats) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            <BentoStatsGrid stats={stats} />

            {/* Popular Cars */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bento-tile"
            >
                <h3 className="text-xl font-display font-semibold text-white mb-6">Most Requested Vehicles</h3>
                <div className="space-y-4">
                    {stats.popularCars.map((car, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-lg bg-electric-500/10 flex items-center justify-center text-electric-400 font-bold text-sm">
                                    {index + 1}
                                </span>
                                <span className="text-white font-medium">{car.brand} {car.model}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-obsidian rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-electric-500 to-electric-400 rounded-full"
                                        style={{ width: `${Math.min((car.rental_count / 10) * 100, 100)}%` }}
                                    />
                                </div>
                                <span className="text-sm text-metallic-500 w-16 text-right">{car.rental_count} rentals</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

// Main Admin Dashboard
export default function LuxuryAdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const location = useLocation();

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            toast.error('Failed to fetch dashboard stats');
        }
    }

    const currentTab = location.pathname.split('/').pop() || 'overview';

    const navItems = [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/cars', label: 'Fleet', icon: Car },
        { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
        { path: '/admin/payments', label: 'Payments', icon: DollarSign },
        { path: '/admin/users', label: 'Users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-carbon pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <span className="text-electric-400 text-sm font-medium uppercase tracking-widest mb-2 block">
                        Administration
                    </span>
                    <h1 className="section-title">Admin Dashboard</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card rounded-2xl p-4 sticky top-28">
                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const isActive = currentTab === item.path.split('/').pop() || 
                                        (currentTab === 'admin' && item.path === '/admin');
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                                isActive
                                                    ? 'bg-electric-500/20 text-electric-400'
                                                    : 'text-metallic-500 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="lg:col-span-4">
                        <Routes>
                            <Route path="/" element={<Overview stats={stats} />} />
                            <Route path="/cars" element={<LuxuryCarManagement />} />
                            <Route path="/bookings" element={<BookingsManagement />} />
                            <Route path="/payments" element={<PaymentsManagement />} />
                            <Route path="/users" element={<UsersManagement />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}
