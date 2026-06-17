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

export async function login(username, password) {
  return fetchJson('/auth/login', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
}

export async function getHouses(query = '') {
  return fetchJson(`/houses${query}`, { credentials: 'include' });
}

export async function getHouse(id) {
  return fetchJson(`/houses/${id}`, { credentials: 'include' });
}

export async function createHouse(formData) {
  const response = await fetch(`${API_BASE}/houses`, {
    method: 'POST',
    credentials: 'include',
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
    credentials: 'include',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update house');
  }
  return response.json();
}

export async function deleteHouse(id) {
  return fetchJson(`/houses/${id}`, { method: 'DELETE', credentials: 'include' });
}

export async function toggleVisited(id, visited) {
  const formData = new FormData();
  formData.append('visited', visited ? 'true' : 'false');
  return updateHouse(id, formData);
}
