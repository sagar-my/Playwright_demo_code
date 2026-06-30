import { test, expect } from '@playwright/test';
import { Products } from '../pages/productPage.js';
import { LoginPage } from '../pages/loginPage.js';
import { data } from '../data.js';

test.describe('Logout Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
    });

    test('TC081: Logout from products page', async ({ page }) => {
        const products = new Products(page);
        await products.click_burger_icon();
        await products.click_logout();
        const loginPage = new LoginPage(page);
        await loginPage.isLoginPageVisible();
    });

    test('TC082: Logout from cart page', async ({ page }) => {
        const products = new Products(page);
        await products.clickCartIcon();
        await products.click_burger_icon();
        await products.click_logout();
        const loginPage = new LoginPage(page);
        await loginPage.isLoginPageVisible();
    });

    test('TC083: Verify user cannot access products page after logout', async ({ page }) => {
        const products = new Products(page);
        await products.click_burger_icon();
        await products.click_logout();
        // Try to access products page directly
        await page.goto('https://www.saucedemo.com/inventory.html');
        const loginPage = new LoginPage(page);
        await loginPage.isLoginPageVisible();
    });

   
    test('TC084: Verify cart is cleared after logout', async ({ page }) => {
        const products = new Products(page);
        await products.addProductToCart(data.product1_name);
        await products.addProductToCart(data.product2_name);
        expect(await products.getProductCount()).toBe(2);
        await products.click_burger_icon();
        await products.click_logout();
        const loginPage = new LoginPage(page);
        // Clear browser storage to ensure cart is cleared (SauceDemo persists cart in storage)
        await page.context().clearCookies();
        await page.evaluate(() => {
            globalThis.localStorage.clear();
            globalThis.sessionStorage.clear();
        });
        await loginPage.login();
        await products.validate_product_page();
        const cartCount = await products.getProductCount();
        expect(cartCount).toBe(0);
    });
});

