import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { MessageSquare, ThumbsUp, AlertTriangle, CheckCircle, Clock, User, Loader2, RefreshCw } from 'lucide-react';

interface FeedbackItem {
  id: number;
  feedback_type: string;
  project_name: string;
  message: string;
  submitted_at: string;
  status: string;
  llg: string;
  is_anonymous: boolean; // Now correctly mapped to PHP boolean
  author_name: string;    // PHP handles the "Anonymous Submission" string
}

interface SimpleProject {
  id: number;
  title: string;
  llg: string;
}

const PublicFeedback = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<SimpleProject[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [type, setType] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch logic
  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, feedRes] = await Promise.all([
        fetch('http://localhost/project-tracking-portal/api/projects/get_projects.php'),
        fetch('http://localhost/project-tracking-portal/api/feedback/get_feedback.php')
      ]);
      
      const projectData = await projRes.json();
      const feedbackData = await feedRes.json();
      
      setProjects(projectData);
      setRecentFeedback(feedbackData);
    } catch (err) {
      console.error("Fetch error:", err);
      toast({ title: "Connection Error", description: "Could not sync with the database.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !selectedProjectId || !message) {
      toast({ title: "Required Fields", description: "Please select a project and provide a message.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const selectedProject = projects.find(p => p.id.toString() === selectedProjectId);

    const payload = {
      feedback_type: type,
      project_id: selectedProjectId,
      project_name: selectedProject?.title,
      message,
      llg: selectedProject?.llg,
      is_anonymous: anonymous ? 1 : 0, // Convert to TINYINT for PHP
      author_name: name,
      author_email: email
    };

    try {
      const res = await fetch('http://localhost/project-tracking-portal/api/feedback/submit_feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Submitted", description: "Your feedback is now under review." });
        setMessage('');
        setType('');
        setSelectedProjectId('');
        fetchData(); // Refresh list to show new feedback
      }
    } catch (err) {
      toast({ title: "Error", description: "Submission failed.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    switch(t) {
        case 'complaint': return 'destructive';
        case 'appreciation': return 'success';
        case 'concern': return 'warning';
        case 'suggestion': return 'default';
        default: return 'secondary';
    }
  };

  return (
    <div className="py-16 bg-background" id="public">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Community Voice Portal</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Directly influence development by sharing your observations from the field.
          </p>
        </div>

        <Tabs defaultValue="submit" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="submit">Submit New Feedback</TabsTrigger>
            <TabsTrigger value="recent">Recent Community Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Your Feedback Matters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Type of Feedback</label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="concern">Concern</SelectItem>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="appreciation">Appreciation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Affected Project</label>
                      <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                        <SelectTrigger><SelectValue placeholder="Which project?" /></SelectTrigger>
                        <SelectContent>
                          {projects.map(p => (
                            <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Message</label>
                    <Textarea 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please be descriptive. Mention specific landmarks or dates if possible." 
                      className="min-h-[140px] resize-none" 
                    />
                  </div>

                  <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-md">
                    <input 
                      type="checkbox" 
                      id="anon" 
                      checked={anonymous} 
                      onChange={(e) => setAnonymous(e.target.checked)} 
                      className="h-5 w-5 accent-primary"
                    />
                    <label htmlFor="anon" className="text-sm font-medium cursor-pointer">
                      Submit anonymously (Your identity will be hidden)
                    </label>
                  </div>

                  {!anonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-1">Your Name</label>
                        <Input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-1">Email (Private)</label>
                        <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Send Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <div className="flex justify-end mb-4">
               <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
               </Button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
              ) : recentFeedback.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">No public feedback available yet.</p>
              ) : (
                recentFeedback.map((f) => (
                  <Card key={f.id} className="border-l-4 border-primary transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant={getTypeColor(f.feedback_type) as any} className="capitalize px-3 py-1">
                          {f.feedback_type}
                        </Badge>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 bg-muted px-2 py-1 rounded">
                          <Clock className="h-3 w-3" />
                          {new Date(f.submitted_at).toLocaleDateString('en-PG', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="font-bold text-foreground text-lg">{f.project_name}</p>
                        <p className="text-xs font-bold text-primary/70 uppercase tracking-widest">{f.llg}</p>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg border-l-2 border-muted-foreground/20 mb-4">
                        <p className="text-sm italic text-foreground/90 leading-relaxed">"{f.message}"</p>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs border-t pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4 p-0.5 bg-secondary rounded-full" />
                            <span className="font-semibold">{f.author_name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                            Status: {f.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicFeedback;