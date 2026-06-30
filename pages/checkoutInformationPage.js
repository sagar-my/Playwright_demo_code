import { expect } from '@playwright/test';
import { CartPage } from './cartPage.js';

export class CheckoutInformationPage extends CartPage {
    constructor(page) {
        super(page);
        this.firstName_field = page.locator('//input[@data-test="firstName"]');
        this.lastName_field = page.locator('//input[@data-test="lastName"]');
        this.postalCode_field = page.locator('//input[@data-test="postalCode"]');
        this.continue_button = page.locator('//input[@data-test="continue"]');
        this.cancel_button = page.locator('//button[@data-test="cancel"]');
        this.information_page_title = page.locator('//span[text()="Checkout: Your Information"]');
        this.error_message = page.locator('[data-test="error"]');
    }

    async fillFirstName(firstName) {
        await this.firstName_field.fill(firstName);
    }

    async fillLastName(lastName) {
        await this.lastName_field.fill(lastName);
    }

    async fillPostalCode(postalCode) {
        await this.postalCode_field.fill(postalCode);
    }

    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillPostalCode(postalCode);
    }

    async clickContinue() {
        await this.continue_button.click();
    }

    async clickCancel() {
        await this.cancel_button.click();
    }

    async validate_information_page() {
        await expect(this.information_page_title).toBeVisible();
    }

    async getErrorMessage() {
        return await this.error_message.textContent();
    }

    async isErrorMessageVisible() {
        return await this.error_message.isVisible().catch(() => false);
    }

    async clearFirstName() {
        await this.firstName_field.fill('');
    }

    async clearLastName() {
        await this.lastName_field.fill('');
    }

    async clearPostalCode() {
        await this.postalCode_field.fill('');
    }

    async isContinueButtonEnabled() {
        return await this.continue_button.isEnabled();
    }
}

