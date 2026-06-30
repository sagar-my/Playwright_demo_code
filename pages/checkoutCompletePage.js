import { expect } from '@playwright/test';
import { CheckoutOverviewPage } from './checkoutOverviewPage.js';

export class CheckoutCompletePage extends CheckoutOverviewPage {
    constructor(page) {
        super(page);
        this.complete_page_title = page.locator('//span[text()="Checkout: Complete!"]');
        this.thankYouMessage = page.locator('//h2[text()="Thank you for your order!"]');
        this.completeText = page.locator('.complete-text');
        this.backHome_button = page.locator('//button[@data-test="back-to-products"]');
        this.ponyExpressImage = page.locator('.pony_express');
    }

    async validate_complete_page() {
        await expect(this.complete_page_title).toBeVisible();
    }

    async validate_thankyou_message() {
        await expect(this.thankYouMessage).toBeVisible();
    }

    async click_backHome_button() {
        await this.backHome_button.click();
    }

    async getCompleteText() {
        return await this.completeText.textContent();
    }

    async validateOrderComplete() {
        await this.validate_complete_page();
        await this.validate_thankyou_message();
        await expect(this.ponyExpressImage).toBeVisible();
    }
}

