import { Link } from "react-router-dom";
import { GatePortal } from '@/components/ui/GatePortal';
import { SystemSigilLogo } from '@/components/ui/SystemSigilLogo';
import { Skull, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Void mist effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-arise/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-shadow-purple/5 rounded-full blur-3xl animate-pulse-glow-delay-1s" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-arise/3 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 grid-pattern" />
      </div>
      
      <div className="text-center max-w-lg mx-auto px-4 relative z-10">
        <div className="mb-8">
          {/* Umbral Ascendant Logo above rift */}
          <div className="flex justify-center mb-6">
            <SystemSigilLogo size="lg" />
          </div>
          
          {/* Rift Portal Graphic - Corrupted/Broken */}
          <div className="flex justify-center mb-8 relative">
            <GatePortal rank="E" className="w-40 h-40 opacity-30 grayscale" animated={false} />
            {/* Broken rift overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Skull className="w-16 h-16 text-arise/50 animate-pulse" />
            </div>
          </div>
          
          {/* System-style error display */}
          <div className="mb-6 p-4 rounded-lg border border-arise/30 bg-arise/5 backdrop-blur-sm">
            <div className="text-xs font-arise text-arise/70 tracking-widest mb-2">
              SYSTEM ERROR
            </div>
            <h1 className="font-arise text-7xl font-bold gradient-text-shadow text-glow-purple tracking-wider">
              404
            </h1>
          </div>
          
          <h2 className="mb-4 font-arise text-2xl font-bold text-foreground tracking-wide">
            RIFT NOT FOUND
          </h2>
          <p className="mb-8 text-lg text-muted-foreground font-heading leading-relaxed">
            This path does not exist in the System's records. 
            Perhaps the <span className="text-arise font-semibold">Prime Architect</span> has sealed this route, 
            or it was lost during the reset.
          </p>
          
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button 
                size="lg"
                className="gap-2 font-heading bg-gradient-to-r from-arise to-shadow-purple hover:shadow-arise/30 hover:shadow-lg transition-all w-full sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2 font-heading border-arise/30 hover:bg-arise/10 hover:border-arise/50 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>
        
        {/* Footer text */}
        <p className="text-xs text-muted-foreground/50 font-heading mt-12">
          "The System sees all... except this page."
        </p>
      </div>
    </div>
  );
};

export default NotFound;


