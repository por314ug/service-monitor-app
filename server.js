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
    const services = await Service.find();
    res.send(services);
});

app.post('/services', async (req, res) => {
    const service = new Service({ url: req.body.url, status: 'Pending', lastChecked: new Date() });
    const response = await axios.get(req.body.url);
    service.status = response.status === 200 ? 'Up' : 'Down';
    await service.save();
    res.send(service);
});

mongoose.connect('mongodb://mongo:27017/monitor', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(6000, () => {
    console.log('Server is running on port 6000');
});
