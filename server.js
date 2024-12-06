const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


app.listen(PORT, ()=> {
    console.log(`Ad Exchange running on ${PORT}`);
})