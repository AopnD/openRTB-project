const express = require('express');
const axios = require('axios');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const DSP_URLS = [
    'https://mock-dsp1.example.com/bid',
    'https://mock-dsp2.example.com/bid',
]


const logger = winston.createLogger({
    level:'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

function validateBidRequest(bidRequest){
    const requiredFields = ['id', 'imp', 'site'];
    return requiredFields.every((field) => bidRequest[field] );
};

function getBidsFromDSPs(bidRequest){
    return Promise.allSettled(
        DSP_URLS.map((url)=> 
        axios.post(url, bidRequest, {timeout: 3000})
        )
    );
}

app.post('/exchange', async(req, res) => {
    const bidRequest = req.body;
logger.info('Inside bid request: ' + JSON.stringify(bidRequest));

if(!validateBidRequest(bidRequest)){
    return res.status(400).json({error: 'Invalid bid request'});
}

try {
    const dspResponse = await getBidsFromDSPs(bidRequest);
    
} catch (error) {
    
}

});


app.listen(PORT, ()=> {
    console.log(`Ad Exchange running on ${PORT}`);
});
