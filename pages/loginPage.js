const { expect } = require("@playwright/test");
const { data } = require("../data");

exports.LoginPage = class LoginPage {
    constructor(page) {
        this.page = page;
        this.username_field = page.locator('[data-test="username"]');
        this.password_field = page.locator('[data-test="password"]');
        this.login_button = page.locator('[data-test="login-button"]');
        this.error_message = page.locator('[data-test="error"]');
        this.error_button = page.locator('.error-button');
        this.login_container = page.locator('.login_container');
    }

    async navigate() {
        await this.page.goto("https://www.saucedemo.com/");
    }

    async enterUsername(username) {
        await this.username_field.fill(username);
    }

    async enterPassword(password) {
        await this.password_field.fill(password);
    }

    async clickLogin() {
        await this.login_button.click();
    }

    async login() {
        await this.username_field.fill(data.correct_user);
        await this.password_field.fill(data.correct_password);
        await this.login_button.click();
    }

    async isLoginPageVisible() {
        await expect(this.login_container).toBeVisible();
    }

    async getErrorMessage() {
        return await this.error_message.textContent();
    }

    async isErrorMessageVisible() {
        await expect(this.error_message).toBeVisible();
    }

    async clearUsername() {
        await this.username_field.clear();
    }

    async clearPassword() {
        await this.password_field.clear();
    }

    async isLoginButtonEnabled() {
        return await this.login_button.isEnabled();
    }

    async verifySuccessfulLogin() {
        // Verify user is redirected to products page after successful login
        await expect(this.page.locator('.title', { hasText: 'Products' })).toBeVisible();
    }
}

