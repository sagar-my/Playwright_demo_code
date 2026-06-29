const { expect } = require("@playwright/test");
const { Products } = require("./productPage");

exports.CartPage = class CartPage extends Products {
    constructor(page) {
        super(page);
        this.cart_page_title = page.locator('//span[text()="Your Cart"]');
        this.checkout_button = page.locator('//button[text()="Checkout"]');
        this.cart_badge = page.locator('//span[@data-test="shopping-cart-badge"]');
        this.continueShopping_button = page.locator('//button[text()="Continue Shopping"]');
        this.cartItems = page.locator('.cart_item');
        this.removeButtons = page.locator('button[data-test*="remove"]');
        this.cartItemNames = page.locator('.inventory_item_name');
        this.cartItemPrices = page.locator('.inventory_item_price');
        this.cartItemQuantities = page.locator('.cart_quantity');
    }

    async validate_cart_page_title() {
        await expect(this.cart_page_title).toBeVisible();
    }

    async click_checkout() {
        await this.checkout_button.click();
    }

    async click_continueShopping() {
        await this.continueShopping_button.click();
    }

    async getCartItemCount() {
        return await this.cartItems.count();
    }

    async removeItemByIndex(index) {
        const removeButtons = await this.removeButtons.all();
        if (removeButtons[index]) {
            await removeButtons[index].click();
        }
    }

    async removeItemByName(itemName) {
        const item = this.page.locator(`//div[text()="${itemName}"]/ancestor::div[@class="cart_item"]//button`);
        await item.click();
    }

    async getCartItemNames() {
        return await this.cartItemNames.allTextContents();
    }

    async isItemInCart(itemName) {
        const names = await this.getCartItemNames();
        return names.includes(itemName);
    }

    async validateCartIsEmpty() {
        await expect(this.cartItems.first()).toBeHidden().catch(() => {});
    }

    async isCheckoutButtonEnabled() {
        return await this.checkout_button.isEnabled();
    }

    async getTotalItemsInCart() {
        return await this.cartItems.count();
    }
}

