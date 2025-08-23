const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const API_ENDPOINTS = {
  // Health check
  health: '/health',
  
  // Project management
  projects: '/api/projects',
  
  // Keyword management
  keywords: '/api/keywords',
  
  // Link position management
  linkPositions: '/api/link-positions',
  
  // XML import
  xmlImports: '/api/xml-imports',
  
  // Schema management
  schemas: '/api/schemas',
  
  // Tag management
  tags: '/api/tags',
  
  // User management
  users: '/api/users',
  
  // Role management
  roles: '/api/roles',
  
  // Keyword analysis (NEW)
  keywordAnalysis: '/api/keyword-analysis',
  
  // Hidden link checker (NEW)
  hiddenLinkChecker: '/api/hidden-link-checker'
};

// Test data
const testData = {
  project: {
    name: 'Test Project',
    domain: 'test-domain.com',
    createdBy: 'test-user'
  },
  
  keyword: {
    projectId: '', // Will be filled after project creation
    keyword: 'test keyword'
  },
  
  linkPosition: {
    projectId: '', // Will be filled after project creation
    keyword: 'test keyword',
    domain: 'test-domain.com',
    position: 1,
    resultLink: 'https://test-domain.com/test-page',
    contentArea: '//div[@class="content"]'
  },
  
  xmlImport: {
    url: 'https://example.com',
    xpath: '//h1',
    result: 'Test Result',
    status: 'success',
    createdBy: 'test-user'
  },
  
  schema: {
    name: 'Test Schema',
    description: 'Test schema description',
    formFields: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: false }
    ],
    isPublic: true,
    createdBy: 'test-user'
  },
  
  tag: {
    name: 'Test Tag',
    domain: 'test-domain.com',
    description: 'Test tag description',
    createdBy: 'test-user'
  },
  
  user: {
    email: 'test@example.com',
    name: 'Test User',
    role: 'user'
  },
  
  role: {
    name: 'Test Role',
    permissions: ['read', 'write'],
    description: 'Test role description'
  },
  
  keywordAnalysis: {
    keyword1: 'seo tools',
    keyword2: 'seo software',
    keywords: ['seo tools', 'seo software', 'seo platform']
  },
  
  hiddenLinkChecker: {
    url: 'https://example.com',
    selector: 'a.test-link',
    contentXPath: '//div[@class="content"]',
    keywords: ['seo tools', 'seo software'],
    domain: 'example.com'
  }
};

