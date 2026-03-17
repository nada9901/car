import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Clock, Headphones, MapPin, Star } from 'lucide-react';
import { getCars } from '@/services/api';
import CarCard from '@/components/CarCard';
import type { Car } from '@/types';

// Bilingual translations
const t = {
    hero: {
        title: 'استأجر سيارة أحلامك',
        titleEn: 'Rent Your Dream Car',
        subtitle: 'اكتشف أسطولنا المتميز من المركبات الفاخرة. من السيارات المدمجة إلى SUVs الفاخرة، لدينا الرحلة المثالية لكل رحلة.',
        subtitleEn: 'Discover our premium fleet of vehicles. From compact cars to luxury SUVs, we have the perfect ride for every journey.',
        browseFleet: 'تصفح الأسطول',
        browseFleetEn: 'Browse Fleet',
        getStarted: 'ابدأ الآن',
        getStartedEn: 'Get Started'
    },
    whyChooseUs: {
        title: 'لماذا تختارنا',
        titleEn: 'Why Choose Us',
        subtitle: 'نقدم أفضل تجربة تأجير سيارات مع مركبات فاخرة، أسعار تنافسية، وخدمة عملاء استثنائية.',
        subtitleEn: 'We provide the best car rental experience with premium vehicles, competitive prices, and exceptional customer service.',
        features: [
            {
                icon: Shield,
                title: 'مؤمن بالكامل',
                titleEn: 'Fully Insured',
                desc: 'جميع مركباتنا تأتي مع تغطية تأمينية شاملة لراحة بالك.',
                descEn: 'All our vehicles come with comprehensive insurance coverage for your peace of mind.'
            },
            {
                icon: Clock,
                title: 'دعم 24/7',
                titleEn: '24/7 Support',
                desc: 'فريق دعم العملاء لدينا متاح على مدار الساعة لمساعدتك.',
                descEn: 'Our customer support team is available around the clock to assist you.'
            },
            {
                icon: Headphones,
                title: 'حجز سهل',
                titleEn: 'Easy Booking',
                desc: 'عملية حجز بسيطة وخالية من المتاعب. احجز سيارتك في دقائق.',
                descEn: 'Simple and hassle-free booking process. Reserve your car in minutes.'
            }
        ]
    },
    featuredCars: {
        title: 'السيارات المميزة',
        titleEn: 'Featured Cars',
        subtitle: 'استكشف مركباتنا الأكثر شعبية',
        subtitleEn: 'Explore our most popular vehicles',
        viewAll: 'عرض الكل',
        viewAllEn: 'View All'
    },
    howItWorks: {
        title: 'كيف يعمل',
        titleEn: 'How It Works',
        subtitle: 'تأجير السيارات أسهل من أي وقت مضى. اتبع هذه الخطوات البسيطة للبدء.',
        subtitleEn: 'Renting a car has never been easier. Follow these simple steps to get started.',
        steps: [
            { step: '1', title: 'اختر سيارة', titleEn: 'Choose a Car', desc: 'تصفح أسطولنا واختر مركبتك المثالية', descEn: 'Browse our fleet and select your perfect vehicle' },
            { step: '2', title: 'احجز أونلاين', titleEn: 'Book Online', desc: 'احجز سيارتك مع نظام الحجز السهل', descEn: 'Reserve your car with our easy booking system' },
            { step: '3', title: 'قم بالدفع', titleEn: 'Make Payment', desc: 'دفع آمن عبر التحويل البنكي', descEn: 'Secure payment through bank transfer' },
            { step: '4', title: 'استلم وانطلق', titleEn: 'Pick Up & Go', desc: 'استلم سيارتك وابدأ رحلتك', descEn: 'Collect your car and start your journey' }
        ]
    },
    branches: {
        title: 'فروعنا',
        titleEn: 'Our Branches',
        locations: [
            { city: 'الرياض', cityEn: 'Riyadh', address: 'حي العليا، طريق الملك فهد' },
            { city: 'جدة', cityEn: 'Jeddah', address: 'حي الروضة، شارع فلسطين' },
            { city: 'بيشة', cityEn: 'Bisha', address: 'حي الملك فهد، شارع الستين' }
        ]
    },
    cta: {
        title: 'مستعد للبدء؟',
        titleEn: 'Ready to Get Started?',
        subtitle: 'انضم إلى آلاف العملاء الراضين الذين يثقون بنا لتأجير السيارات. سجل اليوم واحصل على خصومات خاصة على أول تأجير لك.',
        subtitleEn: 'Join thousands of satisfied customers who trust us for their car rental needs. Sign up today and get special discounts on your first rental.',
        button: 'إنشاء حساب',
        buttonEn: 'Create Account'
    }
};

