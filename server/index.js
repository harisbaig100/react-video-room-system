const express = require("express");
const http = require("http");
const app = express();
const config = require('./config/config');

const server = app.listen(config.port, () => {
    console.info(`Server started on port ${config.port}.`);
});

server.on('error', (err) => {
    console.error('An error occurred while starting the server:', err);
});
