import { LoginPage } from '../pages/loginPage.js';

/**
 * Helper function to login with standard_user credentials
 * Navigates to the site and performs login
 * @param {Page} page - Playwright page object
 */
export async function validLogin(page) {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await loginPage.verifySuccessfulLogin();
}
