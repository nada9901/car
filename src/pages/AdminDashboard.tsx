import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    LayoutDashboard, 
    Car, 
    Calendar, 
    DollarSign, 
    Users, 
    TrendingUp,
    Download,
    CheckCircle,
    XCircle,
    Star
} from 'lucide-react';
import { getDashboardStats, getAllBookings, getAllPayments, getAllUsers, updateBookingStatus, verifyPayment } from '@/services/api';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import * as Papa from 'papaparse';
import type { DashboardStats, Booking, Payment, User } from '@/types';
import CarManagement from '@/components/admin/CarManagement';

// Bilingual translations
const t = {
    dashboard: 'لوحة التحكم',
    dashboardEn: 'Dashboard',
    overview: 'نظرة عامة',
    overviewEn: 'Overview',
    fleet: 'إدارة الأسطول',
    fleetEn: 'Fleet Management',
    bookings: 'الحجوزات',
    bookingsEn: 'Bookings',
    payments: 'المدفوعات',
    paymentsEn: 'Payments',
    users: 'المستخدمين',
    usersEn: 'Users',
    stats: {
        revenue: 'إجمالي الإيرادات',
        revenueEn: 'Total Revenue',
        activeRentals: 'التأجيرات النشطة',
        activeRentalsEn: 'Active Rentals',
        totalBookings: 'إجمالي الحجوزات',
        totalBookingsEn: 'Total Bookings',
        occupancyRate: 'معدل الإشغال',
        occupancyRateEn: 'Occupancy Rate'
    },
    popularCars: 'السيارات الأكثر طلباً',
    popularCarsEn: 'Most Popular Cars',
    exportCSV: 'تصدير CSV',
    exportCSVEn: 'Export CSV',
    exportPDF: 'تصدير PDF',
    exportPDFEn: 'Export PDF',
    approve: 'موافقة',
    approveEn: 'Approve',
    reject: 'رفض',
    rejectEn: 'Reject',
    verify: 'تأكيد',
    verifyEn: 'Verify'
};

