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
    const foundLocations = await page.$$eval('table tbody .trlocation', (nodes) => {
      console.log(nodes.length)
      return nodes.map(item => {
          const location = item.querySelector('.tdlocNameTitle')
          const distance = item.querySelector('td:nth-child(3)');
          return {
              location: location.textContent.trim(),
              distance: distance.textContent.trim()
          };
      });
    });

    const foundLocationsLessThan100Km = foundLocations.filter(item => {
      return parseInt(item.distance.split(' ')[0]) < 100
    })
    console.log(`Found ${foundLocationsLessThan100Km.length} near locations. (100Km)`)
    foundLocationsLessThan100Km.forEach((item) => console.log(`${item.location} - ${item.distance}`))
  } else {
    console.log('No locations available :(')
  }

  await browser.close();

})();