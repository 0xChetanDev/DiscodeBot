

require('dotenv').config();
const express = require('express');
const { client } = require('./bot'); // this line is crucial
const searchApi = require('./api');

const app = express();
app.use('/', searchApi);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

// Login to Discord
client.login(process.env.DISCORD_TOKEN);



