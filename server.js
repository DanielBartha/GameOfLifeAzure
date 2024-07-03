require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const stream = require('stream');

// Application Insights
const appInsights = require('applicationinsights');
const instrumentationKey = process.env.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY;

if (instrumentationKey) {
    appInsights.setup(instrumentationKey).start();
} else {
    console.error('No instrumentation key found in environment variables.');
}

const client = appInsights.defaultClient;

const upload = multer();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-canvas', upload.single('canvasImage'), async (req, res) => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
        const blobName = `gameOfLife-${Date.now()}.png`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        await blockBlobClient.uploadStream(bufferStream, req.file.buffer.length, 5);

        res.json({ message: 'Image uploaded successfully', blobName: blobName });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Example route to track a custom event
app.get('/track-event', (req, res) => {
    if (client) {
        client.trackEvent({ name: 'CustomEvent', properties: { customProperty: 'customValue' } });
    }
    res.send('Event tracked');
});

// Serve index.html as the entry point
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    if (client) {
        client.trackEvent({ name: 'ServerStarted', properties: { port: port } });
    }
});
