const { Browser, By, until, Builder, Select, Key } = require("selenium-webdriver");
const Chrome = require('selenium-webdriver/chrome');
const path = require("path");
const assert = require('node:assert');

async function clearWebField(element){
    while(!await element.getAttribute("value") == ""){
        await element.sendKeys(Key.BACK_SPACE);
    }
}

describe('Product Update Test', function () {
    let driver;

    before(async function () {
        driver = new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(new Chrome.Options().addArguments("--disable-search-engine-choice-screen"))
            .build();
    });

    after(() => {
        driver.quit()
    });

    it('Should be able to update a product successfully', async function () {

        await driver.manage().setTimeouts({ implicit: 5000 });

        // Navigate to URL
        await driver.get('http://localhost:3010/product-portfolio-admin-panel/public-test-mode');

        // Press edit
        await driver.findElement(By.xpath('//*[@id="root"]/div/div[6]/div[2]/div[1]/div[2]/button[1]')).click();

        // Is the edit card visible?
        let result = await driver.findElement(By.className("productcard-edit")).isDisplayed();
        assert.equal(result, true)

        // References to the edit card
        let editForm = await driver.findElement(By.css('form'));
        const imageUrl = await editForm.findElement(By.id('mp_image_url'));
        const productName = await driver.findElement(By.id('mp_name'));
        const productionCountryElement = await driver.findElement(By.id('mp_c_id_production'));
        const productionCountry = new Select(productionCountryElement)
        const color = await driver.findElement(By.id('mp_color'));
        const price = await driver.findElement(By.id('mp_price'));
        const weight = await driver.findElement(By.id('mp_weight_kg'));

        // Editing image, production country, price, weight, and product name
        await clearWebField(productName);
        await new Promise(r => setTimeout(r, 100));
        await productName.sendKeys("Selenium");

        await imageUrl.sendKeys('https://picsum.photos/seed/674/200/300');
        await editForm.findElement(By.xpath("//*[text()='Load']")).click();

        await productionCountry.selectByVisibleText('Morocco');

        await clearWebField(price);
        await price.sendKeys("199.94");

        // Ensure at least one value changes
        const currentWeight = await weight.getAttribute("value");
        let randomNumberString = currentWeight;
        while (randomNumberString == currentWeight) {
            randomNumberString = ((Math.floor(Math.random() * (400 - 100 + 1)) + 100)/10).toString();
        }
        await clearWebField(weight);
        await weight.sendKeys(randomNumberString);

        // Saving
        await editForm.findElement(By.xpath("//*[text()='Save']")).click();

        // Checking notification entry
        await new Promise(r => setTimeout(r, 100));
        const notificationDiv = await driver.findElement(By.xpath('//*[@id="notification-container"]/div[last()]/div'));
        const notificationText = await notificationDiv.getText()

        assert.equal(notificationText.includes("modified"), true);
    });
});