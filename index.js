const playwright = require('playwright');

const baseUrl = 'https://bmvs.onlineappointmentscheduling.net.au/oasis/Default.aspx';

const search = {
  city: 'Sydney',
  state: 'NSW'
};

(async () => {

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseUrl);

  await page.click('button.select-book-type-button');

  await page.waitForLoadState('networkidle');

  await page.fill('#ContentPlaceHolder1_SelectLocation1_txtSuburb', search.city);

  await page.selectOption('select#ContentPlaceHolder1_SelectLocation1_ddlState', search.state);

  await Promise.all([
    page.click('input.blue-button'),
    page.waitForNavigation(),
  ]);

  const locations = await page.$$("div#ContentPlaceHolder1_SelectLocation1_divLocations");
  if (locations.length) {
    console.log('Found locations!')
    const foundLocations = await page.$$eval("table", (nodes) =>
      nodes.map((n) => n.innerText)
    );

    console.log(foundLocations)
  } else {
    console.log('No locations Found :(')
  }

  await browser.close();

})();