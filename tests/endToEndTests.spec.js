import { test, expect } from '@playwright/test';
import { CheckoutCompletePage } from '../pages/checkoutCompletePage';
import { LoginPage } from '../pages/loginPage';
import { data } from '../data';

test.describe('End-to-End Tests - Complete User Journeys', () => {
    test('TC071: Complete purchase flow - Single product', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.validate_cart_page_title();
        await checkoutComplete.click_checkout();
        await checkoutComplete.validate_information_page();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.validate_overview_page();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });

    test('TC072: Complete purchase flow - Multiple products', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickProductByName(data.product2_name);
        await checkoutComplete.clickProductByName(data.product3_name);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.validate_cart_page_title();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.validate_overview_page();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });

    test('TC073: Complete purchase and return to home', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
        await checkoutComplete.click_backHome_button();
        await checkoutComplete.validate_product_page();
    });

    test('TC074: Add product, remove from cart, add again and checkout', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickProductByName(data.product2_name);
        expect(await checkoutComplete.getProductCount()).toBe(2);
        await checkoutComplete.clickProductByName(data.product1_name); // Remove
        expect(await checkoutComplete.getProductCount()).toBe(1);
        await checkoutComplete.clickProductByName(data.product1_name); // Add again
        expect(await checkoutComplete.getProductCount()).toBe(2);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });

    test('TC075: Browse products, sort, add to cart and checkout', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.change_ProductSorting(data.sortPriceLowToHigh);
        await checkoutComplete.validate_sort('Price (low to high)');
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });

    test('TC076: View product details, add to cart, checkout', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.clickProductByName(data.product1_name);
        const ProductDetailPage = (await import('../pages/productDetailPage')).ProductDetailPage;
        const productDetail = new ProductDetailPage(page);
        await productDetail.validateProductDetailPage();
        await productDetail.addToCart();
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });

    test('TC077: Cancel checkout and complete later', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.clickCancel(); // Cancel first time
        await checkoutComplete.validate_cart_page_title();
        await checkoutComplete.click_checkout(); // Try again
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });

    test('TC078: Complete checkout with all products', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        const productCount = await checkoutComplete.getProductCountInList();
        // Add all products
        for (let i = 0; i < productCount; i++) {
            const buttons = await checkoutComplete.addToCartButtons.all();
            await buttons[i].click();
        }
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });
});

test.describe('End-to-End Tests - Edge Cases', () => {
    test('TC079: Login, logout, login again and complete purchase', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.click_burger_icon();
        await checkoutComplete.click_logout();
        await loginPage.isLoginPageVisible();
        
        await loginPage.login();
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.validateOrderComplete();
    });

    test('TC080: Verify cart is empty after successful order', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
        
        const checkoutComplete = new CheckoutCompletePage(page);
        await checkoutComplete.clickProductByName(data.product1_name);
        await checkoutComplete.clickCartIcon();
        await checkoutComplete.click_checkout();
        await checkoutComplete.fillCheckoutInformation(data.first_name, data.last_name, data.pin_code);
        await checkoutComplete.clickContinue();
        await checkoutComplete.click_finish_button();
        await checkoutComplete.click_backHome_button();
        
        const cartCount = await checkoutComplete.getProductCount();
        expect(cartCount).toBe(0);
    });
});

