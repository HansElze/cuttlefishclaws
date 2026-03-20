import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Home from "@/pages/home";
import About from "@/pages/about";
import Portfolio from "@/pages/portfolio";
import Technology from "@/pages/technology";
import WhitePaper from "@/pages/whitepaper";
import Community from "@/pages/community";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import CuttlefishAISidebar from "@/components/cuttlefish-ai-sidebar";
import FloatingChatButton from "@/components/floating-chat-button";
import VaultAdminPanel from "@/pages/admin/vault";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/technology" component={Technology} />
      <Route path="/whitepaper" component={WhitePaper} />
      <Route path="/community" component={Community} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin/vault" component={VaultAdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
      <FloatingChatButton 
        onClick={() => setIsSidebarOpen(true)}
        isOpen={isSidebarOpen}
      />
      <CuttlefishAISidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </TooltipProvider>
  );
}

export default App;
