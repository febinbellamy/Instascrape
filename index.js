const puppeteer = require("puppeteer");
const credentials = require("./credentials");
const Sheet = require("./sheet");

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

  await page.waitForNavigation();

  const usernames = [
    "therock",
    "kingjames",
    "champagnepapi",
    "igpr0",
    "duranthighlights",
  ];

  const profiles = [];

  for (let i = 0; i < usernames.length; i++) {
    let username = usernames[i];
    await page.goto(`https://instagram.com/${username}`);
    await page.waitForSelector("img");
    
    await page.waitForTimeout(3000);

    const profilePicSrc = await page
      .$eval("img", (element) => element.getAttribute("src"))
      .catch(() => false);

    const stats = await page.$$eval("header li", (elements) =>
      elements.map((element) => element.textContent)
    );

    const fullName = await page
      .$eval("._aa_c span", (element) => element.textContent)
      .catch(() => false);

    const bio = await page
      .$eval(
        "._aa_c ._aacl._aacp._aacu._aacx._aad6._aade",
        (element) => element.textContent
      )
      .catch(() => false);

    const profileLink = await page
      .$eval(
        "._aacl._aacp._aacw._aacz._aada._aade",
        (element) => element.textContent
      )
      .catch(() => false);

    const profile = {
      profilePicSrc,
      fullName,
      bio,
      profileLink,
      username: username,
    };

    for (let stat of stats) {
      const [count, name] = stat.split(" ");
      profile[name] = count;
    }
    profiles.push(profile);
  }

  const sheet = new Sheet();
  await sheet.load();

  const prevProfiles = await sheet.getRows(0);
  for (let prevProfile of prevProfiles) {
    if (usernames.includes(prevProfile.username)) {
      await prevProfile.delete();
    }
  }

  await sheet.addRows(profiles, 0);

  await browser.close();
})();
