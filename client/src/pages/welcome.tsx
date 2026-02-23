import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Shield, Users, Download, GraduationCap, Loader2, Mail, Settings } from "lucide-react";
import { useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Welcome() {
  usePageTitle("Dashboard");
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login?redirect=/welcome");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const pathways = [
    { title: "Royal Academy", description: "Courses in trust, stewardship & covenant authority", href: "/courses", icon: BookOpen },
    { title: "Freedom Resources", description: "Templates, guides & legal tools", href: "/resources", icon: FileText },
    { title: "Proof Vault", description: "Timestamp & verify your documents", href: "/proof-vault", icon: Shield },
    { title: "Embassy Forum", description: "Fellowship with the covenant community", href: "/forum", icon: Users },
    { title: "Downloads", description: "Documents, declarations & resources", href: "/downloads", icon: Download },
    { title: "My Courses", description: "Continue your learning journey", href: "/my-courses", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen marble-bg pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy text-white py-16 md:py-24 border-b-2 border-royal-gold">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-cinzel-decorative text-3xl md:text-5xl font-bold mb-4">
            Welcome, {user.firstName}
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Your Covenant Journey Begins
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Email verification reminder */}
        {user.isEmailVerified === false && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-8">
            <Mail className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              We sent a verification link to <strong>{user.email}</strong>. Please check your inbox to verify your email address.
            </p>
          </div>
        )}

        {/* Pathway Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((p) => (
            <Link key={p.href} href={p.href}>
              <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                <CardContent className="p-8">
                  <p.icon className="w-12 h-12 text-royal-burgundy mb-4" />
                  <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-2">{p.title}</h3>
                  <p className="text-gray-600">{p.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {user.role === 'admin' && (
          <div className="mt-8">
            <Link href="/admin">
              <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer border-dashed border-2">
                <CardContent className="p-8 flex items-center gap-6">
                  <Settings className="w-12 h-12 text-royal-burgundy flex-shrink-0" />
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-2">Admin Panel</h3>
                    <p className="text-gray-600">Manage users, content, courses, and system settings</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
