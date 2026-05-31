const apiBase = '/api';
const tokenKey = 'reading_list_token';

const state = {
  token: localStorage.getItem(tokenKey) || null,
  user: null,
  sortByUser: false
};

const elements = {
  loginForm: document.getElementById('login-form'),
  signupForm: document.getElementById('signup-form'),
  showLogin: document.getElementById('show-login'),
  showSignup: document.getElementById('show-signup'),
  bookForm: document.getElementById('book-form'),
  bookList: document.getElementById('book-list'),
  userPanel: document.getElementById('user-panel'),
  loadAllBooks: document.getElementById('load-all-books'),
  loadMyBooks: document.getElementById('load-my-books'),
  sortUser: document.getElementById('sort-user'),
  userFilter: document.getElementById('user-filter'),
  toast: document.getElementById('toast')
};

const showToast = (message, duration = 3000) => {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => elements.toast.classList.remove('show'), duration);
};

const fetchJson = async (url, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

const setUserPanel = () => {
  if (!state.user) {
    elements.userPanel.innerHTML = '<span>Not signed in</span>';
    return;
  }

  elements.userPanel.innerHTML = `
    <span><strong>${state.user.name}</strong> (${state.user.role})</span>
    <button type="button" id="logout-button">Logout</button>
  `;

  document.getElementById('logout-button').addEventListener('click', () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem(tokenKey);
    setUserPanel();
    showToast('Logged out');
  });
};

const toggleAuthTab = (showLogin) => {
  elements.showLogin.classList.toggle('active', showLogin);
  elements.showSignup.classList.toggle('active', !showLogin);
  elements.loginForm.classList.toggle('hidden', !showLogin);
  elements.signupForm.classList.toggle('hidden', showLogin);
};

const loadCurrentUser = async () => {
  if (!state.token) {
    setUserPanel();
    return;
  }

  try {
    const data = await fetchJson(`${apiBase}/auth/me`);
    state.user = data.user;
    setUserPanel();
    await loadUserOptions();
  } catch (error) {
    state.token = null;
    localStorage.removeItem(tokenKey);
    state.user = null;
    setUserPanel();
  }
};

const loadUserOptions = async () => {
  if (!state.token) return;
  try {
    const data = await fetchJson(`${apiBase}/users`);
    elements.userFilter.innerHTML = '<option value="">All users</option>';

    data.users.forEach((user) => {
      const option = document.createElement('option');
      option.value = user._id;
      option.textContent = `${user.name} (${user.email})`;
      elements.userFilter.appendChild(option);
    });
  } catch (error) {
    console.warn('Could not load user list', error.message);
  }
};

const renderBooks = (books) => {
  if (!books.length) {
    elements.bookList.innerHTML = '<p>No books found.</p>';
    return;
  }

  elements.bookList.innerHTML = books
    .map((book) => {
      const username = book.user ? `${book.user.name} (${book.user.email})` : 'Unknown user';
      return `
        <article class="book-card">
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>ISBN:</strong> ${book.isbn}</p>
          <p><strong>Genre:</strong> ${book.genre || 'N/A'}</p>
          <p><strong>Published:</strong> ${book.publishedYear || 'N/A'}</p>
          <p><strong>Added by:</strong> ${username}</p>
        </article>
      `;
    })
    .join('');
};

const loadBooks = async (filter = {}) => {
  const query = new URLSearchParams();

  if (filter.user) {
    query.set('user', filter.user);
  }

  if (state.sortByUser) {
    query.set('sortBy', 'user');
  }

  const url = `${apiBase}/books?${query.toString()}`;

  try {
    const data = await fetchJson(url);
    renderBooks(data.books);
  } catch (error) {
    showToast(error.message);
  }
};

const handleAuthSubmit = async (event, type) => {
  event.preventDefault();

  const body = {
    email: document.getElementById(`${type}-email`).value.trim(),
    password: document.getElementById(`${type}-password`).value.trim()
  };

  if (type === 'signup') {
    body.name = document.getElementById('signup-name').value.trim();
  }

  try {
    const data = await fetchJson(`${apiBase}/auth/${type}`, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    state.token = data.token;
    localStorage.setItem(tokenKey, state.token);
    state.user = data.user;
    setUserPanel();
    await loadUserOptions();
    showToast(`Welcome, ${state.user.name}!`);
    loadBooks();
  } catch (error) {
    showToast(error.message);
  }
};

const handleBookSubmit = async (event) => {
  event.preventDefault();

  if (!state.token) {
    showToast('You must be logged in to add a book');
    return;
  }

  const book = {
    title: document.getElementById('book-title').value.trim(),
    author: document.getElementById('book-author').value.trim(),
    isbn: document.getElementById('book-isbn').value.trim(),
    genre: document.getElementById('book-genre').value.trim(),
    publishedYear: Number(document.getElementById('book-year').value) || undefined
  };

  try {
    await fetchJson(`${apiBase}/books`, {
      method: 'POST',
      body: JSON.stringify(book)
    });
    showToast('Book added successfully');
    event.target.reset();
    loadBooks({ user: elements.userFilter.value });
  } catch (error) {
    showToast(error.message);
  }
};

const init = () => {
  elements.showLogin.addEventListener('click', () => toggleAuthTab(true));
  elements.showSignup.addEventListener('click', () => toggleAuthTab(false));
  elements.loginForm.addEventListener('submit', (event) => handleAuthSubmit(event, 'login'));
  elements.signupForm.addEventListener('submit', (event) => handleAuthSubmit(event, 'signup'));
  elements.bookForm.addEventListener('submit', handleBookSubmit);
  elements.loadAllBooks.addEventListener('click', () => {
    elements.userFilter.value = '';
    state.sortByUser = false;
    loadBooks();
  });
  elements.loadMyBooks.addEventListener('click', () => {
    if (!state.user) {
      showToast('Login to view your books');
      return;
    }
    elements.userFilter.value = state.user.id || '';
    state.sortByUser = false;
    loadBooks({ user: state.user.id });
  });
  elements.sortUser.addEventListener('click', () => {
    state.sortByUser = !state.sortByUser;
    elements.sortUser.textContent = state.sortByUser ? 'Sorted by User' : 'Sort by User';
    loadBooks({ user: elements.userFilter.value });
  });
  elements.userFilter.addEventListener('change', () => {
    loadBooks({ user: elements.userFilter.value });
  });

  setUserPanel();
  loadCurrentUser();
  loadBooks();
};

init();
