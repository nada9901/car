import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Gauge, MapPin } from 'lucide-react';
import type { Car } from '@/types';

interface CarCardProps {
    car: Car;
}

// Bilingual translations
const t = {
    day: 'يوم',
    dayEn: '/day',
    viewDetails: 'التفاصيل',
    viewDetailsEn: 'Details',
    available: 'متاح',
    reserved: 'محجوز',
    maintenance: 'صيانة'
};

export default function CarCard({ car }: CarCardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Available':
                return (
                    <Badge className="bg-electric-500/20 text-electric-400 border border-electric-500/30 px-3 py-1">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-electric-400 rounded-full animate-pulse" />
                            {t.available}
                        </span>
                    </Badge>
                );
            case 'Reserved':
                return (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1">
                        {t.reserved}
                    </Badge>
                );
            case 'Maintenance':
                return (
                    <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1">
                        {t.maintenance}
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <div className="group relative">
            {/* Glow Effect Background */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-500/0 via-electric-500/30 to-electric-500/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            
            {/* Main Card */}
            <div className="relative glass-card-hover rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-carbon-200">
                    <img
                        src={car.image_url || '/placeholder-car.jpg'}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-300 via-transparent to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        {getStatusBadge(car.status)}
                    </div>
                    
                    {/* Branch Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-carbon-300/80 backdrop-blur text-white/80 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {car.branch}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-electric-400 transition-colors">
                                {car.brand} {car.model}
                            </h3>
                            <p className="text-sm text-white/50 mt-1">
                                {car.manufacturing_year} • {car.color}
                            </p>
                        </div>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-electric-400" />
                            <span>{car.seats} مقاعد</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gauge className="w-4 h-4 text-electric-400" />
                            <span>{car.engine_power}</span>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-electric-400">
                                {car.daily_price.toLocaleString()}
                                <span className="text-sm text-electric-400/60 mr-1">ر.س</span>
                            </span>
                            <span className="text-xs text-white/40">/ {t.day}</span>
                        </div>
                        <Button 
                            asChild
                            className="bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green transition-all duration-300"
                        >
                            <Link to={`/car/${car.id}`}>
                                {t.viewDetails}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
