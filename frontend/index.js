const API_URL = 'https://job-tracker-api-production-7a78.up.railway.app';

function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabs = document.querySelectorAll('.tab');
  const message = document.getElementById('message');

  message.className = 'message';
  message.textContent = '';

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
  }
}

function showMessage(text, type) {
  const message = document.getElementById('message');
  message.textContent = text;
  message.className = `message ${type}`;
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    return showMessage('Please fill in all fields', 'error');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return showMessage(data.error, 'error');
    }

    localStorage.setItem('token', data.token);
    window.location.href = 'pages/dashboard.html';
  } catch (error) {
    showMessage('Something went wrong. Try again.', 'error');
  }
}

async function register() {
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  if (!name || !email || !password) {
    return showMessage('Please fill in all fields', 'error');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return showMessage(data.error, 'error');
    }

    showMessage('Account created! You can now login.', 'success');
    switchTab('login');
  } catch (error) {
    showMessage('Something went wrong. Try again.', 'error');
  }
}