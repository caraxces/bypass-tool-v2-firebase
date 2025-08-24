// Test Supabase Connection - Simple Version
const https = require('https');

const supabaseUrl = 'https://tfdheobalbfnrluuuhth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZGhlb2JhbGJmbnJsdXV1aHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjYyNjUsImV4cCI6MjA3MTU0MjI2NX0._OfLkhWC_rzV3cPYsBx0s8jClYW_S-tdjaQPLLOid5c';

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

// Test 1: Check if project is accessible
const options = {
  hostname: 'tfdheobalbfnrluuuhth.supabase.co',
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Project is accessible via REST API');
      console.log('Response:', data.substring(0, 200) + '...');
    } else {
      console.log('❌ Project not accessible via REST API');
      console.log('Response:', data);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
});

req.end();
