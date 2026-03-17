import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays } from 'date-fns';
import { getCar, createBooking } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
    ChevronLeft, 
    CalendarIcon, 
    Users, 
    Gauge, 
    Palette, 
    CalendarDays,
    Check,
    ArrowRight,
    Shield,
    Clock,
    Zap
} from 'lucide-react';
import type { Car } from '@/types';

export default function LuxuryCarDetailsPage() {
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
                toast.error('Failed to load vehicle details');
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
            toast.error('Please sign in to book a vehicle');
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            toast.error('Please select your rental dates');
            return;
        }

        try {
            setBookingLoading(true);
            await createBooking({
                car_id: car!.id,
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
            });
            toast.success('Booking created successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <div className="text-center">
                    <p className="text-metallic-500 mb-4">Vehicle not found</p>
                    <Link to="/fleet" className="btn-neon-outline">
                        Back to Fleet
                    </Link>
                </div>
            </div>
        );
    }

    const features = [
        'Premium leather interior',
        'Advanced navigation system',
        'Bluetooth connectivity',
        'Backup camera & sensors',
        'Climate control',
        'Cruise control',
        'USB charging ports',
        '24/7 roadside assistance',
    ];

    return (
        <div className="min-h-screen bg-carbon pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link 
                        to="/fleet" 
                        className="inline-flex items-center gap-2 text-metallic-500 hover:text-electric-400 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Fleet
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Image & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative rounded-3xl overflow-hidden aspect-video"
                        >
                            <img
                                src={car.image_url || '/placeholder-car.jpg'}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
                            
                            {/* Brand Badge */}
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 rounded-full bg-carbon/80 backdrop-blur text-sm font-medium text-white border border-white/10">
                                    {car.brand}
                                </span>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-6 right-6">
                                {car.status === 'Available' ? (
                                    <span className="badge-available">Available</span>
                                ) : car.status === 'Reserved' ? (
                                    <span className="badge-reserved">Reserved</span>
                                ) : (
                                    <span className="badge-maintenance">Maintenance</span>
                                )}
                            </div>

                            {/* Title Overlay */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                                    {car.model}
                                </h1>
                                <p className="text-metallic-400 text-lg">
                                    {car.size} Class • {car.manufacturing_year}
                                </p>
                            </div>
                        </motion.div>

                        {/* Specs Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {[
                                { icon: Users, label: 'Seats', value: car.seats },
                                { icon: Gauge, label: 'Engine', value: car.engine_power },
                                { icon: Palette, label: 'Color', value: car.color },
                                { icon: CalendarDays, label: 'Year', value: car.manufacturing_year },
                            ].map((spec, index) => (
                                <div key={index} className="bento-tile text-center">
                                    <spec.icon className="w-6 h-6 text-electric-400 mx-auto mb-3" />
                                    <p className="text-sm text-metallic-500 mb-1">{spec.label}</p>
                                    <p className="text-lg font-semibold text-white">{spec.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bento-tile"
                        >
                            <h3 className="text-xl font-display font-semibold text-white mb-6">
                                Features & Amenities
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-acid-500/20 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-acid-500" />
                                        </div>
                                        <span className="text-metallic-400">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Insurance Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bento-tile border-acid-500/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-acid-500/10 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-acid-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-semibold text-white mb-2">
                                        Fully Insured
                                    </h3>
                                    <p className="text-metallic-500">
                                        Every rental includes comprehensive insurance coverage. 
                                        Drive with complete peace of mind knowing you're protected.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Booking */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-28">
                            <div className="glass-card rounded-3xl p-6">
                                {/* Price Header */}
                                <div className="text-center pb-6 border-b border-white/5">
                                    <p className="text-metallic-500 text-sm mb-1">Daily Rate</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold text-gradient">${car.daily_price}</span>
                                        <span className="text-metallic-500">/day</span>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="py-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Pick-up Date
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="input-luxury w-full flex items-center gap-3 text-left">
                                                    <CalendarIcon className="w-5 h-5 text-electric-400" />
                                                    {startDate ? format(startDate, 'MMM dd, yyyy') : 'Select date'}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-obsidian border-white/10" align="start">
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
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Return Date
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="input-luxury w-full flex items-center gap-3 text-left">
                                                    <CalendarIcon className="w-5 h-5 text-electric-400" />
                                                    {endDate ? format(endDate, 'MMM dd, yyyy') : 'Select date'}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-obsidian border-white/10" align="start">
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
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="py-6 border-t border-white/5"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-metallic-500">
                                                    ${car.daily_price} × {totalDays} days
                                                </span>
                                                <span className="text-white">${totalPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-metallic-500">Insurance & Fees</span>
                                                <span className="text-acid-500">Included</span>
                                            </div>
                                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-white font-medium">Total</span>
                                                <span className="text-2xl font-bold text-gradient">${totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* CTA */}
                                <div className="pt-6 border-t border-white/5">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBookNow}
                                        disabled={!startDate || !endDate || car.status !== 'Available' || bookingLoading}
                                        className={`w-full btn-neon flex items-center justify-center gap-2 py-4 ${
                                            (!startDate || !endDate || car.status !== 'Available') 
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : ''
                                        }`}
                                    >
                                        {bookingLoading ? (
                                            <div className="w-5 h-5 border-2 border-carbon border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {car.status === 'Available' ? 'Book Now' : car.status}
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>

                                    {car.status !== 'Available' && (
                                        <p className="text-center text-sm text-metallic-500 mt-3">
                                            This vehicle is currently unavailable
                                        </p>
                                    )}

                                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-metallic-600">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Free cancellation
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            Instant confirmation
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
