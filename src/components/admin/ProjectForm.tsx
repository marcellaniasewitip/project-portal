import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DollarSign, MapPin, Users, FileText, ChevronDown, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

// --- Zod Schema ---
const projectSchema = z.object({
  title: z.string().min(2, 'Project title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Specific location is required'),
  llg: z.string().min(1, 'LLG is required'),
  district: z.string().min(1, 'District is required'),
  contractor: z.string().min(2, 'Contractor name is required'),
  budget: z.string().regex(/^\d+$/, 'Budget must be a whole number'), 
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.string().min(1, 'Status is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

// --- Constants ---
const LLG_OPTIONS = [
  'Nuku Central LLG', 'West Palai LLG', 'East Palai LLG', 'Maimai Wanwan LLG', 'Yangkok LLG'
];

const DISTRICT_OPTIONS = ['Nuku'];

export const ProjectForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      llg: '',
      district: 'Nuku',
      contractor: '',
      budget: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      category: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      // THE FIX: Added credentials: 'include' to ensure the PHP session is recognized
      const response = await fetch('http://localhost/project-tracking-portal/api/projects/create_project.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', 
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: `"${data.title}" has been successfully registered.`,
        });
        form.reset({ district: 'Nuku', status: 'planning', priority: 'medium' });
      } else {
        throw new Error(result.message || "Failed to save project.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Connection to server failed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-0 md:px-4 py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
        <p className="text-slate-500">Fill in the details below to register a new infrastructure project.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                <FileText className="h-5 w-5 text-blue-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rural Road Rehabilitation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed scope and objectives..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="water-sanitation">Water & Sanitation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Location Information */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                <MapPin className="h-5 w-5 text-red-600" />
                Execution Site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Specific Site / Village</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sapik Village" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="llg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Local Level Government (LLG)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select LLG" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LLG_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">District</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nuku" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Nuku">Nuku</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Finance & Contractor */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                <DollarSign className="h-5 w-5 text-green-600" />
                Finance & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contractor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Contractor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Executing company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Total Budget (PGK)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 font-bold">K</span>
                          <Input type="number" className="pl-8" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Proposed Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Target Completion</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
              className="w-full sm:w-32"
            >
              Clear Form
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-48 bg-blue-700 hover:bg-blue-800">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Register Project'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};