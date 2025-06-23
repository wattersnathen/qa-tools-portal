import { test as base, expect as baseExpect, Page, Route } from '@playwright/test';

// Shared test data
export const products = [
  { id: 10, name: 'apples', price: 5.00 },
  { id: 20, name: 'batteries', price: 9.99 },
  { id: 33, name: 'tv', price: 299.99 }
];

type Fixtures = {
  page: Page;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await mockProductApi(page, products);

    const browserErrors: { source: string; message: string }[] = [];

    page.on('pageerror', error => {
      browserErrors.push({ source: 'pageerror', message: error.message });
    });

    await use(page);

    for (const { source, message } of browserErrors) {
      baseExpect.soft(message, source).toBe('');
    }
  },
});

export const expect = baseExpect;

// Helpers
async function mockProductApi(page: Page, productList: typeof products) {
  await page.route('**/api/products', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(productList),
    });
  });
}