// src/components/BookmarkButton.jsx
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkFill } from 'react-bootstrap-icons';
import { toggleBookmark, isTopicBookmarked } from '../services/supabaseService';

const BookmarkButton = ({section, chapterId, topicId, topicName}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      const isBookmarked = await isTopicBookmarked(section, chapterId, topicId, topicName);
      setBookmarked(isBookmarked);
    };
    checkBookmark();
  }, [section, chapterId, topicId, topicName]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const { bookmarked: newState } = await toggleBookmark( 
        section, 
        chapterId, 
        topicId,
        topicName
      );
      setBookmarked(newState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className="btn btn-sm btn-outline-secondary"
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {bookmarked ? (
        <BookmarkFill color="var(--bs-primary)" />
      ) : (
        <Bookmark />
      )}
    </button>
  );
};

export default BookmarkButton;