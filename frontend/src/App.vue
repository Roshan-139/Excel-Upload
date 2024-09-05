<template>
  <div>
    <header class="page-header">
      <h1>Excel File Upload</h1>
    </header>
    <main>
      <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
      <button @click="uploadFile" :disabled="!file">Upload</button>
      <button @click="downloadShipmentsFile">Download Sample</button>
      <p v-if="message">{{ message }}</p>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      message: ''
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
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.message = response.data;
      } catch (error) {
        this.message = 'Error uploading file. Please try again.';
        console.error(error);
      }
    },
    downloadShipmentsFile() {
      const link = document.createElement('a');
      link.href = 'http://localhost:3001/files/sample-file.xlsx';
      link.download = 'sample-file.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.page-header {
  background-color: #d4edda; /* Light green color */
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #c3e6cb;
}

main {
  padding: 20px;
}
</style>
