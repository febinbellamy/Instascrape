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

  await page.waitForNavigation();

  const usernames = [
    "therock",
    "kingjames",
    "champagnepapi",
    "igpr0",
    "duranthighlights",
  ];

  // this loop will visit each one of the usernames' pages and scrape them
  for (let i = 0; i < usernames.length; i++) {
    let username = usernames[i];
    await page.goto(`https://instagram.com/${username}`);
    await page.waitForSelector("img");

    const profilePicSrc = await page
      .$eval("img", (element) => element.getAttribute("src"))
      .catch((e) => console.log(e));

    const stats = await page.$$eval("header li", (elements) =>
      elements.map((element) => element.textContent)
    );

    const fullName = await page
      .$eval("._aa_c span", (element) => element.textContent)
      .catch((e) => console.log(e));

    const bio = await page
      .$eval(
        "._aa_c ._aacl._aacp._aacu._aacx._aad6._aade",
        (element) => element.textContent
      )
      .catch((e) => console.log(e));

    const profileLink = await page
      .$eval(
        "._aacl._aacp._aacw._aacz._aada._aade",
        (element) => element.textContent
      )
      .catch((e) => console.log(e));

    // these are the row names for the spreadsheet
    const profile = {
      profilePicSrc,
      stats,
      fullName,
      bio,
      profileLink,
      username,
    };

    // splits the stats data and puts it into the profile object
    for (let i = 0; i < stats.length; i++) {
      let stat = stats[i];
      const [count, name] = stat.split(" ");
      profile[name] = count;
    }

    console.log({ profile });

  }

  // await browser.close();
})();
