// apiService.js: This file contains the service function for making API calls using Axios. 
// src/api/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost/apicrudphp', // Replace with your API base URL
  baseURL: 'https://medicare-com.stackstaging.com/onlinefashion_apis', // Replace with your API base URL
  timeout: 10000, // Adjust timeout as needed
});

export default instance;