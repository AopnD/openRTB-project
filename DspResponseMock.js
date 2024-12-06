class DSPResponseMock {
  static dsp1Response = {
    data: {
      id: 'dsp1-response',
      seatbid: [
        {
          bid: [{ id: '1', impid: '1', price: 2.5 }],
        },
      ],
    },
  };

  static dsp2Response = {
    data: {
      id: 'dsp2-response',
      seatbid: [
        {
          bid: [{ id: '2', impid: '1', price: 3.0 }],
        },
      ],
    },
  };
}

module.exports = DSPResponseMock;
