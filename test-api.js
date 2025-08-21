const testXMLImportAPI = async () => {
  try {
    console.log('🔍 Đang test API XML Import...');
    
    // Test GET endpoint
    console.log('\n1. Testing GET /api/xml-imports/');
    const getResponse = await fetch('http://localhost:3001/api/xml-imports/');
    console.log('Status:', getResponse.status);
    console.log('Headers:', Object.fromEntries(getResponse.headers.entries()));
    
    const getText = await getResponse.text();
    console.log('Response Text:', getText);
    
    try {
      const getData = JSON.parse(getText);
      console.log('✅ GET Response:', getData);
    } catch (parseError) {
      console.log('❌ Không thể parse JSON:', parseError.message);
    }
    
    // Test POST extract endpoint
    console.log('\n2. Testing POST /api/xml-imports/extract');
    const postResponse = await fetch('http://localhost:3001/api/xml-imports/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://ru9.vn',
        xpath: '/html/body/div/p',
        createdBy: 'admin'
      })
    });
    
    console.log('POST Status:', postResponse.status);
    console.log('POST Headers:', Object.fromEntries(postResponse.headers.entries()));
    
    const postText = await postResponse.text();
    console.log('POST Response Text:', postText);
    
    try {
      const postData = JSON.parse(postText);
      console.log('✅ POST Response:', postData);
      
      if (postData.success) {
        console.log('\n🎉 Test thành công! Dữ liệu đã được trích xuất:');
        console.log('URL:', postData.data.url);
        console.log('XPath:', postData.data.xpath);
        console.log('Result:', postData.data.result);
        console.log('Status:', postData.data.status);
      } else {
        console.log('\n❌ Test thất bại:', postData.error);
      }
    } catch (parseError) {
      console.log('❌ Không thể parse POST response JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi test API:', error.message);
  }
};

// Chạy test
testXMLImportAPI();
