import { test, expect, products } from './fixture';

test.describe('Using API mocks in Checkout', () => {
    test('products are presented to the user', async ({ page }) => {
        await page.goto('/');
        const productsFound = await page.locator('.product-item').all();
        const idsFound: number[] = [];
        for (const p of productsFound) {
            idsFound.push(Number(await p.getAttribute('data-testid')));
        }
        expect(idsFound).toEqual(products.map(p => p.id));
    });

    test('user can successfully checkout', async ({ page }) => {
        await page.route('**/api/checkout', route => route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Checkout successful', product: products[0] })
        }));
        await page.goto('/');
        await fillForm(page, products[0].id, 'Checkout successful');
    });

    test('error is presented for invalid product id at checkout', async ({ page }) => {
        await page.route('**/api/checkout', route => route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Product not found' })
        }));

        await page.goto('/');
        await fillForm(page, 33, 'Product not found');
    });
});

async function fillForm(page, id, expectedMessage) {
    // clock install must start before the form submit action
    await page.clock.install();
    await page.getByRole('spinbutton').fill('' + id);
    await page.locator('input[type="submit"]').click();
    const responseElement = await page.locator('.response');
    await expect(responseElement).toContainText(expectedMessage);
    // advance the clock by 9 seconds (the client-side setTimeout value)
    await page.clock.fastForward('09');
    await expect(responseElement).not.toBeAttached();
}