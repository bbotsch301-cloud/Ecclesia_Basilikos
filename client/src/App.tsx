import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Videos from "@/pages/videos";
import Resources from "@/pages/resources";
import Nation from "@/pages/nation";
import Contact from "@/pages/contact";
import Forum from "@/pages/forum";
import ThreadPage from "@/pages/thread";
import TrustDownload from "@/pages/trust-download";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminContent from "@/pages/admin-content";
import AdminTrustDownloads from "@/pages/admin-trust-downloads";
import AdminVideos from "@/pages/admin-videos";
import AdminDownloads from "@/pages/admin-downloads";
import AdminUsers from "@/pages/admin-users";
import AdminContactMessages from "@/pages/admin-contact-messages";
import NewCovenantIntro from "@/pages/new-covenant-intro";
import Courses from "@/pages/courses";
import MyCourses from "@/pages/my-courses";
import CourseLesson from "@/pages/course-lesson";
import VerifyEmail from "@/pages/verify-email";
import Mandate from "@/pages/mandate";
import Repository from "@/pages/repository";
import Downloads from "@/pages/downloads";
import ProofVault from "@/pages/proof-vault";
import ProofVaultNew from "@/pages/proof-vault-new";
import ProofVaultDetail from "@/pages/proof-vault-detail";
import ProofVaultVerify from "@/pages/proof-vault-verify";
import RequireAdmin from "@/components/RequireAdmin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/mandate" component={Mandate} />
          <Route path="/repository" component={Repository} />
          <Route path="/videos" component={Videos} />
          <Route path="/resources" component={Resources} />
          <Route path="/nation" component={Nation} />
          <Route path="/contact" component={Contact} />
          <Route path="/forum" component={Forum} />
          <Route path="/forum/thread/:threadId" component={ThreadPage} />
          <Route path="/trust-download" component={TrustDownload} />
          <Route path="/downloads" component={Downloads} />
          <Route path="/new-covenant-intro" component={NewCovenantIntro} />
          <Route path="/courses" component={Courses} />
          <Route path="/my-courses" component={MyCourses} />
          <Route path="/course/:courseId" component={CourseLesson} />
          <Route path="/course/:courseId/lesson/:lessonId" component={CourseLesson} />
          <Route path="/verify-email" component={VerifyEmail} />
          {/* Proof Vault routes */}
          <Route path="/proof-vault" component={ProofVault} />
          <Route path="/proof-vault/new" component={ProofVaultNew} />
          <Route path="/proof-vault/proofs/:id" component={ProofVaultDetail} />
          <Route path="/proof-vault/verify" component={ProofVaultVerify} />
          {/* Admin routes - client-side gate + server-side requireAdmin middleware */}
          <Route path="/admin/content">{() => <RequireAdmin><AdminContent /></RequireAdmin>}</Route>
          <Route path="/admin/trust-downloads">{() => <RequireAdmin><AdminTrustDownloads /></RequireAdmin>}</Route>
          <Route path="/admin/videos">{() => <RequireAdmin><AdminVideos /></RequireAdmin>}</Route>
          <Route path="/admin/downloads">{() => <RequireAdmin><AdminDownloads /></RequireAdmin>}</Route>
          <Route path="/admin/users">{() => <RequireAdmin><AdminUsers /></RequireAdmin>}</Route>
          <Route path="/admin/contacts">{() => <RequireAdmin><AdminContactMessages /></RequireAdmin>}</Route>
          <Route path="/admin">{() => <RequireAdmin><AdminDashboard /></RequireAdmin>}</Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
