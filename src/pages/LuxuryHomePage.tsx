import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LuxuryHero from '@/components/luxury/LuxuryHero';
import CarCard from '@/components/luxury/CarCard';
import { getCars } from '@/services/api';
import { ArrowRight, Shield, Clock, Zap, Star } from 'lucide-react';
import type { Car } from '@/types';

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, delay }: { 
  icon: any; 
  title: string; 
  description: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bento-tile group"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-500/20 to-electric-700/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-electric-400" />
      </div>
      <h3 className="text-xl font-display font-semibold text-white mb-3">{title}</h3>
      <p className="text-metallic-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function LuxuryHomePage() {
    const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCars() {
            try {
                const cars = await getCars({ availability: 'Available' });
                setFeaturedCars(cars.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch cars:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, []);

    return (
        <div className="bg-carbon">
            {/* Hero Section */}
            <LuxuryHero />

            {/* Featured Fleet Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between mb-12"
                    >
                        <div>
                            <span className="text-electric-400 text-sm font-medium uppercase tracking-widest mb-2 block">
                                Curated Selection
                            </span>
                            <h2 className="section-title">Featured Fleet</h2>
                        </div>
                        <Link to="/fleet" className="mt-4 md:mt-0">
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-2 text-electric-400 font-medium group"
                            >
                                View All Vehicles
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Cars Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="car-card aspect-[4/5] animate-pulse bg-obsidian" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredCars.map((car, index) => (
                                <CarCard key={car.id} car={car} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-500/5 rounded-full blur-[150px]" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <span className="text-electric-400 text-sm font-medium uppercase tracking-widest mb-2 block">
                            Why Choose Us
                        </span>
                        <h2 className="section-title mb-4">The Apex Difference</h2>
                        <p className="text-metallic-500 text-lg">
                            Experience luxury automotive service redefined. Every detail crafted for excellence.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Shield}
                            title="Fully Insured"
                            description="Comprehensive coverage on every vehicle for complete peace of mind."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Clock}
                            title="24/7 Support"
                            description="Round-the-clock concierge service for all your needs."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant Booking"
                            description="Seamless digital experience from selection to pickup."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Star}
                            title="Premium Fleet"
                            description="Curated collection of the world's finest vehicles."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-electric-900/50 via-obsidian to-acid-900/20" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMEQ0RkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

                        {/* Content */}
                        <div className="relative z-10 px-8 md:px-16 py-16 md:py-24 text-center">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                                Ready to <span className="text-gradient-electric">Experience</span> More?
                            </h2>
                            <p className="text-metallic-400 text-lg max-w-2xl mx-auto mb-10">
                                Join thousands of discerning drivers who choose Apex Drive for their luxury mobility needs.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-neon text-lg py-4 px-10"
                                    >
                                        Create Account
                                    </motion.button>
                                </Link>
                                <Link to="/fleet">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-neon-outline text-lg py-4 px-10"
                                    >
                                        Browse Fleet
                                    </motion.button>
                                </Link>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-electric-500/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-acid-500/5 rounded-full blur-[100px]" />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
