import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function ThreadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forum Coming Soon</h1>
            <p className="text-gray-600">
              We're preparing a space for covenant discussions and Kingdom fellowship. 
              This feature will be available soon.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/forum">
              <Button variant="outline" className="w-full">
                Back to Forum
              </Button>
            </Link>
            <Link href="/education">
              <Button className="w-full bg-covenant-blue hover:bg-covenant-blue/80">
                Explore Kingdom College
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}