const { chromium } = require("playwright"); // Import Playwright
const configProvider = require("./config/configurationProvider");

const environments = configProvider.getConfig().environments;
const ssnUsers = configProvider.getConfig().ssnUsers;
const chromeOptions = configProvider.getConfig().chrome;

const toSPAv2 = async (env, user, isTe = false) => {
  // Validations
  let url = environments[env];

  // Navigate to the login page (via tyopoyta)
  if (!url) {
    console.log(`Environment ${env} not found. Exiting...`);
    return;
  }

  // Launch Chrome with your profile and extensions
  const browser = await chromium.launchPersistentContext(
    chromeOptions.userDataPath,
    {
      headless: false, // Launch in headful mode to see the browser UI
      devTools: true, // Enable DevTools to debug the automation
      executablePath: chromeOptions.executablePath, // Optional: Specify the path to your Chrome installation
      args: [
        "--disable-web-security", // Optional: Disable web security if needed
        `--disable-extensions-except=${chromeOptions.reactDevToolsExtensionPath},${chromeOptions.reduxDevToolsExtensionPath}`, // Optional: Enable only specific extensions (if needed)
        "--start-maximized", // Start the browser maximized
        "--disable-blink-features=AutomationControlled", // Hide the automation message "Chrome is being controlled by automated test software."
        "--auto-open-devtools-for-tabs", // Open DevTools at startup
        "--ignore-certificate-errors", // Ignore certificate errors
      ],
      viewport: null, // Follow the window size
    }
  );

  // Get the first page within the context
  const [page] = browser.pages();

  // Maximize the browser window
  await page.evaluate(() => {
    window.moveTo(0, 0);
    window.resizeTo(screen.width, screen.height);
  });

  if (isTe) {
    url += "/~tepalvelut";
  }
  url += "/tyopoyta";

  await page.goto(url);

  // Login
  if (ssnUsers[user]) {
    // Suomi.fi
    await page
      .locator(
        'input.button[value="SPAv2 suomi.fi-testi"], input.button[value="Suomi.fi"]'
      )
      .first()
      .click();
    await page.click('a[id="fakevetuma2"]');
    await page.fill('input[id="hetu_input"]', ssnUsers[user]);
    await page.keyboard.press("Enter");
    await page.waitForSelector("#continue-button", { state: "visible" }); // Wait for the button to be visible
    await page.click("#continue-button");
  } else {
    // username/password
    await page.fill('input[name="username"]', user);
    await page.fill('input[name="password"]', "sanaSalainen");
    await page.click('input.button[value="Kirjaudu"]');
  }
};

module.exports = { toSPAv2 };
