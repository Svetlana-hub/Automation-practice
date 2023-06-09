const { test, expect } = require('@playwright/test');

import config from '../../config.json';

test('cookies', async ({ request, page }) => {

    await page.goto('https://demoqa.com/login');
    await page.getByPlaceholder('UserName').fill(config.homework3Auth.userName);         
    await page.getByPlaceholder('Password').fill(config.homework3Auth.password); 
    await page.getByRole('button', { name : "Login"}).click();
  
    await page.waitForURL('https://demoqa.com/profile');
    await expect(page.locator('.main-header')).toHaveText('Profile');

    const cookies = await page.context().cookies();
    // console.log(cookies);
  

    await expect(cookies.find(c => c.name === 'userID').value).toBeTruthy();
    await expect(cookies.find(c => c.name === 'userName').value).toBeTruthy();
    await expect(cookies.find(c => c.name === 'expires').value).toBeTruthy();
    await expect(cookies.find(c => c.name === 'token').value).toBeTruthy();

    const token = cookies.find(c => c.name === 'token').value;
    const userId = cookies.find(c => c.name === 'userID').value;

    await page.goto('https://demoqa.com/profile');
    await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
    const responsePromise = page.waitForResponse('https://demoqa.com/BookStore/v1/Books');
    await page.getByText('Book Store', { exact: true }).click();
    await page.screenshot({path: 'hw3/screenshots/screenshot.png'});
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const responseJson = await response.json();
    // console.log(responseJson)

    const numberFromRequest = responseJson.books.length;
    await expect(page.getByRole("gridcell").filter({ has: page.getByRole('link')})).toHaveCount(numberFromRequest);


  const randomPages = Math.round(Math.random() * 999 + 1).toString();
  await page.route(
    "https://demoqa.com/BookStore/v1/Book?ISBN=*",
    async (route) => {
      const response = await route.fetch();
      let body = await response.text();
      const searchBody = JSON.parse(body);
      body = body.replace(searchBody.pages, randomPages);
      route.fulfill({
        response,
        body,
        headers: {
          ...response.headers(),
        },
      });
    }
  );

    const randomBooks = Math.round(Math.random()*responseJson.books.length);
    await page.getByRole("gridcell").filter({ has: page.getByRole('link')}).nth(randomBooks).click();
    await expect(page.locator("#pages-wrapper #userName-value")).toHaveText(randomPages);

    const responseAuth = await request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
        headers: {
            'Authorization': "Bearer " + token,
        },
    }) 
    const responseJsonAuth = await responseAuth.json();
    console.log(responseJsonAuth);
    expect(responseJsonAuth.books.length).toBe(0);
    expect(responseJsonAuth.username).toBe(config.homework3Auth.userName);
})

