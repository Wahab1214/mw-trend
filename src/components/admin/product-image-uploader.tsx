'use client';

import * as React from 'react';
import { ProductImage } from '@/types';
import { UploadCloud, Trash2, Star, Plus, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

// Client-side image compression using HTML5 Canvas (high quality, ultra lightweight)
async function compressImageFile(file: File, maxWidth = 900, maxHeight = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image processing error'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsDataURL(file);
  });
}

export function ProductImageUploader({ images, onChange, maxImages = 6 }: ProductImageUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [manualUrl, setManualUrl] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      alert(`You can upload a maximum of ${maxImages} images per product.`);
      return;
    }

    const filesToProcess = fileArray.slice(0, availableSlots);
    setIsProcessing(true);

    try {
      const newImages: ProductImage[] = [];
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const compressedBase64 = await compressImageFile(file);
        newImages.push({
          id: `img_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          product_id: '',
          image_url: compressedBase64,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          sort_order: images.length + i + 1,
          is_primary: images.length === 0 && i === 0,
        });
      }

      onChange([...images, ...newImages]);
    } catch {
      alert('Failed to process image files.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDeleteImage = (id: string) => {
    const remaining = images.filter((img) => img.id !== id);
    // If the primary image was deleted, make the first one primary
    if (remaining.length > 0 && !remaining.some((img) => img.is_primary)) {
      remaining[0].is_primary = true;
    }
    onChange(remaining);
  };

  const handleSetPrimary = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      is_primary: img.id === id,
    }));
    // Sort so primary is first
    const primary = updated.find((img) => img.is_primary);
    const others = updated.filter((img) => !img.is_primary);
    onChange(primary ? [primary, ...others] : updated);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const newImage: ProductImage = {
      id: `img_url_${Date.now()}`,
      product_id: '',
      image_url: manualUrl.trim(),
      sort_order: images.length + 1,
      is_primary: images.length === 0,
    };

    onChange([...images, newImage]);
    setManualUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-[#A8A29A] uppercase tracking-wider">
            Product Photos ({images.length}/{maxImages})
          </label>
          <p className="text-[11px] text-text-muted mt-0.5">
            Apne mobile ya PC se product ki 1 se 6 tak HD photos upload karein. Pehli photo Cover Photo banegi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-gold hover:underline flex items-center gap-1 font-medium"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Cancel Link' : '+ Add via Link'}</span>
        </button>
      </div>

      {/* Manual URL input toggle */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="flex gap-2 p-3 rounded-xl bg-elevated/50 border border-border">
          <Input
            placeholder="Paste image link: https://..."
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="text-xs h-9"
          />
          <Button type="submit" variant="gold" size="sm" className="shrink-0 text-xs font-bold">
            Add
          </Button>
        </form>
      )}

      {/* Upload Drag & Drop Box */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-gold bg-gold/10 scale-[1.01]'
              : 'border-[#333333] hover:border-gold/50 bg-[#141414] hover:bg-[#181818]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-text-primary">
                {isProcessing ? 'Processing photos...' : 'Click to Upload or Drag Photos Here'}
              </p>
              <p className="text-[11px] text-text-secondary">
                PNG, JPG, WEBP • Mobile Camera &amp; Gallery supported • Max {maxImages} photos
              </p>
            </div>

            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider">
              Browse Files (Choose 1 to {maxImages - images.length} photos)
            </span>
          </div>
        </div>
      )}

      {/* Uploaded Photos Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {images.map((img, index) => {
            const isPrimary = img.is_primary || index === 0;
            return (
              <div
                key={img.id}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-black group transition-all ${
                  isPrimary ? 'border-gold shadow-gold-glow' : 'border-border hover:border-gold/40'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt={img.alt_text || `Product photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover Badge */}
                {isPrimary ? (
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-gold text-black text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md z-10">
                    <Star className="w-2.5 h-2.5 fill-black" />
                    <span>Cover</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 hover:bg-gold text-white hover:text-black text-[9px] font-medium transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Make this the main cover photo"
                  >
                    Set Cover
                  </button>
                )}

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-text-muted hover:text-red-400 hover:bg-black transition-colors z-10"
                  title="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Photo sequence index */}
                <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-[#A8A29A]">
                  #{index + 1}
                </span>
              </div>
            );
          })}

          {/* Add more button if less than maxImages */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-[#2E2E2E] hover:border-gold/50 bg-[#121212] flex flex-col items-center justify-center gap-1 text-text-muted hover:text-gold transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-medium">+ Add Photo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
