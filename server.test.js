const request = require('supertest');
const axios = require('axios');
const app = require('./server.js');
const validReq = require('./sample-bid-request.json');
const DSPResponseMock = require('./DSPResponseMock.js');

jest.mock('axios');

describe('Ad Exchange API', () => {
  const validBidRequest = validReq;
  const dsp1Response = DSPResponseMock.dsp1Response;
  const dsp2Response = DSPResponseMock.dsp2Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a winning bid response when valid bids are received', async () => {
    axios.post.mockResolvedValueOnce(dsp1Response);
    axios.post.mockResolvedValueOnce(dsp2Response);

    const response = await request(app)
      .post('/exchange')
      .send(validBidRequest)
      .expect(200);

    expect(response.body).toEqual({
      id: validBidRequest.id,
      seatbid: [
        {
          bid: [{ id: '2', impid: '1', price: 3.0 }],
        },
      ],
    });
  });

  test('should return 204 when no valid bids are received', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 'dsp1-response', seatbid: [] } });
    axios.post.mockResolvedValueOnce({ data: { id: 'dsp2-response', seatbid: [] } });

    await request(app)
      .post('/exchange')
      .send(validBidRequest)
      .expect(204);
  });

  test('should return 400 for invalid bid request', async () => {
    const invalidBidRequest = { imp: [], site: {} };

    const response = await request(app)
      .post('/exchange')
      .send(invalidBidRequest)
      .expect(400);

    expect(response.body).toEqual({ error: 'Invalid bid request' });
  });

  test('should handle DSP timeout gracefully', async () => {
    axios.post.mockRejectedValueOnce(new Error('Timeout'));
    axios.post.mockResolvedValueOnce(dsp2Response);

    const response = await request(app)
      .post('/exchange')
      .send(validBidRequest)
      .expect(200);

    expect(response.body).toEqual({
      id: validBidRequest.id,
      seatbid: [
        {
          bid: [{ id: '2', impid: '1', price: 3.0 }],
        },
      ],
    });
  });

  test('should handle no DSP responses gracefully', async () => {
    axios.post.mockRejectedValueOnce(new Error('Timeout'));
    axios.post.mockRejectedValueOnce(new Error('Timeout'));

    await request(app)
      .post('/exchange')
      .send(validBidRequest)
      .expect(204);
  });
});
