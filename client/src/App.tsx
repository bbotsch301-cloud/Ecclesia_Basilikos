import { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AppErrorBoundary, SectionErrorBoundary } from "@/components/ErrorBoundary";
import RequireAdmin from "@/components/RequireAdmin";
import CookieConsent from "@/components/CookieConsent";

// Eagerly loaded (above-the-fold)
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

// Lazy loaded pages
const About = lazy(() => import("@/pages/about"));
const Videos = lazy(() => import("@/pages/videos"));
const Resources = lazy(() => import("@/pages/resources"));
const Nation = lazy(() => import("@/pages/nation"));
const Contact = lazy(() => import("@/pages/contact"));
const Forum = lazy(() => import("@/pages/forum"));
const ThreadPage = lazy(() => import("@/pages/thread"));
const TrustDownload = lazy(() => import("@/pages/trust-download"));
const NewCovenantIntro = lazy(() => import("@/pages/new-covenant-intro"));
const Courses = lazy(() => import("@/pages/courses"));
const CourseLesson = lazy(() => import("@/pages/course-lesson"));
const VerifyEmail = lazy(() => import("@/pages/verify-email"));
const Mandate = lazy(() => import("@/pages/mandate"));
const LawfulMoney = lazy(() => import("@/pages/lawful-money"));
const TrustAssets = lazy(() => import("@/pages/trust-assets"));
const StatePassport = lazy(() => import("@/pages/state-passport"));
const Repository = lazy(() => import("@/pages/repository"));
const Downloads = lazy(() => import("@/pages/downloads"));
const ProofVault = lazy(() => import("@/pages/proof-vault"));
const ProofVaultNew = lazy(() => import("@/pages/proof-vault-new"));
const ProofVaultDetail = lazy(() => import("@/pages/proof-vault-detail"));
const ProofVaultVerify = lazy(() => import("@/pages/proof-vault-verify"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Welcome = lazy(() => import("@/pages/welcome"));
const Profile = lazy(() => import("@/pages/profile"));
const NewsletterUnsubscribe = lazy(() => import("@/pages/newsletter-unsubscribe"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const PmaAgreement = lazy(() => import("@/pages/pma-agreement"));
const BeneficialUnit = lazy(() => import("@/pages/beneficial-unit"));
const UserProfile = lazy(() => import("@/pages/user-profile"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AdminContent = lazy(() => import("@/pages/admin-content"));
const AdminTrustDownloads = lazy(() => import("@/pages/admin-trust-downloads"));
const AdminVideos = lazy(() => import("@/pages/admin-videos"));
const AdminDownloads = lazy(() => import("@/pages/admin-downloads"));
const AdminUsers = lazy(() => import("@/pages/admin-users"));
const AdminContactMessages = lazy(() => import("@/pages/admin-contact-messages"));
const AdminCourses = lazy(() => import("@/pages/admin-courses"));
const AdminCourseEditor = lazy(() => import("@/pages/admin-course-editor"));
const AdminForum = lazy(() => import("@/pages/admin-forum"));
const AdminNewsletter = lazy(() => import("@/pages/admin-newsletter"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Billing = lazy(() => import("@/pages/billing"));
const AdminSubscribers = lazy(() => import("@/pages/admin-subscribers"));
const AdminTrustStructure = lazy(() => import("@/pages/admin-trust-structure"));
const AdminWhitePaper = lazy(() => import("@/pages/admin-white-paper"));
const AdminTrustDocuments = lazy(() => import("@/pages/admin-trust-documents"));

function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--royal-gold)]" />
    </div>
  );
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-royal-gold focus:text-royal-navy focus:rounded focus:font-semibold">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/lawful-money" component={LawfulMoney} />
            <Route path="/learning-path">{() => <Redirect to="/courses" />}</Route>
            <Route path="/trust-assets" component={TrustAssets} />
            <Route path="/state-passport" component={StatePassport} />
            <Route path="/mandate" component={Mandate} />
            <Route path="/repository" component={Repository} />
            <Route path="/videos" component={Videos} />
            <Route path="/resources" component={Resources} />
            <Route path="/nation" component={Nation} />
            <Route path="/contact" component={Contact} />
            <Route path="/forum">{() => <SectionErrorBoundary><Forum /></SectionErrorBoundary>}</Route>
            <Route path="/forum/thread/:threadId">{() => <SectionErrorBoundary><ThreadPage /></SectionErrorBoundary>}</Route>
            <Route path="/trust-download" component={TrustDownload} />
            <Route path="/downloads" component={Downloads} />
            <Route path="/new-covenant-intro" component={NewCovenantIntro} />
            <Route path="/courses">{() => <SectionErrorBoundary><Courses /></SectionErrorBoundary>}</Route>
            <Route path="/dashboard">{() => <SectionErrorBoundary><Dashboard /></SectionErrorBoundary>}</Route>
            <Route path="/my-courses">{() => <Redirect to="/courses" />}</Route>
            <Route path="/course/:courseId">{() => <SectionErrorBoundary><CourseLesson /></SectionErrorBoundary>}</Route>
            <Route path="/course/:courseId/lesson/:lessonId">{() => <SectionErrorBoundary><CourseLesson /></SectionErrorBoundary>}</Route>
            <Route path="/verify-email" component={VerifyEmail} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/profile" component={Profile} />
            <Route path="/newsletter/unsubscribe" component={NewsletterUnsubscribe} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/pma-agreement" component={PmaAgreement} />
            <Route path="/beneficiary/unit">{() => <SectionErrorBoundary><BeneficialUnit /></SectionErrorBoundary>}</Route>
            <Route path="/pricing" component={Pricing} />
            <Route path="/billing">{() => <SectionErrorBoundary><Billing /></SectionErrorBoundary>}</Route>
            <Route path="/user/:userId" component={UserProfile} />
            {/* Proof Vault routes */}
            <Route path="/proof-vault">{() => <SectionErrorBoundary><ProofVault /></SectionErrorBoundary>}</Route>
            <Route path="/proof-vault/new">{() => <SectionErrorBoundary><ProofVaultNew /></SectionErrorBoundary>}</Route>
            <Route path="/proof-vault/proofs/:id">{() => <SectionErrorBoundary><ProofVaultDetail /></SectionErrorBoundary>}</Route>
            <Route path="/proof-vault/verify">{() => <SectionErrorBoundary><ProofVaultVerify /></SectionErrorBoundary>}</Route>
            {/* Admin routes - client-side gate + server-side requireAdmin middleware */}
            <Route path="/admin/content">{() => <RequireAdmin><SectionErrorBoundary><AdminContent /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/trust-downloads">{() => <RequireAdmin><SectionErrorBoundary><AdminTrustDownloads /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/courses">{() => <RequireAdmin><SectionErrorBoundary><AdminCourseEditor /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/courses/:courseId/edit">{() => <RequireAdmin><SectionErrorBoundary><AdminCourseEditor /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/videos">{() => <RequireAdmin><SectionErrorBoundary><AdminVideos /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/downloads">{() => <RequireAdmin><SectionErrorBoundary><AdminDownloads /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/users">{() => <RequireAdmin><SectionErrorBoundary><AdminUsers /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/forum">{() => <RequireAdmin><SectionErrorBoundary><AdminForum /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/contacts">{() => <RequireAdmin><SectionErrorBoundary><AdminContactMessages /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/newsletter">{() => <RequireAdmin><SectionErrorBoundary><AdminNewsletter /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/subscribers">{() => <RequireAdmin><SectionErrorBoundary><AdminSubscribers /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/trust-structure">{() => <RequireAdmin><SectionErrorBoundary><AdminTrustStructure /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/white-paper">{() => <RequireAdmin><SectionErrorBoundary><AdminWhitePaper /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin/trust-documents">{() => <RequireAdmin><SectionErrorBoundary><AdminTrustDocuments /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route path="/admin">{() => <RequireAdmin><SectionErrorBoundary><AdminDashboard /></SectionErrorBoundary></RequireAdmin>}</Route>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
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
        <AppErrorBoundary>
          <Router />
        </AppErrorBoundary>
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
