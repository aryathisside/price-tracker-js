import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PriceService {
  private prices: any[] = [];
  private alerts: any[] = [];

  constructor() {
    // Fetch prices every 5 minutes using an arrow function
    this.fetchPrices(); // Initial fetch on startup
    setInterval(() => this.fetchPrices(), 5 * 60 * 1000); // Set to 5 minutes
  }

  fetchPrices = async () => {
    try {
      console.log('Fetching prices...');
      const ethResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const polygonResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
  
      const ethPrice = ethResponse.data.ethereum.usd;
      const polygonPrice = polygonResponse.data['matic-network'].usd;
      const timestamp = new Date();
  
      console.log(`Fetched Prices: ETH - ${ethPrice}, POLYGON - ${polygonPrice}`); // Log fetched prices
  
      this.prices.push({ chain: 'ethereum', price: ethPrice, timestamp });
      this.prices.push({ chain: 'polygon', price: polygonPrice, timestamp });
  
      // Keep only the last 24 hours of prices (5 minutes intervals)
      if (this.prices.length > (24 * 60) / 5 * 2) {
        this.prices = this.prices.slice(-((24 * 60) / 5 * 2));
      }
  
      // Check for price alerts
      this.checkPriceAlerts(ethPrice, 'ethereum');
      this.checkPriceAlerts(polygonPrice, 'polygon');
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };
  
  checkPriceAlerts = (currentPrice: number, chain: string) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const pastPrices = this.prices.filter((p) => p.chain === chain && p.timestamp >= oneHourAgo);
  
    if (pastPrices.length > 0) {
      const lastPrice = pastPrices[pastPrices.length - 1].price; // Get the last price from the last hour
      const percentageChange = ((currentPrice - lastPrice) / lastPrice) * 100;
  
      console.log(`Checking alerts for ${chain}. Current Price: ${currentPrice}, Last Price: ${lastPrice}, Change: ${percentageChange.toFixed(2)}%`);
  
      if (percentageChange > 3) {
        // Send alert email to the predefined alert email from .env
        this.sendPriceAlertEmail(chain, currentPrice);
      }
    } else {
      console.log(`No past prices available for ${chain} in the last hour.`);
    }
  
    this.alerts.forEach((alert) => {
      if (alert.chain === chain && currentPrice <= alert.price) {
        console.log(`Sending custom alert to ${alert.email}. Current Price: ${currentPrice}, Alert Price: ${alert.price}`);
        this.sendCustomAlertEmail(alert.email, chain, currentPrice);
      }
    });
  };

  sendPriceAlertEmail = (chain: string, price: number) => {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_EMAIL,
      subject: `${chain.toUpperCase()} Price Alert`,
      text: `${chain.toUpperCase()} price has increased by more than 3%. New price: ${price}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

  sendCustomAlertEmail = (email: string, chain: string, price: number) => {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Custom Price Alert for ${chain.toUpperCase()}`,
      text: `${chain.toUpperCase()} has reached your set price of ${price}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

  getPricesWithinLastHour = () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.prices.filter((p) => p.timestamp >= oneHourAgo);
  };

  setAlert = (chain: string, price: number, email: string) => {
    this.alerts.push({ chain, price, email });
    return { message: 'Alert set successfully' };
  };

  calculateSwapRate = (ethAmount: number) => {
    const btcRate = 0.03; // Mock rate
    const btcReceived = ethAmount * btcRate;
    const fee = ethAmount * 0.03;
  
    const ethPrice = this.prices.find((p) => p.chain === 'ethereum')?.price;
  
    console.log(`Calculating swap rate for ETH Amount: ${ethAmount}. ETH Price: ${ethPrice}, BTC Received: ${btcReceived}, Fee: ${fee}`);
  
    return {
      btcReceived,
      feeInEth: fee,
      feeInDollar: ethPrice ? fee * ethPrice : null, // Ensure ethPrice is valid before multiplying
    };
  };
}
