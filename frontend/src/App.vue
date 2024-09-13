<template>
  <div>
    <header class="page-header">
      <h1>Excel File Upload</h1>
    </header>
    <main>
      <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
      <div class="button-container">
        <button @click="uploadFile" :disabled="!file">Upload</button>
        <button @click="downloadShipmentsFile">Download Sample</button>
        <!-- <button @click="viewPostgresData">View PostgreSQL Data</button>
        <button @click="viewMongoData">View MongoDB Data</button> -->
      </div>
      <p v-if="message">{{ message }}</p>
      <div v-if="data">
        <h2>Data from Database:</h2>
        <pre>{{ data }}</pre>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      message: '',
      data: null // New data property to store database contents
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      if (!this.file) {
        this.message = 'Please select a file first.';
        return;
      }
      const formData = new FormData();
      formData.append('file', this.file);
      try {
        const response = await axios.post('http://localhost:3000/excelHandler/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.message = response.data.message || 'File uploaded successfully!';
      } catch (error) {
        if (error.response) {
          this.message = `Error: ${error.response.data.message || 'An error occurred'}`;
        } else if (error.request) {
          this.message = 'No response received from server.';
        } else {
          this.message = `Error: ${error.message}`;
        }
        console.error(error);
      }
    },
    downloadShipmentsFile() {
      const link = document.createElement('a');
      link.href = 'http://localhost:3000/files/samplefile.xlsx';
      link.download = 'sample-file.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // async viewPostgresData() {
    //   try {
    //     const response = await axios.get('http://localhost:3000/database/postgres');
    //     this.data = response.data;
    //     this.message = 'PostgreSQL data loaded successfully.';
    //   } catch (error) {
    //     this.message = `Error fetching PostgreSQL data: ${error.message}`;
    //     console.error(error);
    //   }
    // },
    // async viewMongoData() {
    //   try {
    //     const response = await axios.get('http://localhost:3000/database/mongodb');
    //     this.data = response.data;
    //     this.message = 'MongoDB data loaded successfully.';
    //   } catch (error) {
    //     this.message = `Error fetching MongoDB data: ${error.message}`;
    //     console.error(error);
    //   }
    // }
  }
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
}

.page-header {
  background-color: #28a745; /* Green color */
  color: white; /* White text color for better contrast */
  padding: 20px;
  width: 100%; /* Ensure full width */
  height: 80px; /* Set height for the header */
  box-sizing: border-box; /* Include padding and border in element's total width and height */
  position: fixed; /* Fix header to the top */
  top: 0; /* Align to the top of the viewport */
  left: 0; /* Align to the left edge */
  z-index: 1000; /* Ensure it stays above other content */
  display: flex; /* Use flexbox for alignment */
  align-items: center; /* Center content vertically */
  justify-content: center; /* Center content horizontally */
}

main {
  padding: 100px 20px 20px; /* Adjust top padding to account for fixed header */
}

.button-container {
  margin: 20px 0; /* Add margin to separate from other elements */
  display: flex; /* Use flexbox to align buttons */
  gap: 10px; /* Space between buttons */
  justify-content: center; /* Center buttons horizontally */
}

button {
  padding: 10px 20px; /* Add padding for better button appearance */
  border: none;
  border-radius: 4px; /* Optional: round the corners */
  background-color: #007bff; /* Blue background color */
  color: white; /* White text color */
  cursor: pointer; /* Change cursor to pointer on hover */
}

button:disabled {
  background-color: #ccc; /* Gray background for disabled state */
  cursor: not-allowed; /* Change cursor to not-allowed on disabled state */
}

button:hover:not(:disabled) {
  background-color: #0056b3; /* Darker blue background on hover */
}

pre {
  background-color: #f8f9fa; /* Light gray background for preformatted text */
  padding: 10px;
  border: 1px solid #ddd; /* Light gray border */
  border-radius: 4px; /* Round the corners */
  overflow-x: auto; /* Horizontal scroll if content is too wide */
}
</style>
