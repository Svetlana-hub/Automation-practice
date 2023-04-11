const { test, expect } = require('@playwright/test');

// test.beforeEach(async ({ page }) => {
//     await page.goto('https://demoqa.com/automation-practice-form');
//   });

test('locatorFill', async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');
    const firstName = page.getByPlaceholder('First Name');
    await firstName.fill('John');
    await expect (firstName).toHaveValue('John');

    await page.getByPlaceholder('Last Name').fill('Wick');
    await expect (page.getByPlaceholder('Last Name')).toHaveValue('Wick');

    await page.getByPlaceholder('name@example.com').fill('john@gmail.com');
    await expect (page.getByPlaceholder('name@example.com')).toHaveValue('john@gmail.com');
})

test('locatorCheck', async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');
    await page.getByLabel('Male', { exact: true }).click({ force: true });         /// Почему не работает просто .check() ??
    await expect (page.getByLabel('Male', { exact: true })).toBeChecked();

    await page.getByLabel('Sports').click({ force: true });
    await expect (page.getByLabel('Sports')).toBeChecked();
})

// test('locatorSelectOption', async ({ page }) => {
//     await page.goto('https://demoqa.com/automation-practice-form');
//     await page.locator('xpath=//*[@id="state"]').click().selectOption([Haryana]);         //Почему этот тест не работает? Как сделать selectOption на div элемент?
//     // await expect (page.getByPlaceholder('Select State')).toHaveValue('Haryana');
// })

test('locatorSelectOption', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
    await page.locator('css=#oldSelectMenu').selectOption('Blue');
    await expect (page.locator('css=#oldSelectMenu')).toContainText('Blue');

        // await page.getByText('Select Option').selectOption('A root option');          //Почему этот тест не работает? Как сделать selectOption на div элемент?
})


test('locatorClick', async ({ page }) => { 
    await page.goto('https://demoqa.com/automation-practice-form');
    await page.getByPlaceholder('Current Address').click();
    await expect (page.getByPlaceholder('Current Address')).toBeFocused();
})

test('locatorHover1', async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');
    await page.getByText('Submit').hover({force : true});                                 /// Почему не работает просто .hover() ??
    await expect (page.getByText('Submit')).toHaveCSS('background-color', 'rgb(0, 123, 255)');
})

test('locatorHover2', async ({ page }) => {
    await page.goto('https://demoqa.com/menu');
    await page
        .getByRole('listitem')
        .filter ({ has: page.getByRole('link', { name : "Main Item 2"})})
        .hover({force : true});
    await expect (page.getByText('SUB SUB LIST »')).toBeVisible();
    await page
        .getByRole('listitem')
        .filter ({has: page.getByRole('link', { name : "Sub Item "})}).nth(2)
        .hover({force : true});
    await page.getByText('SUB SUB LIST »').hover({force : true});
    await expect (page.getByText('SUB SUB ITEM 1')).toBeVisible();
})

test('locatorSetInputFiles', async ({ page }) => {
    await page.goto('https://demoqa.com/upload-download');
    await page.locator('css=#uploadFile').setInputFiles("tests/hw2/playwright.png"); 
    await expect (page.locator('css=#uploadedFilePath')).toBeVisible();
})


test('locatorPress', async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');
    await page.getByPlaceholder('First Name').click();
    await page.keyboard.press('Tab');
    await expect (page.getByPlaceholder('Last Name')).toBeFocused()
 })


test('locatorDragAndDrop', async ({ page }) => {
    await page.goto('https://demoqa.com/droppable');
    const dragMe = page.getByText('Drag me', { exact: true });
    const dropHere = page.locator('css=#simpleDropContainer #droppable'); 
    await dragMe.dragTo(dropHere);
    await expect (page.getByText('Dropped')).toBeVisible();
})

test('calendarCheck', async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');
    await page.locator('#dateOfBirthInput').click();
    await page.getByLabel('Choose Wednesday, April 12th, 2023').click();
    await expect (page.locator('#dateOfBirthInput')).toHaveValue('12 Apr 2023');
})
