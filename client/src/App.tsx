import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Education from "@/pages/education";
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
import NewCovenantIntro from "@/pages/new-covenant-intro";
import Courses from "@/pages/courses";
import MyCourses from "@/pages/my-courses";
import CourseLesson from "@/pages/course-lesson";
import VerifyEmail from "@/pages/verify-email";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/education" component={Education} />
          <Route path="/videos" component={Videos} />
          <Route path="/resources" component={Resources} />
          <Route path="/nation" component={Nation} />
          <Route path="/contact" component={Contact} />
          <Route path="/forum" component={Forum} />
          <Route path="/forum/thread/:threadId" component={ThreadPage} />
          <Route path="/trust-download" component={TrustDownload} />
          <Route path="/new-covenant-intro" component={NewCovenantIntro} />
          <Route path="/courses" component={Courses} />
          <Route path="/my-courses" component={MyCourses} />
          <Route path="/course/:courseId" component={CourseLesson} />
          <Route path="/course/:courseId/lesson/:lessonId" component={CourseLesson} />
          <Route path="/verify-email" component={VerifyEmail} />
          <Route path="/admin/content" component={AdminContent} />
          <Route path="/admin/trust-downloads" component={AdminTrustDownloads} />
          <Route path="/admin/videos" component={AdminVideos} />
          <Route path="/admin" component={AdminDashboard} />
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
