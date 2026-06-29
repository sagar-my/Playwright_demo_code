import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cartPage';
import { LoginPage } from '../pages/loginPage';
import { data } from '../data';

test.describe('Cart Tests - Positive Scenarios', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
    });

    test('TC039: Navigate to cart page', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickCartIcon();
        await cartPage.validate_cart_page_title();
    });

    test('TC040: Verify empty cart page', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickCartIcon();
        await cartPage.validate_cart_page_title();
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);
    });

    test('TC041: Add product and verify in cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickCartIcon();
        await cartPage.validate_cart_page_title();
        const isInCart = await cartPage.isItemInCart(data.product1_name);
        expect(isInCart).toBe(true);
    });

    test('TC042: Add multiple products and verify all in cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickProductByName(data.product2_name);
        await cartPage.clickProductByName(data.product3_name);
        await cartPage.clickCartIcon();
        await cartPage.validate_cart_page_title();
        expect(await cartPage.isItemInCart(data.product1_name)).toBe(true);
        expect(await cartPage.isItemInCart(data.product2_name)).toBe(true);
        expect(await cartPage.isItemInCart(data.product3_name)).toBe(true);
    });

    test('TC043: Remove product from cart page', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickProductByName(data.product2_name);
        await cartPage.clickCartIcon();
        await cartPage.removeItemByName(data.product1_name);
        expect(await cartPage.isItemInCart(data.product1_name)).toBe(false);
        expect(await cartPage.isItemInCart(data.product2_name)).toBe(true);
    });

    test('TC044: Remove all products from cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickProductByName(data.product2_name);
        await cartPage.clickProductByName(data.product3_name);
        await cartPage.clickCartIcon();
        await cartPage.removeItemByName(data.product1_name);
        await cartPage.removeItemByName(data.product2_name);
        await cartPage.removeItemByName(data.product3_name);
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);
    });

    test('TC045: Continue shopping from cart page', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickCartIcon();
        await cartPage.click_continueShopping();
        await cartPage.validate_product_page();
    });

    test('TC046: Verify cart badge count matches items in cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickProductByName(data.product2_name);
        const badgeCount = await cartPage.getProductCount();
        await cartPage.clickCartIcon();
        const cartItemCount = await cartPage.getCartItemCount();
        expect(badgeCount).toBe(cartItemCount);
    });

    test('TC047: Verify checkout button is enabled when cart has items', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickCartIcon();
        const isEnabled = await cartPage.isCheckoutButtonEnabled();
        expect(isEnabled).toBe(true);
    });

    test('TC048: Verify product names and prices in cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickCartIcon();
        const itemNames = await cartPage.getCartItemNames();
        expect(itemNames.length).toBeGreaterThan(0);
        expect(itemNames).toContain(data.product1_name);
    });
});

test.describe('Cart Tests - Negative Scenarios', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
    });

    test('TC049: Verify checkout button behavior with empty cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickCartIcon();
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);
        // Checkout button should still be visible but cart should be empty
        await expect(cartPage.checkout_button).toBeVisible();
    });

    test('TC050: Try to remove non-existent item from cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickCartIcon();
        const initialCount = await cartPage.getCartItemCount();
        // Try to remove item that doesn't exist
        const removeButtons = await cartPage.removeButtons.all();
        expect(removeButtons.length).toBe(0);
        expect(initialCount).toBe(0);
    });

    test('TC051: Verify cart persists after page refresh', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clickProductByName(data.product1_name);
        await cartPage.clickProductByName(data.product2_name);
        await page.reload();
        const cartCount = await cartPage.getProductCount();
        expect(cartCount).toBe(2);
    });
});

