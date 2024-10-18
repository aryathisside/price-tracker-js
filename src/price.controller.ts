import { Controller, Get, Post, Body } from '@nestjs/common';
import { PriceService } from './price.service';

@Controller('prices')
export class PriceController {
    constructor(private readonly priceService: PriceService) { }


    @Get('hourly')
    getHourlyPrices() {
        const prices = this.priceService.getPricesWithinLastHour();
        console.log('Hourly Prices:', prices);
        return prices;
    }

    @Post('alert')
    setAlert(@Body() alertDto: { chain: string; price: number; email: string }) {
        const alert = this.priceService.setAlert(alertDto.chain, alertDto.price, alertDto.email);
        console.log(`alert: ${alert}`);
        return alert;
    }

    @Post('swap')
    swap(@Body() swapDto: { ethAmount: number }) {
        const swap = this.priceService.calculateSwapRate(swapDto.ethAmount);
        console.log(`Swap: ${swap}`);
        return swap;
    }
}
