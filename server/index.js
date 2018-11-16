const http = require('http');
const express = require('express');

const port = 8080;
const app = express();

app.use(express.static('../public'));

app.listen(port, () => console.log(`This server is ready for play on port ${port}`));
