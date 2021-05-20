const port = process.env.PORT || 8080;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

var app = express();

app.use(cors);
app.use(express.json());
app.listen(port, console.log("Server up at port ", port));