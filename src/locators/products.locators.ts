import type { Locator, Page } from '@playwright/test';

export const productsLocators = (page: Page) => ({
  heading: page.locator('.features_items h2.title'),
  searchInput: page.locator('#search_product'),
  searchButton: page.locator('#submit_search'),
  cards: page.locator('.features_items .product-image-wrapper'),
  cardNames: page.locator('.features_items .productinfo p'),
  // card-relative helpers
  cardName: (card: Locator) => card.locator('.productinfo p'),
  cardPrice: (card: Locator) => card.locator('.productinfo h2'),
  cardOverlayAddToCart: (card: Locator) => card.locator('.product-overlay a.add-to-cart'),
  cardViewDetails: (card: Locator) => card.locator('a[href^="/product_details/"]').first(),
});
