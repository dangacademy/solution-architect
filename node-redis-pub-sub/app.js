// app.js
const redis = require('redis');
const express = require('express');
const app = express();
let client = null;
let subscriber1 = null;
let subscriber2 = null;
let publisher = null;

( async() => {
    console.log("app.js");

    //Client for regular command
    client = await redis.createClient({ 
        url: 'redis://redis:6379' 
    }).on('error', err => console.log('Redis Client Error', err))
    .connect();    
    console.log('####### Connected ######')

    // Dedicated subscriber client
    subscriber1 = client.duplicate();
    subscriber2 = client.duplicate();
    await subscriber1.connect();
    await subscriber2.connect();
    console.log('####### Subscriber Connected ######')

    subscriber1.subscribe('testChannel', (message) => {
        console.log(`Sub1 : Received message : ${message}`);
    });

    subscriber2.subscribe('testChannel', (message) => {
        console.log(`Sub2 : Received message: ${message}`);
    });

    // Dedicated publisher client
    publisher = client.duplicate();
    await publisher.connect();

    await client.set('visit', 0);
    console.log(await client.get('visit'));

    app.get('/', async (req, res) => {
        const visit = await client.get('visit');
        res.send('Number of visits is ' + visit);
        await client.set('visit', parseInt(visit) + 1);
    });

    app.get('/publisher', async (req, res) => {
        const message = `Hello ${new Date()}`;
        console.log(`Publishing: ${message}`);
        await publisher.publish('testChannel', message);
        res.send('Message published');
    });

    const port = 8080;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})();
