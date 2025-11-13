import axios from 'axios';
import { getAuth } from 'firebase/auth';

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const useAxios = () => {

  apiAxios.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(); 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return apiAxios;
};

export default useAxios;
