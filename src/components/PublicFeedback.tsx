import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { MessageSquare, ThumbsUp, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';

const PublicFeedback = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [project, setProject] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(true);

  const recentFeedback = [
    {
      id: 1,
      type: 'complaint',
      project: 'Rural Road Rehabilitation Project',
      message: 'Road work has been halted for 2 weeks with no explanation. Community needs updates.',
      date: '2025-03-30',
      status: 'reviewed',
      llg: 'Yangkok',
      anonymous: true
    },
    {
      id: 2,
      type: 'appreciation',
      project: 'Health Center Construction',
      message: 'Great progress on the health center. Workers are very professional and respectful to the community.',
      date: '2025-07-03',
      status: 'acknowledged',
      llg: 'West Palai LLG',
      anonymous: false,
      author: 'Mary K.'
    },
    {
      id: 3,
      type: 'concern',
      project: 'School Classroom Expansion',
      message: 'Construction materials left unattended. Concerned about safety around the school area.',
      date: '2025-03-01',
      status: 'under-review',
      llg: 'West Palai LLG',
      anonymous: true
    },
    {
      id: 4,
      type: 'suggestion',
      project: 'Water Supply System Upgrade',
      message: 'Suggest coordinating with local church groups who can help with community awareness about the project.',
      date: '2025-07-01',
      status: 'reviewed',
      llg: 'East Palai LLG',
      anonymous: false,
      author: 'James M.'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <AlertTriangle className="h-4 w-4" />;
      case 'appreciation':
        return <ThumbsUp className="h-4 w-4" />;
      case 'concern':
        return <MessageSquare className="h-4 w-4" />;
      case 'suggestion':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'complaint':
        return 'destructive';
      case 'appreciation':
        return 'success';
      case 'concern':
        return 'warning';
      case 'suggestion':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'acknowledged':
        return 'success';
      case 'reviewed':
        return 'default';
      case 'under-review':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ feedbackType, project, message, anonymous });
    // Reset form
    setFeedbackType('');
    setProject('');
    setMessage('');
  };

  return (
    <div className="py-16 bg-background" id="public">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Public Feedback Portal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your voice matters. Share feedback, report concerns, or ask questions about development projects in your area.
          </p>
        </div>

        <Tabs defaultValue="submit" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
            <TabsTrigger value="recent">Recent Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Submit Your Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Feedback Type</label>
                      <Select value={feedbackType} onValueChange={setFeedbackType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="concern">Concern</SelectItem>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="appreciation">Appreciation</SelectItem>
                          <SelectItem value="question">Question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Related Project</label>
                      <Select value={project} onValueChange={setProject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rural-road">Rural Road Rehabilitation Project</SelectItem>
                          <SelectItem value="health-center">Health Center Construction</SelectItem>
                          <SelectItem value="school-expansion">School Classroom Expansion</SelectItem>
                          <SelectItem value="water-supply">Water Supply System Upgrade</SelectItem>
                          <SelectItem value="market-facility">Market Facility Reconstruction</SelectItem>
                          <SelectItem value="bridge-construction">Bridge Construction Project</SelectItem>
                          <SelectItem value="other">Other/General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Message</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide detailed information about your feedback..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                      Submit anonymously (recommended for sensitive feedback)
                    </label>
                  </div>

                  {!anonymous && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="Your name (optional)" />
                      <Input placeholder="Your email (optional)" />
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getTypeColor(feedback.type) as any} className="flex items-center space-x-1">
                          {getTypeIcon(feedback.type)}
                          <span className="capitalize">{feedback.type}</span>
                        </Badge>
                        <Badge variant={getStatusColor(feedback.status) as any}>
                          {feedback.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(feedback.date)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground">{feedback.project}</p>
                        <p className="text-sm text-muted-foreground">{feedback.llg}</p>
                      </div>
                      
                      <p className="text-muted-foreground">{feedback.message}</p>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>
                          {feedback.anonymous ? 'Anonymous' : `By ${feedback.author}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Feedback
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicFeedback;