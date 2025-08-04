
import { supabase } from './supabaseService';

// Load lesson data for a section
export const loadLessons = async (section) => {
  try {
    const data = await loadLessonsMetadata(section);
    if (data && data.length) return data;

    // Fallback to loading from JSON if Supabase data is not available
    const response = await fetch(`https://raw.githubusercontent.com/Omanshu840/data/refs/heads/main/gmat-practice/${section}.json`)
    return await response.json();
  } catch (error) {
    console.error('Error loading lessons:', error);
    return [];
  }
};

// Load test data for a section
export const loadTests = async (section) => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/Omanshu840/data/refs/heads/main/gmat-practice/${section}_tests.json`)
    return await response.json();
  } catch (error) {
    console.error('Error loading tests:', error);
    return [];
  }
};

// Most efficient version using a single query with calculated offset
export async function loadTopic(section, chapterIndex, topicIndex) {
  try {
    section = section.toLowerCase();
    
    // Get the chapter ID first
    const { data: chapters, error: chaptersError } = await supabase
      .from(`${section}_chapters`)
      .select('id')
      .order('id', { ascending: true })
      .limit(1)
      .range(chapterIndex, chapterIndex);

    if (chaptersError || !chapters || chapters.length === 0) {
      console.error('Chapter not found at index:', chapterIndex);
      return null;
    }

    const chapterId = chapters[0].id;

    // Fetch only the specific topic using LIMIT 1 and offset
    const { data: topics, error: topicsError } = await supabase
      .from(`${section}_topics`)
      .select('topic_name, page_number, content')
      .eq('chapter_id', chapterId)
      .order('id', { ascending: true })
      .limit(1)
      .range(topicIndex, topicIndex);

    if (topicsError || !topics || topics.length === 0) {
      console.error(`Topic not found at index ${topicIndex} in chapter ${chapterIndex + 1}`);
      return null;
    }

    return {
      topicName: topics[0].topic_name,
      pageNumber: topics[0].page_number,
      content: topics[0].content
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}



// Load data from Supabase
async function loadLessonsFromSupabase(section) {
  try {
    section = section.toLowerCase();

    // Query chapters with their related topics
    const { data: chapters, error } = await supabase
      .from(`${section}_chapters`)
      .select(`
        id,
        chapter_name,
        ${section}_topics (
          id,
          topic_name,
          page_number,
          content
        )
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching data:', error);
      return null;
    }

    // Transform to original format
    const transformedData = chapters.map(chapter => ({
      chapterName: chapter.chapter_name,
      topics: chapter[`${section}_topics`].map(topic => ({
        topicName: topic.topic_name,
        pageNumber: topic.page_number,
        content: topic.content
      }))
    }));

    return transformedData;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

async function loadLessonsMetadata(section) {
  try {
    section = section.toLowerCase();

    // First, get all chapters and topics WITHOUT content
    const { data: chapters, error } = await supabase
      .from(`${section}_chapters`)
      .select(`
        id,
        chapter_name,
        ${section}_topics (
          id,
          topic_name,
          page_number
        )
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }

    const transformedData = chapters.map(chapter => ({
      chapterName: chapter.chapter_name,
      topics: chapter[`${section}_topics`]
        .sort((a, b) => a.id - b.id) // Sort topics by ID
        .map(topic => ({
          topicId: topic.id,
          topicName: topic.topic_name,
          pageNumber: topic.page_number,
          content: null // Load on demand
        }))
    }));

    return transformedData;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}