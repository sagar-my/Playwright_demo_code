import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { data } from '../data.js';

test.describe('Login Tests - Positive Scenarios', () => {
    test('TC001: Login with valid credentials - standard_user', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        await loginPage.verifySuccessfulLogin();
    });
});

test.describe('Login Tests - Negative Scenarios', () => {
    test('TC004: Login with invalid username', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.enterUsername(data.invalid_user);
        await loginPage.enterPassword(data.correct_password);
        await loginPage.clickLogin();
        await loginPage.isErrorMessageVisible();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(data.error_invalid_credentials);
    });

    test('TC005: Login with invalid password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.enterUsername(data.correct_user);
        await loginPage.enterPassword(data.invalid_password);
        await loginPage.clickLogin();
        await loginPage.isErrorMessageVisible();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(data.error_invalid_credentials);
    });

    test('TC006: Login with empty username', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.enterUsername(data.empty_username);
        await loginPage.enterPassword(data.correct_password);
        await loginPage.clickLogin();
        await loginPage.isErrorMessageVisible();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username is required');
    });

    test('TC007: Login with empty password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.enterUsername(data.correct_user);
        await loginPage.enterPassword(data.empty_password);
        await loginPage.clickLogin();
        await loginPage.isErrorMessageVisible();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Password is required');
    });

   
});

