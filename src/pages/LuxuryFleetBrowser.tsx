import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CarCard from '@/components/luxury/CarCard';
import { getCars } from '@/services/api';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Car } from '@/types';

const sizes = ['All', 'Small', 'Medium', 'Large'];
const seatOptions = ['All', '4', '6', '7', '8'];
const priceRanges = [
    { label: 'All Prices', min: 0, max: 1000 },
    { label: 'Under $75', min: 0, max: 75 },
    { label: '$75 - $100', min: 75, max: 100 },
    { label: '$100 - $150', min: 100, max: 150 },
    { label: '$150+', min: 150, max: 1000 },
];

export default function LuxuryFleetBrowser() {
    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filter states
    const [selectedSize, setSelectedSize] = useState('All');
    const [selectedSeats, setSelectedSeats] = useState('All');
    const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);

    useEffect(() => {
        fetchCars();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [cars, searchQuery, selectedSize, selectedSeats, selectedPriceRange]);

    async function fetchCars() {
        try {
            setLoading(true);
            const data = await getCars();
            setCars(data);
            setFilteredCars(data);
        } catch (error) {
            console.error('Failed to fetch cars:', error);
        } finally {
            setLoading(false);
        }
    }

    function applyFilters() {
        let result = [...cars];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(car => 
                car.brand.toLowerCase().includes(query) ||
                car.model.toLowerCase().includes(query)
            );
        }

        // Size filter
        if (selectedSize !== 'All') {
            result = result.filter(car => car.size === selectedSize);
        }

        // Seats filter
        if (selectedSeats !== 'All') {
            result = result.filter(car => car.seats === parseInt(selectedSeats));
        }

        // Price filter
        result = result.filter(car => 
            car.daily_price >= selectedPriceRange.min && 
            car.daily_price <= selectedPriceRange.max
        );

        setFilteredCars(result);
    }

    function clearFilters() {
        setSearchQuery('');
        setSelectedSize('All');
        setSelectedSeats('All');
        setSelectedPriceRange(priceRanges[0]);
    }

    const hasActiveFilters = searchQuery || selectedSize !== 'All' || selectedSeats !== 'All' || selectedPriceRange !== priceRanges[0];

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
                        Our Collection
                    </span>
                    <h1 className="section-title">The Fleet</h1>
                    <p className="text-metallic-500 mt-3 max-w-xl">
                        Discover our curated selection of premium vehicles. From electric supercars to executive sedans.
                    </p>
                </motion.div>

                {/* Search & Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-metallic-600" />
                            <input
                                type="text"
                                placeholder="Search by brand or model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-luxury pl-12 pr-4"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                                showFilters 
                                    ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30' 
                                    : 'bg-obsidian text-metallic-400 border border-white/5 hover:border-white/10'
                            }`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            Filters
                            {hasActiveFilters && (
                                <span className="w-5 h-5 rounded-full bg-acid-500 text-carbon text-xs flex items-center justify-center font-bold">
                                    !
                                </span>
                            )}
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-metallic-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Expanded Filters */}
                    <motion.div
                        initial={false}
                        animate={{ 
                            height: showFilters ? 'auto' : 0,
                            opacity: showFilters ? 1 : 0
                        }}
                        className="overflow-hidden"
                    >
                        <div className="glass-card mt-4 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Size Filter */}
                                <div>
                                    <label className="text-sm font-medium text-metallic-400 mb-3 block">
                                        Vehicle Size
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedSize === size
                                                        ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30'
                                                        : 'bg-obsidian text-metallic-500 border border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Seats Filter */}
                                <div>
                                    <label className="text-sm font-medium text-metallic-400 mb-3 block">
                                        Seats
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {seatOptions.map((seats) => (
                                            <button
                                                key={seats}
                                                onClick={() => setSelectedSeats(seats)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedSeats === seats
                                                        ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30'
                                                        : 'bg-obsidian text-metallic-500 border border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                {seats === 'All' ? 'All' : `${seats} Seats`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div>
                                    <label className="text-sm font-medium text-metallic-400 mb-3 block">
                                        Price Range
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {priceRanges.map((range) => (
                                            <button
                                                key={range.label}
                                                onClick={() => setSelectedPriceRange(range)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedPriceRange === range
                                                        ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30'
                                                        : 'bg-obsidian text-metallic-500 border border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <p className="text-metallic-500">
                        Showing <span className="text-white font-medium">{filteredCars.length}</span> vehicles
                    </p>
                </motion.div>

                {/* Cars Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="car-card aspect-[4/5] animate-pulse bg-obsidian" />
                        ))}
                    </div>
                ) : filteredCars.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-obsidian flex items-center justify-center">
                            <Search className="w-8 h-8 text-metallic-600" />
                        </div>
                        <h3 className="text-xl font-display font-semibold text-white mb-2">
                            No vehicles found
                        </h3>
                        <p className="text-metallic-500 mb-6">
                            Try adjusting your filters to see more results
                        </p>
                        <button onClick={clearFilters} className="btn-neon-outline">
                            Clear All Filters
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCars.map((car, index) => (
                            <CarCard key={car.id} car={car} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
