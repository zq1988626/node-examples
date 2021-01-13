const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://192.168.1.11:9080/com.kysoft.service/index/login.html');
    //await driver.findElement(By.name('q'));//.sendKeys('webdriver', Key.RETURN);
    //await driver.wait(true,1000);
    //await driver.findElement(By.id('kw')).sendKeys('12306', Key.RETURN);//.sendKeys('webdriver', Key.RETURN);
    
    driver.executeScript("$.getScript('http://127.0.0.1:8029/com.kysoft.service/demo/test.js')")
    //console.log(JSON.stringify(until.titleIs('webdriver_百度搜索')));
    //await driver.findElement(By.id('1')).click();
    //await driver.wait(until.titleIs('webdriver_百度搜索'), 1000);

    //await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } catch(ex) {
    console.error(ex);
    await driver.quit();
  }
})();