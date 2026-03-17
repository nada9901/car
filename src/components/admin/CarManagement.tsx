import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Upload, MapPin } from 'lucide-react';
import { getCars, addCar, updateCar, deleteCar } from '@/services/api';
import { toast } from 'sonner';
import type { Car } from '@/types';

// Bilingual translations
const t = {
    fleetManagement: 'إدارة الأسطول',
    fleetManagementEn: 'Fleet Management',
    addCar: 'إضافة سيارة',
    addCarEn: 'Add Car',
    editCar: 'تعديل سيارة',
    editCarEn: 'Edit Car',
    brand: 'الماركة',
    brandEn: 'Brand',
    model: 'الموديل',
    modelEn: 'Model',
    size: 'الحجم',
    sizeEn: 'Size',
    seats: 'المقاعد',
    seatsEn: 'Seats',
    year: 'السنة',
    yearEn: 'Year',
    engine: 'المحرك',
    engineEn: 'Engine',
    color: 'اللون',
    colorEn: 'Color',
    price: 'السعر اليومي (ر.س)',
    priceEn: 'Daily Price (SAR)',
    status: 'الحالة',
    statusEn: 'Status',
    branch: 'الفرع',
    branchEn: 'Branch',
    image: 'صورة السيارة',
    imageEn: 'Car Image',
    cancel: 'إلغاء',
    cancelEn: 'Cancel',
    save: 'حفظ',
    saveEn: 'Save',
    delete: 'حذف',
    deleteEn: 'Delete',
    available: 'متاح',
    availableEn: 'Available',
    reserved: 'محجوز',
    reservedEn: 'Reserved',
    maintenance: 'صيانة',
    maintenanceEn: 'Maintenance',
    sizes: {
        Small: 'صغير',
        Medium: 'متوسط',
        Large: 'كبير',
        SUV: 'دفع رباعي',
        Luxury: 'فاخر'
    },
    branches: {
        Riyadh: 'الرياض',
        Jeddah: 'جدة',
        Bisha: 'بيشة'
    }
};

const carSizes = ['Small', 'Medium', 'Large', 'SUV', 'Luxury'];
const carStatuses = ['Available', 'Reserved', 'Maintenance'];
const seatOptions = [4, 5, 6, 7, 8];
const branches = ['Riyadh', 'Jeddah', 'Bisha'];

