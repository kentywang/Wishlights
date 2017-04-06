// const express = require('express')
"use strict";
import express from "express";
const app = express()





app.use(express.static('client'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '../client/index.html'));
});


app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})