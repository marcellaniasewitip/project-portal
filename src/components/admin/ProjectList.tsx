import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Edit, Eye, Trash2, MapPin, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { EditProjectModal } from './EditProjectModal'; // <--- Import the new modal
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useToast } from '../../hooks/use-toast';

// Updated Interface to match your DB columns exactly
interface Project {
  id: string;
  title: string;
  description: string;
  location_general: string; // Matches DB
  location_llg: string;     // Matches DB
  location_district: string;
  contractor: string;
  budget: string;
  amount_used: string;       // Changed from budgetUsed
  start_date: string;       // Matches DB
  end_date: string;         // Matches DB
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'delayed';
  category: string;
  priority: 'high' | 'medium' | 'low';
  progress_percentage: number; // Changed from progress
}

export const ProjectList = ({ preview = false }: { preview?: boolean }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null); // State for modal
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost/project-tracking-portal/api/projects/projects.php');
      const json = await response.json();
      if (json.success) {
        setProjects(json.data);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Connection Error", description: "Could not load projects." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (projectId: string) => {
    try {
      const res = await fetch(`http://localhost/project-tracking-portal/api/projects/delete_project.php?id=${projectId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success) {
        setProjects(projects.filter(p => p.id !== projectId));
        toast({ title: "Success", description: "Project removed from database." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete project." });
    }
  };

  // UI Helpers
  const getStatusColor = (s: Project['status']) => {
    const colors = { completed: 'bg-green-500', 'in-progress': 'bg-blue-500', 'on-hold': 'bg-orange-500', delayed: 'bg-red-500', planning: 'bg-gray-500' };
    return colors[s] || 'bg-gray-400';
  };

  const formatCurrency = (amt: string) => `K${parseFloat(amt || "0").toLocaleString()}`;
  const formatDate = (ds: string) => ds ? new Date(ds).toLocaleDateString('en-PG', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  const displayProjects = preview ? projects.slice(0, 3) : projects;

  return (
    <div className="space-y-4">
      {displayProjects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-all border-l-4 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div className="flex-1 min-w-0 pr-4">
                <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
                
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant={project.priority === 'high' ? 'destructive' : 'secondary'}>
                    {project.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{project.category}</Badge>
                  <div className="flex items-center gap-1.5 ml-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(project.status)}`} />
                    <span className="text-xs font-medium uppercase text-muted-foreground">{project.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              
              {!preview && (
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <Button size="icon" variant="outline" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  
                  {/* EDIT BUTTON TRIGGERS MODAL */}
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-8 w-8"
                    onClick={() => setEditingProject(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                        <AlertDialogDescription>Removing "{project.title}" is permanent.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(project.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {project.location_general}, {project.location_llg}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {formatDate(project.start_date)}
              </div>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <DollarSign className="h-4 w-4" /> {formatCurrency(project.budget)}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 uppercase font-bold tracking-wider">
                  <span>Physical Progress</span>
                  <span className="text-primary">{project.progress_percentage}%</span>
                </div>
                <Progress value={Number(project.progress_percentage)} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 uppercase font-bold tracking-wider">
                  <span>Funds Utilized</span>
                  <span>
                    {project.budget && parseInt(project.budget) > 0 
                      ? Math.round((parseFloat(project.amount_used) / parseFloat(project.budget)) * 100) 
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={(parseFloat(project.amount_used) / parseFloat(project.budget)) * 100} 
                  className="h-2" 
                />
                <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
                  <span>Spent: {formatCurrency(project.amount_used)}</span>
                  <span>Total: {formatCurrency(project.budget)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* EDIT MODAL COMPONENT */}
      {editingProject && (
        <EditProjectModal 
          project={editingProject} 
          isOpen={!!editingProject} 
          onClose={() => setEditingProject(null)} 
          onRefresh={fetchProjects}
        />
      )}

      {preview && projects.length > 3 && (
        <Button variant="outline" className="w-full">View All {projects.length} Projects</Button>
      )}
    </div>
  );
};