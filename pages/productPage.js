import { expect } from '@playwright/test';
import { BasePage } from './baseClass.js';

export class Products extends BasePage {
    constructor(page) {
        super(page);
        // Product buttons
        this.product1 = page.locator('(//div[@class="inventory_item_price"]/following-sibling::button)[1]');
        this.product1_name = page.locator('//div[text()="Sauce Labs Backpack"]');
        this.product2 = page.locator('(//div[@class="inventory_item_price"]/following-sibling::button)[2]');
        this.product3 = page.locator('(//div[@class="inventory_item_price"]/following-sibling::button)[3]');
        this.removeFirstProduct = page.locator('(//div[@class="inventory_item_price"]/following-sibling::button)[1]');
        // All product items
        this.allProducts = page.locator('.inventory_item');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.addToCartButtons = page.locator('button[data-test*="add-to-cart"]');
        this.removeButtons = page.locator('button[data-test*="remove"]');
        this.backToProductsBtn = page.locator('//*[@id="back-to-products"]');
        // Cart
        this.cart_icon = page.locator('//a[@data-test="shopping-cart-link"]');
        this.cart_badge = page.locator('//span[@data-test="shopping-cart-badge"]');
        
        // Sorting
        this.product_sort = page.locator('//select[@data-test="product-sort-container"]');
        this.check_sort = page.locator('//span[@data-test="active-option"]');
        
        // Menu
        this.burgerMenu = page.locator('//button[text()="Open Menu"]');
        this.logout_button = page.locator('//a[text()="Logout"]');
        this.allItems_link = page.locator('//a[text()="All Items"]');
        this.about_link = page.locator('//a[text()="About"]');
        this.resetAppState_link = page.locator('//a[text()="Reset App State"]');
        
        // Product page title
        this.productPage_Title = page.locator('.title', { hasText: 'Products' });
    }

    async clickProduct1() {
        await this.product1.click();
    }

    async RemoveFirstProduct() {
        await this.removeFirstProduct.click();
    }

    async clickProduct2() {
        await this.product2.click();
    }

    async clickProduct3() {
        await this.product3.click();
    }

    async clickCartIcon() {
        await this.cart_icon.click();
    }

    async validate_cart_with_product(count) {
        await expect(this.cart_badge).toHaveText(count.toString());
    }

    async clickBackToProducts() {
    await this.backToProductsBtn.click();
  }

    async change_ProductSorting(optionval) {
        await this.product_sort.selectOption(optionval);
    }

    async validate_sort(checkval) {
        await expect(this.check_sort).toContainText(checkval);
    }

    async validate_product1() {
        await expect(this.product1_name).toBeVisible();
    }

    async click_burger_icon() {
        await this.burgerMenu.click();
    }

    async click_logout() {
        await this.logout_button.click();
    }

    async getAllProductNames() {
        return await this.productNames.allTextContents();
    }

    async getAllProductPrices() {
        const prices = await this.productPrices.allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }

    async addProductToCart(productName) {
        const product = this.page.locator(`//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button`);
        console.log(`Adding product to cart: ${productName}`);
        await product.click();
    }

    async removeProductFromCart(productName) {
        const product = this.page.locator(`//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button`);
        console.log(`Removing product from cart: ${productName}`);
        await product.click();
        }

    async clickProductByName(productName) {
        await this.page.locator(`//div[text()="${productName}"]`).click();
        console.log(`Clicked on product: ${productName}`);
    }

    async addtocartbutton(){
        await this.addToCartButtons.first().click();
    }

    async getProductCount() {
        const count = await this.cart_badge.textContent().catch(() => null);
        console.log("Product count in cart:", count);
         return count ? parseInt(count) : 0;
    }

    async isCartBadgeVisible() {
        return await this.cart_badge.isVisible().catch(() => false);
    }

    async clickAllItems() {
        await this.allItems_link.click();
    }

    async clickAbout() {
        await this.about_link.click();
    }

    async clickResetAppState() {
        await this.resetAppState_link.click();
    }

    async getProductCountInList() {
        return await this.allProducts.count();
    }
}
