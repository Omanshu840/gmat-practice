const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs").promises;
const path = require("path");
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

    const BASE_URL = "https://gmat.targettestprep.com";

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Load JSON
    const filePath = path.join(__dirname, "chapter_tests_with_questions.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const chapters = JSON.parse(raw);

    let skip = false;

    for (const chapter of chapters) {
        for (const sub of chapter.subSections) {
            for (const test of sub.tests) {
                if (
                    chapter.name === "Evaluate The Argument" &&
                    sub.name === "Hard Tests" &&
                    test.name === "Test 2"
                ) {
                    skip = false;
                }
                if (!skip) {
                    const fullLink =
                        BASE_URL + test.questionsLink + "#tab-question-review";
                    console.log(`📘 Starting test: ${test.name} | ${fullLink}`);
                    test.questions = [];

                    // Go to the test review page
                    await page.goto(fullLink, {
                        waitUntil: "domcontentloaded",
                    });
                    await page.waitForSelector(".question-review-table-row");

                    // Click the first question
                    const firstQuestionLink = await page.$(
                        ".question-review-table-row a.link-to-question-detail"
                    );
                    if (!firstQuestionLink) {
                        console.log(`⚠️ No question found in ${test.name}`);
                        continue;
                    }

                    const firstHref = await page.evaluate(
                        (el) => el.getAttribute("href"),
                        firstQuestionLink
                    );
                    if (!firstHref) continue;

                    await Promise.all([
                        page.waitForNavigation({
                            waitUntil: "domcontentloaded",
                        }),
                        firstQuestionLink.click(),
                    ]);

                    // Begin question loop
                    while (true) {
                        try {
                            // Wait for the question box to load
                            await page.waitForSelector(
                                ".exercise-attempt-box",
                                {
                                    timeout: 10000,
                                }
                            );

                            // Get page number from URL
                            const currentUrl = page.url();
                            const match = currentUrl.match(
                                /problem_attempts\/(\d+)/
                            );
                            const pageNumber = match ? match[1] : "unknown";

                            // Get HTML of question
                            const html = await page.$eval(
                                ".exercise-attempt-box",
                                (el) => el.innerHTML
                            );

                            test.questions.push({ pageNumber, html });

                            console.log(`✅ Saved question ${pageNumber}`);

                            // Look for the NEXT button
                            const nextButton = await page.$(
                                "a.navigation-link.next.show-overlay"
                            );
                            if (!nextButton) break;

                            const nextHref = await page.evaluate(
                                (el) => el.getAttribute("href"),
                                nextButton
                            );

                            if (nextHref === "#") {
                                console.log("🛑 Reached last question.");
                                break;
                            }

                            // Click next and wait
                            await Promise.all([
                                page.waitForNavigation({
                                    waitUntil: "domcontentloaded",
                                }),
                                nextButton.click(),
                            ]);
                        } catch (err) {
                            console.log(
                                "⚠️ Error while reading questions. Moving to next test."
                            );
                            break;
                        }
                    }

                    // Save after each test
                    await fs.writeFile(
                        path.join(
                            __dirname,
                            "chapter_tests_with_questions.json"
                        ),
                        JSON.stringify(chapters, null, 2)
                    );
                    console.log(
                        `💾 Test "${test.name}" saved with ${test.questions.length} questions.`
                    );
                    await sleep(1000);
                }
            }
        }
    }

    console.log("🎉 All tests processed and saved.");
    await browser.close();
})();
