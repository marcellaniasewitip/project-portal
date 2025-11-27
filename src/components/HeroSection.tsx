import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Shield, Eye, Users, MapPin, BarChart3, FileCheck } from 'lucide-react';
// REMOVED: import heroBanner from '../assets/hero-banner.jpg'; // This import is no longer needed

const HeroSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Open access to project information builds public trust'
    },
    {
      icon: Eye,
      title: 'Accountability',
      //title: 'Accountability',
      description: 'Track progress and ensure responsible resource management'
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Citizens can provide feedback and report on local projects'
    }
  ];

  const stats = [
    { label: 'Active Projects', value: '156', icon: MapPin },
    { label: 'LLGs Covered', value: '5', icon: BarChart3 },
    { label: 'Completed Projects', value: '342', icon: FileCheck }
  ];

  return (
    <div className="relative">
      {/* Hero Background */}
      <div
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        // FIXED: Directly linking to the public asset for background image
        style={{ backgroundImage: `url(/src/assets/cover-page.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            District Project
            <span className="block text-accent">Tracking Portal</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Promoting accountability and transparency in the LLGs and development of the projects across the District
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-3">
              View Public Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Admin Access
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Building Trust Through Transparency
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform ensures that every development project is visible, trackable, and accountable to the people it serves.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;