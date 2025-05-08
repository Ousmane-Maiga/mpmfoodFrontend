import axios from 'axios';

const BASE_API_URL = process.env.API_URL || 'http://192.168.129.1:3000';

export const login = async (employee_name: string, pin: string) => {
  const response = await axios.post(`${BASE_API_URL}/auth/login`, {
    employee_name,
    pin,
  });
  return response.data;
};