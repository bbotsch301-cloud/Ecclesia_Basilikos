import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Video,
  Download,
  FileText,
  MessageSquare,
  Menu,
  X,
  Eye,
  MessagesSquare,
  Mail,
  Pencil,
  CreditCard,
  Crown,
  ScrollText,
  Layers,
  Landmark,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const adminNavGroups: NavGroup[] = [
  {
    label: "",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content & Media",
    items: [
      { name: "Course Editor", href: "/admin/courses", icon: Pencil },
      { name: "Videos & Resources", href: "/admin/videos", icon: Video },
      { name: "Downloads", href: "/admin/downloads", icon: Download },
      { name: "Content Pages", href: "/admin/content", icon: FileText },
    ],
  },
  {
    label: "Community",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Forum", href: "/admin/forum", icon: MessagesSquare },
      { name: "Subscribers", href: "/admin/subscribers", icon: CreditCard },
      { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
      { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    label: "Trust",
    items: [
      { name: "Structure", href: "/admin/trust-structure", icon: Crown },
      { name: "Architecture", href: "/admin/trust-architecture", icon: Layers },
      { name: "Documents", href: "/admin/trust-documents", icon: FileText },
      { name: "Trust Downloads", href: "/admin/trust-downloads", icon: Download },
      { name: "White Paper", href: "/admin/white-paper", icon: ScrollText },
      { name: "Babylonian Comparison", href: "/admin/babylonian-comparison", icon: Landmark },
    ],
  },
];

function NavSection({
  group,
  isActive,
  onNavigate,
  defaultOpen,
}: {
  group: NavGroup;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // No label = top-level items (Dashboard), always visible
  if (!group.label) {
    return (
      <>
        {group.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
      </>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
      >
        {group.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 mt-0.5">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  // Auto-open groups that contain the active page
  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => isActive(item.href));

  const sidebar = (
    <nav className="flex flex-col gap-2 p-4">
      {adminNavGroups.map((group) => (
        <NavSection
          key={group.label || "_top"}
          group={group}
          isActive={isActive}
          onNavigate={() => setSidebarOpen(false)}
          defaultOpen={isGroupActive(group)}
        />
      ))}
      <div className="border-t my-2" />
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
