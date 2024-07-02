const express = require('express');
const app = express();
const path = require('path');

// Application Insights
const appInsights = require('applicationinsights');
appInsights.setup('InstrumentationKey=64eb3960-7db4-47fe-a824-5948f9946969;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;ApplicationId=a42788e4-2239-470c-b7ff-71d8656079a6').start();
const client = appInsights.defaultClient;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Example route to track a custom event
app.get('/track-event', (req, res) => {
    client.trackEvent({ name: 'CustomEvent', properties: { customProperty: 'customValue' } });
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
    client.trackEvent({ name: 'ServerStarted', properties: { port: port } });
});
