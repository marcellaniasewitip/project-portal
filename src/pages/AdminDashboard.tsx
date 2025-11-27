import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProjectForm } from '../components/admin/ProjectForm';
import { ProjectList } from '../components/admin/ProjectList';
import { Analytics } from '../components/admin/Analytics';
import { Button } from '../components/ui/button';
import { Plus, BarChart3, FileText, Users, UserCircle, LogOut, User } from 'lucide-react'; // Import new icons

// Import DropdownMenu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate(); // Initialize navigate hook

  // Mock user data (in a real app, this would come from context/auth state)
  const [username] = useState('AdminUser'); // Example: Replace with actual logged-in username

  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      description: 'Active development projects',
      icon: FileText,
      trend: '+12%'
    },
    {
      title: 'Total Budget',
      value: 'K10M',
      description: 'Allocated funds this year',
      icon: BarChart3,
      trend: '+8%'
    },
    {
      title: 'Public Feedback',
      value: '156',
      description: 'Community submissions',
      icon: Users,
      trend: '+23%'
    }
  ];

  const handleLogout = () => {
    // Clear authentication state (e.g., remove item from localStorage)
    localStorage.removeItem('isAuthenticated');
    // Redirect to the login page
    navigate('/'); // Assuming '/admin' is your login page route
  };

  const handleProfileClick = () => {
    // Implement your profile navigation or modal here
    // For now, let's just log it or show a toast
    console.log("Profile clicked!");
    // Example: navigate('/admin-profile');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center"> {/* Added flex and justify-between */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage PNG district and provincial projects</p>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <UserCircle className="h-6 w-6 text-primary" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@example.com {/* Example email, replace with actual user email */}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                  <span className="text-green-600 ml-2">{stat.trend}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="add-project">Add Project</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Latest project updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectList preview={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setActiveTab('add-project')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                  <Button
                    onClick={() => setActiveTab('analytics')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>View and manage all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-project">
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Create a new development project</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;