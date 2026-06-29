const { expect } = require("@playwright/test");
const { Products } = require("./productPage");

exports.ProductDetailPage = class ProductDetailPage extends Products {
    constructor(page) {
        super(page);
        this.backToProducts = page.locator('//button[@data-test="back-to-products"]');
        this.productName = page.locator('.inventory_details_name');
        this.productDescription = page.locator('.inventory_details_desc');
        this.productPrice = page.locator('.inventory_details_price');
        this.addToCartButton = page.locator('button[data-test*="add-to-cart"]');
        this.removeButton = page.locator('button[data-test*="remove"]');
        this.productImage = page.locator('.inventory_details_img');
    }

    async clickBackToProducts() {
        await this.backToProducts.click();
    }

    async getProductName() {
        return await this.productName.textContent();
    }

    async getProductDescription() {
        return await this.productDescription.textContent();
    }

    async getProductPrice() {
        const price = await this.productPrice.textContent();
        return price ? parseFloat(price.replace('$', '')) : null;
    }

    async addToCart() {
        await this.addToCartButton.click();
    }

    async removeFromCart() {
        await this.removeButton.click();
    }

    async isAddToCartButtonVisible() {
        return await this.addToCartButton.isVisible();
    }

    async isRemoveButtonVisible() {
        return await this.removeButton.isVisible();
    }

    async validateProductDetailPage() {
        await expect(this.productName).toBeVisible();
        await expect(this.productDescription).toBeVisible();
        await expect(this.productPrice).toBeVisible();
    }
}

