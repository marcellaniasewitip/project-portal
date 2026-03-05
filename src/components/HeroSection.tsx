import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // 1. Import Framer Motion
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Eye, Users, MapPin, BarChart3, FileCheck, Loader2 } from 'lucide-react';

const HeroSection = () => {
  const [stats, setStats] = useState([
    { label: 'Active Projects', value: '...', icon: MapPin, key: 'active' },
    { label: 'LLGs Covered', value: '...', icon: BarChart3, key: 'llgs' },
    { label: 'Completed Projects', value: '...', icon: FileCheck, key: 'completed' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/project-tracking-portal/api/projects/get_hero_stats.php')
      .then(res => res.json())
      .then(data => {
        setStats([
          { label: 'Active Projects', value: data.active, icon: MapPin, key: 'active' },
          { label: 'LLGs Covered', value: data.llgs, icon: BarChart3, key: 'llgs' },
          { label: 'Completed Projects', value: data.completed, icon: FileCheck, key: 'completed' }
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const features = [
    { icon: Shield, title: 'Transparency', description: 'Open access to project information builds public trust' },
    { icon: Eye, title: 'Accountability', description: 'Track progress and ensure responsible resource management' },
    { icon: Users, title: 'Community Engagement', description: 'Citizens can provide feedback and report on local projects' }
  ];

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* 1. Hero Banner Section */}
      <div
        className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url('/src/assets/cover-page.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
          >
            Nuku District <br />
            <motion.span 
              animate={{ color: ['#fbbf24', '#f97316', '#fbbf24'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
            >
              Watch Portal
            </motion.span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Promoting accountability and transparency in the development of projects across all LLGs within the District.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-6 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
              View Public Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-10 py-6 rounded-full border-2 border-white/50 bg-white/10 text-white hover:bg-white hover:text-primary transition-all active:scale-95"
            >
              Admin Access
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. Stats Section (Overlapping) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-20 -mt-16 max-w-6xl mx-auto px-4"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-10 border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 bg-primary/10 rounded-2xl mb-4"
                >
                  <stat.icon className="h-8 w-8 text-primary" />
                </motion.div>
                {loading ? <Loader2 className="animate-spin h-6 w-6 text-slate-300" /> : 
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-bold text-slate-900 dark:text-white"
                  >
                    {stat.value}
                  </motion.div>
                }
                <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. Features Section */}
      <div className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Building Trust Through Transparency
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1 }}
              className="h-1.5 bg-primary mx-auto rounded-full mb-6"
            ></motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {features.map((feature, index) => (
              <motion.div variants={fadeInUp} key={index}>
                <Card className="group hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden relative">
                  <CardContent className="pt-10 pb-8 px-8 text-center">
                    <motion.div 
                      whileHover={{ scale: 1.2, y: -5 }}
                      className="mb-6 inline-block p-4 bg-slate-100 group-hover:bg-primary group-hover:text-white rounded-2xl transition-colors duration-300"
                    >
                      <feature.icon className="h-10 w-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;