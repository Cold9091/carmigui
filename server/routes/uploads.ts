import type { Express } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

// Security: Validate file magic bytes (file signatures) to detect disguised malicious files
async function validateImageMagicBytes(filePath: string): Promise<boolean> {
  try {
    const fileHandle = await fs.open(filePath, 'r');
    const buffer = Buffer.alloc(12);
    await fileHandle.read(buffer, 0, 12, 0);
    await fileHandle.close();

    // Check magic bytes for common image formats
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return true;
    }
    
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
        buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
      return true;
    }
    
    // GIF: 47 49 46 38 (GIF8)
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
      return true;
    }
    
    // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF....WEBP)
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error validating magic bytes:', error);
    return false;
  }
}

// Security: Validate image using sharp to ensure it's a valid, processable image
async function validateImageWithSharp(filePath: string): Promise<boolean> {
  try {
    const metadata = await sharp(filePath).metadata();
    
    // Ensure image has valid dimensions
    if (!metadata.width || !metadata.height) {
      return false;
    }
    
    // Ensure dimensions are reasonable (not too small or suspiciously large)
    if (metadata.width < 1 || metadata.height < 1 || 
        metadata.width > 20000 || metadata.height > 20000) {
      return false;
    }
    
    // Ensure format is one we expect
    const allowedFormats = ['jpeg', 'png', 'gif', 'webp'];
    if (!metadata.format || !allowedFormats.includes(metadata.format)) {
      return false;
    }
    
    return true;
  } catch (error) {
    // If sharp can't process it, it's not a valid image
    return false;
  }
}

export function registerUploadRoutes(app: Express) {
  // Configure multer for file uploads
  const storage_multer = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads', 'images');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error instanceof Error ? error : new Error('Failed to create upload directory'), uploadDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `image-${uniqueSuffix}${ext}`);
    }
  });

  const upload = multer({
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
      }
    }
  });

  // Image upload routes with comprehensive security validation
  app.post('/api/upload/images', upload.array('images', 10), async (req, res) => {
    const filesToCleanup: string[] = [];
    
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
      }

      const uploadedFiles = await Promise.all(
        req.files.map(async (file: Express.Multer.File) => {
          const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
          const originalPath = file.path;
          const fileNameWithoutExt = path.parse(file.filename).name;
          const webpFilename = `${fileNameWithoutExt}.webp`;
          const webpPath = path.join(uploadsDir, webpFilename);

          try {
            // Security: Validate magic bytes to detect disguised malicious files
            const validMagicBytes = await validateImageMagicBytes(originalPath);
            if (!validMagicBytes) {
              filesToCleanup.push(originalPath);
              throw new Error(`File ${file.originalname} failed magic bytes validation. Invalid or potentially malicious file.`);
            }

            // Security: Validate with sharp to ensure it's a legitimate, processable image
            const validImage = await validateImageWithSharp(originalPath);
            if (!validImage) {
              filesToCleanup.push(originalPath);
              throw new Error(`File ${file.originalname} failed image validation. Corrupted or invalid image format.`);
            }

            // Convert to WebP with optimization
            await sharp(originalPath)
              .resize(1920, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .webp({ 
                quality: 80,
                effort: 6
              })
              .toFile(webpPath);

            return {
              filename: file.filename,
              originalName: file.originalname,
              size: file.size,
              url: `/uploads/images/${file.filename}`,
              webp: {
                filename: webpFilename,
                url: `/uploads/images/${webpFilename}`
              }
            };
          } catch (conversionError) {
            filesToCleanup.push(originalPath);
            if (conversionError instanceof Error && conversionError.message.includes('validation')) {
              throw conversionError;
            }
            throw new Error(`Failed to process image ${file.originalname}. File may be corrupted or in an unsupported format.`);
          }
        })
      );

      res.json({
        success: true,
        message: `${uploadedFiles.length} image(s) uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      // Security: Automatic cleanup of files that failed validation
      for (const filePath of filesToCleanup) {
        try {
          await fs.unlink(filePath);
        } catch (cleanupError) {
          console.error('Error cleaning up invalid file:', cleanupError);
        }
      }

      console.error('Error uploading images:', error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to upload images',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete image route
  app.delete('/api/upload/images/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      
      // Security: Validate filename pattern to prevent path traversal
      const filenamePattern = /^image-\d+-\d+\.(jpg|jpeg|png|gif|webp)$/i;
      if (!filenamePattern.test(filename)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid filename format' 
        });
      }
      
      // Safely construct file path
      const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
      const filePath = path.join(uploadsDir, filename);
      
      // Ensure the resolved path is still within uploads/images
      const normalizedPath = path.normalize(filePath);
      if (!normalizedPath.startsWith(uploadsDir)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid file path' 
        });
      }
      
      try {
        // Delete original file
        await fs.unlink(normalizedPath);
        
        // Try to delete WebP version if it exists
        const fileNameWithoutExt = path.parse(filename).name;
        const webpFilename = `${fileNameWithoutExt}.webp`;
        const webpPath = path.join(uploadsDir, webpFilename);
        
        try {
          await fs.unlink(webpPath);
        } catch (webpError) {
          // Ignore if WebP doesn't exist
          if ((webpError as any).code !== 'ENOENT') {
            console.warn('Error deleting WebP version:', webpError);
          }
        }
        
        res.json({ 
          success: true, 
          message: 'Image deleted successfully' 
        });
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          return res.status(404).json({ 
            success: false, 
            message: 'Image not found' 
          });
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete image',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
