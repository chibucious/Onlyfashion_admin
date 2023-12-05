// axiosInstance.js: This file should contain the code for creating the Axios instance.
// src/api/apiService.js
import axios from './axiosInstance';

export const fetchData = async (endpoint, headers=null) => {
  try {
    let response;
    if(!headers){
      response = await axios.get(endpoint);
    }else{
      response = await axios.get(endpoint, headers);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.toString());
    return error.response.data;
  }
};

export const postData = async (endpoint, data, headers) => {
  try {
    const response = await axios.post(endpoint, data, headers);
    // console.log("Post Success response ", response);
    return JSON.stringify(response.data);
  } catch (error) {
    let response = error.response;
    if (response.status === 400) {
        throw new Error(JSON.stringify(response.data));
    } else if (response.status === 404) {
        throw new Error('Not Found: ' + JSON.stringify(response.data));
    } else if (response.status === 405) {
      throw new Error(JSON.stringify(response.data));
    } else if (response.status === 500) {
        throw new Error('Server Error: ' + JSON.stringify(response.data));
    } else {
        throw new Error('Unexpected status: ' + response.status);
    }
  }
};

export const putData = async (endpoint, data, headers) => {
  try {
    const response = await axios.put(endpoint, data, headers);
    // console.log("PUT Success response ", response);
    return JSON.stringify(response.data);
  } catch (error) {
    let response = error.response;
    if (response.status === 400) {
        throw new Error(JSON.stringify(response.data));
    } else if (response.status === 404) {
        throw new Error('Not Found: ' + JSON.stringify(response.data));
    } else if (response.status === 500) {
        throw new Error('Server Error: ' + JSON.stringify(response.data));
    } else {
        throw new Error('Unexpected status: ' + response.status);
    }
  }
};

export const deleteData = async (endpoint, headers) => {
  try {
    const response = await axios.delete(endpoint, headers);
    // console.log("Delete Success response ", response);
    return JSON.stringify(response.data);
  } catch (error) {
    let response = error.response;
    if (response && response.status === 400) {
        throw new Error(JSON.stringify(response.data));
    } else if (response.status === 404) {
        throw new Error(JSON.stringify(response.data));
    } else if (response.status === 405) {
        throw new Error(JSON.stringify(response.data));
    } else if (response.status === 500) {
      throw new Error(JSON.stringify(response.data));
    } else {
        throw new Error(JSON.stringify(response.data));
    }
  }
};

