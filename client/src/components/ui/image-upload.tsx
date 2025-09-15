import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedImage {
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({ 
  value = [], 
  onChange, 
  maxImages = 10, 
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = async (files: FileList) => {
    if (disabled || isUploading) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: `${file.name} não é uma imagem válida`,
          variant: 'destructive',
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: 'Arquivo muito grande',
          description: `${file.name} excede o limite de 5MB`,
          variant: 'destructive',
        });
        return false;
      }
      
      return true;
    });

    if (value.length + validFiles.length > maxImages) {
      toast({
        title: 'Muitas imagens',
        description: `Máximo de ${maxImages} imagens permitidas`,
        variant: 'destructive',
      });
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload');
      }

      const result = await response.json();
      
      if (result.success && result.files) {
        const newUrls = result.files.map((file: UploadedImage) => file.url);
        onChange([...value, ...newUrls]);
        
        toast({
          title: 'Upload realizado',
          description: `${result.files.length} imagem(ns) carregada(s) com sucesso`,
        });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: 'Erro no upload',
        description: 'Falha ao fazer upload das imagens',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (urlToRemove: string) => {
    if (disabled || isUploading) return;

    try {
      // Extract filename from URL
      const filename = urlToRemove.split('/').pop();
      if (filename) {
        const response = await fetch(`/api/upload/images/${filename}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao deletar imagem');
        }
        
        // Only remove from state if deletion was successful
        onChange(value.filter(url => url !== urlToRemove));
        
        toast({
          title: 'Imagem removida',
          description: 'Imagem deletada com sucesso',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      toast({
        title: 'Erro ao deletar',
        description: error instanceof Error ? error.message : 'Falha ao deletar imagem',
        variant: 'destructive',
      });
    }
  };

  const openFileSelector = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileSelector}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            {isUploading ? 'Fazendo upload...' : 'Clique ou arraste imagens aqui'}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, GIF até 5MB ({value.length}/{maxImages})
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
        data-testid="input-file-upload"
      />

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative overflow-hidden rounded-md">
                  <img
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTk5OTkiPkVycm8gYW8gY2FycmVnYXIgaW1hZ2VtPC90ZXh0Pjwvc3ZnPg==';
                    }}
                    data-testid={`preview-image-${index}`}
                  />
                  {!(disabled || isUploading) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(url);
                      }}
                      data-testid={`button-remove-image-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Button (alternative to drag & drop) */}
      {!(disabled || isUploading) && value.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileSelector}
          disabled={isUploading}
          className="w-full"
          data-testid="button-select-images"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          {isUploading ? 'Fazendo upload...' : 'Selecionar Imagens'}
        </Button>
      )}
    </div>
  );
}