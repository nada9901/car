import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ChevronLeft, Users, Gauge, Palette, CalendarDays, MapPin, Check } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { getCar, createBooking } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { Car } from '@/types';
import { Label } from '@/components/ui/label';

// Bilingual translations
const t = {
    back: 'العودة للأسطول',
    backEn: 'Back to Fleet',
    specifications: 'المواصفات',
    specificationsEn: 'Specifications',
    features: 'المميزات',
    featuresEn: 'Features',
    priceCalculator: 'حاسبة السعر',
    priceCalculatorEn: 'Price Calculator',
    dailyRate: 'السعر اليومي',
    dailyRateEn: 'Daily Rate',
    startDate: 'تاريخ البدء',
    startDateEn: 'Start Date',
    endDate: 'تاريخ الانتهاء',
    endDateEn: 'End Date',
    selectDate: 'اختر التاريخ',
    selectDateEn: 'Select date',
    total: 'المجموع',
    totalEn: 'Total',
    taxesIncluded: 'الضرائب مشمولة',
    taxesIncludedEn: 'Taxes Included',
    bookNow: 'احجز الآن',
    bookNowEn: 'Book Now',
    unavailable: 'هذه السيارة غير متاحة حالياً',
    unavailableEn: 'This vehicle is currently unavailable',
    freeCancellation: 'إلغاء مجاني حتى 24 ساعة قبل الاستلام',
    freeCancellationEn: 'Free cancellation up to 24 hours before pickup',
    loginRequired: 'الرجاء تسجيل الدخول لحجز سيارة',
    loginRequiredEn: 'Please login to book a car',
    selectDates: 'الرجاء اختيار تواريخ البدء والانتهاء',
    selectDatesEn: 'Please select start and end dates',
    bookingSuccess: 'تم إنشاء الحجز بنجاح! يرجى إكمال الدفع.',
    bookingSuccessEn: 'Booking created successfully! Please complete payment.',
    day: 'يوم',
    dayEn: 'day',
    days: 'أيام',
    daysEn: 'days',
    seats: 'مقاعد',
    seatsEn: 'Seats',
    engine: 'المحرك',
    engineEn: 'Engine',
    color: 'اللون',
    colorEn: 'Color',
    year: 'السنة',
    yearEn: 'Year',
    branch: 'الفرع',
    branchEn: 'Branch'
};

const featuresList = [
    'تكييف هوائي',
    'بلوتوث',
    'كاميرا خلفية',
    'مثبت سرعة',
    'نظام ملاحة',
    'منافذ USB',
    'مقعد أطفال متاح',
    'مساعدة على الطريق 24/7'
];

