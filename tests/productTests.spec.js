import { test, expect } from '@playwright/test';
import { Products } from '../pages/productPage.js';
import { ProductDetailPage } from '../pages/productDetailPage.js';
import { LoginPage } from '../pages/loginPage.js';
import { data } from '../data.js';

test.describe('Product Tests - Positive Scenarios', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
    });

    test('TC021: Verify products page is displayed after login', async ({ page }) => {
        const products = new Products(page);
        await products.validate_product_page();
    });

    test('TC022: Verify all products are displayed', async ({ page }) => {
        const products = new Products(page);
        const productCount = await products.getProductCountInList();
        expect(productCount).toBeGreaterThan(0);
    });

    test('TC023: Add single product to cart', async ({ page }) => {
        const products = new Products(page);
        await products.clickProduct1();
        const cartCount = await products.getProductCount();
        expect(cartCount).toBe(1);
    });

    test('TC024: Add multiple products to cart', async ({ page }) => {
        const products = new Products(page);
        await products.clickProduct1();
        await products.clickProduct2();
        await products.clickProduct3();
        const cartCount = await products.getProductCount();
        expect(cartCount).toBe(3);
    });

    test('TC025: Remove product from cart', async ({ page }) => {
        const products = new Products(page);
        await products.clickProduct1();
        await products.clickProduct2();
        expect(await products.getProductCount()).toBe(2);
        await products.RemoveFirstProduct(); // Remove first product
        expect(await products.getProductCount()).toBe(1);
    });

    test('TC026: Sort products by Name A to Z', async ({ page }) => {
        const products = new Products(page);
        await products.change_ProductSorting(data.sortNameAtoZ);
        await products.validate_sort('Name (A to Z)');
        const productNames = await products.getAllProductNames();
        const sortedNames = [...productNames].sort();
        expect(productNames).toEqual(sortedNames);
    });

    test('TC027: Sort products by Name Z to A', async ({ page }) => {
        const products = new Products(page);
        await products.change_ProductSorting(data.sortNameZtoA);
        await products.validate_sort('Name (Z to A)');
        const productNames = await products.getAllProductNames();
        const sortedNames = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedNames);
    });

    test('TC028: Sort products by Price Low to High', async ({ page }) => {
        const products = new Products(page);
        await products.change_ProductSorting(data.sortPriceLowToHigh);
        await products.validate_sort('Price (low to high)');
        const prices = await products.getAllProductPrices();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });

    test('TC029: Sort products by Price High to Low', async ({ page }) => {
        const products = new Products(page);
        await products.change_ProductSorting(data.sortPriceHighToLow);
        await products.validate_sort('Price (high to low)');
        const prices = await products.getAllProductPrices();
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
    });

    test('TC030: Navigate to product detail page', async ({ page }) => {
        const products = new Products(page);
        await products.clickProductByName(data.product1_name);
        const productDetail = new ProductDetailPage(page);
        await productDetail.validateProductDetailPage();
    });

    test('TC031: Add product to cart from detail page', async ({ page }) => {
        const products = new Products(page);
        await products.clickProductByName(data.product1_name);
        const productDetail = new ProductDetailPage(page);
        await productDetail.addToCart();
        await products.clickCartIcon();
        const cartPage = new (await import('../pages/cartPage')).CartPage(page);
        const isInCart = await cartPage.isItemInCart(data.product1_name);
        expect(isInCart).toBe(true);
    });

    test('TC032: Remove product from cart on detail page', async ({ page }) => {
        const products = new Products(page);
        await products.clickProductByName(data.product1_name);
        const productDetail = new ProductDetailPage(page);
        await productDetail.addToCart();
        await productDetail.removeFromCart();
        const cartCount = await products.getProductCount();
        expect(cartCount).toBe(0);
    });

    test('TC033: Navigate back to products from detail page', async ({ page }) => {
        const products = new Products(page);
        await products.clickProductByName(data.product1_name);
        const productDetail = new ProductDetailPage(page);
        await productDetail.clickBackToProducts();
        await products.validate_product_page();
    });

    test('TC034: Verify product information on detail page', async ({ page }) => {
        const products = new Products(page);
        await products.clickProductByName(data.product1_name);
        const productDetail = new ProductDetailPage(page);
        const productName = await productDetail.getProductName();
        const productPrice = await productDetail.getProductPrice();
        expect(productName).toBeTruthy();
        expect(productPrice).toBeGreaterThan(0);
    });

    test('TC035: Add all products to cart', async ({ page }) => {
        const products = new Products(page);
        const productCount = await products.getProductCountInList();
        for (let i = 0; i < productCount; i++) {
            const buttons = await products.addToCartButtons.all();
            await buttons[i].click();
        }
        const cartCount = await products.getProductCount();
        expect(cartCount).toBe(productCount);
    });
});

test.describe('Product Tests - Negative Scenarios', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
    });

    test('TC036: Verify cart badge disappears when all items removed', async ({ page }) => {
        const products = new Products(page);
        await products.clickProduct1();
        await products.clickProduct2();
        expect(await products.isCartBadgeVisible()).toBe(true);
        await products.clickProduct1();
        await products.clickProduct2();
        expect(await products.isCartBadgeVisible()).toBe(false);
    });

    test('TC037: Try to add same product multiple times', async ({ page }) => {
        const products = new Products(page);
        await products.clickProduct1();
        await products.clickProduct1(); // Try to add again
        const cartCount = await products.getProductCount();
        expect(cartCount).toBe(0); // Should remove it instead
    });

    test('TC038: Verify sorting resets after page refresh', async ({ page }) => {
        const products = new Products(page);
        await products.change_ProductSorting(data.sortNameZtoA);
        await page.reload();
        await products.validate_sort('Name (A to Z)'); // Should reset to default
    });
});

