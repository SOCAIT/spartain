// verify_health_data.js - Run this script to manually check if data was written
const axios = require('axios');

const BACKEND_URL = 'http://your-backend-url.com'; // Update with your backend URL
const AUTH_TOKEN = 'your-auth-token'; // Replace with actual token

async function verifyHealthData() {
  try {
    console.log('🔍 Checking server health...');
    
    // 1. Check server health
    const healthCheck = await axios.get(`${BACKEND_URL}/api/v1/health`, {
      timeout: 5000
    });
    console.log('✅ Server is healthy:', healthCheck.data);

    // 2. Get storage statistics
    const statsResponse = await axios.get(`${BACKEND_URL}/api/v1/ml-training-data/stats/storage`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      timeout: 10000
    });
    console.log('📊 Storage stats:', statsResponse.data);

    // 3. Check MySQL health (if available)
    const mysqlHealth = await axios.get(`${BACKEND_URL}/api/v1/mysql/health`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      timeout: 5000
    });
    console.log('🗄️ MySQL health:', mysqlHealth.data);

    // 4. List database tables
    const tables = await axios.get(`${BACKEND_URL}/api/v1/mysql/tables`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      timeout: 10000
    });
    console.log('📋 Available tables:', tables.data);

  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the verification
verifyHealthData(); 