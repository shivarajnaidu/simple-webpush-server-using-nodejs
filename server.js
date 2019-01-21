'use strict';
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;
const list = [];
// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
    'mailto:info@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

console.log(vapidKeys.publicKey)

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/api/subscribe', async (req, res, next) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'test' });

    console.log(subscription);
    list.push(subscription);

    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
    });
});

app.get('/api/notify', async (req, res, next) => {
    try {
        const payload = JSON.stringify({ title: 'Yuvaraj' });

        const subscription = list[list.length - 1];
        if (subscription) {
            await webpush.sendNotification(subscription, payload);
        }

        res.json({});
    } catch (error) {
        console.error(error.message, error);
        res.status(500).json({});
    }
})

app.listen(PORT, () => {
    console.log(`Server Listening At Port ${PORT}`);
});
