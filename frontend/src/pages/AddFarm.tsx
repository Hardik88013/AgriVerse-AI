// Purpose: Multi-step wizard to register a new farm.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapSelector from '../components/MapSelector';
import ImageUploader from '../components/ImageUploader';
import api from '../services/api';

const AddFarm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for all 5 steps
  const [formData, setFormData] = useState({
    name: '', village: '', district: '', state: '', pinCode: '',
    area: '', unit: 'Acres', irrigationType: 'Drip', waterSource: 'Well', farmType: 'Conventional',
    soilType: 'Loamy', pH: '', nitrogen: '', phosphorus: '', potassium: '', organicCarbon: '',
    previousCrop: '', currentCrop: ''
  });
  
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);
  
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!position) {
      alert("Please select a location on the map.");
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. Create Farm Document
      const farmPayload = {
        ...formData,
        area: parseFloat(formData.area) || 0,
        pH: parseFloat(formData.pH) || null,
        nitrogen: parseFloat(formData.nitrogen) || null,
        phosphorus: parseFloat(formData.phosphorus) || null,
        potassium: parseFloat(formData.potassium) || null,
        organicCarbon: parseFloat(formData.organicCarbon) || null,
        location: {
          type: "Point",
          coordinates: [position[1], position[0]] // GeoJSON expects [lng, lat]
        }
      };
      
      const response = await api.post('/farms/', farmPayload);
      const farmId = response.data.id;
      
      // 2. Upload Image if exists
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        await api.post(`/farms/${farmId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Failed to save farm.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Register New Farm</h1>
          <p className="text-gray-500">Step {step} of 5</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
          </div>
        </div>

        {/* STEP 1: Basic Details & Location */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Details & Location</h2>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Farm Name" className="w-full p-2 border rounded" required />
            <div className="grid grid-cols-2 gap-4">
              <input name="village" value={formData.village} onChange={handleChange} placeholder="Village" className="p-2 border rounded" />
              <input name="district" value={formData.district} onChange={handleChange} placeholder="District" className="p-2 border rounded" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="p-2 border rounded" />
              <input name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="PIN Code" className="p-2 border rounded" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location (GPS)</label>
              <MapSelector position={position} setPosition={setPosition} />
            </div>
          </div>
        )}

        {/* STEP 2: Farm Information */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Farm Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="area" type="number" value={formData.area} onChange={handleChange} placeholder="Area (Size)" className="p-2 border rounded" />
              <select name="unit" value={formData.unit} onChange={handleChange} className="p-2 border rounded">
                <option value="Acres">Acres</option>
                <option value="Hectares">Hectares</option>
              </select>
              <input name="irrigationType" value={formData.irrigationType} onChange={handleChange} placeholder="Irrigation Type (e.g. Drip)" className="p-2 border rounded" />
              <input name="waterSource" value={formData.waterSource} onChange={handleChange} placeholder="Water Source (e.g. Canal)" className="p-2 border rounded" />
              <select name="farmType" value={formData.farmType} onChange={handleChange} className="p-2 border rounded col-span-2">
                <option value="Conventional">Conventional</option>
                <option value="Organic">Organic</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Soil Information */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Soil Health (Optional)</h2>
            <input name="soilType" value={formData.soilType} onChange={handleChange} placeholder="Soil Type (e.g. Black, Alluvial)" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-4">
              <input name="pH" type="number" step="0.1" value={formData.pH} onChange={handleChange} placeholder="pH Level" className="p-2 border rounded" />
              <input name="nitrogen" type="number" value={formData.nitrogen} onChange={handleChange} placeholder="Nitrogen (N)" className="p-2 border rounded" />
              <input name="phosphorus" type="number" value={formData.phosphorus} onChange={handleChange} placeholder="Phosphorus (P)" className="p-2 border rounded" />
              <input name="potassium" type="number" value={formData.potassium} onChange={handleChange} placeholder="Potassium (K)" className="p-2 border rounded" />
            </div>
          </div>
        )}

        {/* STEP 4: Crop History */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Crop History</h2>
            <input name="previousCrop" value={formData.previousCrop} onChange={handleChange} placeholder="Previous Crop" className="w-full p-2 border rounded" />
            <input name="currentCrop" value={formData.currentCrop} onChange={handleChange} placeholder="Current Crop (If planted)" className="w-full p-2 border rounded" />
          </div>
        )}

        {/* STEP 5: Images */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Farm Photos</h2>
            <ImageUploader onImageSelect={setImage} />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <button 
            disabled={step === 1} 
            onClick={handlePrev}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
          
          {step < 5 ? (
            <button 
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-bold"
            >
              {isLoading ? 'Saving...' : 'Submit Farm'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddFarm;
