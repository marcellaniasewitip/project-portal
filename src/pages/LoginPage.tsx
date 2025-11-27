import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate(); // Hook from React Router

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/project-tracking-portal/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the Admin Dashboard!",
          variant: "default",
        });
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        toast({
          title: "Login Failed",
          description: data.message || 'Invalid username or password.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
      toast({
        title: "Error",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-primary/5 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center relative"> {/* Added relative for positioning */}
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')} // Redirect to root path
            className="absolute top-4 left-4" // Position top-left
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back to home</span>
          </Button>

          {/* Logo and Titles */}
          <div className="flex flex-col items-center"> {/* Centered content */}
            <img
              src="/src/assets/738px-National_emblem_of_Papua_New_Guinea_(variant).svg.png"
              alt="PNG Emblem"
              className="h-20 w-20 mx-auto mb-4"
            />
            <CardTitle className="text-3xl font-bold text-foreground">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Access the Nuku District Project Tracking Portal
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        {/* The 'Don't have an account' paragraph was outside CardContent in your snippet,
            I'm assuming it should be within the Card component,
            placing it here directly before CardFooter or within an adjusted CardFooter. */}
        <p className="text-center text-sm text-muted-foreground mt-4 mb-4"> {/* Added mb-4 for spacing */}
          Don't have an account?{' '}
          <Button variant="link" onClick={() => navigate('/register')} className="p-0 h-auto text-primary">
            Register here
          </Button>
        </p>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">&copy; {new Date().getFullYear()} Nuku District Administration. All rights reserved.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;