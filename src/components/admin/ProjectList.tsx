import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Edit, Eye, Trash2, MapPin, Calendar, DollarSign } from 'lucide-react';
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

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  llg: string;
  district: string;
  contractor: string;
  budget: string;
  budgetUsed: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'delayed';
  category: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

interface ProjectListProps {
  preview?: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Rural Road Rehabilitation Project',
    description: 'Upgrading 25km of rural access roads to improve connectivity for remote communities.',
    location: 'Piom to Ningil',
    llg: 'Yangkok',
    district: 'Nuku',
    contractor: 'Dekenai Infrastructure Ltd',
    budget: '250,000',
    budgetUsed: '175,000',
    startDate: '2024-01-15',
    endDate: '2025-08-30',
    status: 'in-progress',
    category: 'infrastructure',
    priority: 'high',
    progress: 40
  },
  {
    id: '2',
    title: 'Rural Health Center Construction',
    description: 'Construction of a new health center to serve remote communities.',
    location: 'Wasisi Village',
    llg: 'West Palai LLG',
    district: 'Nuku',
    contractor: 'Wasisi Construction Co',
    budget: '28,000',
    budgetUsed: '14,000',
    startDate: '2025-05-01',
    endDate: '2024-10-15',
    status: 'in-progress',
    category: 'healthcare',
    priority: 'high',
    progress: 75
  },
  {
    id: '3',
    title: 'School Classroom Expansion',
    description: 'Addition of 6 new classrooms and library facilities for Lae Primary School.',
    location: 'Sapik',
    llg: 'West Palai LLG',
    district: 'Nuku',
    contractor: 'Urban Torowi Builders',
    budget: '95,000',
    budgetUsed: '95,000',
    startDate: '2025-01-01',
    endDate: '2025-07-01',
    status: 'completed',
    category: 'energy',
    priority: 'medium',
    progress: 100
  },
  {
    id: '4',
    title: 'Water Supply System Upgrade',
    description: 'Upgrading water supply infrastructure for improved access to clean water.',
    location: 'Wara Sikau',
    llg: 'East Palai LLG',
    district: 'Madang',
    contractor: 'Pacific Water Solutions',
    budget: '3,200000',
    budgetUsed: '64,000',
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    status: 'in-progress',
    category: 'water-sanitation',
    priority: 'high',
    progress: 25
  },
  {
    id: '5',
    title: 'Bridge Construction Project',
    description: 'Construction of a new bridge to connect isolated Wati and Nuku Station during flood season.',
    location: 'Wara Moon',
    llg: 'Nuku Central LLG',
    district: 'Nuku',
    contractor: 'Coastal Engineering Ltd',
    budget: '450,000',
    budgetUsed: '0',
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    status: 'in-progress',
    category: 'road',
    priority: 'medium',
    progress: 10
  }
];

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-blue-500';
    case 'on-hold':
      return 'bg-orange-500';
    case 'delayed':
      return 'bg-red-500';
    case 'planning':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

const getPriorityColor = (priority: Project['priority']) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

export const ProjectList = ({ preview = false }: ProjectListProps) => {
  const [projects] = useState<Project[]>(mockProjects);
  const { toast } = useToast();

  const displayProjects = preview ? projects.slice(0, 3) : projects;

  const handleDelete = (projectId: string) => {
    toast({
      title: "Project Deleted",
      description: "The project has been removed from the system.",
    });
  };

  const formatCurrency = (amount: string) => {
    return `K${parseInt(amount).toLocaleString()}`;
  };

  const calculateBudgetPercentage = (used: string, total: string) => {
    return Math.round((parseInt(used) / parseInt(total)) * 100);
  };

  return (
    <div className="space-y-4">
      {displayProjects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                <CardDescription className="mb-3">{project.description}</CardDescription>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={getPriorityColor(project.priority)}>
                    {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                  </Badge>
                  <Badge variant="secondary">{project.category}</Badge>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                    <span className="text-xs text-muted-foreground capitalize">{project.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              
              {!preview && (
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the project
                          "{project.title}" and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(project.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{project.location}, {project.llg}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Budget: {formatCurrency(project.budget)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>Project Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>Budget Utilization</span>
                  <span>{calculateBudgetPercentage(project.budgetUsed, project.budget)}%</span>
                </div>
                <Progress 
                  value={calculateBudgetPercentage(project.budgetUsed, project.budget)} 
                  className="h-2" 
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Used: {formatCurrency(project.budgetUsed)}</span>
                  <span>Total: {formatCurrency(project.budget)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Contractor: {project.contractor}</span>
                <span>District: {project.district}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {preview && projects.length > 3 && (
        <div className="text-center">
          <Button variant="outline">View All Projects ({projects.length})</Button>
        </div>
      )}
    </div>
  );
};