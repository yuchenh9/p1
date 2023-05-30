const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Use cors middleware to enable cors
app.use(cors());

app.use(express.static('AssetBundles'));  // Serve files from the AssetBundles directory

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
