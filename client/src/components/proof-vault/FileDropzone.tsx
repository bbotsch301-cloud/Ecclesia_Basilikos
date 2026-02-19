import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, CheckCircle2 } from "lucide-react";

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear?: () => void;
  accept?: string;
  maxSizeMb?: number;
  compact?: boolean;
  className?: string;
}

export function FileDropzone({
  file,
  onFileSelect,
  onFileClear,
  accept,
  maxSizeMb = 50,
  compact = false,
  className = "",
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        if (droppedFile.size > maxSizeMb * 1024 * 1024) {
          return;
        }
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect, maxSizeMb]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileClear?.();
  };

  const padding = compact ? "p-4" : "p-8";
  const iconSize = compact ? "w-8 h-8" : "w-10 h-10";

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl ${padding} text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-royal-gold bg-royal-gold/5 scale-[1.01]"
          : "border-gray-300 dark:border-gray-600 hover:border-royal-gold/50"
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      {file ? (
        <div>
          <CheckCircle2 className={`${iconSize} text-green-500 mx-auto mb-3`} />
          <p className="font-medium text-royal-navy dark:text-gray-200">
            {file.name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
            {file.type ? ` - ${file.type}` : ""}
          </p>
          {onFileClear && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
              onClick={handleClear}
            >
              Change file
            </Button>
          )}
        </div>
      ) : (
        <div>
          <Upload
            className={`${iconSize} text-gray-400 mx-auto mb-3 transition-transform duration-200 ${
              isDragging ? "scale-110 text-royal-gold" : ""
            }`}
          />
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            {isDragging ? "Drop file here" : "Drag & drop or click to select"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Max {maxSizeMb} MB - Any file type
          </p>
        </div>
      )}
    </div>
  );
}
