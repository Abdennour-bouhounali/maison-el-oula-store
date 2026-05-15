const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const testUpload = async () => {
  const url = 'http://localhost:5000/upload?folder=test-product-folder';
  const formData = new FormData();

  // Create a dummy image file for testing
  const dummyFilePath = path.join(__dirname, 'dummy.png');
  fs.writeFileSync(dummyFilePath, 'dummy content');

  formData.append('image', fs.createReadStream(dummyFilePath));

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log('Upload Response:', response.data);

    if (response.data.success && response.data.image.includes('test-product-folder')) {
      console.log('Test Passed: Folder created and image saved correctly.');
    } else {
      console.log('Test Failed: Response unexpected.');
    }
  } catch (error) {
    console.error('Upload Failed:', error.response ? error.response.data : error.message);
  } finally {
    // Clean up dummy file
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
  }
};

testUpload();
