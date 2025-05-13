import axios from 'axios';

const API_BASE_URL = 'http://192.168.129.1:3000/api';

export const loginEmployee = async (employee_name: string, pin: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { employee_name, pin });
  return response.data; // should be { id, role }
};


// Add these to your existing api.ts
export const getEmployees = async () => {
  const response = await axios.get(`${API_BASE_URL}/employees`);
  return response.data;
};

export const getEmployeeDetails = async (employeeId: string) => {
  const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}`);
  return response.data;
};

export const updateEmployee = async (employeeId: string, employeeData: any) => {
  const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, employeeData);
  return response.data;
};

export const getEmployeeSchedule = async (employeeId: string) => {
  const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/schedule`);
  return response.data;
};

export const updateEmployeeSchedule = async (employeeId: string, scheduleData: any) => {
  const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}/schedule`, scheduleData);
  return response.data;
};

export const deleteEmployee = async (employeeId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);
  
  if (response.status === 403) {
    throw new Error('Admin employees cannot be deleted');
  }
  
  return response.data;
};