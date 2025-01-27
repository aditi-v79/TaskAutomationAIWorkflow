import axios from 'axios';
import { workflowApi } from './workflowApi.ts';
import { taskApi } from './taskApi.ts';

const BASE_URL = 'http://localhost:8000/api'; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default {
  workflows: workflowApi,
  tasks: taskApi
};
