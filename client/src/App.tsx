import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

function Header() {
  return (
    <header className="border-b dark:border-gray-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold text-github-dark dark:text-github-darkmode-text">GitHub Repository Language Analyzer</h1>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-8 py-6 border-t dark:border-gray-700">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>GitHub Repository Language Analyzer</p>
        <p className="mt-2">
          Created by <a 
            href="https://github.com/ChristianDeoManlangit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Christian Deo Manlangit
          </a>
        </p>
        <p className="mt-1">Data is fetched from the GitHub API. Usage limits may apply.</p>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-[#1a2230] text-github-dark dark:text-github-darkmode-text transition-colors duration-200">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
