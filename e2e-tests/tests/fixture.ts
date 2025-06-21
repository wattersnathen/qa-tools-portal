import { test as base, Page } from '@playwright/test';

export const products = [
    { id: 10, name: 'apples', price: 5.00 },
    { id: 20, name: 'batteries', price: 9.99 },
    { id: 33, name: 'tv', price: 299.99 }
]

type Fixtures = {
    page: Page
}

export const test = base.extend<Fixtures>({
    page: async ({ page }, use) => {

        await page.route('**/api/products', route => route.fulfill({
            status: 200,
            body: JSON.stringify(products)
        }));

        await use(page);
    },
});

export { expect } from '@playwright/test';
