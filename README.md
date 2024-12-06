# OpenRTB Ad Exchange

## Overview

This project is a basic implementation of an **Open Real-Time Bidding (OpenRTB)** Ad Exchange. The ad exchange accepts bid requests following the OpenRTB 2.5 specification, communicates with two mock Demand Side Platforms (DSPs), determines the highest bid, and responds with the winning bid.

## Features

- HTTP API to handle OpenRTB bid requests.
- Validation of required fields in bid requests.
- Communication with mock DSPs to fetch bids.
- Winning bid selection based on the highest price.
- Graceful handling of errors (e.g., DSP timeouts, invalid responses).
- Logging of requests, responses, and errors using **Winston**.

## Technology Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for building the API.
- **Axios**: HTTP client for communication with DSPs.
- **Jest**: Testing framework.
- **Winston**: Logging library.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/openrtb-ad-exchange.git
   cd openrtb-ad-exchange
