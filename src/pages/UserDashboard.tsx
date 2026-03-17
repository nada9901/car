import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Car, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getMyBookings, getMyPayments } from '@/services/api';
import { format, parseISO, isPast } from 'date-fns';
import { toast } from 'sonner';
import type { Booking, Payment } from '@/types';

// Bilingual translations
const t = {
    myDashboard: 'لوحتي',
    myDashboardEn: 'My Dashboard',
    subtitle: 'إدارة حجوزاتك ومدفوعاتك',
    subtitleEn: 'Manage your bookings and payments',
    myBookings: 'حجوزاتي',
    myBookingsEn: 'My Bookings',
    payments: 'المدفوعات',
    paymentsEn: 'Payments',
    noBookings: 'لا توجد حجوزات بعد',
    noBookingsEn: 'No Bookings Yet',
    noBookingsDesc: 'لم تقم بأي حجوزات بعد. ابدأ بتصفح أسطولنا!',
    noBookingsDescEn: "You haven't made any bookings yet. Start exploring our fleet!",
    browseFleet: 'تصفح الأسطول',
    browseFleetEn: 'Browse Fleet',
    noPayments: 'لا توجد مدفوعات بعد',
    noPaymentsEn: 'No Payments Yet',
    noPaymentsDesc: 'لم تقم بأي مدفوعات بعد.',
    noPaymentsDescEn: "You haven't made any payments yet.",
    startDate: 'تاريخ البدء',
    startDateEn: 'Start Date',
    endDate: 'تاريخ الانتهاء',
    endDateEn: 'End Date',
    duration: 'المدة',
    durationEn: 'Duration',
    days: 'أيام',
    daysEn: 'days',
    totalPrice: 'السعر الإجمالي',
    totalPriceEn: 'Total Price',
    completePayment: 'إكمال الدفع',
    completePaymentEn: 'Complete Payment',
    extendRental: 'تمديد التأجير',
    extendRentalEn: 'Extend Rental',
    paidOn: 'تم الدفع بتاريخ',
    paidOnEn: 'Paid on',
    account: 'الحساب',
    accountEn: 'Account',
    viewReceipt: 'عرض الإيصال',
    viewReceiptEn: 'View Receipt',
    statuses: {
        Confirmed: 'مؤكد',
        Pending: 'معلق',
        Cancelled: 'ملغي',
        Completed: 'مكتمل'
    }
};

export default function UserDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

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
                console.error('Failed to fetch data:', error);
                toast.error('فشل في تحميل بيانات لوحة التحكم');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    function getStatusIcon(status: string) {
        switch (status) {
            case 'Confirmed':
                return <CheckCircle className="h-4 w-4 text-electric-400" />;
            case 'Pending':
                return <Clock className="h-4 w-4 text-yellow-400" />;
            case 'Cancelled':
                return <XCircle className="h-4 w-4 text-red-400" />;
            case 'Completed':
                return <CheckCircle className="h-4 w-4 text-blue-400" />;
            default:
                return <AlertCircle className="h-4 w-4 text-white/40" />;
        }
    }

    function getStatusBadgeClass(status: string) {
        switch (status) {
            case 'Confirmed':
                return 'bg-electric-500/20 text-electric-400 border-electric-500/30';
            case 'Pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'Completed':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default:
                return 'bg-white/10 text-white/50';
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon-300 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-electric-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-carbon-300 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{t.myDashboard}</h1>
                    <p className="text-white/50">{t.subtitle}</p>
                </div>

                <Tabs defaultValue="bookings" className="space-y-6">
                    <TabsList className="bg-carbon-200 border border-white/10">
                        <TabsTrigger value="bookings" className="data-[state=active]:bg-electric-500 data-[state=active]:text-white gap-2">
                            <Car className="h-4 w-4" />
                            {t.myBookings}
                        </TabsTrigger>
                        <TabsTrigger value="payments" className="data-[state=active]:bg-electric-500 data-[state=active]:text-white gap-2">
                            <DollarSign className="h-4 w-4" />
                            {t.payments}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings">
                        {bookings.length === 0 ? (
                            <Card className="glass-card border-0">
                                <CardContent className="py-16 text-center">
                                    <Car className="h-16 w-16 text-white/20 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">{t.noBookings}</h3>
                                    <p className="text-white/50 mb-6">{t.noBookingsDesc}</p>
                                    <Button asChild className="bg-electric-500 hover:bg-electric-400 text-white">
                                        <a href="/fleet">{t.browseFleet}</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {bookings.map((booking) => (
                                    <Card key={booking.id} className="glass-card border-0">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                {/* Car Image */}
                                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-carbon-200">
                                                    <img
                                                        src={booking.image_url || '/placeholder-car.jpg'}
                                                        alt={`${booking.brand} ${booking.model}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Booking Details */}
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {booking.brand} {booking.model}
                                                        </h3>
                                                        <Badge className={getStatusBadgeClass(booking.status)}>
                                                            <span className="flex items-center gap-1">
                                                                {getStatusIcon(booking.status)}
                                                                {t.statuses[booking.status as keyof typeof t.statuses]}
                                                            </span>
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-white/40">{t.startDate}</p>
                                                            <p className="font-medium text-white">
                                                                {format(parseISO(booking.start_date), 'MMM dd, yyyy')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-white/40">{t.endDate}</p>
                                                            <p className="font-medium text-white">
                                                                {format(parseISO(booking.end_date), 'MMM dd, yyyy')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-white/40">{t.duration}</p>
                                                            <p className="font-medium text-white">{booking.total_days} {t.days}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-white/40">{t.totalPrice}</p>
                                                            <p className="font-medium text-electric-400">{booking.total_price.toLocaleString()} ر.س</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2">
                                                    {booking.status === 'Pending' && (
                                                        <Button variant="outline" size="sm" className="border-electric-500/50 text-electric-400 hover:bg-electric-500/10">
                                                            {t.completePayment}
                                                        </Button>
                                                    )}
                                                    {booking.status === 'Confirmed' && !isPast(parseISO(booking.end_date)) && (
                                                        <Button variant="outline" size="sm" className="border-white/20 text-white/70 hover:bg-white/5">
                                                            {t.extendRental}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="payments">
                        {payments.length === 0 ? (
                            <Card className="glass-card border-0">
                                <CardContent className="py-16 text-center">
                                    <DollarSign className="h-16 w-16 text-white/20 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">{t.noPayments}</h3>
                                    <p className="text-white/50">{t.noPaymentsDesc}</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {payments.map((payment) => (
                                    <Card key={payment.id} className="glass-card border-0">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-electric-400">{payment.amount_paid.toLocaleString()} ر.س</h3>
                                                        <Badge className={
                                                            payment.status === 'Verified' 
                                                                ? 'bg-electric-500/20 text-electric-400' 
                                                                : 'bg-yellow-500/20 text-yellow-400'
                                                        }>
                                                            {payment.status === 'Verified' ? 'مؤكد' : 'معلق'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-white/50">
                                                        {payment.brand} {payment.model}
                                                    </p>
                                                    <p className="text-sm text-white/50">
                                                        {t.paidOn} {format(parseISO(payment.payment_date), 'MMM dd, yyyy')}
                                                    </p>
                                                    {payment.bank_account_number && (
                                                        <p className="text-sm text-white/30">
                                                            {t.account}: ****{payment.bank_account_number.slice(-4)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {payment.transaction_receipt_url && (
                                                        <Button variant="link" size="sm" className="h-auto p-0 text-electric-400 hover:text-electric-300">
                                                            {t.viewReceipt}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
