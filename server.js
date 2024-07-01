const express = require('express');
const app = express();
const appInsights = require('applicationinsights');

// Setup Application Insights
appInsights.setup('YOUR_INSTRUMENTATION_KEY').start();
const client = appInsights.defaultClient;

// Serve static files
app.use(express.static('public'));

// Example route to track a custom event
app.get('/track-event', (req, res) => {
    client.trackEvent({ name: 'CustomEvent', properties: { customProperty: 'customValue' } });
    res.send('Event tracked');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    client.trackEvent({ name: 'ServerStarted', properties: { port: port } });
});
