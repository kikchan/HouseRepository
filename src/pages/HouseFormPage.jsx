import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createHouse, getHouse, updateHouse } from '../api.js';

const TYPES = ['apartment', 'house', 'villa', 'studio', 'penthouse'];

export default function HouseFormPage({ editMode }) {
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    title: '',
    link: '',
    location: '',
    type: 'apartment',
    price: '',
    rooms: '',
    bathrooms: '',
    ibiPrice: '',
    communityFee: '',
    visited: false,
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && id) {
      loadHouse();
    }
  }, [editMode, id]);

  const loadHouse = async () => {
    setLoading(true);
    try {
      const house = await getHouse(id);
      setFormValues({
        title: house.title || '',
        link: house.link || '',
        location: house.location || '',
        type: house.type || 'apartment',
        price: house.price || '',
        rooms: house.rooms || '',
        bathrooms: house.bathrooms || '',
        ibiPrice: house.ibiPrice || '',
        communityFee: house.communityFee || '',
        visited: house.visited || false,
        description: house.description || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const required = ['title', 'location', 'type', 'price', 'rooms', 'bathrooms'];
    for (const field of required) {
      if (!formValues[field]) {
        setError('Please fill all required fields.');
        return;
      }
    }

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editMode) {
        await updateHouse(id, formData);
      } else {
        await createHouse(formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{editMode ? 'Edit house' : 'Add new house'}</h1>
            <p className="text-sm text-slate-500">{editMode ? 'Update house details.' : 'Create a new listing.'}</p>
          </div>
        </div>

        {error && <div className="mb-4 rounded-2xl bg-rose-100 p-4 text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title *</span>
              <input
                value={formValues.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Location *</span>
              <input
                value={formValues.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Type *</span>
              <select
                value={formValues.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Link</span>
              <input
                value={formValues.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
                placeholder="https://example.com"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Price *</span>
              <input
                type="number"
                value={formValues.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Rooms *</span>
              <input
                type="number"
                value={formValues.rooms}
                onChange={(e) => handleChange('rooms', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Bathrooms *</span>
              <input
                type="number"
                value={formValues.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">IBI Price</span>
              <input
                type="number"
                value={formValues.ibiPrice}
                onChange={(e) => handleChange('ibiPrice', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Community Fee</span>
              <input
                type="number"
                value={formValues.communityFee}
                onChange={(e) => handleChange('communityFee', e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Visited</span>
              <select
                value={formValues.visited ? 'true' : 'false'}
                onChange={(e) => handleChange('visited', e.target.value === 'true')}
                className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
              >
                <option value="false">Not visited</option>
                <option value="true">Visited</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={formValues.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="4"
              className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-2 w-full"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-700">
              {editMode ? 'Update house' : 'Create house'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
