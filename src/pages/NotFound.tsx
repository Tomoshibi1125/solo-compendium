import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-4 font-display text-6xl font-bold gradient-text-shadow text-glow-purple">404</h1>
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">GATE NOT FOUND</h2>
          <p className="mb-6 text-lg text-muted-foreground font-heading">
            This path does not exist in the System's records. 
            Perhaps the Shadow Monarch has sealed this route, or it was lost in the reset.
          </p>
        </div>
        <a 
          href="/" 
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 py-3 font-heading font-semibold hover:bg-primary/90 transition-colors"
        >
          Return to the Compendium
        </a>
      </div>
    </div>
  );
};

export default NotFound;
