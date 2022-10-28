const puppeteer = require("puppeteer");
const credentials = require("./credentials");
const Sheet = require("./sheet");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
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

  await page.waitForNavigation();

  const sheet = new Sheet();
  await sheet.load();

  const allUsernames = (await sheet.getRows(0)).map((row) => row.username);

  const profiles = [];

  for (let i = 0; i < allUsernames.length; i++) {
    let USERNAME = allUsernames[i];

    await page.goto(`https://instagram.com/${USERNAME}`);
    await page.waitForSelector("img");

    const profilePicSrc = await page
      .$eval("img", (element) => element.getAttribute("src"))
      .catch((err) => false);

    const stats = await page
      .$$eval("header li", (elements) =>
        elements.map((element) => element.textContent)
      )
      .catch((err) => false);

    const fullName = await page
      .$eval("._aa_c span", (element) => element.textContent)
      .catch((err) => false);

    const bio = await page
      .$eval(
        "._aa_c ._aacl._aacp._aacu._aacx._aad6._aade",
        (element) => element.textContent
      )
      .catch((err) => false);

    const profileLink = await page
      .$eval(
        "._aacl._aacp._aacw._aacz._aada._aade",
        (element) => element.textContent
      )
      .catch((err) => false);

    const profile = {
      profilePicSrc,
      fullName,
      bio,
      profileLink,
      username: USERNAME,
    };

    for (let stat of stats) {
      const [count, name] = stat.split(" ");
      profile[name] = count;
    }
    profiles.push(profile);
  }

  const prevProfiles = await sheet.getRows(1);
  for (let prevProfile of prevProfiles) {
    if (allUsernames.includes(prevProfile.username)) {
      await prevProfile.delete();
    }
  }

  await sheet.addRows(profiles, 1);

  await browser.close();
})();
