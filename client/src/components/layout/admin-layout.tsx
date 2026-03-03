import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  Download,
  FileText,
  MessageSquare,
  Shield,
  Menu,
  X,
  Eye,
  MessagesSquare,
  Mail,
} from "lucide-react";
import { useState } from "react";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Videos & Resources", href: "/admin/videos", icon: Video },
  { name: "Downloads", href: "/admin/downloads", icon: Download },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Forum", href: "/admin/forum", icon: MessagesSquare },
  { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Trust Downloads", href: "/admin/trust-downloads", icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  const sidebar = (
    <nav className="flex flex-col gap-1 p-4">
      {adminNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive(item.href)
              ? "bg-royal-navy text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <item.icon className="h-4 w-4 flex-shrink-0" />
          {item.name}
        </Link>
      ))}
      <div className="border-t my-3" />
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Eye className="h-4 w-4 flex-shrink-0" />
        View Site
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b px-4 py-2 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="ml-2 text-sm font-medium">Admin Menu</span>
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 pt-16"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 bg-white dark:bg-gray-800 h-full mt-10 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex pt-0">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-4rem)] sticky top-16 shrink-0">
          <div className="py-4">
            <div className="px-6 pb-4 border-b mb-2">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Admin Panel</h2>
            </div>
            {sidebar}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 lg:pt-0 pt-12">
          {children}
        </main>
      </div>
    </div>
  );
}
