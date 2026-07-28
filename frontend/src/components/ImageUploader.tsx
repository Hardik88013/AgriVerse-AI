// Purpose: Component for handling single or multiple image uploads.
// How it works: Accepts a file from the user and passes it to the parent component.

import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
}

const ImageUploader = ({ onImageSelect }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate it's an image
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }

      onImageSelect(file);
      
      // Create a temporary local URL for the preview image
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img src={preview} alt="Farm preview" className="w-full h-48 object-cover" />
          <button 
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
