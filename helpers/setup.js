import { LoginPage } from "../pages/loginPage";

/**
 * Helper function to login with standard_user credentials
 * Navigates to the site and performs login
 * @param {Page} page - Playwright page object
 */
exports.validLogin = async function (page) {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    // Verify successful login by checking products page
    await loginPage.verifySuccessfulLogin();
}
