import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProjectForm } from '../components/admin/ProjectForm';
import { ProjectList } from '../components/admin/ProjectList';
import { Analytics } from '../components/admin/Analytics';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../components/ui/sheet";
import { 
  Plus, BarChart3, FileText, Users, UserCircle, LogOut, 
  LayoutDashboard, ListPlus, CircleDollarSign, Loader2, Menu 
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(''); 
  const [displayName, setDisplayName] = useState('');
  const [dbStats, setDbStats] = useState({ total_projects: 0, total_budget: 0, total_feedback: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        // GET USER (with credentials include to pass session cookie)
        const userRes = await fetch('http://localhost/project-tracking-portal/api/get_current_user.php', { credentials: 'include' });
        const userData = await userRes.json();
        
        if (userData.success) {
          setUserEmail(userData.email);
          setDisplayName(userData.display_name);
        } else {
          navigate('/'); // Redirect if session missing
          return;
        }

        // GET STATS
        const statsRes = await fetch('http://localhost/project-tracking-portal/api/dashboard/get_dashboard_stats.php', { credentials: 'include' });
        const statsData = await statsRes.json();
        if (statsData.success) setDbStats(statsData.stats);

      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [navigate]);

  const navItems = [
    { value: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { value: 'projects', name: 'Projects', icon: FileText },
    { value: 'feedback', name: 'Community Voice', icon: Users },
    { value: 'add-project', name: 'Add New', icon: ListPlus },
    { value: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await fetch('http://localhost/project-tracking-portal/api/auth/logout.php', { credentials: 'include' });
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 py-2 flex-1">
        <h2 className="mb-6 px-4 text-xl font-bold text-primary tracking-tight">Nuku Portal</h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.value}
              variant={activeTab === item.value ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => { setActiveTab(item.value); setIsMobileMenuOpen(false); }}
            >
              <item.icon className="h-4 w-4" /> {item.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="px-3 mt-auto">
        <div className="bg-white p-3 rounded-lg border shadow-sm mb-4">
          <p className="text-xs font-bold truncate">{displayName || 'Loading...'}</p>
          <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
        </div>
        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* MOBILE HEADER */}
<header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white px-4 h-16 border-b">
  <div className="flex items-center gap-2">
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
       <SheetContent side="left" className="p-0 w-72">
  <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
  {/* Optional Description */}
  <div className="sr-only">Access dashboard, projects, and analytics.</div>
  <SidebarContent />
</SheetContent>
      </SheetContent>
    </Sheet>
    <span className="font-bold text-primary">Nuku Admin</span>
  </div>
  <UserCircle className="text-primary h-8 w-8" />
</header>

      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 border-r bg-slate-100 h-screen sticky top-0">
          <SidebarContent />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
          <div className="mb-8 hidden md:block">
            <h1 className="text-4xl font-black text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome back, {displayName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-l-4 border-blue-500">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Projects</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{loading ? "..." : dbStats.total_projects}</CardContent>
            </Card>
            <Card className="border-l-4 border-green-500">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Budget</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">K{(dbStats.total_budget / 1000000).toFixed(1)}M</CardContent>
            </Card>
            <Card className="border-l-4 border-purple-500">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Feedback</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{dbStats.total_feedback}</CardContent>
            </Card>
          </div>

          {/*<div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 min-h-[400px]">
             {activeTab === 'overview' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                 <h2 className="text-2xl font-bold">Live Overview</h2>
                 <ProjectList preview={true} />
               </div>
             )}
             {activeTab === 'projects' && <ProjectList />}
             {activeTab === 'add-project' && <ProjectForm />}
             {activeTab === 'analytics' && <Analytics />}
          </div>*/}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 min-h-[400px]">
   {activeTab === 'overview' && (
     <div className="space-y-6">
       <h2 className="text-2xl font-bold">Live Overview</h2>
       <ProjectList preview={true} />
     </div>
   )}
   {activeTab === 'projects' && <ProjectList />}
   
   {/* ADD THIS NEW SECTION */}
   {activeTab === 'feedback' && (
     <div className="space-y-6">
       <h2 className="text-2xl font-bold">Recent Feedback Submissions</h2>
       {/* You can reuse the PublicFeedback component here but in 'admin mode' */}
       <p className="text-muted-foreground text-sm">Use the 'Projects' tab to view feedback specific to each project via the eye icon.</p>
     </div>
   )}

   {activeTab === 'add-project' && <ProjectForm />}
   {activeTab === 'analytics' && <Analytics />}
</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;