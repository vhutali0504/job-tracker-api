const API_URL = 'https://job-tracker-api-production-7a78.up.railway.app';

// Redirect to login if no token
const token = localStorage.getItem('token');
if (!token) window.location.href = '../index.html';

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../index.html';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-ZA');
}

async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/api/applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const applications = await response.json();

    if (!response.ok) {
      if (response.status === 401) window.location.href = '../index.html';
      return;
    }

    // Count by status
    const counts = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    applications.forEach(app => {
      if (counts[app.status] !== undefined) counts[app.status]++;
    });

    document.getElementById('appliedCount').textContent = counts.Applied;
    document.getElementById('interviewCount').textContent = counts.Interview;
    document.getElementById('offerCount').textContent = counts.Offer;
    document.getElementById('rejectedCount').textContent = counts.Rejected;

    // Show 5 most recent
    const tbody = document.getElementById('recentApplications');
    const recent = applications.slice(0, 5);

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="empty">No applications yet. <a href="applications.html" style="color:#6366f1">Add one!</a></td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map(app => `
      <tr>
        <td>${app.company}</td>
        <td>${app.role}</td>
        <td><span class="badge ${app.status}">${app.status}</span></td>
        <td>${formatDate(app.date_applied)}</td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

loadDashboard();