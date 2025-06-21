import { test, expect } from "@playwright/test";

test.describe('Checkout Regressions', () => {
    let apiProducts: any[] = [];
    test.beforeAll(async ({ request }) => {
        const response = await request.get('/api/products');
        const body = await response.json();
        apiProducts = body;
    });

    test('products rendered should match available products', async ({ page }) => {
        await page.goto('/');
        const uiProducts = await page.locator('.product-item').all();
        const uiItems: any[] = [];
        for (const product of uiProducts) {
            const id = Number(await product.getAttribute('data-testid'));
            const name = await product.locator('.name').textContent();
            const price = Number(await product.locator('.price').textContent());

            uiItems.push({
                id,
                name,
                price
            });
        }

        expect(apiProducts).toEqual(uiItems);
    });

    test('can checkout with a known product', async ({ page }) => {
        const ids = apiProducts.map(p => p.id);
        
        await page.goto('/');
        await fillForm(page, ids[0], 'Checkout successful');
    });

    test('error presented to user when checking out with invalid product', async ({ page }) => {
        await page.goto('/');
        await fillForm(page, -1, 'Product not found');
    });
});

async function fillForm(page, id, assertion) {
    await page.getByRole('spinbutton').fill('' + id);
    await page.locator('input[type="submit"]').click();

    const responseDiv = await page.locator('.response');
    await expect(responseDiv).toContainText(assertion);
    await responseDiv.waitFor({ state: 'detached' });
}