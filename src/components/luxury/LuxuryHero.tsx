import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function LuxuryHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ type: 'spring', damping: 50, stiffness: 100 }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: -mousePosition.x * 1.5,
          y: -mousePosition.y * 1.5,
        }}
        transition={{ type: 'spring', damping: 50, stiffness: 100 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-acid-500/5 rounded-full blur-[100px]"
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-acid-500 animate-pulse" />
              Premium Fleet Now Available
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6"
          >
            <span className="text-white">Drive the</span>
            <br />
            <span className="text-gradient-electric">Extraordinary</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-metallic-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience luxury automotive excellence. From electric supercars to 
            executive sedans, elevate every journey with our curated collection.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/fleet">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-neon flex items-center gap-2 text-lg py-4 px-8"
              >
                Explore Fleet
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-neon-outline flex items-center gap-2 text-lg py-4 px-8"
              >
                <Play className="w-5 h-5" />
                Get Started
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '50+', label: 'Vehicles' },
              { value: '10K+', label: 'Rentals' },
              { value: '4.9', label: 'Rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-metallic-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-carbon to-transparent" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-metallic-500 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-metallic-700 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-electric-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
