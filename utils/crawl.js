import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API base URL
export const crawlPost = async (url) => {
  try {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
          'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7', 
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', 
        }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};