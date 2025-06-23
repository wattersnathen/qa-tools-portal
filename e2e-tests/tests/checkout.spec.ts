import { test, expect, Page } from '@playwright/test';

test.describe('Checkout Regressions', () => {
  let apiProducts: Array<{ id: number; name: string; price: number }> = [];

  test.beforeAll(async ({ request }) => {
    const response = await request.get('/api/products');
    apiProducts = await response.json();
  });

  test('should render products that match the API', async ({ page }) => {
    await page.goto('/');
    const uiProducts = await page.locator('.product-item').all();

    const displayed = await Promise.all(
      uiProducts.map(async (product) => ({
        id: Number(await product.getAttribute('data-testid')),
        name: await product.locator('.name').textContent(),
        price: Number(await product.locator('.price').textContent()),
      }))
    );

    expect(displayed).toEqual(apiProducts);
  });

  test('should checkout successfully with a valid product', async ({ page }) => {
    await page.goto('/');
    const validId = apiProducts[0]?.id;
    await submitCheckoutForm(page, validId, 'Checkout successful');
  });

  test('should show error for an invalid product', async ({ page }) => {
    await page.goto('/');
    await submitCheckoutForm(page, -1, 'Product not found');
  });
});

async function submitCheckoutForm(page: Page, id: number, expectedMessage: string) {
  await page.getByRole('spinbutton').fill(String(id));
  await page.locator('input[type="submit"]').click();

  const response = page.locator('.response');
  await expect(response).toContainText(expectedMessage);
}