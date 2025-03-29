
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Create abort controller for cancelling any pending requests
    abortControllerRef.current = new AbortController();
    
    // Use a timeout to ensure DOM is fully ready before mounting
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    return () => {
      clearTimeout(timeout);
      setIsMounted(false);
      // Cancel any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleNavigate = (path: string) => {
    // Only navigate if component is still mounted
    if (isMounted) {
      navigate(path);
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-gradient-to-b from-background to-muted/30 pt-20 pb-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="heading-1 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Secure Checklist & Signature System
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A streamlined solution for managing checklists and electronic signatures with ease.
              </p>
            </div>
            <div className="space-x-4">
              <Button
                className="px-8 h-11"
                onClick={() => handleNavigate(isAuthenticated ? '/dashboard' : '/login')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "User Management",
                description: "Easily manage administrators and clients with role-based access.",
                icon: (
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )
              },
              {
                title: "Digital Checklists",
                description: "Create, manage, and track checklists throughout the entire lifecycle.",
                icon: (
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect height="4" rx="1" width="6" x="9" y="3" />
                    <path d="m9 14 2 2 4-4" />
                  </svg>
                )
              },
              {
                title: "Electronic Signatures",
                description: "Securely capture electronic signatures with timestamp and IP verification.",
                icon: (
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.5 3.5c1.9 0 3.5 1.6 3.5 3.5 0 1.9-1.6 3.5-3.5 3.5-1.9 0-3.5-1.6-3.5-3.5 0-1.9 1.6-3.5 3.5-3.5Z" />
                    <path d="M14.5 16.5c4.7 0 8.5-3.8 8.5-8.5 0-4.7-3.8-8.5-8.5-8.5-4.7 0-8.5 3.8-8.5 8.5 0 4.7 3.8 8.5 8.5 8.5Z" />
                    <path d="M3.375 20.833c1.74-1.11 3.99-1.833 6.417-1.833 5.04 0 9.333 2.649 9.333 6m-1.5-3.01v6.3l2.893-2.893" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div key={`feature-${index}`} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3">
                  {feature.icon}
                </div>
                <h3 className="heading-3">{feature.title}</h3>
                <p className="text-center text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-2 mb-6">Ready to simplify your checklist process?</h2>
            <p className="mb-8 text-muted-foreground md:text-lg">
              Our system streamlines the entire process from creation to signature collection and completion tracking.
            </p>
            <Button 
              size="lg" 
              className="px-8 h-11"
              onClick={() => handleNavigate(isAuthenticated ? '/dashboard' : '/login')}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
