// src/services/localStorageService.js

const STORAGE_KEY = 'gmatPrepData';

// Initialize default storage structure
const getDefaultData = () => ({
  lessonProgress: {},
  testAttempts: {}
});

// Get all stored data
const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultData();
  } catch (error) {
    console.error('Error reading localStorage:', error);
    return getDefaultData();
  }
};

// Save all data
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Lesson Progress Functions
export const saveLessonProgress = (section, chapterId, topicId) => {
  const data = getStoredData();
  
  if (!data.lessonProgress[section]) {
    data.lessonProgress[section] = {};
  }
  
  if (!data.lessonProgress[section][chapterId]) {
    data.lessonProgress[section][chapterId] = [];
  }
  
  if (!data.lessonProgress[section][chapterId].includes(topicId)) {
    data.lessonProgress[section][chapterId].push(topicId);
    saveData(data);
  }
};

export const getCompletedLessons = (section) => {
  const data = getStoredData();
  const sectionData = data.lessonProgress[section] || {};
  
  return Object.entries(sectionData).flatMap(([chapterId, topicIds]) =>
    topicIds.map(topicId => ({ chapterId, topicId }))
  );
};

// Test Attempt Functions
export const saveTestAttempt = (testData) => {
  const data = getStoredData();
  
  if (!data.testAttempts[testData.section]) {
    data.testAttempts[testData.section] = [];
  }
  
  data.testAttempts[testData.section].push({
    chapterId: testData.chapterId,
    difficulty: testData.difficulty,
    testId: testData.testId,
    answers: testData.answers,
    score: testData.score,
    totalQuestions: testData.totalQuestions,
    timeTaken: testData.timeTaken,
    timestamp: new Date().toISOString()
  });
  
  saveData(data);
};

export const getTestAttempts = (section) => {
  const data = getStoredData();
  return data.testAttempts[section] || [];
};

// Clear all data (optional)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};