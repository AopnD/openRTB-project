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

function getWinningBid(dspResponse){
    let highestBid = null;

    dspResponse.forEach((response)=>{
        if(response.status === 'fulfilled'){
            const bidResponse = response.value.data; // Assume DSP returns valid OpenRTB response
            const { seatbid }= bidResponse;
            if(seatbid && seatbid.length > 0){
                const bid = seatbid[0].bid[0];
                if(!highestBid || bid.price > highestBid.price){
                    highestBid = bid;
                }
            }
        }
    })
return highestBid;
}

app.post('/exchange', async(req, res) => {
    const bidRequest = req.body;
logger.info('Inside bid request: ' + JSON.stringify(bidRequest));

if(!validateBidRequest(bidRequest)){
    return res.status(400).json({error: 'Invalid bid request'});
}

try {
    const dspResponse = await getBidsFromDSPs(bidRequest);
    const winningBid = getWinningBid(dspResponse);
    if(winningBid){
        const bidResponse = {
            id: bidRequest.id,
            seatbid: [{ bid: [winningBid] }],
        };
        logger.info('Winning bid response: ', bidResponse);
        return res.status(200).json(bidResponse);
    }else {
        logger.info('No valid bids received');
        return res.status(204).send();
    }
} catch (error) {
    logger.error('Error handling bid request: ', error);
    return res.status(500).json({error: 'Internal server error'});
}

});


app.listen(PORT, ()=> {
    console.log(`Ad Exchange running on ${PORT}`);
});
