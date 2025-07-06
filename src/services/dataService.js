

// Load lesson data for a section
export const loadLessons = async (section) => {
  try {
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