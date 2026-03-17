import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Car, Eye, EyeOff } from 'lucide-react';

// Bilingual translations
const t = {
    welcomeBack: 'مرحباً بعودتك',
    welcomeBackEn: 'Welcome Back',
    subtitle: 'سجل دخولك لإدارة حجوزاتك ومدفوعاتك',
    subtitleEn: 'Sign in to manage your bookings and payments',
    email: 'البريد الإلكتروني',
    emailEn: 'Email',
    password: 'كلمة المرور',
    passwordEn: 'Password',
    rememberMe: 'تذكرني',
    rememberMeEn: 'Remember me',
    forgotPassword: 'نسيت كلمة المرور؟',
    forgotPasswordEn: 'Forgot password?',
    signIn: 'تسجيل الدخول',
    signInEn: 'Sign In',
    noAccount: 'ليس لديك حساب؟',
    noAccountEn: "Don't have an account?",
    signUp: 'إنشاء حساب',
    signUpEn: 'Sign up',
    demoCredentials: 'بيانات تجريبية:',
    demoCredentialsEn: 'Demo Credentials:',
    admin: 'مدير: admin@carrental.sa / admin123',
    adminEn: 'Admin: admin@carrental.sa / admin123'
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('الرجاء ملء جميع الحقول');
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            toast.success('تم تسجيل الدخول بنجاح!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'فشل تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 bg-carbon-300">
            <Card className="w-full max-w-md glass-card border-0">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-electric-500/20 rounded-2xl flex items-center justify-center">
                            <Car className="h-7 w-7 text-electric-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-white">{t.welcomeBack}</CardTitle>
                    <CardDescription className="text-white/50">
                        {t.subtitle}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white/70">{t.email}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-electric-500/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white/70">{t.password}</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-4 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-electric-500/50"
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    className="border-white/20 data-[state=checked]:bg-electric-500 data-[state=checked]:border-electric-500"
                                />
                                <Label htmlFor="remember" className="text-sm font-normal text-white/50">
                                    {t.rememberMe}
                                </Label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-electric-400 hover:text-electric-300">
                                {t.forgotPassword}
                            </Link>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                t.signIn
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-white/50">{t.noAccount} </span>
                        <Link to="/register" className="text-electric-400 hover:text-electric-300 font-medium">
                            {t.signUp}
                        </Link>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-electric-500/10 rounded-xl border border-electric-500/20 text-sm">
                        <p className="font-medium text-electric-400 mb-2">{t.demoCredentials}</p>
                        <p className="text-white/50">{t.admin}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
