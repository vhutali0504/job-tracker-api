const API_URL = 'https://job-tracker-api-production-7a78.up.railway.app';

const token = localStorage.getItem('token');
if (!token) window.location.href = '../index.html';

let editingId = null;

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../index.html';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-ZA');
}

function openModal(app = null) {
  editingId = app ? app.id : null;
  document.getElementById('modalTitle').textContent = app ? 'Edit Application' : 'Add Application';
  document.getElementById('company').value = app ? app.company : '';
  document.getElementById('role').value = app ? app.role : '';
  document.getElementById('status').value = app ? app.status : 'Applied';
  document.getElementById('dateApplied').value = app ? (app.date_applied ? app.date_applied.split('T')[0] : '') : '';
  document.getElementById('notes').value = app ? app.notes || '' : '';

  document.getElementById('modal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
}

async function loadApplications() {
  try {
    const response = await fetch(`${API_URL}/api/applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      window.location.href = '../index.html';
      return;
    }

    const applications = await response.json();
    const tbody = document.getElementById('applicationsList');

    if (applications.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty">No applications yet. Click "Add Application" to get started!</td></tr>`;
      return;
    }

    tbody.innerHTML = applications.map(app => `
      <tr>
        <td>${app.company}</td>
        <td>${app.role}</td>
        <td><span class="badge ${app.status}">${app.status}</span></td>
        <td>${formatDate(app.date_applied)}</td>
        <td>${app.notes || '—'}</td>
        <td>
          <button class="action-btn edit" onclick='editApplication(${JSON.stringify(app)})'>Edit</button>
          <button class="action-btn delete" onclick="deleteApplication(${app.id})">Delete</button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error loading applications:', error);
  }
}

function editApplication(app) {
  openModal(app);
}

async function saveApplication() {
  const company = document.getElementById('company').value;
  const role = document.getElementById('role').value;
  const status = document.getElementById('status').value;
  const date_applied = document.getElementById('dateApplied').value;
  const notes = document.getElementById('notes').value;

  if (!company || !role) {
    alert('Company and role are required');
    return;
  }

  const body = { company, role, status, date_applied, notes };
  const url = editingId
    ? `${API_URL}/api/applications/${editingId}`
    : `${API_URL}/api/applications`;
  const method = editingId ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error);
      return;
    }

    closeModal();
    loadApplications();
  } catch (error) {
    console.error('Error saving application:', error);
  }
}

async function deleteApplication(id) {
  if (!confirm('Are you sure you want to delete this application?')) return;

  try {
    const response = await fetch(`${API_URL}/api/applications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) loadApplications();
  } catch (error) {
    console.error('Error deleting application:', error);
  }
}

loadApplications();