import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, Car as CarIcon } from 'lucide-react';
import { getCars } from '@/services/api';
import CarCard from '@/components/CarCard';
import type { Car as CarType, CarFilters } from '@/types';

// Bilingual translations
const t = {
    title: 'أسطولنا',
    titleEn: 'Our Fleet',
    subtitle: 'تصفح مجموعتنا الواسعة من المركبات الفاخرة',
    subtitleEn: 'Browse our extensive collection of premium vehicles',
    search: 'البحث بالماركة...',
    searchEn: 'Search by brand...',
    filters: 'التصفية',
    filtersEn: 'Filters',
    clear: 'مسح',
    clearEn: 'Clear',
    size: 'الحجم',
    sizeEn: 'Size',
    allSizes: 'جميع الأحجام',
    seats: 'المقاعد',
    seatsEn: 'Seats',
    anySeats: 'أي عدد',
    availability: 'التوفر',
    availabilityEn: 'Availability',
    all: 'الكل',
    available: 'متاح',
    reserved: 'محجوز',
    maintenance: 'صيانة',
    priceRange: 'نطاق السعر',
    priceRangeEn: 'Price Range',
    showing: 'عرض',
    showingEn: 'Showing',
    vehicle: 'سيارة',
    vehicleEn: 'vehicle',
    vehicles: 'سيارات',
    vehiclesEn: 'vehicles',
    noResults: 'لا توجد مركبات مطابقة لمعايير البحث',
    noResultsEn: 'No vehicles found matching your criteria',
    sizes: {
        Small: 'صغير',
        Medium: 'متوسط',
        Large: 'كبير',
        SUV: 'دفع رباعي',
        Luxury: 'فاخر'
    }
};

export default function FleetBrowser() {
    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<CarFilters>({});
    const [priceRange, setPriceRange] = useState([0, 2000]);

    useEffect(() => {
        fetchCars();
    }, [filters]);

    async function fetchCars() {
        try {
            setLoading(true);
            const data = await getCars({
                ...filters,
                min_price: priceRange[0].toString(),
                max_price: priceRange[1].toString(),
            });
            setCars(data);
        } catch (error) {
            console.error('Failed to fetch cars:', error);
        } finally {
            setLoading(false);
        }
    }

    function clearFilters() {
        setFilters({});
        setPriceRange([0, 2000]);
    }

    const hasActiveFilters = Object.keys(filters).length > 0 || priceRange[0] > 0 || priceRange[1] < 2000;

    return (
        <div className="min-h-screen bg-carbon-300 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">{t.title}</h1>
                    <p className="text-white/50">{t.subtitle}</p>
                </div>

                {/* Filters and Search */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input
                                placeholder={t.search}
                                className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-electric-500/50"
                                value={filters.brand || ''}
                                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`gap-2 border-white/20 text-white hover:bg-white/5 ${showFilters ? 'bg-electric-500/20 border-electric-500/50' : ''}`}
                        >
                            <Filter className="h-4 w-4" />
                            {t.filters}
                            {hasActiveFilters && (
                                <span className="ml-1 w-5 h-5 bg-electric-500 text-white rounded-full text-xs flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </Button>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={clearFilters} className="gap-2 text-white/60 hover:text-white">
                                <X className="h-4 w-4" />
                                {t.clear}
                            </Button>
                        )}
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="glass-card rounded-xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <Label className="mb-2 block text-white/70">{t.size}</Label>
                                    <Select
                                        value={filters.size || ''}
                                        onValueChange={(value) => setFilters({ ...filters, size: value || undefined })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder={t.allSizes} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-carbon-200 border-white/10">
                                            <SelectItem value="">{t.allSizes}</SelectItem>
                                            <SelectItem value="Small">{t.sizes.Small}</SelectItem>
                                            <SelectItem value="Medium">{t.sizes.Medium}</SelectItem>
                                            <SelectItem value="Large">{t.sizes.Large}</SelectItem>
                                            <SelectItem value="SUV">{t.sizes.SUV}</SelectItem>
                                            <SelectItem value="Luxury">{t.sizes.Luxury}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="mb-2 block text-white/70">{t.seats}</Label>
                                    <Select
                                        value={filters.seats || ''}
                                        onValueChange={(value) => setFilters({ ...filters, seats: value || undefined })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder={t.anySeats} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-carbon-200 border-white/10">
                                            <SelectItem value="">{t.anySeats}</SelectItem>
                                            <SelectItem value="4">4</SelectItem>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="7">7</SelectItem>
                                            <SelectItem value="8">8</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="mb-2 block text-white/70">{t.availability}</Label>
                                    <Select
                                        value={filters.availability || ''}
                                        onValueChange={(value) => setFilters({ ...filters, availability: value || undefined })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder={t.all} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-carbon-200 border-white/10">
                                            <SelectItem value="">{t.all}</SelectItem>
                                            <SelectItem value="Available">{t.available}</SelectItem>
                                            <SelectItem value="Reserved">{t.reserved}</SelectItem>
                                            <SelectItem value="Maintenance">{t.maintenance}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="mb-2 block text-white/70">
                                        {t.priceRange}: {priceRange[0]} - {priceRange[1]} ر.س
                                    </Label>
                                    <Slider
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        max={2000}
                                        step={50}
                                        className="mt-3"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-white/50">
                        {t.showing} <span className="text-electric-400 font-bold">{cars.length}</span> {cars.length === 1 ? t.vehicle : t.vehicles}
                    </p>
                </div>

                {/* Car Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="glass-card rounded-2xl h-96 animate-pulse" />
                        ))}
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center py-20">
                        <CarIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50 mb-4">{t.noResults}</p>
                        <Button onClick={clearFilters} className="bg-electric-500 hover:bg-electric-400">
                            {t.clear}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cars.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
