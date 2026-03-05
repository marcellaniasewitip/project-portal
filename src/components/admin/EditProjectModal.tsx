import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { Slider } from '../ui/slider'; // Optional: for progress percentage

export const EditProjectModal = ({ project, isOpen, onClose, onRefresh }) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      id: project.id,
      title: project.title,
      status: project.status,
      amount_used: project.amount_used || 0,
      progress_percentage: project.progress_percentage || 0,
    },
  });

  const onUpdate = async (data) => {
    try {
      const response = await fetch('http://localhost/project-tracking-portal/api/projects/update_project.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        toast({ title: "Updated!", description: "Project status saved." });
        onRefresh(); // Refresh the list
        onClose();   // Close modal
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive", description: "Update failed." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Progress: {project.title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount_used"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Funds Spent (PGK)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progress_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Completion: {field.value}%</FormLabel>
                  <FormControl>
                    <Input type="range" min="0" max="100" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};