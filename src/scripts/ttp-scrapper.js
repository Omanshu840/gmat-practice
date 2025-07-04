const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const readline = require('readline-sync');
const fs = require('fs');

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  // Step 1: Manual login
  await page.goto('https://gmat.targettestprep.com/users/sign_in', {
    waitUntil: 'networkidle2',
  });

  console.log('🔐 Please log in manually in the browser window.');
  readline.question('✅ After login, press Enter here to continue...');

  const baseURL = 'https://gmat.targettestprep.com';
  const lessonsNumbers = [1868, 1887, 1947, 2186, 1925, 2093];
  let lessonIndex = 0;
  let currentLessonUrl = `${baseURL}/lesson/${lessonsNumbers[lessonIndex]}`;

  // Step 2: Load existing di-lessons.json if available
  let lessons = [];
  let visitedPages = new Set();
  let totalTopics = 0;
  const maxTopics = 706;

  if (fs.existsSync('di-lessons.json')) {
    console.log('📂 Reading existing di-lessons.json...');
    const data = JSON.parse(fs.readFileSync('di-lessons.json', 'utf8'));
    lessons = data;

    // Gather all existing pageNumbers to avoid re-processing
    data.forEach(chapter => {
      chapter.topics.forEach(topic => {
        visitedPages.add(topic.pageNumber);
        totalTopics++;
      });
    });
    console.log(`🔁 Resuming from ${totalTopics} existing topics...`);
  }

  while (currentLessonUrl) {
    const pageNumberMatch = currentLessonUrl.match(/\/lesson\/(\d+)/);
    const pageNumber = pageNumberMatch ? pageNumberMatch[1] : null;

    if (!pageNumber || visitedPages.has(pageNumber)) {
      console.log(`⏩ Skipping already processed page: ${pageNumber}`);
    } else {
      console.log(`🔄 Navigating to: ${currentLessonUrl}`);
      await page.goto(currentLessonUrl, { waitUntil: 'networkidle2' });

      try {
        await page.waitForSelector('div.main-content.container.lesson-content', {
          timeout: 10000,
        });

        const chapterName = await page.$eval(
          'h1.title.chapter-name',
          el => el.textContent.trim()
        );

        const topicName = await page.$eval(
          'h2.subtitle.topic-name.text-grey-1',
          el => el.textContent.trim()
        );

        const content = await page.$eval(
          'div.main-content.container.lesson-content',
          el => el.innerHTML
        );

        // Add topic to the corresponding chapter
        let chapter = lessons.find(item => item.chapterName === chapterName);
        if (!chapter) {
          chapter = {
            chapterName,
            topics: [],
          };
          lessons.push(chapter);
        }

        chapter.topics.push({
          topicName,
          pageNumber,
          content,
        });

        visitedPages.add(pageNumber);
        totalTopics++;
        console.log(`✅ Added topic ${totalTopics}/${maxTopics}: ${topicName}`);

      } catch (err) {
        console.log('⚠️ Error on page:', err.message);
        break;
      }
    }

    // Get next lesson
    const nextLessonHref = await page.$$eval(
      'a.next-topic.btn.btn-section',
      links => {
        const link = links.find(a => a.textContent.includes('Next'));
        return link ? link.getAttribute('href') : null;
      }
    );

    currentLessonUrl = nextLessonHref ? baseURL + nextLessonHref : null;
    if(!currentLessonUrl && lessonIndex < lessonsNumbers.length-1) {
      // Save updated data
      fs.writeFileSync('di-lessons.json', JSON.stringify(lessons, null, 2));
      console.log(`📦 saved: ${totalTopics} topics to di-lessons.json`);

      lessonIndex = lessonIndex+1;
      currentLessonUrl = `${baseURL}/lesson/${lessonsNumbers[lessonIndex]}`;
    }
  }

  // Save updated data
  fs.writeFileSync('di-lessons.json', JSON.stringify(lessons, null, 2));
  console.log(`📦 Final saved: ${totalTopics} topics to di-lessons.json`);

  await browser.close();
})();
