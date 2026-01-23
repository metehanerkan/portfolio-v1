import { test, expect } from '@playwright/test';

test.describe('Homepage Smoke Tests', () => {

    test('should load the homepage and show correct title', async ({ page }) => {
        // 1. Ana sayfaya git (Redirect expected to /tr)
        await page.goto('/tr');

        // 2. Başlığın (Title) doğru olduğunu kontrol et
        await expect(page).toHaveTitle(/Metehan Erkan/);

        // 3. Ana metnin (Heading) görünür olduğunu kontrol et
        const heading = page.getByRole('heading', { level: 1 }).first();
        await expect(heading).toContainText('Ben Metehan');
    });

    test('should navigate to Projects page', async ({ page }) => {
        await page.goto('/tr');

        // Navigasyon linkini bul ve tıkla
        // Explicitly wait for the link to be visible
        const projectLink = page.getByRole('link', { name: /Projeler|Projects/i }).first();
        await expect(projectLink).toBeVisible();
        await projectLink.click();

        // URL'in değiştiğini kontrol et
        await expect(page).toHaveURL(/.*projects/);
    });

});
