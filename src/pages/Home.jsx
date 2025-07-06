import { useState, useEffect } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import { loadLessons } from "../services/dataService";
// import { getCompletedLessons } from '../services/parseService';
// import { getCompletedLessons } from "../services/localStorageService";
import { getCompletedLessons } from "../services/supabaseService";
import CompletionBadge from "../components/CompletionBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressIndicator from "../components/ProgressIndicator";
import { BASE_URL } from "../services/utils";

const sections = [
    { id: "PS", name: "Problem Solving" },
    { id: "CR", name: "Critical Reasoning" },
    { id: "RC", name: "Reading Comprehension" },
    { id: "DI", name: "Data Interpretation" },
];

const Home = () => {
    const [lessons, setLessons] = useState({});
    const [completedLessons, setCompletedLessons] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            const allLessons = {};
            const allCompleted = {};

            for (const section of sections) {
                const [lessonData, completedData] = await Promise.all([
                    loadLessons(section.id),
                    getCompletedLessons(section.id),
                ]);

                allLessons[section.id] = lessonData;
                allCompleted[section.id] = completedData;
            }

            setLessons(allLessons);
            setCompletedLessons(allCompleted);
            setLoading(false);
        };

        loadAllData();
    }, []);

    const isTopicCompleted = (section, chapterId, topicId) => {
        return completedLessons[section]?.some(
            (item) =>
                item.chapterId === chapterId.toString() &&
                item.topicId === topicId.toString()
        );
    };

    const getCompletedCount = (section, chapter) => {
        if (!completedLessons[section]) return 0;

        return chapter.topics.filter((_, topicId) =>
            isTopicCompleted(section, chapter.id, topicId)
        ).length;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="mb-4">GMAT Prep Lessons</h1>

            {sections.map((section) => (
                <div key={section.id} className="mb-5">
                    <h2 className="mb-3">{section.name}</h2>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {lessons[section.id]?.map((chapter, chapterId) => (
                            <Col key={chapterId}>
                                <div className="lesson-card card-hover shadow-sm">
                                    <Card.Body>
                                        <ProgressIndicator
                                            completed={getCompletedCount(
                                                section.id,
                                                { ...chapter, id: chapterId }
                                            )}
                                            total={chapter.topics.length}
                                        />
                                        <Accordion>
                                            <Accordion.Item
                                                key={chapterId}
                                                eventKey={`${chapter}-${chapterId}`}
                                            >
                                                <Accordion.Header>{chapter.chapterName}</Accordion.Header>
                                                <Accordion.Body>
                                                    {chapter.topics.map(
                                                        (topic, topicId) => (
                                                            // <div className="topic">
                                                                <Link
                                                                    className="topic"
                                                                    to={`${BASE_URL}/lesson/${section.id}/${chapterId}/${topicId}`}
                                                                >
                                                                    {
                                                                        topic.topicName
                                                                    }
                                                                    <CompletionBadge
                                                                        completed={isTopicCompleted(
                                                                            section.id,
                                                                            chapterId,
                                                                            topicId
                                                                        )}
                                                                    />
                                                                </Link>
                                                            // </div>
                                                        )
                                                    )}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Card.Body>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    );
};

export default Home;
