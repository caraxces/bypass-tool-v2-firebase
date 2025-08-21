const testWebsiteStructure = async () => {
  try {
    console.log('🔍 Đang kiểm tra cấu trúc website ru9.vn...');
    
    // Test POST extract endpoint với các XPath khác nhau
    const xpaths = [
      '/html/body/div/p',
      '/html/body/p',
      '/html/body/div',
      '/html/body',
      '//p',
      '//div',
      '//h1',
      '//title',
      '//body//text()'
    ];
    
    for (const xpath of xpaths) {
      console.log(`\n--- Testing XPath: ${xpath} ---`);
      
      try {
        const response = await fetch('http://localhost:3001/api/xml-imports/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: 'https://ru9.vn',
            xpath: xpath,
            createdBy: 'admin'
          })
        });
        
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        
        if (data.success) {
          console.log('✅ Thành công!');
          console.log('Result:', data.data.result);
          console.log('Status:', data.data.status);
        } else {
          console.log('❌ Thất bại:', data.error);
        }
        
      } catch (error) {
        console.log('❌ Lỗi:', error.message);
      }
      
      // Đợi một chút giữa các request
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi test:', error.message);
  }
};

// Chạy test
testWebsiteStructure();
