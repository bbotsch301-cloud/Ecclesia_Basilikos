import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Mail } from "lucide-react";

export default function NewsletterUnsubscribe() {
  usePageTitle("Unsubscribe");
  const [email, setEmail] = useState("");

  const unsubMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/newsletter/unsubscribe", { email });
      return res.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) unsubMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {unsubMutation.isIdle && (
          <>
            <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribe</h1>
            <p className="text-gray-600 mb-6">
              Enter your email address to unsubscribe from our newsletter.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full bg-royal-navy hover:bg-royal-navy/90 text-white"
                disabled={unsubMutation.isPending}
              >
                {unsubMutation.isPending ? "Processing..." : "Unsubscribe"}
              </Button>
            </form>
          </>
        )}

        {unsubMutation.isSuccess && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribed</h1>
            <p className="text-gray-600 mb-6">
              You have been successfully removed from our mailing list.
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </div>
        )}

        {unsubMutation.isError && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribe Failed</h1>
            <p className="text-gray-600 mb-6">
              {(unsubMutation.error as any)?.message || "Could not find that email address in our subscriber list."}
            </p>
            <Button variant="outline" onClick={() => unsubMutation.reset()}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
