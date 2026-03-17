import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatTileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ElementType;
  size?: 'small' | 'medium' | 'large';
  gradient?: boolean;
  delay?: number;
}

function StatTile({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  size = 'small',
  gradient = false,
  delay = 0 
}: StatTileProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-acid-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-metallic-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-acid-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-metallic-500';
    }
  };

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 row-span-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={sizeClasses[size]}
    >
      <div className={`bento-tile h-full ${gradient ? 'relative overflow-hidden' : ''}`}>
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-electric-500/10 via-transparent to-acid-500/5 pointer-events-none" />
        )}
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-metallic-500 uppercase tracking-wider">
              {title}
            </span>
            <div className="w-10 h-10 rounded-xl bg-electric-500/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-electric-400" />
            </div>
          </div>

          {/* Value */}
          <div className="flex-1 flex flex-col justify-center">
            <span className="stats-value text-4xl md:text-5xl">{value}</span>
            {subtitle && (
              <span className="text-sm text-metallic-500 mt-2">{subtitle}</span>
            )}
          </div>

          {/* Trend */}
          {trend && trendValue && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {trendValue}
              </span>
              <span className="text-sm text-metallic-600">vs last month</span>
            </div>
          )}
        </div>

        {/* Decorative Corner */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-electric-500/5 to-transparent rounded-tl-full" />
      </div>
    </motion.div>
  );
}

// Main Bento Grid Component
interface BentoStatsGridProps {
  stats: {
    totalRevenue: number;
    activeRentals: number;
    totalBookings: number;
    occupancyRate: number;
    pendingBookings: number;
  };
}

export default function BentoStatsGrid({ stats }: BentoStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
      {/* Revenue - Large Tile */}
      <StatTile
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        subtitle="Lifetime earnings"
        trend="up"
        trendValue="+12.5%"
        icon={({ className }: { className?: string }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )}
        size="medium"
        gradient
        delay={0}
      />

      {/* Active Rentals */}
      <StatTile
        title="Active Rentals"
        value={stats.activeRentals}
        subtitle="Vehicles on the road"
        trend="up"
        trendValue="+8.2%"
        icon={({ className }: { className?: string }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        )}
        delay={0.1}
      />

      {/* Occupancy Rate */}
      <StatTile
        title="Occupancy Rate"
        value={`${stats.occupancyRate}%`}
        subtitle="Fleet utilization"
        trend="up"
        trendValue="+5.1%"
        icon={({ className }: { className?: string }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
          </svg>
        )}
        delay={0.2}
      />

      {/* Total Bookings */}
      <StatTile
        title="Total Bookings"
        value={stats.totalBookings}
        subtitle="All time reservations"
        trend="neutral"
        trendValue="0%"
        icon={({ className }: { className?: string }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )}
        delay={0.3}
      />

      {/* Pending Bookings - Highlighted */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="col-span-1"
      >
        <div className="bento-tile h-full relative overflow-hidden border-acid-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-acid-500/10 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-acid-400 uppercase tracking-wider">
                Pending
              </span>
              <div className="w-10 h-10 rounded-xl bg-acid-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-acid-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>

            <span className="stats-value text-4xl" style={{ 
              background: 'linear-gradient(135deg, #39FF14 0%, #2ECC10 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {stats.pendingBookings}
            </span>
            <p className="text-sm text-metallic-500 mt-2">Awaiting approval</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export { StatTile };
