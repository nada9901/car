import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCars, addCar, updateCar, deleteCar } from '@/services/api';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import type { Car } from '@/types';

const carSizes = ['Small', 'Medium', 'Large'];
const carStatuses = ['Available', 'Reserved', 'Maintenance'];
const seatOptions = [4, 6, 7, 8];

export default function LuxuryCarManagement() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        size: 'Medium',
        seats: '4',
        engine_power: '',
        color: '',
        manufacturing_year: new Date().getFullYear().toString(),
        daily_price: '',
        status: 'Available',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchCars();
    }, []);

    async function fetchCars() {
        try {
            const data = await getCars();
            setCars(data);
        } catch (error) {
            toast.error('Failed to fetch fleet');
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setFormData({
            brand: '',
            model: '',
            size: 'Medium',
            seats: '4',
            engine_power: '',
            color: '',
            manufacturing_year: new Date().getFullYear().toString(),
            daily_price: '',
            status: 'Available',
        });
        setImageFile(null);
        setImagePreview(null);
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
        });
        setImagePreview(car.image_url);
        setIsModalOpen(true);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
                toast.success('Vehicle updated successfully');
            } else {
                await addCar(data);
                toast.success('Vehicle added to fleet');
            }
            
            resetForm();
            setIsModalOpen(false);
            fetchCars();
        } catch (error) {
            toast.error(editingCar ? 'Failed to update vehicle' : 'Failed to add vehicle');
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to remove this vehicle?')) return;
        
        try {
            await deleteCar(id);
            toast.success('Vehicle removed from fleet');
            fetchCars();
        } catch (error) {
            toast.error('Failed to remove vehicle');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white">Fleet Management</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="btn-neon flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Vehicle
                </button>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car, index) => (
                    <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card rounded-2xl overflow-hidden group"
                    >
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={car.image_url || '/placeholder-car.jpg'}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
                            
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                {car.status === 'Available' ? (
                                    <span className="badge-available text-xs">Available</span>
                                ) : car.status === 'Reserved' ? (
                                    <span className="badge-reserved text-xs">Reserved</span>
                                ) : (
                                    <span className="badge-maintenance text-xs">Maintenance</span>
                                )}
                            </div>

                            {/* Brand */}
                            <div className="absolute top-3 left-3">
                                <span className="text-xs font-display font-semibold text-metallic-400 uppercase tracking-wider">
                                    {car.brand}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-lg font-display font-semibold text-white mb-1">
                                {car.model}
                            </h3>
                            <p className="text-sm text-metallic-500 mb-4">
                                {car.size} • {car.seats} Seats • {car.color}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div>
                                    <span className="text-2xl font-bold text-gradient">${car.daily_price}</span>
                                    <span className="text-sm text-metallic-600">/day</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(car)}
                                        className="w-10 h-10 rounded-xl bg-electric-500/10 flex items-center justify-center text-electric-400 hover:bg-electric-500/20 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(car.id)}
                                        className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-carbon/90 backdrop-blur-xl"
                            onClick={() => setIsModalOpen(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h3 className="text-xl font-display font-semibold text-white">
                                    {editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-metallic-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="text-sm font-medium text-metallic-400 mb-3 block">
                                        Vehicle Image
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="car-image"
                                        />
                                        <label
                                            htmlFor="car-image"
                                            className="flex flex-col items-center justify-center gap-3 w-full h-48 rounded-2xl border-2 border-dashed border-white/10 hover:border-electric-500/30 transition-colors cursor-pointer bg-obsidian overflow-hidden"
                                        >
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center">
                                                        <Upload className="w-6 h-6 text-electric-400" />
                                                    </div>
                                                    <span className="text-sm text-metallic-500">
                                                        Click to upload image
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Brand & Model */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Brand
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            placeholder="e.g., Tesla"
                                            className="input-luxury"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Model
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.model}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            placeholder="e.g., Model S"
                                            className="input-luxury"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Size, Seats, Year */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Size
                                        </label>
                                        <select
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                            className="input-luxury"
                                        >
                                            {carSizes.map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Seats
                                        </label>
                                        <select
                                            value={formData.seats}
                                            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                                            className="input-luxury"
                                        >
                                            {seatOptions.map((seats) => (
                                                <option key={seats} value={seats}>{seats}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Year
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.manufacturing_year}
                                            onChange={(e) => setFormData({ ...formData, manufacturing_year: e.target.value })}
                                            className="input-luxury"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Engine & Color */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Engine
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.engine_power}
                                            onChange={(e) => setFormData({ ...formData, engine_power: e.target.value })}
                                            placeholder="e.g., Electric 670HP"
                                            className="input-luxury"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Color
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            placeholder="e.g., Pearl White"
                                            className="input-luxury"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Price & Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Daily Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.daily_price}
                                            onChange={(e) => setFormData({ ...formData, daily_price: e.target.value })}
                                            placeholder="e.g., 150.00"
                                            className="input-luxury"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-metallic-400 mb-2 block">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="input-luxury"
                                        >
                                            {carStatuses.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 btn-neon-outline py-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-neon py-3"
                                    >
                                        {editingCar ? 'Update Vehicle' : 'Add to Fleet'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
