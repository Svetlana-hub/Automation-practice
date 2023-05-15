import { test, expect } from '@playwright/test'
import config from '../../../config.json'
test('homework4', async ({ request, page }) => {
  let token
  let userId
  let responsePromise
  let responseJson
  let randomPages
  let responseAuth
  let responseJsonAuth
  let cookies

  await test.step('sign-in', async () => {
    await page.goto('https://demoqa.com/login')
    await page.getByPlaceholder('UserName').fill(config.homework3Auth.userName)
    await page.getByPlaceholder('Password').fill(config.homework3Auth.password)
    await page.getByRole('button', { name: 'Login' }).click()
  })

  await test.step('check-cookies', async () => {
    await page.waitForURL('https://demoqa.com/profile')
    await expect(page.locator('.main-header')).toHaveText('Profile')

    cookies = await page.context().cookies()

    await expect(cookies.find((c) => c.name === 'userID').value).toBeTruthy()
    await expect(cookies.find((c) => c.name === 'userName').value).toBeTruthy()
    await expect(cookies.find((c) => c.name === 'expires').value).toBeTruthy()
    await expect(cookies.find((c) => c.name === 'token').value).toBeTruthy()

    token = cookies.find((c) => c.name === 'token').value
    userId = cookies.find((c) => c.name === 'userID').value
  })

  await test.step('block-all-pictures', async () => {
    await page.goto('https://demoqa.com/profile')
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
  })

  await test.step('request interception', async () => {
    responsePromise = page.waitForResponse(
      'https://demoqa.com/BookStore/v1/Books'
    )
  })

  await test.step('click-bookStore', async () => {
    await page.getByText('Book Store', { exact: true }).click()
  })

  await test.step('make-screenshot', async () => {
    await page.screenshot({ path: '../../hw3/screenshots/screenshot.png' })
  })

  await test.step('check-intercept-get-request', async () => {
    const response = await responsePromise

    expect(response.status()).toBe(200)
    responseJson = await response.json()
    // console.log(responseJson);

    const numberFromUI = await page
      .getByRole('gridcell')
      .filter({ has: page.getByRole('link') })
      .count()
    const numberFromRequest = responseJson.books.length
    expect(numberFromRequest).toEqual(numberFromUI)
  })

  await test.step('set-random-Pages', async () => {
    randomPages = Math.round(Math.random() * 999 + 1).toString()
    await page.route(
      'https://demoqa.com/BookStore/v1/Book?ISBN=*',
      async (route) => {
        const response = await route.fetch()
        let body = await response.text()
        const searchBody = JSON.parse(body)
        body = body.replace(searchBody.pages, randomPages)
        route.fulfill({
          response,
          body,
          headers: {
            ...response.headers(),
          },
        })
      }
    )
  })

  await test.step('check-number-if-pages-of-any-book', async () => {
    const randomBooks = Math.round(Math.random() * responseJson.books.length)
    await page
      .getByRole('gridcell')
      .filter({ has: page.getByRole('link') })
      .nth(randomBooks)
      .click()
    await expect(page.locator('#pages-wrapper #userName-value')).toHaveText(
      randomPages
    )
  })

  await test.step('send-get-request-with-token-in-header', async () => {
    responseAuth = await request.get(
      `https://demoqa.com/Account/v1/User/${userId}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    responseJsonAuth = await responseAuth.json()
    //    console.log(responseJsonAuth);
  })

  await test.step('check-response-for-auth-request', async () => {
    expect(Array.isArray(responseJsonAuth.books)).toBeTruthy()
    expect(responseJsonAuth.username).toBe(config.homework3Auth.userName)
  })
})
