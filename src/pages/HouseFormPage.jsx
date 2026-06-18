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
    size:'',
    visitedDate:'',
    visited: false,
    description: '',
    pros: '',
    cons: '',
    agentName: '',
    agentPhone: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fieldClass = 'coast-field mt-2 w-full rounded-xl px-4 py-3';
  const labelClass = 'text-sm font-medium text-teal-900';

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
        pros: house.pros || '',
        cons: house.cons || '',
        agentName: house.agentName || '',
        agentPhone: house.agentPhone || '',
        size: house.size || '',
        visitedDate: house.visitedDate ? house.visitedDate.substring(0,16):'',
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

  const handlePasteImage = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes('image/png') || item.types.includes('image/jpeg') || item.types.includes('image/webp')) {
          const blob = await item.getType(item.types.find(t => t.startsWith('image/')));
          const file = new File([blob], `pasted-${Date.now()}.${blob.type.split('/')[1]}`, { type: blob.type });
          setImageFile(file);
          setError('');
          return;
        }
      }
      setError('No image found in clipboard');
    } catch (err) {
      setError('Failed to read clipboard. Make sure clipboard access is allowed.');
    }
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
    <div className="coast-page px-4 py-6">
      <div className="coast-panel mx-auto max-w-4xl p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-teal-950">{editMode ? 'Edit house' : 'Add new house'}</h1>
            <p className="text-sm text-teal-700">{editMode ? 'Update house details.' : 'Create a new listing.'}</p>
          </div>
        </div>

        {error && <div className="mb-4 rounded-2xl bg-rose-100 p-4 text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Title *</span>
              <input
                value={formValues.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Location *</span>
              <input
                value={formValues.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Type *</span>
              <select
                value={formValues.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={fieldClass}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Link</span>
              <input
                value={formValues.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className={fieldClass}
                placeholder="https://example.com"
              />
            </label>
          </div><label className='block'><span className={labelClass}>Size (m2)</span><input type='number' value={formValues.size} onChange={(e)=>handleChange('size',e.target.value)} className={fieldClass}/></label><label className='block'><span className={labelClass}>Visited Date</span><input type='datetime-local' value={formValues.visitedDate} onChange={(e)=>handleChange('visitedDate',e.target.value)} className={fieldClass}/></label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className={labelClass}>Price *</span>
              <input
                type="number"
                value={formValues.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Rooms *</span>
              <input
                type="number"
                value={formValues.rooms}
                onChange={(e) => handleChange('rooms', e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Bathrooms *</span>
              <input
                type="number"
                value={formValues.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className={labelClass}>IBI Price</span>
              <input
                type="number"
                value={formValues.ibiPrice}
                onChange={(e) => handleChange('ibiPrice', e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Community Fee</span>
              <input
                type="number"
                value={formValues.communityFee}
                onChange={(e) => handleChange('communityFee', e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Visited</span>
              <select
                value={formValues.visited ? 'true' : 'false'}
                onChange={(e) => handleChange('visited', e.target.value === 'true')}
                className={fieldClass}
              >
                <option value="false">Not visited</option>
                <option value="true">Visited</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Description</span>
            <textarea
              value={formValues.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="4"
              className={fieldClass}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Pros</span>
              <textarea
                value={formValues.pros}
                onChange={(e) => handleChange('pros', e.target.value)}
                rows="4"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Cons</span>
              <textarea
                value={formValues.cons}
                onChange={(e) => handleChange('cons', e.target.value)}
                rows="4"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Agent Name</span>
              <input
                value={formValues.agentName}
                onChange={(e) => handleChange('agentName', e.target.value)}
                className={fieldClass}
                placeholder="John Doe"
              />
            </label>
            <label className="block">
              <span className={labelClass}>Agent Phone</span>
              <input
                value={formValues.agentPhone}
                onChange={(e) => handleChange('agentPhone', e.target.value)}
                className={fieldClass}
                placeholder="+34 123 456 789"
              />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Image</span>
            <div className="mt-2 space-y-3">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={handlePasteImage}
                  className="rounded-2xl bg-sky-700 px-4 py-3 text-sm text-white hover:bg-sky-600 whitespace-nowrap"
                >
                  Paste
                </button>
              </div>
              {imageFile && <p className="text-sm text-teal-700">Selected: {imageFile.name}</p>}
            </div>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="coast-button-primary rounded-2xl px-5 py-3">
              {editMode ? 'Update house' : 'Create house'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="coast-button-secondary rounded-2xl px-5 py-3">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
