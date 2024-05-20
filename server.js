const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
app.use(express.json());

const serviceTestingSchema = new mongoose.Schema({
    url: String,
    status: String,
    lastChecked: Date
});

const Service = mongoose.model('Service', serviceTestingSchema);

app.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        console.log('Fetched services:', services);
        res.send(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Error fetching services');
    }
});

app.post('/services', async (req, res) => {
    try {
        const service = new Service({ url: req.body.url, status: 'Pending', lastChecked: new Date() });
        const response = await axios.get(req.body.url);
        service.status = response.status === 200 ? 'Up' : 'Down';
        await service.save();
        res.send(service);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).send('Error creating service');
    }
});

// Endpoint for adding sample data
app.post('/add-sample', async (req, res) => {
    try {
        const sampleService = new Service({ url: 'http://example.com', status: 'Pending', lastChecked: new Date() });
        await sampleService.save();
        res.send(sampleService);
    } catch (error) {
        console.error('Error adding sample service:', error);
        res.status(500).send('Error adding sample service');
    }
});

mongoose.connect('mongodb://mongo:27017/monitor', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
