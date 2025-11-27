const express = require("express");
const path = require("path");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// OR specifically for favicon:
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
