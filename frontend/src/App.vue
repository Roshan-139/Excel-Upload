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
        <button @click="ViewData">View Data</button>
      </div>
      <p v-if="message">{{ message }}</p>
      <div v-if="data && data.length">
        <h2>Data from Database:</h2>
        <table>
          <thead>
            <tr>
              <!-- Dynamically generate table headers based on keys of the first object -->
              <th v-for="(value, key) in data[0]" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <!-- Iterate over data to generate table rows -->
            <tr v-for="(item, index) in data" :key="index">
              <td v-for="(value, key) in item" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else-if="data && data.length === 0">No data available.</p>
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
      data: [] // Initialize as an empty array
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
    async ViewData() {
      try {
        const response = await axios.get('http://localhost:3000/database/postgres');
        this.data = response.data; // Assume data is an array of objects
        this.message = 'Data loaded successfully.';
      } catch (error) {
        this.message = `Error fetching data: ${error.message}`;
        console.error(error);
      }
    }
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

table {
  width: 100%;
  border-collapse: collapse; /* Ensure borders are merged */
  margin-top: 20px; /* Add some space above the table */
}

th, td {
  padding: 8px 12px; /* Add padding inside cells */
  border: 1px solid #ddd; /* Light gray border */
  text-align: left; /* Align text to the left */
}

th {
  background-color: #f2f2f2; /* Light gray background for headers */
  font-weight: bold; /* Bold text for headers */
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternating row colors */
}

tr:hover {
  background-color: #f1f1f1; /* Highlight row on hover */
}
</style>