export default function CarManagement() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        size: 'Medium',
        seats: '5',
        engine_power: '',
        color: '',
        manufacturing_year: new Date().getFullYear().toString(),
        daily_price: '',
        status: 'Available',
        branch: 'Riyadh',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchCars();
    }, []);

    async function fetchCars() {
        try {
            const data = await getCars();
            setCars(data);
        } catch (error) {
            toast.error('فشل في تحميل السيارات');
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setFormData({
            brand: '',
            model: '',
            size: 'Medium',
            seats: '5',
            engine_power: '',
            color: '',
            manufacturing_year: new Date().getFullYear().toString(),
            daily_price: '',
            status: 'Available',
            branch: 'Riyadh',
        });
        setImageFile(null);
        setEditingCar(null);
    }

    function handleEdit(car: Car) {
        setEditingCar(car);
        setFormData({
            brand: car.brand,
            model: car.model,
            size: car.size,
            seats: car.seats.toString(),
            engine_power: car.engine_power,
            color: car.color,
            manufacturing_year: car.manufacturing_year.toString(),
            daily_price: car.daily_price.toString(),
            status: car.status,
            branch: car.branch || 'Riyadh',
        });
        setIsDialogOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingCar) {
                await updateCar(editingCar.id, data);
                toast.success('تم تحديث السيارة بنجاح');
            } else {
                await addCar(data);
                toast.success('تم إضافة السيارة بنجاح');
            }
            
            resetForm();
            setIsDialogOpen(false);
            fetchCars();
        } catch (error) {
            toast.error(editingCar ? 'فشل في تحديث السيارة' : 'فشل في إضافة السيارة');
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('هل أنت متأكد من حذف هذه السيارة؟')) return;
        
        try {
            await deleteCar(id);
            toast.success('تم حذف السيارة بنجاح');
            fetchCars();
        } catch (error) {
            toast.error('فشل في حذف السيارة');
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Available':
                return <Badge className="bg-electric-500/20 text-electric-400 border border-electric-500/30">{t.available}</Badge>;
            case 'Reserved':
                return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">{t.reserved}</Badge>;
            case 'Maintenance':
                return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">{t.maintenance}</Badge>;
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="text-white/50 text-center py-12">جاري التحميل...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{t.fleetManagement}</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="bg-electric-500 hover:bg-electric-400 text-white shadow-neon-green">
                            <Plus className="h-4 w-4 mr-2" />
                            {t.addCar}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-carbon-200 border-white/10">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                {editingCar ? t.editCar : t.addCar}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.brand}</Label>
                                    <Input
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="مثال: Toyota"
                                        className="bg-white/5 border-white/10 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.model}</Label>
                                    <Input
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        placeholder="مثال: Camry"
                                        className="bg-white/5 border-white/10 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.size}</Label>
                                    <Select
                                        value={formData.size}
                                        onValueChange={(value) => setFormData({ ...formData, size: value })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-carbon-200 border-white/10">
                                            {carSizes.map((size) => (
                                                <SelectItem key={size} value={size}>{t.sizes[size as keyof typeof t.sizes]}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.seats}</Label>
                                    <Select
                                        value={formData.seats}
                                        onValueChange={(value) => setFormData({ ...formData, seats: value })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-carbon-200 border-white/10">
                                            {seatOptions.map((seats) => (
                                                <SelectItem key={seats} value={seats.toString()}>{seats}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.year}</Label>
                                    <Input
                                        value={formData.manufacturing_year}
                                        onChange={(e) => setFormData({ ...formData, manufacturing_year: e.target.value })}
                                        type="number"
                                        className="bg-white/5 border-white/10 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.engine}</Label>
                                    <Input
                                        value={formData.engine_power}
                                        onChange={(e) => setFormData({ ...formData, engine_power: e.target.value })}
                                        placeholder="مثال: 2.5L 203HP"
                                        className="bg-white/5 border-white/10 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.color}</Label>
                                    <Input
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="مثال: White"
                                        className="bg-white/5 border-white/10 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.price}</Label>
                                    <Input
                                        value={formData.daily_price}
                                        onChange={(e) => setFormData({ ...formData, daily_price: e.target.value })}
                                        type="number"
                                        step="1"
                                        placeholder="مثال: 250"
                                        className="bg-white/5 border-white/10 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.status}</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-carbon-200 border-white/10">
                                            {carStatuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status === 'Available' ? t.available : status === 'Reserved' ? t.reserved : t.maintenance}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/70">{t.branch}</Label>
                                    <Select
                                        value={formData.branch}
                                        onValueChange={(value) => setFormData({ ...formData, branch: value })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-carbon-200 border-white/10">
                                            {branches.map((branch) => (
                                                <SelectItem key={branch} value={branch}>
                                                    {t.branches[branch as keyof typeof t.branches]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/70">{t.image}</Label>
                                <div className="relative">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="car-image"
                                    />
                                    <Label
                                        htmlFor="car-image"
                                        className="flex items-center justify-center gap-2 w-full h-12 px-4 border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-white/70"
                                    >
                                        <Upload className="h-4 w-4" />
                                        <span className="text-sm truncate">
                                            {imageFile ? imageFile.name : (editingCar ? 'تغيير الصورة' : 'رفع صورة')}
                                        </span>
                                    </Label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/20 text-white hover:bg-white/5">
                                    {t.cancel}
                                </Button>
                                <Button type="submit" className="bg-electric-500 hover:bg-electric-400 text-white">
                                    {editingCar ? t.save : t.addCar}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <Card key={car.id} className="glass-card border-0 overflow-hidden group">
                        <div className="aspect-video overflow-hidden bg-carbon-200">
                            <img
                                src={car.image_url || '/placeholder-car.jpg'}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-white">{car.brand} {car.model}</h3>
                                {getStatusBadge(car.status)}
                            </div>
                            <p className="text-sm text-white/50 mb-3">
                                {car.size} • {car.seats} مقاعد • {car.engine_power}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
                                <MapPin className="w-4 h-4" />
                                {t.branches[car.branch as keyof typeof t.branches] || car.branch}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                <span className="text-xl font-bold text-electric-400">
                                    {car.daily_price.toLocaleString()}
                                    <span className="text-sm text-electric-400/60 mr-1">ر.س</span>
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(car)} className="text-white/50 hover:text-electric-400 hover:bg-electric-500/10">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(car.id)} className="text-white/50 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
