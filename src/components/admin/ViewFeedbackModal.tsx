import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { CheckCircle, MessageSquare, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

// 1. ADD THIS INTERFACE TO FIX THE ERROR
interface Feedback {
  id: string;
  project_id: string;
  message: string;
  author_name: string;
  is_anonymous: boolean;
  submitted_at: string;
  status: 'pending' | 'reviewed';
}

// Ensure you define the Props interface as well for better TS support
interface ViewFeedbackModalProps {
  project: { id: string; title: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewFeedbackModal = ({ project, isOpen, onClose }: ViewFeedbackModalProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]); // Error gone!
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeedback = async () => {
    if (!project?.id) return;
    setLoading(true);
    try {
      // Note: Added project_id param to match your fetch call
      const response = await fetch(`http://localhost/project-tracking-portal/api/feedback/get_feedback.php?project_id=${project.id}`, { 
        credentials: 'include' 
      });
      const json = await response.json();
      
      // Safety check: handle if json.data exists or if json itself is the array
      if (json.success) {
        setFeedback(json.data);
      } else if (Array.isArray(json)) {
        setFeedback(json);
      }
    } catch (err) {
      console.error("Feedback fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && project?.id) fetchFeedback();
  }, [isOpen, project]);

  const handleMarkReviewed = async (feedbackId: string) => {
    try {
      const response = await fetch('http://localhost/project-tracking-portal/api/feedback/update_feedback_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feedbackId, status: 'reviewed' }),
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setFeedback(prev => prev.map(f => f.id === feedbackId ? { ...f, status: 'reviewed' } : f));
        toast({ title: "Feedback Updated", description: "Marked as reviewed successfully." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Feedback: {project?.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[450px] pr-4 mt-4">
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
          ) : feedback.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic">No feedback found for this project.</div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className="p-4 border rounded-xl bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm flex items-center gap-1">
                        {item.is_anonymous ? <ShieldCheck className="h-3 w-3 text-green-600" /> : null}
                        {item.is_anonymous ? "Anonymous Resident" : item.author_name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(item.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant={item.status === 'reviewed' ? 'outline' : 'default'}>
                      {item.status || 'pending'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3 italic leading-relaxed">"{item.message}"</p>

                  {item.status !== 'reviewed' && (
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleMarkReviewed(item.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark as Reviewed
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};