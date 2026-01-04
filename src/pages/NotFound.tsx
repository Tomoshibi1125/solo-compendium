import { Link } from "react-router-dom";
import { GatePortal } from '@/components/ui/GatePortal';

const NotFound = () => {

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow-delay-1s" />
      </div>
      
      <div className="text-center max-w-md mx-auto px-4 relative z-10">
        <div className="mb-8">
          {/* Gate Portal Graphic */}
          <div className="flex justify-center mb-6">
            <GatePortal rank="E" className="w-32 h-32 opacity-50" animated={true} />
          </div>
          
          <h1 className="mb-4 font-display text-6xl font-bold gradient-text-shadow text-glow-purple">404</h1>
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">GATE NOT FOUND</h2>
          <p className="mb-6 text-lg text-muted-foreground font-heading">
            This path does not exist in the System's records. 
            Perhaps the Shadow Monarch has sealed this route, or it was lost in the reset.
          </p>
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 py-3 font-heading font-semibold hover:bg-primary/90 transition-colors"
        >
          Return to the Compendium
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
