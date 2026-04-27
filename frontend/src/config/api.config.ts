let API_BASE_MEDIA_URL = `${import.meta.env.VITE_API_URL}`;
let API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

if (import.meta.env.DEV) {
  API_BASE_MEDIA_URL = `${import.meta.env.VITE_API_URL}`;
  API_BASE_URL = `${import.meta.env.VITE_API_URL}`;
}

export default API_BASE_URL;
export { API_BASE_MEDIA_URL };
