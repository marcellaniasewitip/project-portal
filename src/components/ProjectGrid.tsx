import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { MapPin, Calendar, DollarSign, Building, Users, ExternalLink, ArrowRight } from 'lucide-react';

const ProjectsGrid = () => {
  const projects = [
    {
      id: 1,
      title: 'Rural Road Rehabilitation Project',
      location: 'Piom to Ningil',
      llg: 'Yangkok',
      contractor: 'Dekenai Infrastructure Ltd',
      budget: 250000,
      used: 175000,
      status: 'in-progress',
      progress: 70,
      startDate: '2025-03-15',
      endDate: '2025-08-30',
      description: 'Upgrading 25km of rural access roads to improve connectivity for remote communities.'
    },
    {
      id: 2,
      title: 'Health Center Construction',
      location: 'Wasisi',
      llg: 'West Palai LLG',
      contractor: 'Wasisi Construction Co',
      budget: 28000,
      used: 14000,
      status: 'in-progress',
      progress: 50,
      startDate: '2025-05-01',
      endDate: '2025-10-15',
      description: 'Construction of a new health center to serve 5,000 residents in the Goroka region.'
    },
    {
      id: 3,
      title: 'School Classroom Expansion',
      location: 'Sapik',
      llg: 'West Palai LLG',
      contractor: 'Urban Torowi Builders',
      budget: 95000,
      used: 95000,
      status: 'completed',
      progress: 100,
      startDate: '2025-01-01',
      endDate: '2025-07-01',
      description: 'Addition of 6 new classrooms and library facilities for Lae Primary School.'
    },
    {
      id: 4,
      title: 'Water Supply System Upgrade',
      location: 'Wara Sikau',
      llg: 'East Palai LLG',
      contractor: 'Pacific Water Solutions',
      budget: 320000,
      used: 64000,
      status: 'in-progress',
      progress: 20,
      startDate: '2025-05-01',
      endDate: '2025-06-30',
      description: 'Upgrading water treatment and distribution systems to serve urban communities.'
    },
    {
      id: 5,
      title: 'Market Facility Reconstruction',
      location: 'Nuku Station',
      llg: 'Nuku Central LLG',
      contractor: 'North Coast Developers',
      budget: 120000,
      used: 12000,
      status: 'pending',
      progress: 10,
      startDate: '2024-07-01',
      endDate: '2024-12-31',
      description: 'Rebuilding the main market facility to support local vendors and traders.'
    },
    {
      id: 6,
      title: 'Bridge Construction Project',
      location: 'Wara Moon',
      llg: 'Nuku Central LLG',
      contractor: 'Coastal Engineering PNG',
      budget: 4500000,
      used: 0,
      status: 'pending',
      progress: 0,
      startDate: '2024-09-01',
      endDate: '2025-08-31',
      description: 'Construction of a new bridge to connect isolated communities during flood season.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PG', {
      style: 'currency',
      currency: 'PGK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="py-16 bg-muted/30" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Current Development Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track the progress of infrastructure and development projects across PNG districts and provinces.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                  <Badge variant={getStatusColor(project.status) as any}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{project.llg}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{project.description}</p>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Contractor</p>
                        <p className="font-medium">{project.contractor}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Timeline</p>
                        <p className="font-medium">{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{formatCurrency(project.budget)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-medium">{formatCurrency(project.used)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;