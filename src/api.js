const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
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
    body: JSON.stringify({ username, password }),
  });
}

export async function setupAdmin(username, password) {
  return fetchJson('/auth/setup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return fetchJson('/auth/logout', { method: 'POST' });
}

export async function me() {
  return fetchJson('/auth/me');
}

export async function firstRun() {
  return fetchJson('/auth/first-run');
}

export async function getUsers() {
  return fetchJson('/auth/users');
}

export async function createUser(username, password, isAdmin = false) {
  return fetchJson('/auth/users', {
    method: 'POST',
    body: JSON.stringify({ username, password, isAdmin }),
  });
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
  return fetchJson(`/houses/${id}`, { method: 'DELETE' });
}

export async function toggleVisited(id, visited) {
  const formData = new FormData();
  formData.append('visited', visited ? 'true' : 'false');
  return updateHouse(id, formData);
}
