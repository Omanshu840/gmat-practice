// src/pages/Bookmarks.jsx
import { useEffect, useState } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getBookmarks } from '../services/supabaseService';
import { BASE_URL } from '../services/utils';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      setLoading(true);
      try {
        const data = await getBookmarks();
        setBookmarks(data);
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, []);

  if (loading) return <div>Loading bookmarks...</div>;

  return (
    <div>
      <h2>Your Bookmarked Topics</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet. Click the bookmark icon on lessons to save them.</p>
      ) : (
        <ListGroup>
          {bookmarks.map((bookmark, index) => (
            <ListGroup.Item key={index}>
              <Link to={`${BASE_URL}/lesson/${bookmark.section}/${bookmark.chapter_id}/${bookmark.topic_id}`}>
                {bookmark.section} - Chapter {bookmark.chapter_id}, Topic {bookmark.topic_name}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Bookmarks;