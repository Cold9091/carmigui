import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{ version?: string; cacheName?: string } | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Detectar quando uma nova versão está instalando
    const checkForUpdates = async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        // Verificar se há uma atualização esperando
        if (registration.waiting) {
          setShowUpdate(true);
        }

        // Listener para novas instalações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      }
    };

    // Listener para mensagens do Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        setUpdateInfo({
          version: event.data.version,
          cacheName: event.data.cacheName
        });
        setShowUpdate(true);
      }
    });

    checkForUpdates();

    // Verificar por atualizações a cada 5 minutos
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration()?.then(reg => reg?.update());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration?.waiting) {
      // Enviar mensagem para o service worker fazer skipWaiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Aguardar o controllerchange e recarregar
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    } else {
      // Forçar recarga imediata
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5" data-testid="update-notification">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg border-0">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Nova versão disponível!</h3>
            <p className="text-sm opacity-90 mb-3">
              Uma atualização está pronta para ser instalada.
              {updateInfo?.version && ` Versão ${updateInfo.version}`}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleUpdate}
                className="gap-2"
                data-testid="button-update-now"
              >
                <RefreshCw className="h-3 w-3" />
                Atualizar agora
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20"
                data-testid="button-dismiss-update"
              >
                Depois
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
