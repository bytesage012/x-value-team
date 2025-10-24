import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing, uploadImages } from '../services/api';
import AuthContext from '../context/AuthContext';
import { Select } from '../components/ui/Select';
import { X } from 'lucide-react';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
    year: new Date().getFullYear(),
    mileage: '',
    fuelType: 'petrol',
    transmission: 'manual',
    location: '',
    make: '',
    model: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState(null);

  // Upload files immediately when selected
  const handleFileSelect = async (files) => {
    try {
      setUploadStatus('Uploading...');
      setError(null);
  const uploaded = await uploadImages(files);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploaded]
      }));
      // clear selectedFiles (they are now uploaded)
      setSelectedFiles([]);
      setUploadStatus('Upload complete');
      setTimeout(() => setUploadStatus(''), 2000);
    } catch (err) {
      setError(err?.message || 'Upload failed');
      setUploadStatus('');
    }
  };

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Prevent submitting while uploads are still in progress
    if (uploadStatus === 'Uploading...') {
      setError('Please wait for image uploads to finish before creating the listing.');
      return;
    }
    
    const requiredFields = ['title', 'description', 'price', 'year', 'mileage', 'fuelType', 'transmission', 'location', 'make', 'model'];
    const missingFields = requiredFields.filter(field => {
      const val = formData[field];
      return val === undefined || val === null || String(val).trim() === '';
    });

    if (formData.images.length === 0) {
      missingFields.push('images');
    }

    if (missingFields.length > 0) {
      setError(`Required fields missing: ${missingFields.join(', ')}`);
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      year: Number(formData.year),
      mileage: Number(formData.mileage)
    };

    try {
      setLoading(true);
      await createListing(payload, token);
      navigate('/');
    } catch (err) {
      // Display detailed server validation errors if available
      const resp = err?.response?.data;
      if (resp) {
        if (resp.issues && Array.isArray(resp.issues)) {
          setError(resp.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
        } else if (resp.message) {
          setError(resp.message);
        } else {
          setError(err.message || 'Failed to create listing');
        }
      } else {
        setError(err.message || 'Failed to create listing');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-text">Create Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Title"
            required
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <input 
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="Price"
            type="number"
            required
            min="0"
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        <textarea 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Description"
          required
          className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition h-32"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            value={formData.make}
            onChange={(e) => setFormData({...formData, make: e.target.value})}
            placeholder="Make (e.g., Toyota, Honda)"
            required
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <input 
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
            placeholder="Model (e.g., Camry, Civic)"
            required
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input 
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            placeholder="Year"
            type="number"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <input 
            value={formData.mileage}
            onChange={(e) => setFormData({...formData, mileage: e.target.value})}
            placeholder="Mileage"
            type="number"
            required
            min="0"
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <input 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Location"
            required
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
            value={formData.fuelType}
            onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
            required
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            value={formData.transmission}
            onChange={(e) => setFormData({...formData, transmission: e.target.value})}
            required
            className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          >
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* Styled file picker button */}
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="bg-white border border-gray-200 px-3 py-2 rounded-lg hover:shadow-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-3 7l4-4 4 4 6-6" />
              </svg>
              <span className="text-sm text-gray-700">Upload images</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                setSelectedFiles(prev => [...prev, ...files]);
                // Upload the files immediately
                await handleFileSelect(files);
                // reset input so selecting same file again works
                e.target.value = null;
              }}
              className="hidden"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Render uploaded image tags (URLs) */}
            {formData.images.map((url, index) => (
              <div 
                key={`url-${index}`}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                <img src={url} alt={`img-${index}`} className="w-12 h-8 object-cover rounded" />
                <span className="max-w-[200px] truncate">{url.split('/').pop()}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index)
                    }));
                  }}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Render selected (local) files as tags with preview */}
            {selectedFiles.map((file, idx) => (
              <div key={`file-${idx}`} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-12 h-8 object-cover rounded" />
                <span className="max-w-[160px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                  className="text-gray-500 hover:text-red-500 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {uploadStatus && (
            <p className="text-sm text-primary">{uploadStatus}</p>
          )}
          {formData.images.length > 0 ? (
            <p className="text-sm text-gray-500">
              {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} added
            </p>
          ) : (
            <p className="text-sm text-red-500">At least one image is required</p>
          )}
        </div>

        {error && <div className="text-red-500">{error}</div>}
        
        <div className="flex items-center gap-3">
          <button 
            disabled={loading || uploadStatus === 'Uploading...'} 
            type="submit" 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
          >
            {loading ? 'Creating...' : uploadStatus === 'Uploading...' ? 'Uploading...' : 'Create Listing'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                price: '',
                images: [],
                year: new Date().getFullYear(),
                mileage: '',
                fuelType: 'petrol',
                transmission: 'manual',
                location: '',
                make: '',
                model: ''
              });
              setSelectedFiles([]);
            }} 
            className="border border-gray-200 text-text px-4 py-3 rounded-lg hover:shadow-sm transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
