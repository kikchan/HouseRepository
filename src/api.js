const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }

  return response.json();
}

export async function getHouses(query = '') {
  return fetchJson(`/houses${query}`);
}

export async function getHouse(id) {
  return fetchJson(`/houses/${id}`);
}

export async function createHouse(formData) {
  const response = await fetch(`${API_BASE}/houses`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create house');
  }
  return response.json();
}

export async function updateHouse(id, formData) {
  const response = await fetch(`${API_BASE}/houses/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update house');
  }
  return response.json();
}

export async function deleteHouse(id) {
  return fetchJson(`/houses/${id}`, { method: 'DELETE' });
}

export async function toggleVisited(id, visited) {
  const formData = new FormData();
  formData.append('visited', visited ? 'true' : 'false');
  return updateHouse(id, formData);
}
