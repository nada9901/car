import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Car, Eye, EyeOff, Upload } from 'lucide-react';

// Bilingual translations
const t = {
    createAccount: 'إنشاء حساب',
    createAccountEn: 'Create Account',
    subtitle: 'سجل الآن وابدأ في تأجير السيارات الفاخرة',
    subtitleEn: 'Sign up now and start renting luxury cars',
    fullName: 'الاسم الكامل',
    fullNameEn: 'Full Name',
    email: 'البريد الإلكتروني',
    emailEn: 'Email',
    password: 'كلمة المرور',
    passwordEn: 'Password',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmPasswordEn: 'Confirm Password',
    age: 'العمر',
    ageEn: 'Age',
    nationalId: 'رقم الهوية / الإقامة',
    nationalIdEn: 'National ID / Iqama',
    licenseNumber: 'رقم رخصة القيادة',
    licenseNumberEn: 'Driver License Number',
    phone: 'رقم الجوال',
    phoneEn: 'Phone Number',
    city: 'المدينة',
    cityEn: 'City',
    idImage: 'صورة الهوية',
    idImageEn: 'ID Image',
    licenseImage: 'صورة الرخصة',
    licenseImageEn: 'License Image',
    upload: 'رفع',
    uploadEn: 'Upload',
    create: 'إنشاء حساب',
    createEn: 'Create Account',
    haveAccount: 'لديك حساب بالفعل؟',
    haveAccountEn: 'Already have an account?',
    signIn: 'تسجيل الدخول',
    signInEn: 'Sign in',
    cities: {
        Riyadh: 'الرياض',
        Jeddah: 'جدة',
        Bisha: 'بيشة',
        Dammam: 'الدمام',
        Makkah: 'مكة المكرمة',
        Madinah: 'المدينة المنورة'
    }
};

const cities = ['Riyadh', 'Jeddah', 'Bisha', 'Dammam', 'Makkah', 'Madinah'];

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        national_id_number: '',
        license_number: '',
        phone_number: '',
        city: 'Riyadh',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [idImage, setIdImage] = useState<File | null>(null);
    const [licenseImage, setLicenseImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (Object.values(formData).some(v => !v)) {
            toast.error('الرجاء ملء جميع الحقول');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('كلمات المرور غير متطابقة');
            return;
        }

        if (parseInt(formData.age) < 21) {
            toast.error('يجب أن يكون عمرك 21 عاماً على الأقل');
            return;
        }

        if (formData.national_id_number.length !== 10) {
            toast.error('رقم الهوية يجب أن يكون 10 أرقام');
            return;
        }

        if (!idImage || !licenseImage) {
            toast.error('الرجاء رفع صور الهوية والرخصة');
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();
            data.append('full_name', formData.full_name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('age', formData.age);
            data.append('national_id_number', formData.national_id_number);
            data.append('license_number', formData.license_number);
            data.append('phone_number', formData.phone_number);
            data.append('city', formData.city);
            data.append('id_image', idImage);
            data.append('license_image', licenseImage);

            await register(data);
            toast.success('تم إنشاء الحساب بنجاح!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'فشل في إنشاء الحساب');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 bg-carbon-300">
            <Card className="w-full max-w-lg glass-card border-0">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-electric-500/20 rounded-2xl flex items-center justify-center">
                            <Car className="h-7 w-7 text-electric-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-white">{t.createAccount}</CardTitle>
                    <CardDescription className="text-white/50">
                        {t.subtitle}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-white/70">{t.fullName}</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    placeholder="أحمد الغامدي"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/70">{t.email}</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white/70">{t.password}</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-4 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white/70">{t.confirmPassword}</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-white/70">{t.age}</Label>
                                <Input
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="25"
                                    min="21"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="national_id_number" className="text-white/70">{t.nationalId}</Label>
                                <Input
                                    id="national_id_number"
                                    name="national_id_number"
                                    placeholder="1023456789"
                                    maxLength={10}
                                    value={formData.national_id_number}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="license_number" className="text-white/70">{t.licenseNumber}</Label>
                                <Input
                                    id="license_number"
                                    name="license_number"
                                    placeholder="رقم الرخصة"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number" className="text-white/70">{t.phone}</Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    placeholder="+966 50 123 4567"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white/70">{t.city}</Label>
                            <Select
                                value={formData.city}
                                onValueChange={(value) => setFormData({ ...formData, city: value })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-carbon-200 border-white/10">
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {t.cities[city as keyof typeof t.cities]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-white/70">{t.idImage}</Label>
                                <div className="relative">
                                    <Input
                                        id="id_image"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => setIdImage(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="id_image"
                                        className="flex items-center justify-center gap-2 w-full h-12 px-4 border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-white/70"
                                    >
                                        <Upload className="h-4 w-4" />
                                        <span className="text-sm truncate">
                                            {idImage ? idImage.name : t.upload}
                                        </span>
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/70">{t.licenseImage}</Label>
                                <div className="relative">
                                    <Input
                                        id="license_image"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => setLicenseImage(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="license_image"
                                        className="flex items-center justify-center gap-2 w-full h-12 px-4 border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-white/70"
                                    >
                                        <Upload className="h-4 w-4" />
                                        <span className="text-sm truncate">
                                            {licenseImage ? licenseImage.name : t.upload}
                                        </span>
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                t.create
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-white/50">{t.haveAccount} </span>
                        <Link to="/login" className="text-electric-400 hover:text-electric-300 font-medium">
                            {t.signIn}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
