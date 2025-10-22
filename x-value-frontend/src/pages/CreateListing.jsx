import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../services/api';
import AuthContext from '../context/AuthContext';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title || !description || !price) {
      setError('Title, description and price are required');
      return;
    }

    const payload = {
      title,
      description,
      price: Number(price),
      images: images ? images.split(',').map((s) => s.trim()) : [],
    };

    try {
      setLoading(true);
      await createListing(payload, token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-text">Create Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition h-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" />
          <input value={images} onChange={(e) => setImages(e.target.value)} placeholder="Image URLs (comma separated)" className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex items-center gap-3">
          <button disabled={loading} type="submit" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">{loading ? 'Creating...' : 'Create Listing'}</button>
          <button type="button" onClick={() => { setTitle(''); setDescription(''); setPrice(''); setImages(''); }} className="border border-gray-200 text-text px-4 py-3 rounded-lg hover:shadow-sm transition">Clear</button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
