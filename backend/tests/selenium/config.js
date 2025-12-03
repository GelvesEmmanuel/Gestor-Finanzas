const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

const service = new chrome.ServiceBuilder(chromedriver.path);

const createDriver = async () => {
  const options = new chrome.Options();
  options.setChromeBinaryPath('C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe');
  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();
  return driver;
};

module.exports = { createDriver };