export default function HomePage() {
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
        <div className="min-h-screen bg-carbon-300">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-carbon-300 via-carbon-200 to-carbon-300" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-500/10 via-transparent to-transparent" />
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <Badge className="mb-6 bg-electric-500/20 text-electric-400 border-electric-500/30 px-4 py-1.5">
                            <Star className="w-3 h-3 mr-1 fill-electric-400" />
                            نظام تأجير السيارات الرائد في المملكة
                        </Badge>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            {t.hero.title}
                            <span className="block text-electric-400">{t.hero.titleEn}</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl leading-relaxed">
                            {t.hero.subtitle}
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" asChild className="bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green text-lg px-8">
                                <Link to="/fleet">
                                    {t.hero.browseFleet}
                                    <ArrowRight className="mr-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-lg px-8" asChild>
                                <Link to="/register">{t.hero.getStarted}</Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                            {[
                                { value: '50+', label: 'سيارة', labelEn: 'Cars' },
                                { value: '10K+', label: 'عميل', labelEn: 'Customers' },
                                { value: '3', label: 'فروع', labelEn: 'Branches' }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-3xl font-bold text-electric-400">{stat.value}</div>
                                    <div className="text-sm text-white/50">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-carbon-300 to-transparent" />
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">{t.whyChooseUs.title}</h2>
                        <p className="text-white/50 max-w-2xl mx-auto">{t.whyChooseUs.subtitle}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {t.whyChooseUs.features.map((feature, i) => (
                            <Card key={i} className="glass-card-hover border-0">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-electric-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <feature.icon className="h-8 w-8 text-electric-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-white/50">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-500/5 to-transparent" />
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">{t.featuredCars.title}</h2>
                            <p className="text-white/50">{t.featuredCars.subtitle}</p>
                        </div>
                        <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/5">
                            <Link to="/fleet">{t.featuredCars.viewAll}</Link>
                        </Button>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredCars.map((car) => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">{t.howItWorks.title}</h2>
                        <p className="text-white/50 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {t.howItWorks.steps.map((item, i) => (
                            <div key={i} className="relative text-center group">
                                {/* Connector Line */}
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-white/10">
                                        <div className="absolute inset-0 bg-gradient-to-r from-electric-500/50 to-transparent" />
                                    </div>
                                )}
                                
                                <div className="relative z-10 w-16 h-16 bg-electric-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-neon-green group-hover:scale-110 transition-transform">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-white/50">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Branches Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-500/5 to-transparent" />
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">{t.branches.title}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {t.branches.locations.map((branch, i) => (
                            <Card key={i} className="glass-card-hover border-0">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-electric-500/10 rounded-xl flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-electric-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{branch.city}</h3>
                                        <p className="text-sm text-white/50">{branch.address}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-electric-500/20 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t.cta.title}</h2>
                            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">{t.cta.subtitle}</p>
                            <Button size="lg" asChild className="bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green text-lg px-10 py-6">
                                <Link to="/register">
                                    {t.cta.button}
                                    <ArrowRight className="mr-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
