const puppeteer = require("puppeteer");

const USERNAME = "username123";
const PASSWORD = "password123";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://instagram.com");

  const usernameAndPasswordInputBoxes = await page.$$("input");
  const usernameInputBox = usernameAndPasswordInputBoxes[0];
  const passwordInputBox = usernameAndPasswordInputBoxes[1];

  await usernameInputBox.type(USERNAME);
  await passwordInputBox.type(PASSWORD);

  //   await browser.close();

})();