// Stat Card Component
function StatCard({ title, value, subValue, icon: Icon, trend }: { 
    title: string; 
    value: string | number; 
    subValue?: string;
    icon: any; 
    trend?: string 
}) {
    return (
        <Card className="glass-card-hover border-0">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-white/50 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-white">{value}</p>
                        {subValue && <p className="text-sm text-electric-400 mt-1">{subValue}</p>}
                        {trend && <p className="text-xs text-electric-400 mt-1">{trend}</p>}
                    </div>
                    <div className="w-12 h-12 bg-electric-500/10 rounded-xl flex items-center justify-center">
                        <Icon className="h-6 w-6 text-electric-400" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Overview Component with Bento Grid
function Overview({ stats }: { stats: DashboardStats | null }) {
    if (!stats) return null;

    return (
        <div className="space-y-6">
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title={t.stats.revenue}
                    value={`${stats.totalRevenue.toLocaleString()} ر.س`}
                    icon={DollarSign}
                    trend="+12% من الشهر الماضي"
                />
                <StatCard 
                    title={t.stats.activeRentals}
                    value={stats.activeRentals}
                    icon={Car}
                />
                <StatCard 
                    title={t.stats.totalBookings}
                    value={stats.totalBookings}
                    icon={Calendar}
                />
                <StatCard 
                    title={t.stats.occupancyRate}
                    value={`${stats.occupancyRate}%`}
                    icon={TrendingUp}
                />
            </div>

            {/* Bento Grid - Large Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Popular Cars - Large */}
                <Card className="glass-card border-0 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Star className="h-5 w-5 text-electric-400" />
                            {t.popularCars}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.popularCars.map((car, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 bg-electric-500/20 text-electric-400 rounded-lg flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="text-white font-medium">{car.brand} {car.model}</span>
                                    </div>
                                    <Badge className="bg-electric-500/20 text-electric-400">
                                        {car.rental_count} تأجير
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Revenue Chart Placeholder */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">الإيرادات الشهرية</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.monthlyRevenue.slice(0, 6).map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">
                                        {format(parseISO(item.month), 'MMM yyyy')}
                                    </span>
                                    <span className="text-electric-400 font-medium">
                                        {item.revenue.toLocaleString()} ر.س
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Bookings Management Component
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
            toast.error('فشل في تحميل الحجوزات');
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStatus(id: number, status: string) {
        try {
            await updateBookingStatus(id, status);
            toast.success('تم تحديث حالة الحجز');
            fetchBookings();
        } catch (error) {
            toast.error('فشل في تحديث الحجز');
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
        doc.text('Bookings Report', 20, 20);
        let y = 40;
        bookings.forEach((b, i) => {
            doc.text(`${i + 1}. ${b.full_name} - ${b.brand} ${b.model} - ${b.total_price} ر.س - ${b.status}`, 20, y);
            y += 10;
        });
        doc.save('bookings.pdf');
    }

    if (loading) return <div className="text-white/50 text-center py-12">جاري التحميل...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV} className="border-white/20 text-white hover:bg-white/5">
                    <Download className="h-4 w-4 mr-2" />
                    {t.exportCSV}
                </Button>
                <Button variant="outline" size="sm" onClick={exportToPDF} className="border-white/20 text-white hover:bg-white/5">
                    <Download className="h-4 w-4 mr-2" />
                    {t.exportPDF}
                </Button>
            </div>

            <div className="grid gap-4">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="glass-card border-0">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white">{booking.brand} {booking.model}</h3>
                                        <Badge className={
                                            booking.status === 'Confirmed' ? 'bg-electric-500/20 text-electric-400' :
                                            booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-white/50">
                                        {booking.full_name} ({booking.email})
                                    </p>
                                    <p className="text-sm text-white/50">
                                        {format(parseISO(booking.start_date), 'MMM dd')} - {format(parseISO(booking.end_date), 'MMM dd, yyyy')}
                                        {' • '}
                                        {booking.total_days} أيام
                                        {' • '}
                                        {booking.total_price} ر.س
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {booking.status === 'Pending' && (
                                        <>
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                                                className="bg-electric-500 hover:bg-electric-400"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                {t.approve}
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="destructive"
                                                onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                {t.reject}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Payments Management Component
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
            toast.error('فشل في تحميل المدفوعات');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(id: number) {
        try {
            await verifyPayment(id);
            toast.success('تم تأكيد الدفع');
            fetchPayments();
        } catch (error) {
            toast.error('فشل في تأكيد الدفع');
        }
    }

    if (loading) return <div className="text-white/50 text-center py-12">جاري التحميل...</div>;

    return (
        <div className="grid gap-4">
            {payments.map((payment) => (
                <Card key={payment.id} className="glass-card border-0">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-electric-400">{payment.amount_paid} ر.س</h3>
                                    <Badge className={
                                        payment.status === 'Verified' ? 'bg-electric-500/20 text-electric-400' : 'bg-yellow-500/20 text-yellow-400'
                                    }>
                                        {payment.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-white/50">
                                    {payment.full_name} ({payment.email})
                                </p>
                                <p className="text-sm text-white/50">
                                    {payment.brand} {payment.model}
                                    {' • '}
                                    {format(parseISO(payment.payment_date), 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <div>
                                {payment.status === 'Pending' && (
                                    <Button size="sm" onClick={() => handleVerify(payment.id)} className="bg-electric-500 hover:bg-electric-400">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {t.verify}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Users Management Component
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
            toast.error('فشل في تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="text-white/50 text-center py-12">جاري التحميل...</div>;

    return (
        <div className="grid gap-4">
            {users.map((user) => (
                <Card key={user.id} className="glass-card border-0">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">{user.full_name}</h3>
                                    <Badge className={
                                        user.role === 'Admin' ? 'bg-electric-500/20 text-electric-400' : 'bg-white/10 text-white/70'
                                    }>
                                        {user.role}
                                    </Badge>
                                </div>
                                <p className="text-sm text-white/50">{user.email}</p>
                                <p className="text-sm text-white/50">
                                    العمر: {user.age}
                                    {user.license_number && ` • رخصة: ${user.license_number}`}
                                </p>
                            </div>
                            <p className="text-sm text-white/30">
                                {format(parseISO(user.created_at), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Main Admin Dashboard
export default function AdminDashboard() {
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
            toast.error('فشل في تحميل إحصائيات لوحة التحكم');
        }
    }

    const currentTab = location.pathname.split('/').pop() || 'overview';

    const navItems = [
        { path: '/admin', id: 'admin', label: t.overview, labelEn: t.overviewEn, icon: LayoutDashboard },
        { path: '/admin/cars', id: 'cars', label: t.fleet, labelEn: t.fleetEn, icon: Car },
        { path: '/admin/bookings', id: 'bookings', label: t.bookings, labelEn: t.bookingsEn, icon: Calendar },
        { path: '/admin/payments', id: 'payments', label: t.payments, labelEn: t.paymentsEn, icon: DollarSign },
        { path: '/admin/users', id: 'users', label: t.users, labelEn: t.usersEn, icon: Users },
    ];

    return (
        <div className="min-h-screen bg-carbon-300 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{t.dashboard}</h1>
                    <p className="text-white/50">
                        إدارة أسطولك، حجوزاتك، ومدفوعاتك
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glass-card border-0 sticky top-24">
                            <CardContent className="p-4">
                                <nav className="space-y-1">
                                    {navItems.map((item) => (
                                        <Link key={item.path} to={item.path}>
                                            <Button 
                                                variant={currentTab === item.id || (currentTab === 'admin' && item.id === 'admin') ? 'default' : 'ghost'} 
                                                className={`w-full justify-start gap-3 ${
                                                    currentTab === item.id || (currentTab === 'admin' && item.id === 'admin')
                                                        ? 'bg-electric-500/20 text-electric-400 hover:bg-electric-500/30'
                                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-4">
                        <Routes>
                            <Route path="/" element={<Overview stats={stats} />} />
                            <Route path="/cars" element={<CarManagement />} />
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
