const puppeteer = require('puppeteer')
const config = require("./config.json")


const scrapeLeague = async (query) => {
    const chromeOptions = {
        headless: true,
        defaultViewport: null,
        args: [
            "--incognito",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
    };
    const browser = await puppeteer.launch(chromeOptions)
    const page = await browser.newPage()
    if (query == "pl") {
        await page.goto('https://www.theguardian.com/football/' + config.pl.uniqueName + '/table')
    } else if (query == "laliga") {
        await page.goto('https://www.theguardian.com/football/' + config.laliga.uniqueName + '/table')
    } else if (query == "seriea") {
        await page.goto('https://www.theguardian.com/football/' + config.seriea.uniqueName + '/table')
    } else if (query == "bundesliga") {
        await page.goto('https://www.theguardian.com/football/' + config.bundesliga.uniqueName + '/table')
    } else if (query == "ligue1") {
        await page.goto('https://www.theguardian.com/football/' + config.ligue1.uniqueName + '/table')
    }

    const scrapedData = await page.evaluate(() =>
        Array.from(
            document.querySelectorAll('table.table--football.table--league-table tbody tr')
        )
        // .filter(node => node.querySelector('tr'))
        .map(link => ({
            name: link.querySelector('a.team-name__long').textContent.replace(/\s/g, ""),
            shortName: link.querySelector('span.team-name').getAttribute('data-abbr'),
            imgUrl: link.querySelector('img.team-crest').src,
            played: link.querySelector('td:nth-child(3)').textContent,
            won: link.querySelector('td:nth-child(4)').textContent,
            drawn: link.querySelector('td:nth-child(5)').textContent,
            lost: link.querySelector('td:nth-child(6)').textContent,
            gf: link.querySelector('td:nth-child(7)').textContent,
            ga: link.querySelector('td:nth-child(8)').textContent,
            gd: link.querySelector('td:nth-child(9)').textContent,
            point: link.querySelector('td:nth-child(10)').textContent,
        }))
    )
    await browser.close()
    return scrapedData
}

module.exports.scrapeLeague = scrapeLeague;