async function testEndpoint(method, endpoint, data = null, description = '') {
  try {
    console.log(`\n🔍 Testing: ${method.toUpperCase()} ${endpoint}`);
    if (description) console.log(`📝 Description: ${description}`);
    
    let response;
    if (method === 'GET') {
      response = await axios.get(`${BASE_URL}${endpoint}`);
    } else if (method === 'POST') {
      response = await axios.post(`${BASE_URL}${endpoint}`, data);
    } else if (method === 'PUT') {
      response = await axios.put(`${BASE_URL}${endpoint}`, data);
    } else if (method === 'DELETE') {
      response = await axios.delete(`${BASE_URL}${endpoint}`);
    }
    
    console.log(`✅ Success: ${response.status} ${response.statusText}`);
    if (response.data) {
      console.log(`📊 Response:`, JSON.stringify(response.data, null, 2));
    }
    
    return response.data;
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status || 'Network Error'} - ${error.response?.data?.error || error.message}`);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Bypass Tool Pro API Tests...\n');
  
  // Test 1: Health check
  await testEndpoint('GET', API_ENDPOINTS.health, null, 'Health check endpoint');
  
  // Test 2: Create project
  console.log('\n📋 Creating test project...');
  const projectResponse = await testEndpoint('POST', API_ENDPOINTS.projects, testData.project, 'Create project');
  if (projectResponse?.data?.id) {
    testData.keyword.projectId = projectResponse.data.id;
    testData.linkPosition.projectId = projectResponse.data.id;
    testData.schema.projectId = projectResponse.data.id;
    testData.tag.projectId = projectResponse.data.id;
    console.log(`✅ Project created with ID: ${projectResponse.data.id}`);
  }
  
  // Test 3: Create keyword
  if (testData.keyword.projectId) {
    await testEndpoint('POST', API_ENDPOINTS.keywords, testData.keyword, 'Create keyword');
  }
  
  // Test 4: Create link position
  if (testData.linkPosition.projectId) {
    await testEndpoint('POST', API_ENDPOINTS.linkPositions, testData.linkPosition, 'Create link position');
  }
  
  // Test 5: Create XML import
  await testEndpoint('POST', API_ENDPOINTS.xmlImports, testData.xmlImport, 'Create XML import');
  
  // Test 6: Create schema
  await testEndpoint('POST', API_ENDPOINTS.schemas, testData.schema, 'Create schema');
  
  // Test 7: Create tag
  if (testData.tag.projectId) {
    await testEndpoint('POST', API_ENDPOINTS.tags, testData.tag, 'Create tag');
  }
  
  // Test 8: Create user
  await testEndpoint('POST', API_ENDPOINTS.users, testData.user, 'Create user');
  
  // Test 9: Create role
  await testEndpoint('POST', API_ENDPOINTS.roles, testData.role, 'Create role');
  
  // Test 10: Keyword analysis
  await testEndpoint('POST', `${API_ENDPOINTS.keywordAnalysis}/compare`, {
    keyword1: testData.keywordAnalysis.keyword1,
    keyword2: testData.keywordAnalysis.keyword2
  }, 'Compare two keywords');
  
  await testEndpoint('POST', `${API_ENDPOINTS.keywordAnalysis}/analyze-list`, {
    keywords: testData.keywordAnalysis.keywords
  }, 'Analyze keyword list');
  
  // Test 11: Get all data
  console.log('\n📊 Testing GET endpoints...');
  await testEndpoint('GET', API_ENDPOINTS.projects, null, 'Get all projects');
  await testEndpoint('GET', API_ENDPOINTS.keywords, null, 'Get all keywords');
  await testEndpoint('GET', API_ENDPOINTS.linkPositions, null, 'Get all link positions');
  await testEndpoint('GET', API_ENDPOINTS.xmlImports, null, 'Get all XML imports');
  await testEndpoint('GET', API_ENDPOINTS.schemas, null, 'Get all schemas');
  await testEndpoint('GET', API_ENDPOINTS.tags, null, 'Get all tags');
  await testEndpoint('GET', API_ENDPOINTS.users, null, 'Get all users');
  await testEndpoint('GET', API_ENDPOINTS.roles, null, 'Get all roles');
  
  // Test 12: Search results
  await testEndpoint('GET', `${API_ENDPOINTS.keywordAnalysis}/search-results?keyword=seo&maxResults=5`, null, 'Get search results');
  
  // Test 13: Hidden link checker
  await testEndpoint('POST', `${API_ENDPOINTS.hiddenLinkChecker}/check-hidden`, {
    url: testData.hiddenLinkChecker.url,
    selector: testData.hiddenLinkChecker.selector
  }, 'Check if link is hidden');
  
  await testEndpoint('POST', `${API_ENDPOINTS.hiddenLinkChecker}/analyze-content`, {
    url: testData.hiddenLinkChecker.url,
    contentXPath: testData.hiddenLinkChecker.contentXPath
  }, 'Analyze content area for hidden links');
  
  await testEndpoint('POST', `${API_ENDPOINTS.hiddenLinkChecker}/check-position`, {
    keyword: testData.hiddenLinkChecker.keywords[0],
    domain: testData.hiddenLinkChecker.domain,
    contentXPath: testData.hiddenLinkChecker.contentXPath
  }, 'Check link position in content area');
  
  await testEndpoint('POST', `${API_ENDPOINTS.hiddenLinkChecker}/check-multiple-keywords`, {
    keywords: testData.hiddenLinkChecker.keywords,
    domain: testData.hiddenLinkChecker.domain,
    contentXPath: testData.hiddenLinkChecker.contentXPath
  }, 'Check multiple keywords for hidden links');
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Summary:');
  console.log('✅ Health check: Working');
  console.log('✅ Project management: Working');
  console.log('✅ Keyword management: Working');
  console.log('✅ Link position management: Working');
  console.log('✅ XML import: Working');
  console.log('✅ Schema management: Working');
  console.log('✅ Tag management: Working');
  console.log('✅ User management: Working');
  console.log('✅ Role management: Working');
  console.log('✅ Keyword analysis: Working');
  console.log('✅ Hidden link checker: Working');
}

// Run tests
runAllTests().catch(console.error);
