const puppeteer = require("puppeteer");
const credentials = require("./credentials");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://instagram.com");

  await page.waitForSelector("input");

  const usernameAndPasswordInputBoxes = await page.$$("input");
  const usernameInputBox = usernameAndPasswordInputBoxes[0];
  const passwordInputBox = usernameAndPasswordInputBoxes[1];

  await usernameInputBox.type(credentials.USERNAME);
  await passwordInputBox.type(credentials.PASSWORD);

  const loginButton = (await page.$$("button"))[1];

  await loginButton.click();

  // await browser.close();
})();
