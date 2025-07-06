import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytvcsxfuhatupotnhbyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dmNzeGZ1aGF0dXBvdG5oYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Mzg1NDIsImV4cCI6MjA2NzMxNDU0Mn0.nh7DvJNgVj3onKMF0S5Tr0md7Ce2ecN6TQvh33GoYr4';

export const supabase = createClient(supabaseUrl, supabaseKey);


// Helper function to safely get single row
const getSingleRow = async (table, filter) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .match(filter);

  if (error) throw error;
  return data?.[0] || null; // Return first row or null
};

// Lesson Progress Functions
export const saveLessonProgress = async (section, chapterId, topicId) => {
  try {
    // Get existing progress or create default
    const existing = await getSingleRow('LessonProgress', { section }) || {
      section,
      progress: {}
    };

    // Update progress data
    const progress = existing.progress || {};
    if (!progress[chapterId]) progress[chapterId] = [];
    if (!progress[chapterId].includes(topicId)) {
      progress[chapterId].push(topicId);
      
      // Upsert the record
      const { error } = await supabase
        .from('LessonProgress')
        .upsert({ 
          section, 
          progress 
        }, { 
          onConflict: 'section' 
        });
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
};

export const getCompletedLessons = async (section) => {
  try {
    const row = await getSingleRow('LessonProgress', { section });
    const progress = row?.progress || {};
    
    return Object.entries(progress).flatMap(([chapterId, topicIds]) =>
      topicIds.map(topicId => ({ chapterId, topicId }))
    );
  } catch (error) {
    console.error('Supabase error:', error);
    return [];
  }
};

// Test Attempt Functions
export const saveTestAttempt = async (testData) => {
  try {
    // Get existing attempts or create default
    const existing = await getSingleRow('TestAttempts', { 
      section: testData.section 
    }) || {
      section: testData.section,
      attempts: []
    };

    // Add new attempt
    const attempts = existing.attempts || [];
    attempts.push({
      chapterId: testData.chapterId,
      difficulty: testData.difficulty,
      testId: testData.testId,
      answers: testData.answers,
      score: testData.score,
      totalQuestions: testData.totalQuestions,
      timeTaken: testData.timeTaken,
      timestamp: new Date().toISOString()
    });

    // Upsert the record
    const { error } = await supabase
      .from('TestAttempts')
      .upsert({
        section: testData.section,
        attempts
      }, {
        onConflict: 'section'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
};

export const getTestAttempts = async (section) => {
  try {
    const row = await getSingleRow('TestAttempts', { section });
    return row?.attempts || [];
  } catch (error) {
    console.error('Supabase error:', error);
    return [];
  }
};