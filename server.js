const express = require('express');
const axios = require('axios');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


const logger = winston.createLogger({
    level:'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

function validateBidRequest(bidRequest){
    const requiredFields = ['id', 'imp', 'site'];
    return requiredFields.every((field) => bidRequest[field] );
};

app.post('/exchange', async(req, res) => {
    const bidRequest = req.body;
logger.info('Inside bid request: ' + JSON.stringify(bidRequest));

if(!validateBidRequest(bidRequest)){
    return res.status(400).json({error: 'Invalid bid request'});
}

return res.status(200).json({msg:'This is your bid: ', bidRequest});

});


app.listen(PORT, ()=> {
    console.log(`Ad Exchange running on ${PORT}`);
});
