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
    const chapterTestURL =
        "https://gmat.targettestprep.com/evaluations/verbal?subsection=critical+reasoning";

    await page.goto(chapterTestURL, { waitUntil: "networkidle0" });

    // Helper sleep function
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function isVisible(elementHandle) {
        return elementHandle.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return (
                style &&
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                el.offsetHeight > 0 &&
                el.offsetWidth > 0
            );
        });
    }

    while (true) {
        try {
            // Wait for play buttons
            await page.waitForSelector("a.start", { timeout: 10000 });

            const playButtons = await page.$$("a.start");

            if (playButtons.length === 0) {
                console.log("✅ No more tests available.");
                break;
            }

            console.log("🎯 Starting next available test...");

            await playButtons[0].click();
            await sleep(2000); // Allow modal to appear

            // Click on "Start Test" button in modal
            // await page.waitForSelector("#time-per-question-modal-button", {
            //     timeout: 10000,
            // });
            // await page.click("#time-per-question-modal-button");

            // Wait until at least one element with the ID appears
            await page.waitForSelector("#time-per-question-modal-button", {
                timeout: 10000,
            });

            // Get all matching elements
            const buttons = await page.$$("#time-per-question-modal-button");

            if (buttons.length >= 2) {
                const secondVisible = await isVisible(buttons[1]);

                if (secondVisible) {
                    await buttons[1].click();
                    console.log(
                        "✅ Clicked the second (visible) Start Test button"
                    );
                } else {
                    const firstVisible = await isVisible(buttons[0]);
                    if (firstVisible) {
                        await buttons[0].click();
                        console.log(
                            "⚠️ Second button not visible. Clicked the first (visible) one"
                        );
                    } else {
                        console.log(
                            "❌ Neither of the two Start Test buttons are visible"
                        );
                    }
                }
            } else if (buttons.length === 1) {
                // Fallback: Click the only one
                await page.click("#time-per-question-modal-button");
                // await buttons[0].click();
                console.log(
                    "⚠️ Only one Start Test button found, clicked that"
                );
            } else {
                console.log("❌ No Start Test buttons found");
            }

            await sleep(2000); // Allow modal to appear

            // Loop through questions
            while (true) {
                try {
                    // Wait for question block
                    await page.waitForSelector("div.styledRadio", {
                        timeout: 10000,
                    });

                    // Click the first visible radio-style div
                    const firstOption = await page.$("div.styledRadio");
                    if (firstOption) {
                        await firstOption.click();
                        await sleep(500);
                    }

                    // Click "Next"
                    const nextBtn = await page.$("button.confirm-btn");
                    if (nextBtn) {
                        await nextBtn.click();
                        await sleep(1500);
                    } else {
                        break;
                    }
                } catch (err) {
                    console.log("⚠️ Possibly end of test or question issue.");
                    break;
                }
            }

            // Click "End Review"
            try {
                await page.waitForSelector("a.end-review", { timeout: 10000 });
                await page.click("a.end-review");
                console.log("✅ Test completed.");
            } catch (e) {
                console.log("⚠️ Could not find End Review button.");
            }

            // Wait and go back to Chapter Test screen
            await sleep(2000);
            await page.goto(chapterTestURL, { waitUntil: "networkidle2" });
        } catch (err) {
            console.log("🚫 Error occurred:", err);
            break;
        }
    }

    console.log("🏁 All tests attempted. Closing browser.");
    await browser.close();
})();
