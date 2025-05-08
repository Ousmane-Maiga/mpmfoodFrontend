import axios from 'axios';

const API_BASE_URL = 'http://192.168.129.1:3000/api';

export const loginEmployee = async (employee_name: string, pin: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { employee_name, pin });
  return response.data; // should be { id, role }
};
