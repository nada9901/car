import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Gauge, Zap, ArrowUpRight } from 'lucide-react';
import type { Car } from '@/types';

interface CarCardProps {
  car: Car;
  index?: number;
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <span className="badge-available">Available</span>;
      case 'Reserved':
        return <span className="badge-reserved">Reserved</span>;
      case 'Maintenance':
        return <span className="badge-maintenance">Maintenance</span>;
      default:
        return <span className="badge-available">{status}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/car/${car.id}`}>
        <div className="car-card h-full">
          {/* Image Container */}
          <div className="car-image-container relative aspect-[16/10] overflow-hidden">
            <motion.img
              src={car.image_url || '/placeholder-car.jpg'}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-700"
              whileHover={{ scale: 1.08 }}
            />
            
            {/* Glow Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-electric-500/0 via-electric-500/0 to-electric-500/0 group-hover:from-electric-500/10 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
              {getStatusBadge(car.status)}
            </div>
            
            {/* Brand Logo Area */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-xs font-display font-semibold tracking-widest text-metallic-400 uppercase">
                {car.brand}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 relative">
            {/* Top Line Accent */}
            <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-electric-500/30 to-transparent" />
            
            {/* Model Name */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-display font-semibold text-white group-hover:text-electric-400 transition-colors duration-300">
                  {car.model}
                </h3>
                <p className="text-sm text-metallic-500 mt-1">{car.size} Class</p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ArrowUpRight className="w-5 h-5 text-electric-400" />
              </motion.div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="flex items-center gap-2 text-metallic-400">
                <Users className="w-4 h-4 text-electric-500/70" />
                <span className="text-sm">{car.seats}</span>
              </div>
              <div className="flex items-center gap-2 text-metallic-400">
                <Gauge className="w-4 h-4 text-electric-500/70" />
                <span className="text-sm text-xs truncate">{car.engine_power}</span>
              </div>
              <div className="flex items-center gap-2 text-metallic-400">
                <Zap className="w-4 h-4 text-electric-500/70" />
                <span className="text-sm">{car.manufacturing_year}</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <span className="text-2xl font-bold text-gradient">${car.daily_price}</span>
                <span className="text-sm text-metallic-600 ml-1">/day</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-neon-outline text-sm py-2 px-4"
              >
                Book Now
              </motion.button>
            </div>
          </div>

          {/* Bottom Glow Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}
