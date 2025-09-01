import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X, Maximize2 } from "lucide-react";

interface VirtualTourViewerProps {
  tourUrl: string;
  propertyTitle: string;
  trigger?: React.ReactNode;
}

export function VirtualTourViewer({ tourUrl, propertyTitle, trigger }: VirtualTourViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button 
      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      data-testid="btn-virtual-tour"
    >
      <Eye size={16} />
      Tour Virtual 3D
    </Button>
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || defaultTrigger}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Tour Virtual 3D - {propertyTitle}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(tourUrl, '_blank')}
                  data-testid="btn-fullscreen-tour"
                >
                  <Maximize2 size={16} />
                  Tela Cheia
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  data-testid="btn-close-tour"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 relative">
            <iframe
              src={tourUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={`Tour Virtual 3D - ${propertyTitle}`}
              loading="lazy"
              data-testid="virtual-tour-iframe"
            />
            
            {/* Loading overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Carregando tour virtual...</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface VirtualTourBadgeProps {
  className?: string;
}

export function VirtualTourBadge({ className = "" }: VirtualTourBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium ${className}`}>
      <Eye size={12} />
      Tour 3D
    </div>
  );
}

interface VirtualTourButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary" | "icon";
  className?: string;
}

export function VirtualTourButton({ onClick, variant = "primary", className = "" }: VirtualTourButtonProps) {
  if (variant === "icon") {
    return (
      <button
        onClick={onClick}
        className={`w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 ${className}`}
        data-testid="btn-virtual-tour-icon"
        title="Tour Virtual 3D"
      >
        <Eye size={14} />
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <Button 
        variant="outline"
        onClick={onClick}
        className={`border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center gap-2 ${className}`}
        data-testid="btn-virtual-tour-secondary"
      >
        <Eye size={16} />
        Tour 3D
      </Button>
    );
  }

  return (
    <Button 
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 ${className}`}
      data-testid="btn-virtual-tour-primary"
    >
      <Eye size={16} />
      Tour Virtual 3D
    </Button>
  );
}