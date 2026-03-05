import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { MapPin, Calendar, DollarSign, Building, Users, ExternalLink, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

// Interface updated to match your SQL 'projects' table columns
interface Project {
  id: number;
  title: string;
  description: string;
  location: string;         // mapped from location_general
  llg: string;              // mapped from location_llg
  district: string;         // mapped from location_district
  contractor: string;
  budget: number;
  used: number;             // mapped from amount_used
  status: string;
  category: string;
  priority: string;
  progress: number;         // mapped from progress_percentage
  startDate: string;        // mapped from start_date
  endDate: string;          // mapped from end_date
}

const ProjectsGrid = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost/project-tracking-portal/api/projects/get_projects.php');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load projects. Please ensure the database is connected.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('complete')) return 'success';
    if (s.includes('progress')) return 'default';
    if (s.includes('planning') || s.includes('pending')) return 'warning';
    return 'secondary';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PG', {
      style: 'currency',
      currency: 'PGK',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Connecting to Nuku Database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-muted/30" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              District Development Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              Official status of infrastructure in {projects[0]?.district || 'Nuku'} District.
            </p>
          </div>
          <Badge variant="outline" className="w-fit h-fit py-1 px-4 text-sm font-bold">
            {projects.length} Total Projects
          </Badge>
        </div>

        {projects.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-2">
            <p className="text-muted-foreground italic">No projects are currently registered in the database.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-t-0 border-r-0 border-b-0 border-l-8 border-primary bg-card"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                        {project.category}
                      </span>
                      <CardTitle className="text-xl font-bold leading-tight uppercase">
                        {project.title}
                      </CardTitle>
                    </div>
                    <Badge variant={getStatusColor(project.status) as any} className="whitespace-nowrap uppercase">
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                    <span>{project.llg} • {project.location}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-4">
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{project.description}"
                  </p>
                  
                  <div className="space-y-2 bg-muted/50 p-3 rounded-lg border">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                      <span>Physical Progress</span>
                      <span className="text-primary">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3 bg-secondary" />
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2 border-t border-dashed">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Building className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Contractor</p>
                          <p className="text-sm font-semibold">{project.contractor}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">End Date</p>
                          <p className="text-sm font-semibold">
                            {new Date(project.endDate).toLocaleDateString('en-PG', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-600 mt-1" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Budget</p>
                          <p className="text-sm font-bold">{formatCurrency(project.budget)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-blue-600 mt-1" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Disbursed</p>
                          <p className="text-sm font-bold">{formatCurrency(project.used)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="default" size="sm" className="flex-1 shadow-md hover:bg-primary/90">
                      View Documents
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-2">
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsGrid;