
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface AvatarUploadProps {
  previewUrl: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
}

const AvatarUpload = ({ previewUrl, onImageChange, onClearImage }: AvatarUploadProps) => {
  return (
    <>
      {previewUrl ? (
        <div className="relative mx-auto w-24 h-24">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-full"
          />
          <button
            onClick={onClearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <label htmlFor="upload-avatar" className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-6 h-6 mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">Avatar</p>
            </div>
            <input
              id="upload-avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />
          </label>
        </div>
      )}
    </>
  );
};

export default AvatarUpload;
