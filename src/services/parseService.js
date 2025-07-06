import Parse from 'parse/dist/parse.min.js';

const LESSON_PROGRESS_CLASS = 'LessonProgress';
const TEST_ATTEMPTS_CLASS = 'TestAttempts';

// Save lesson completion status
export const saveLessonProgress = async (section, chapterId, topicId) => {
  const LessonProgress = Parse.Object.extend(LESSON_PROGRESS_CLASS);
  const query = new Parse.Query(LessonProgress);
  
  // Check if already exists (anonymous progress tracking)
  query.equalTo('section', section);
  query.equalTo('chapterId', chapterId);
  query.equalTo('topicId', topicId);
  
  const existing = await query.first();
  if (existing) return;
  
  // Create new record if not exists
  const progress = new LessonProgress();
  progress.set('section', section);
  progress.set('chapterId', chapterId);
  progress.set('topicId', topicId);
  await progress.save();
};

// Get completed lessons for a section
export const getCompletedLessons = async (section) => {
  const LessonProgress = Parse.Object.extend(LESSON_PROGRESS_CLASS);
  const query = new Parse.Query(LessonProgress);
  query.equalTo('section', section);
  const results = await query.find();
  
  return results.map(item => ({
    chapterId: item.get('chapterId'),
    topicId: item.get('topicId')
  }));
};

// Save test attempt
export const saveTestAttempt = async (testData) => {
  const TestAttempts = Parse.Object.extend(TEST_ATTEMPTS_CLASS);
  const attempt = new TestAttempts();
  
  attempt.set('section', testData.section);
  attempt.set('testId', testData.testId);
  attempt.set('answers', testData.answers);
  attempt.set('score', testData.score);
  attempt.set('totalQuestions', testData.totalQuestions);
  attempt.set('timeTaken', testData.timeTaken);
  
  await attempt.save();
  return attempt;
};

// Get test attempts for a section
export const getTestAttempts = async (section) => {
  const TestAttempts = Parse.Object.extend(TEST_ATTEMPTS_CLASS);
  const query = new Parse.Query(TestAttempts);
  query.equalTo('section', section);
  const results = await query.find();
  
  return results.map(item => ({
    testId: item.get('testId'),
    score: item.get('score'),
    totalQuestions: item.get('totalQuestions'),
    timeTaken: item.get('timeTaken')
  }));
};