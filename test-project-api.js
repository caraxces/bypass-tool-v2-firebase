const testProjectAPI = async () => {
  try {
    console.log('🚀 Đang test API Project...');
    
    // Test 1: GET /api/projects
    console.log('\n1. Testing GET /api/projects');
    const getResponse = await fetch('http://localhost:3001/api/projects');
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData);
    
    if (getData.success) {
      console.log('📚 Danh sách dự án hiện tại:', getData.data.length);
    }
    
    // Test 2: POST /api/projects - Tạo dự án mới
    console.log('\n2. Testing POST /api/projects - Tạo dự án mới');
    const createResponse = await fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Website Ru9.vn Test',
        domain: 'https://ru9.vn',
        description: 'Website bán chăn ga gối đệm chất lượng cao'
      })
    });
    
    const createData = await createResponse.json();
    console.log('✅ Create Response:', createData);
    
    if (createData.success) {
      console.log('🎉 Dự án đã được tạo thành công:');
      console.log('- ID:', createData.data.id);
      console.log('- Tên:', createData.data.name);
      console.log('- Domain:', createData.data.domain);
      console.log('- Mô tả:', createData.data.description);
      console.log('- Trạng thái:', createData.data.status);
    } else {
      console.log('❌ Tạo dự án thất bại:', createData.error);
    }
    
    // Test 3: GET /api/projects sau khi tạo
    console.log('\n3. Testing GET /api/projects sau khi tạo');
    const finalGetResponse = await fetch('http://localhost:3001/api/projects');
    const finalGetData = await finalGetResponse.json();
    console.log('✅ Final GET Response:', finalGetData);
    
    if (finalGetData.success) {
      console.log('📚 Danh sách dự án sau khi tạo:', finalGetData.data.length);
      finalGetData.data.forEach((project, index) => {
        console.log(`${index + 1}. ${project.name} - ${project.domain} - ${project.status}`);
      });
    }
    
    console.log('\n🎉 Test hoàn tất! API Project đang hoạt động tốt!');
    
  } catch (error) {
    console.error('❌ Lỗi khi test API Project:', error.message);
  }
};

// Chạy test
testProjectAPI();
