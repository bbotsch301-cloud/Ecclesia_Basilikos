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
import AdminDashboard from "@/pages/admin-dashboard";
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
