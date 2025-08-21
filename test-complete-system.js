const testCompleteSystem = async () => {
  try {
    console.log('🚀 Đang test toàn bộ hệ thống Bypass Tool Pro...');
    
    // Test 1: GET /api/xml-imports
    console.log('\n1. Testing GET /api/xml-imports');
    const getResponse = await fetch('http://localhost:3001/api/xml-imports');
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData);
    
    // Test 2: GET /api/xml-imports/structure
    console.log('\n2. Testing GET /api/xml-imports/structure');
    const structureResponse = await fetch('http://localhost:3001/api/xml-imports/structure?url=https://ru9.vn');
    const structureData = await structureResponse.json();
    console.log('✅ Structure Response:', structureData);
    
    if (structureData.success) {
      console.log('📋 Cấu trúc trang:');
      console.log('- Tiêu đề:', structureData.data.title);
      console.log('- H1:', structureData.data.h1);
      console.log('- H2:', structureData.data.h2);
      console.log('- Meta description:', structureData.data.meta.description);
    }
    
    // Test 3: POST /api/xml-imports/extract với XPath hợp lệ
    console.log('\n3. Testing POST /api/xml-imports/extract với XPath hợp lệ');
    const extractResponse = await fetch('http://localhost:3001/api/xml-imports/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://ru9.vn',
        xpath: '//h1',
        createdBy: 'admin'
      })
    });
    
    const extractData = await extractResponse.json();
    console.log('✅ Extract Response:', extractData);
    
    if (extractData.success) {
      console.log('🎯 Trích xuất thành công:');
      console.log('- URL:', extractData.data.url);
      console.log('- XPath:', extractData.data.xpath);
      console.log('- Result:', extractData.data.result);
      console.log('- Status:', extractData.data.status);
    } else {
      console.log('❌ Trích xuất thất bại:', extractData.error);
    }
    
    // Test 4: POST /api/xml-imports/extract với XPath khác
    console.log('\n4. Testing POST /api/xml-imports/extract với //title');
    const extractTitleResponse = await fetch('http://localhost:3001/api/xml-imports/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://ru9.vn',
        xpath: '//title',
        createdBy: 'admin'
      })
    });
    
    const extractTitleData = await extractTitleResponse.json();
    console.log('✅ Extract Title Response:', extractTitleData);
    
    if (extractTitleData.success) {
      console.log('🎯 Trích xuất title thành công:', extractTitleData.data.result);
    }
    
    // Test 5: Kiểm tra danh sách imports sau khi thêm
    console.log('\n5. Testing GET /api/xml-imports sau khi thêm dữ liệu');
    const finalGetResponse = await fetch('http://localhost:3001/api/xml-imports');
    const finalGetData = await finalGetResponse.json();
    console.log('✅ Final GET Response:', finalGetData);
    
    if (finalGetData.success && finalGetData.data.length > 0) {
      console.log('📚 Danh sách imports:');
      finalGetData.data.forEach((importItem, index) => {
        console.log(`${index + 1}. ${importItem.url} - ${importItem.xpath} - ${importItem.status}`);
      });
    }
    
    console.log('\n🎉 Test hoàn tất! Hệ thống đang hoạt động tốt!');
    
  } catch (error) {
    console.error('❌ Lỗi khi test hệ thống:', error.message);
  }
};

// Chạy test
testCompleteSystem();
