import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

// Import Dialog components (assuming Shadcn UI is in use)
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Define the props for the modal, including a function to close it
interface LoginModalProps {
  setIsOpen: (open: boolean) => void;
}

const LoginPage = ({ setIsOpen }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // --- Login Logic (Kept the same) ---
    try {
      // NOTE: In a production app, use an environment variable for the API URL.
      const response = await fetch('http://localhost/project-tracking-portal/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to the Admin Dashboard!',
          variant: 'default',
        });
        localStorage.setItem('isAuthenticated', 'true');
        setIsOpen(false); // Close the modal on success
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        toast({
          title: 'Login Failed',
          description: data.message || 'Invalid username or password.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
      toast({
        title: 'Error',
        description: 'Could not connect to the server.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  // --- End Login Logic ---

  return (
    // Replaced the heavy 'min-h-screen flex items-center...' container with DialogContent
    // DialogContent replaces the outer <Card> and brings the content into the modal layer
    <DialogContent className="sm:max-w-md p-0 overflow-hidden">
      
      {/* HEADER SECTION */}
      <DialogHeader className="p-6 pb-4 border-b border-border text-center relative">
        {/* Back button logic is now handled by the Dialog close button, 
           but we keep the visual/logo structure: */}
        <div className="flex flex-col items-center">
          <img
            src="src/assets/738px-National_emblem_of_Papua_New_Guinea_(variant).svg.png"
            alt="PNG Emblem"
            className="h-16 w-16 mx-auto mb-3" // Slightly smaller icon for modal
          />
          <DialogTitle className="text-2xl font-bold text-foreground">Admin Login</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Access the Nuku District Project Tracking Portal
          </DialogDescription>
        </div>
      </DialogHeader>

      {/* BODY / FORM SECTION */}
      <div className="p-6">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-primary focus:border-primary"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full flex items-center justify-center" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </Button>
        </form>
      </div>

      {/* FOOTER SECTION */}
      <div className="p-6 pt-0 border-t border-border">
        
       {/*} <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <Button 
             variant="link" 
             onClick={() => {
                setIsOpen(false); 
                navigate('/register'); 
             }} 
             className="p-0 h-auto text-primary"
          >
            Register here
          </Button>
        </p>*/}

        {/* Copyright */}
        <p className="w-full text-center text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} Nuku District Administration. All rights reserved.
        </p>
      </div>
      
    </DialogContent>
  );
};

export default LoginPage;