# Price Tracker Application

This is a simple price tracking and alert application built using **Nest.js** (with JavaScript), **Moralis API** (or any other price API), **nodemailer** for email notifications, and **Docker**. The application tracks the price of **Ethereum** and **Polygon**, sends email alerts when price conditions are met, and provides APIs for price history, alerts, and swap rates.

## Features

1. **Fetch Prices of Ethereum and Polygon every 5 minutes**: 
   - Automatically fetches the latest prices every 5 minutes and stores them.
   
2. **Email Alerts**:
   - Automatically sends an email if the price of Ethereum or Polygon increases by more than 3% compared to its price one hour ago.
   
3. **APIs**:
   - **Get hourly price data** for Ethereum and Polygon (within 24 hours).
   - **Set price alerts** for specific chains and trigger an email if the set price is reached.
   - **Calculate swap rates** from Ethereum to Bitcoin (with a mock rate and fee calculation).

4. **Dockerized**:
   - The entire app is containerized using Docker, making it easy to run locally with one command.

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v14 or higher).
- **Docker**: Install Docker on your machine.

### Steps to Run the Application

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd price-tracker-js


***.env***

- EMAIL_SERVICE=gmail
- EMAIL_USER=your_email@gmail.com        # Replace with your actual Gmail address
- EMAIL_PASS=your_generated_app_password # Use the app password you created in Gmail
- ALERT_EMAIL=hyperhire_assignment@hyperhire.in
