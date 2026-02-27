import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page Not Found");
  return (
    <div className="pt-16 min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button variant="outline" className="mt-4 font-cinzel">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
