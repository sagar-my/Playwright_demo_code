import { expect } from '@playwright/test';

export class BasePage {
    constructor(page) {
        this.page = page;
        this.productPage_Title = page.locator('.title', { hasText: 'Products' });
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async validate_product_page() {
        await expect(this.productPage_Title).toBeVisible();
    }
}
