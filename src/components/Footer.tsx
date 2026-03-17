import { Car, Mail, Phone, MapPin, Instagram, Twitter } from 'lucide-react';

// Bilingual translations
const t = {
    brand: 'برو لتأجير السيارات',
    brandEn: 'CarRental Pro',
    description: 'نظام إدارة تأجير السيارات الاحترافي. استأجر سيارة أحلامك بسهولة وراحة.',
    descriptionEn: 'Professional car rental management system. Rent your dream car with ease and convenience.',
    quickLinks: 'روابط سريعة',
    quickLinksEn: 'Quick Links',
    services: 'خدماتنا',
    servicesEn: 'Services',
    contact: 'تواصل معنا',
    contactEn: 'Contact Us',
    links: {
        home: 'الرئيسية',
        fleet: 'الأسطول',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب'
    },
    serviceItems: [
        'تأجير قصير المدى',
        'تأجير طويل المدى',
        'أسطول الشركات',
        'الاستقبال من المطار'
    ],
    contactInfo: {
        email: 'support@carrental.sa',
        phone: '+966 50 123 4567',
        address: 'الرياض، المملكة العربية السعودية'
    },
    copyright: 'جميع الحقوق محفوظة'
};

export default function Footer() {
    return (
        <footer className="bg-carbon-200 border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-electric-500/20 rounded-xl flex items-center justify-center">
                                <Car className="h-5 w-5 text-electric-400" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">{t.brand}</span>
                                <span className="block text-xs text-electric-400/70">{t.brandEn}</span>
                            </div>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed">
                            {t.description}
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-white/50 hover:text-electric-400 hover:bg-electric-500/10 transition-colors">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-white/50 hover:text-electric-400 hover:bg-electric-500/10 transition-colors">
                                <Twitter className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white mb-6">{t.quickLinks}</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="/" className="text-white/50 hover:text-electric-400 transition-colors">{t.links.home}</a>
                            </li>
                            <li>
                                <a href="/fleet" className="text-white/50 hover:text-electric-400 transition-colors">{t.links.fleet}</a>
                            </li>
                            <li>
                                <a href="/login" className="text-white/50 hover:text-electric-400 transition-colors">{t.links.login}</a>
                            </li>
                            <li>
                                <a href="/register" className="text-white/50 hover:text-electric-400 transition-colors">{t.links.register}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-bold text-white mb-6">{t.services}</h3>
                        <ul className="space-y-3 text-sm text-white/50">
                            {t.serviceItems.map((service, i) => (
                                <li key={i}>{service}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-white mb-6">{t.contact}</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center gap-3 text-white/50">
                                <Mail className="h-4 w-4 text-electric-400" />
                                <span>{t.contactInfo.email}</span>
                            </li>
                            <li className="flex items-center gap-3 text-white/50">
                                <Phone className="h-4 w-4 text-electric-400" />
                                <span>{t.contactInfo.phone}</span>
                            </li>
                            <li className="flex items-start gap-3 text-white/50">
                                <MapPin className="h-4 w-4 text-electric-400 mt-0.5" />
                                <span>{t.contactInfo.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-12 pt-8 text-center">
                    <p className="text-sm text-white/30">
                        &copy; {new Date().getFullYear()} {t.brand}. {t.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
