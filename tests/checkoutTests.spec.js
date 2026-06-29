import { test, expect } from '@playwright/test';
import { CheckoutInformationPage } from '../pages/checkoutInformationPage';
import { CheckoutOverviewPage } from '../pages/checkoutOverviewPage';
import { CheckoutCompletePage } from '../pages/checkoutCompletePage';
import { LoginPage } from '../pages/loginPage';
import { data } from '../data';

test.describe('Checkout Tests - Positive Scenarios', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        // Add products to cart
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.clickProductByName(data.product1_name);
        await checkoutInfo.clickProductByName(data.product2_name);
        await checkoutInfo.clickCartIcon();
        await checkoutInfo.click_checkout();
    });

    test('TC052: Complete checkout flow with valid information', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.validate_information_page();
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        
        const checkoutOverview = new CheckoutOverviewPage(page);
        await checkoutOverview.validate_overview_page();
        await checkoutOverview.click_finish_button();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.validateOrderComplete();
    });

    test('TC053: Verify checkout information page elements', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.validate_information_page();
        await expect(checkoutInfo.firstName_field).toBeVisible();
        await expect(checkoutInfo.lastName_field).toBeVisible();
        await expect(checkoutInfo.postalCode_field).toBeVisible();
        await expect(checkoutInfo.continue_button).toBeVisible();
        await expect(checkoutInfo.cancel_button).toBeVisible();
    });

    test('TC054: Cancel checkout and return to cart', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.clickCancel();
        await checkoutInfo.validate_cart_page_title();
    });

    test('TC055: Verify checkout overview page displays correct information', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        
        const checkoutOverview = new CheckoutOverviewPage(page);
        await checkoutOverview.validate_overview_page();
        const itemCount = await checkoutOverview.getCartItemCount();
        expect(itemCount).toBeGreaterThan(0);
    });

    test('TC056: Verify total calculation on overview page', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        
        const checkoutOverview = new CheckoutOverviewPage(page);
        const isCorrect = await checkoutOverview.validateTotalCalculation();
        expect(isCorrect).toBe(true);
    });

    test('TC057: Cancel checkout from overview page', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        
        const checkoutOverview = new CheckoutOverviewPage(page);
        await checkoutOverview.clickCancel();
        await checkoutInfo.validate_product_page();
    });

    test('TC058: Navigate back home after order completion', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        
        const checkoutOverview = new CheckoutOverviewPage(page);
        await checkoutOverview.click_finish_button();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.click_backHome_button();
        await checkoutInfo.validate_product_page();
    });

    test('TC059: Verify order completion message', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        
        const checkoutOverview = new CheckoutOverviewPage(page);
        await checkoutOverview.click_finish_button();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.validate_thankyou_message();
        const completeText = await checkoutComplete.getCompleteText();
        expect(completeText).toBeTruthy();
    });

    test('TC060: Complete checkout with single item', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.clickProductByName(data.product1_name);
        await checkoutInfo.clickCartIcon();
        await checkoutInfo.click_checkout();
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        
        const checkoutOverview = new CheckoutOverviewPage(page);
        await checkoutOverview.click_finish_button();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.validateOrderComplete();
    });
});

test.describe('Checkout Tests - Negative Scenarios', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.clickProductByName(data.product1_name);
        await checkoutInfo.clickCartIcon();
        await checkoutInfo.click_checkout();
    });

    test('TC061: Try to checkout with empty first name', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.empty_first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);
        const errorMessage = await checkoutInfo.getErrorMessage();
        expect(errorMessage).toContain('First Name');
    });

    test('TC062: Try to checkout with empty last name', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.empty_last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);
        const errorMessage = await checkoutInfo.getErrorMessage();
        expect(errorMessage).toContain('Last Name');
    });

    test('TC063: Try to checkout with empty postal code', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.empty_pin_code);
        await checkoutInfo.clickContinue();
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);
        const errorMessage = await checkoutInfo.getErrorMessage();
        expect(errorMessage).toContain('Postal Code');
    });

    test('TC064: Try to checkout with all empty fields', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.empty_first_name, data.empty_last_name, data.empty_pin_code);
        await checkoutInfo.clickContinue();
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);
    });

    test('TC065: Try to checkout with only first name filled', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillFirstName(data.first_name);
        await checkoutInfo.clickContinue();
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);
    });

    test('TC066: Try to checkout with only last name filled', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillLastName(data.last_name);
        await checkoutInfo.clickContinue();
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);
    });

    test('TC067: Try to checkout with only postal code filled', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillPostalCode(data.pin_code);
        await checkoutInfo.clickContinue();
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isErrorVisible).toBe(true);
    });

    test('TC068: Try to checkout with special characters in first name', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.special_chars_first_name, data.last_name, data.pin_code);
        await checkoutInfo.clickContinue();
        // Should proceed or show error depending on validation
        const overview = new CheckoutOverviewPage(page);
        const isOverviewVisible = await overview.overview_page_title.isVisible().catch(() => false);
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        // Either should show error or proceed (depending on validation rules)
        expect(isOverviewVisible || isErrorVisible).toBe(true);
    });

    test('TC069: Try to checkout with very long postal code', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation(data.first_name, data.last_name, data.long_pin_code);
        await checkoutInfo.clickContinue();
        // Should either proceed or show error
        const overview = new CheckoutOverviewPage(page);
        const isOverviewVisible = await overview.overview_page_title.isVisible().catch(() => false);
        const isErrorVisible = await checkoutInfo.isErrorMessageVisible();
        expect(isOverviewVisible || isErrorVisible).toBe(true);
    });

    test('TC070: Try to checkout with numbers in name fields', async ({ page }) => {
        const checkoutInfo = new CheckoutInformationPage(page);
        await checkoutInfo.fillCheckoutInformation('12345', '67890', data.pin_code);
        await checkoutInfo.clickContinue();
        // Should proceed (no strict validation on names)
        const overview = new CheckoutOverviewPage(page);
        await overview.validate_overview_page();
    });
});

