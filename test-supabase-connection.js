// Test Supabase Connection
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://tfdheobalbfnrluuuhth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZGhlb2JhbGJmbnJsdXV1aHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjYyNjUsImV4cCI6MjA3MTU0MjI2NX0._OfLkhWC_rzV3cPYsBx0s8jClYW_S-tdjaQPLLOid5c';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey.substring(0, 20) + '...');
  
  try {
    // Test 1: Basic connection
    console.log('\n📡 Test 1: Basic connection...');
    const { data, error } = await supabase.from('system_configs').select('*').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      
      // Test 2: Check if table exists
      console.log('\n📋 Test 2: Check available tables...');
      const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
      
      if (tablesError) {
        console.log('❌ Cannot get tables:', tablesError.message);
        
        // Test 3: Check project status
        console.log('\n🌐 Test 3: Check project status...');
        const response = await fetch(supabaseUrl + '/rest/v1/', {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.ok) {
          console.log('✅ Project is accessible via REST API');
        } else {
          console.log('❌ Project not accessible via REST API');
        }
      } else {
        console.log('✅ Available tables:', tables);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('Data:', data);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

// Run test
testConnection();
