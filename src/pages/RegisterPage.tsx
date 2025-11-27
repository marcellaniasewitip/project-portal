import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) { // Basic password length validation
        setError("Password must be at least 6 characters long.");
        toast({
            title: "Registration Failed",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('http://localhost/project-tracking-portal/api/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
          variant: "default",
        });
        navigate('/admin'); // Redirect to the login page after successful registration
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        toast({
          title: "Registration Failed",
          description: data.message || 'An error occurred during registration.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Could not connect to the server.');
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
        <CardHeader className="text-center">
          <img 
            src="/src/assets/738px-National_emblem_of_Papua_New_Guinea_(variant).svg.png" 
            alt="PNG Emblem" 
            className="h-20 w-20 mx-auto mb-4" 
          />
          <CardTitle className="text-3xl font-bold text-foreground">Register New Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account for the Nuku District Project Tracking Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Registering...' : 'Register Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground flex flex-col gap-2">
          <p className="w-full">
            Already have an account?{' '}
            <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto text-primary">
              Login here
            </Button>
          </p>
          <p className="w-full">&copy; {new Date().getFullYear()} Nuku District Administration. All rights reserved.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;