export default function CarDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        async function fetchCar() {
            try {
                if (id) {
                    const data = await getCar(parseInt(id));
                    setCar(data);
                }
            } catch (error) {
                console.error('Failed to fetch car:', error);
                toast.error('فشل في تحميل تفاصيل السيارة');
            } finally {
                setLoading(false);
            }
        }
        fetchCar();
    }, [id]);

    const totalDays = startDate && endDate 
        ? differenceInDays(endDate, startDate) + 1 
        : 0;
    
    const totalPrice = car ? totalDays * car.daily_price : 0;

    async function handleBookNow() {
        if (!user) {
            toast.error(t.loginRequired);
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            toast.error(t.selectDates);
            return;
        }

        try {
            setBookingLoading(true);
            await createBooking({
                car_id: car!.id,
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
            });
            toast.success(t.bookingSuccess);
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'فشل في إنشاء الحجز');
        } finally {
            setBookingLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon-300 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-electric-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-carbon-300 flex flex-col items-center justify-center">
                <p className="text-white/50">السيارة غير موجودة</p>
                <Button onClick={() => navigate('/fleet')} className="mt-4 bg-electric-500 hover:bg-electric-400">
                    {t.back}
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-carbon-300 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Button variant="ghost" onClick={() => navigate('/fleet')} className="mb-6 text-white/70 hover:text-white">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    {t.back}
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Car Image and Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-video rounded-2xl overflow-hidden bg-carbon-200">
                            <img
                                src={car.image_url || '/placeholder-car.jpg'}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">{car.brand} {car.model}</h1>
                                <Badge className={
                                    car.status === 'Available' ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30' :
                                    car.status === 'Reserved' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                }>
                                    {car.status === 'Available' ? 'متاح' : car.status === 'Reserved' ? 'محجوز' : 'صيانة'}
                                </Badge>
                            </div>
                            <p className="text-white/50">{car.size} • {car.manufacturing_year} • {car.color}</p>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Specifications */}
                        <Card className="glass-card border-0">
                            <CardHeader>
                                <CardTitle className="text-white">{t.specifications}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-electric-500/10 rounded-lg flex items-center justify-center">
                                            <Users className="h-5 w-5 text-electric-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/50">{t.seats}</p>
                                            <p className="font-semibold text-white">{car.seats}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-electric-500/10 rounded-lg flex items-center justify-center">
                                            <Gauge className="h-5 w-5 text-electric-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/50">{t.engine}</p>
                                            <p className="font-semibold text-white">{car.engine_power}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-electric-500/10 rounded-lg flex items-center justify-center">
                                            <Palette className="h-5 w-5 text-electric-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/50">{t.color}</p>
                                            <p className="font-semibold text-white">{car.color}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-electric-500/10 rounded-lg flex items-center justify-center">
                                            <CalendarDays className="h-5 w-5 text-electric-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/50">{t.year}</p>
                                            <p className="font-semibold text-white">{car.manufacturing_year}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                                    <div className="w-10 h-10 bg-electric-500/10 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-electric-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/50">{t.branch}</p>
                                        <p className="font-semibold text-white">{car.branch}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card className="glass-card border-0">
                            <CardHeader>
                                <CardTitle className="text-white">{t.features}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {featuresList.map((feature) => (
                                        <div key={feature} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-electric-400" />
                                            <span className="text-sm text-white/70">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Price Calculator & Booking */}
                    <div className="lg:col-span-1">
                        <Card className="glass-card border-0 sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-white">{t.priceCalculator}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Daily Price */}
                                <div className="flex items-center justify-between p-4 bg-electric-500/10 rounded-xl border border-electric-500/20">
                                    <span className="text-white/50">{t.dailyRate}</span>
                                    <span className="text-2xl font-bold text-electric-400">
                                        {car.daily_price.toLocaleString()}
                                        <span className="text-sm text-electric-400/60 mr-1">ر.س</span>
                                    </span>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="mb-2 block text-white/70">{t.startDate}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-electric-400" />
                                                    {startDate ? format(startDate, 'PPP') : t.selectDate}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-carbon-200 border-white/10">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block text-white/70">{t.endDate}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-electric-400" />
                                                    {endDate ? format(endDate, 'PPP') : t.selectDate}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-carbon-200 border-white/10">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    disabled={(date) => {
                                                        if (date < new Date()) return true;
                                                        if (startDate && date < startDate) return true;
                                                        return false;
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                {totalDays > 0 && (
                                    <div className="space-y-2 p-4 bg-electric-500/5 rounded-xl border border-electric-500/10">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/50">
                                                {car.daily_price.toLocaleString()} ر.س × {totalDays} {totalDays === 1 ? t.day : t.days}
                                            </span>
                                            <span className="text-white">{totalPrice.toLocaleString()} ر.س</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/50">{t.taxesIncluded}</span>
                                            <span className="text-electric-400">✓</span>
                                        </div>
                                        <Separator className="bg-white/10" />
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white">{t.total}</span>
                                            <span className="text-2xl font-bold text-electric-400">{totalPrice.toLocaleString()} ر.س</span>
                                        </div>
                                    </div>
                                )}

                                {/* Book Button */}
                                <Button 
                                    className="w-full bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green transition-all duration-300" 
                                    size="lg"
                                    disabled={!startDate || !endDate || car.status !== 'Available' || bookingLoading}
                                    onClick={handleBookNow}
                                >
                                    {bookingLoading ? (
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        t.bookNow
                                    )}
                                </Button>

                                {car.status !== 'Available' && (
                                    <p className="text-sm text-center text-red-400">
                                        {t.unavailable}
                                    </p>
                                )}

                                <p className="text-xs text-center text-white/30">
                                    {t.freeCancellation}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
