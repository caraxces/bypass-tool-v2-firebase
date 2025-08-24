// Create Database Schema on Supabase
const https = require('https');

const supabaseUrl = 'https://tfdheobalbfnrluuuhth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZGhlb2JhbGJmbnJsdXV1aHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjYyNjUsImV4cCI6MjA3MTU0MjI2NX0._OfLkhWC_rzV3cPYsBx0s8jClYW_S-tdjaQPLLOid5c';

// SQL to create tables
const createTablesSQL = `
-- Create Tables for Bypass Tool Pro
-- ===== CORE TABLES =====

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role_id TEXT NOT NULL REFERENCES roles(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keywords table
CREATE TABLE IF NOT EXISTS keywords (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    text TEXT NOT NULL,
    project_id TEXT NOT NULL REFERENCES projects(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'checked', 'failed')),
    position INTEGER,
    result_link TEXT,
    last_checked TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(text, project_id)
);

-- Create system_configs table
CREATE TABLE IF NOT EXISTS system_configs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrator with full access', '["*"]'),
('user', 'Regular user with limited access', '["read:own", "write:own", "delete:own"]')
ON CONFLICT (name) DO NOTHING;

-- Insert system configs
INSERT INTO system_configs (key, value, type, description) VALUES
('app_name', 'Bypass Tool Pro', 'string', 'Application name'),
('max_keywords_per_project', '1000', 'number', 'Maximum keywords per project')
ON CONFLICT (key) DO NOTHING;

SELECT 'Database schema created successfully!' as status;
`;

console.log('🗄️ Creating database schema on Supabase...');

// Execute SQL via REST API
const options = {
  hostname: 'tfdheobalbfnrluuuhth.supabase.co',
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  }
};

const postData = JSON.stringify({
  sql: createTablesSQL
});

const req = https.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Database schema created successfully!');
      console.log('Response:', data);
    } else {
      console.log('❌ Failed to create database schema');
      console.log('Response:', data);
      console.log('\n📋 Manual steps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/tfdheobalbfnrluuuhth');
      console.log('2. Click "SQL Editor"');
      console.log('3. Copy and paste the SQL from create-tables.sql');
      console.log('4. Click "Run"');
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
  console.log('\n📋 Manual steps:');
  console.log('1. Go to: https://supabase.com/dashboard/project/tfdheobalbfnrluuuhth');
  console.log('2. Click "SQL Editor"');
  console.log('3. Copy and paste the SQL from create-tables.sql');
  console.log('4. Click "Run"');
});

req.write(postData);
req.end();
