const { expect } = require("@playwright/test");
const { CheckoutInformationPage } = require("./checkoutInformationPage");

exports.CheckoutOverviewPage = class CheckoutOverviewPage extends CheckoutInformationPage {
    constructor(page) {
        super(page);
        this.overview_page_title = page.locator('//span[text()="Checkout: Overview"]');
        this.finish_button = page.locator('//button[@data-test="finish"]');
        this.cancel_button = page.locator('//button[@data-test="cancel"]');
        this.cartItems = page.locator('.cart_item');
        this.paymentInfo = page.locator('.summary_info_label:has-text("Payment Information") + .summary_value_label');
        this.shippingInfo = page.locator('.summary_info_label:has-text("Shipping Information") + .summary_value_label');
        this.subtotal = page.locator('.summary_subtotal_label');
        this.tax = page.locator('.summary_tax_label');
        this.total = page.locator('.summary_total_label');
    }

    async validate_overview_page() {
        await expect(this.overview_page_title).toBeVisible();
    }

    async click_finish_button() {
        await this.finish_button.click();
    }

    async clickCancel() {
        await this.cancel_button.click();
    }

    async getSubtotal() {
        const text = await this.subtotal.textContent();
        return text ? parseFloat(text.replace(/[^0-9.]/g, '')) : null;
    }

    async getTax() {
        const text = await this.tax.textContent();
        return text ? parseFloat(text.replace(/[^0-9.]/g, '')) : null;
    }

    async getTotal() {
        const text = await this.total.textContent();
        return text ? parseFloat(text.replace(/[^0-9.]/g, '')) : null;
    }

    async getPaymentInfo() {
        return await this.paymentInfo.textContent();
    }

    async getShippingInfo() {
        return await this.shippingInfo.textContent();
    }

    async validateTotalCalculation() {
        const subtotal = await this.getSubtotal();
        const tax = await this.getTax();
        const total = await this.getTotal();
        const calculatedTotal = subtotal + tax;
        return Math.abs(calculatedTotal - total) < 0.01;
    }

    async getCartItemCount() {
        return await this.cartItems.count();
    }
}

