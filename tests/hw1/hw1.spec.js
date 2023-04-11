const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.onliner.by/');
  });

test('testByCss', async ({ page }) => {
    await page.locator("css=g-top");
})

test('testByXpath', async ({ page }) => {
    const name1 = await page.locator('xpath=//input');
    await expect (name1).toBeEnabled();
})


test('filterByText', async ({ page }) => {
    await page
    .getByRole('header')
    .filter ({ hasText: 'ЗРОБЛЕНА БЕЛАРУСАМI'})
    .getByRole('link', { name: 'Каталог' })

})

test('filterByAnotherLocator', async ({ page }) => {
    await page
    .getByRole('header')
    .locator('css=b-main-page-tabs')
    .filter ( {has: page.locator('css=b-main-page-tabs_list')})
    .getByRole('link', { name: 'Помогаем выбрать' })
})

test('getNElement', async ({ page }) => {
    await page
    .locator('css=b-main-page-grid-4 b-main-page-news-2')
    .locator('css=b-main-page-grid-4 cfix')
    .getByRole('generic')
    .getByRole('listitem').nth(2);
})

test('gewtByPlacehlder', async ({ page }) => {
    const name2 = await page.getByPlaceholder('Поиск в Каталоге');
    await expect(name2).toHaveValue('adgag');
})

// Task 2. Cоставить универсальный XPATH селектор, который позволял бы по имени сущности в таблице (Name, уникальный параметр) и названию столбца однозначно идентифицировать любую ячейку таблицы.
//*[contains(text(),'SimpleDataset')]/../../td[count(preceding-sibling::td)+1 = count(ancestor::table/thead/tr/th[.='Updated']/preceding-sibling::th)+1]