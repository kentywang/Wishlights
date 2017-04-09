// const express = require('express')
"use strict";
import express from 'express';
import path from 'path';
const app = express()

app.use(express.static('public'));

app.use(express.static('client'));

// webpack will serve public/index.html for get '/'

// temp for testing
app.get('/home', function(req, res) {
  console.log('here is the dirname', __dirname);
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})