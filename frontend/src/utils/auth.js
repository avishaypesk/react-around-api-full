const BASE_URL = 'https://avishaypeskaround.students.nomoredomainssbs.ru';

const handleResponse = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));


const register = (user) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: user.password, email: user.email }),
  }).then(handleResponse);
};

const authenticate = (user) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: user.password, email: user.email }),
  }).then(handleResponse);
};

const validateToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};

export { authenticate, register, validateToken };
