import { test, expect, products } from './fixture';

test.describe('Checkout Flow with API Mocks', () => {

    test('should display available products', async ({ page }) => {
        await page.goto('/');
        const productItems = await page.locator('.product-item').all();
        const displayedIds = await Promise.all(productItems.map(p => p.getAttribute('data-testid')));
        const numericIds = displayedIds.map(id => Number(id));
        expect(numericIds).toEqual(products.map(p => p.id));
    });

    test('should complete checkout successfully', async ({ page }) => {
        mockCheckoutSuccess(page, products[0]);

        await page.goto('/');
        await submitCheckoutForm(page, {
            productId: products[0].id,
            expectedText: 'Checkout successful',
        });
    });

    const nonexistentProducts = [
        { input: '-42', expected: /product not found/i, description: 'nonexistent numeric input' },
    ];

    for (const { input, expected, description } of nonexistentProducts) {
        test(`should show error for ${description} when product does not exist`, async ({ page }) => {
            const message = typeof expected === 'string' ? expected : expected.source;
            mockCheckoutFailure(page, message);
            await page.goto('/');
            await page.getByRole('spinbutton').fill(input);
            await page.locator('input[type="submit"]').click();
            const response = page.locator('.response');
            const responseText = await response.textContent();
            const { error } = JSON.parse(responseText || '{}');
            expect(error).toMatch(expected);
        });
    }
});

// Helpers

async function submitCheckoutForm(page, { productId, expectedText }) {
    await page.clock.install(); // Ensure clock is installed before triggering setTimeout logic

    await page.getByRole('spinbutton').fill(String(productId));
    await page.locator('input[type="submit"]').click();

    const response = page.locator('.response');
    await expect(response).toContainText(expectedText);

    await page.clock.fastForward('09'); // Fast-forward 9s for auto-dismiss
    await expect(response).not.toBeAttached();
}

function mockCheckoutSuccess(page, product) {
    return page.route('**/api/checkout', route =>
        route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Checkout successful', product }),
        })
    );
}

function mockCheckoutFailure(page, errorMessage) {
    return page.route('**/api/checkout', route =>
        route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: errorMessage }),
        })
    );
}
