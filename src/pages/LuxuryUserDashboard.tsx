import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMyBookings, getMyPayments } from '@/services/api';
import { format, parseISO, isPast } from 'date-fns';
import { toast } from 'sonner';
import { 
    Car, 
    DollarSign, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle,
    ArrowRight
} from 'lucide-react';
import type { Booking, Payment } from '@/types';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { icon: any; className: string; label: string }> = {
        Confirmed: { 
            icon: CheckCircle, 
            className: 'bg-acid-500/15 text-acid-500 border-acid-500/30',
            label: 'Confirmed'
        },
        Pending: { 
            icon: Clock, 
            className: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
            label: 'Pending'
        },
        Cancelled: { 
            icon: XCircle, 
            className: 'bg-red-500/15 text-red-500 border-red-500/30',
            label: 'Cancelled'
        },
        Completed: { 
            icon: CheckCircle, 
            className: 'bg-electric-500/15 text-electric-500 border-electric-500/30',
            label: 'Completed'
        },
    };

    const config = configs[status] || configs.Pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}

export default function LuxuryUserDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'bookings' | 'payments'>('bookings');

    useEffect(() => {
        async function fetchData() {
            try {
                const [bookingsData, paymentsData] = await Promise.all([
                    getMyBookings(),
                    getMyPayments(),
                ]);
                setBookings(bookingsData);
                setPayments(paymentsData);
            } catch (error) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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
                        Your Account
                    </span>
                    <h1 className="section-title">Dashboard</h1>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                >
                    <div className="bento-tile">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-metallic-500 mb-1">Total Bookings</p>
                                <p className="text-3xl font-bold text-white">{bookings.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-electric-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bento-tile">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-metallic-500 mb-1">Active Rentals</p>
                                <p className="text-3xl font-bold text-white">
                                    {bookings.filter(b => b.status === 'Confirmed' && !isPast(parseISO(b.end_date))).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-acid-500/10 flex items-center justify-center">
                                <Car className="w-6 h-6 text-acid-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bento-tile">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-metallic-500 mb-1">Total Spent</p>
                                <p className="text-3xl font-bold text-white">
                                    ${payments.reduce((sum, p) => sum + parseFloat(p.amount_paid.toString()), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-electric-400" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-obsidian border border-white/5 w-fit">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'bookings'
                                    ? 'bg-electric-500/20 text-electric-400'
                                    : 'text-metallic-500 hover:text-white'
                            }`}
                        >
                            <Car className="w-4 h-4" />
                            My Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'payments'
                                    ? 'bg-electric-500/20 text-electric-400'
                                    : 'text-metallic-500 hover:text-white'
                            }`}
                        >
                            <DollarSign className="w-4 h-4" />
                            Payments
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {activeTab === 'bookings' ? (
                        bookings.length === 0 ? (
                            <motion.div variants={itemVariants} className="bento-tile text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-obsidian flex items-center justify-center">
                                    <Car className="w-8 h-8 text-metallic-600" />
                                </div>
                                <h3 className="text-xl font-display font-semibold text-white mb-2">
                                    No Bookings Yet
                                </h3>
                                <p className="text-metallic-500 mb-6">
                                    Start your luxury journey by exploring our fleet
                                </p>
                                <a href="/fleet" className="btn-neon-outline inline-flex items-center gap-2">
                                    Browse Fleet
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <motion.div key={booking.id} variants={itemVariants}>
                                        <div className="glass-card rounded-2xl p-5">
                                            <div className="flex flex-col md:flex-row md:items-center gap-5">
                                                {/* Car Image */}
                                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={booking.image_url || '/placeholder-car.jpg'}
                                                        alt={`${booking.brand} ${booking.model}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-lg font-display font-semibold text-white">
                                                                {booking.brand} {booking.model}
                                                            </h3>
                                                            <p className="text-sm text-metallic-500">
                                                                {booking.brand} {booking.model}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={booking.status} />
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-metallic-500 mb-1">Pick-up</p>
                                                            <p className="text-white">
                                                                {format(parseISO(booking.start_date), 'MMM dd, yyyy')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-metallic-500 mb-1">Return</p>
                                                            <p className="text-white">
                                                                {format(parseISO(booking.end_date), 'MMM dd, yyyy')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-metallic-500 mb-1">Duration</p>
                                                            <p className="text-white">{booking.total_days} days</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-metallic-500 mb-1">Total</p>
                                                            <p className="text-electric-400 font-semibold">${booking.total_price}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2">
                                                    {booking.status === 'Pending' && (
                                                        <button className="btn-neon-outline text-sm py-2 px-4">
                                                            Complete Payment
                                                        </button>
                                                    )}
                                                    {booking.status === 'Confirmed' && !isPast(parseISO(booking.end_date)) && (
                                                        <button className="btn-neon-outline text-sm py-2 px-4">
                                                            Extend Rental
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    ) : (
                        payments.length === 0 ? (
                            <motion.div variants={itemVariants} className="bento-tile text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-obsidian flex items-center justify-center">
                                    <DollarSign className="w-8 h-8 text-metallic-600" />
                                </div>
                                <h3 className="text-xl font-display font-semibold text-white mb-2">
                                    No Payments Yet
                                </h3>
                                <p className="text-metallic-500">
                                    Your payment history will appear here
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {payments.map((payment) => (
                                    <motion.div key={payment.id} variants={itemVariants}>
                                        <div className="glass-card rounded-2xl p-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center">
                                                        <DollarSign className="w-6 h-6 text-electric-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">
                                                            ${payment.amount_paid}
                                                        </h3>
                                                        <p className="text-sm text-metallic-500">
                                                            {payment.brand} {payment.model}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <StatusBadge status={payment.status} />
                                                    <p className="text-sm text-metallic-500 mt-2">
                                                        {format(parseISO(payment.payment_date), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    )}
                </motion.div>
            </div>
        </div>
    );
}
