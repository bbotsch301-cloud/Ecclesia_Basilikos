import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, Shield, Users, Download, GraduationCap, Mail, Settings } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import RequireAuth from "@/components/RequireAuth";

function WelcomeContent() {
  usePageTitle("Dashboard");
  const { user } = useAuth();

  if (!user) return null;

  const pathways = [
    { title: "Downloads", description: "Documents, declarations & resources", href: "/downloads", icon: Download, disabled: false },
    { title: "Educational Resources", description: "Templates, guides & educational materials", href: "/resources", icon: FileText, disabled: false },
    { title: "Royal Academy", description: "Courses in trust, stewardship & covenant authority", href: "/courses", icon: BookOpen, disabled: true },
    { title: "Proof Vault", description: "Timestamp & verify your documents", href: "/proof-vault", icon: Shield, disabled: true },
    { title: "Embassy Forum", description: "Fellowship with the covenant community", href: "/forum", icon: Users, disabled: true },
    { title: "My Courses", description: "Continue your learning journey", href: "/my-courses", icon: GraduationCap, disabled: true },
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
          {pathways.map((p) => {
            const card = (
              <Card className={`royal-card transition-all h-full ${p.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-royal-gold cursor-pointer"}`}>
                <CardContent className="p-8 relative">
                  {p.disabled && (
                    <span className="absolute top-3 right-3 text-xs font-semibold bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <p.icon className={`w-12 h-12 mb-4 ${p.disabled ? "text-gray-400" : "text-royal-burgundy"}`} />
                  <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-2">{p.title}</h3>
                  <p className="text-gray-600">{p.description}</p>
                </CardContent>
              </Card>
            );

            return p.disabled ? (
              <div key={p.href}>{card}</div>
            ) : (
              <Link key={p.href} href={p.href}>{card}</Link>
            );
          })}
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

export default function Welcome() {
  return (
    <RequireAuth>
      <WelcomeContent />
    </RequireAuth>
  );
}
