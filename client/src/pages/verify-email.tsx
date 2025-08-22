import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [location] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    // Verify email
    fetch(`/api/auth/verify-email?token=${token}`, {
      credentials: 'include'
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error occurred');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <XCircle className="w-16 h-16 text-red-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
            </div>
          )}
        </div>
        
        {status !== 'loading' && (
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/courses'}
              className="w-full bg-covenant-gold hover:bg-covenant-gold/90 text-white"
              data-testid="button-go-to-courses"
            >
              Go to Kingdom College
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
              data-testid="button-go-home"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}