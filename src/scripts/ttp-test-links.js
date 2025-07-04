const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const readline = require("readline-sync");

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    });
    const page = await browser.newPage();

    // Step 1: Manual login
    await page.goto("https://gmat.targettestprep.com/users/sign_in", {
        waitUntil: "networkidle2",
    });

    console.log("🔐 Please log in manually in the browser window.");
    readline.question("✅ After login, press Enter here to continue...");

    // Replace this URL with your actual Chapter Test screen
    const chapterTestURL = "https://gmat.targettestprep.com/evaluations/verbal?chapter_id=1685&subsection=reading+comprehension";

    await page.goto(chapterTestURL, { waitUntil: "networkidle0" });

    // Wait for the page to load the test containers
    await page.waitForSelector(".chapter-tests-container");

    // Evaluate the page and scrape data
    const results = await page.evaluate(() => {
        const chapterContainers = document.querySelectorAll(
            ".chapter-tests-container"
        );
        const data = [];

        chapterContainers.forEach((container) => {
            const chapterName =
                container.querySelector("h3.chapter-name")?.innerText?.trim() ||
                "Unknown Chapter";

            const subsections = [];
            const levels = ["easy", "medium", "hard"];

            levels.forEach((level) => {
                const sectionDiv = container.querySelector(
                    `div.level-tests.${level}`
                );
                if (sectionDiv) {
                    const viewLinks =
                        sectionDiv.querySelectorAll("a.view-results");
                    const tests = Array.from(viewLinks).map((link, index) => {
                        const href = link.getAttribute("href");
                        return {
                            name: `Test ${index + 1}`,
                            questionsLink: href,
                        };
                    });

                    if (tests.length > 0) {
                        subsections.push({
                            name: `${
                                level.charAt(0).toUpperCase() + level.slice(1)
                            } Tests`,
                            tests: tests,
                        });
                    }
                }
            });

            data.push({
                name: chapterName,
                subSections: subsections,
            });
        });

        return data;
    });

    // Save to JSON file
    fs.writeFileSync(
        "chapter_tests_with_questions.json",
        JSON.stringify(results, null, 2)
    );
    console.log("✅ Data saved to chapter_tests_results.json");

    await browser.close();
})();
