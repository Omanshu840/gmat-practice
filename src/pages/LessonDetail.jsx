import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Card, ListGroup } from "react-bootstrap";
import { loadLessons } from "../services/dataService";
// import {
//     saveLessonProgress,
//     getCompletedLessons,
// } from "../services/parseService";
// import {
//     saveLessonProgress,
//     getCompletedLessons,
// } from "../services/localStorageService";
import {
    saveLessonProgress,
    getCompletedLessons,
} from "../services/supabaseService";
import Breadcrumbs from "../components/Breadcrumbs";
import LoadingSpinner from "../components/LoadingSpinner";
import CompletionBadge from "../components/CompletionBadge";
import {
    BASE_URL,
    makeModalFunctional,
    makeTableSortFunctional,
    makeTabsFunctional,
} from "../services/utils";
import BookmarkButton from "../components/BookMarkButton";

const LessonDetail = () => {
    const { section, chapterId, topicId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [completedTopics, setCompletedTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // add tabs to body to reflect ttp styles
    useEffect(() => {
        // Add attributes to the body tag
        document.body.setAttribute("data-controller", "lessons");
        document.body.setAttribute("data-action", "show");

        // Optional: Clean up when component unmounts
        return () => {
            document.body.removeAttribute("data-controller");
            document.body.removeAttribute("data-action");
        };
    }, []);

    // make elements functional
    useEffect(() => {
        makeModalFunctional();
        const { tabButtons, handleClick } = makeTabsFunctional();
        const { select, handleSort } = makeTableSortFunctional();

        if (tabButtons) {
            tabButtons.forEach((btn) => {
                btn.addEventListener("click", handleClick);
            });
        }

        if (select) {
            select.addEventListener("change", handleSort);
        }

        // Cleanup
        return () => {
            if (tabButtons) {
                tabButtons.forEach((btn) => {
                    btn.removeEventListener("click", handleClick);
                });
            }
            if (select) {
                select.removeEventListener("change", handleSort);
            }
        };
    });

    useEffect(() => {
        const loadData = async () => {
            const [lessonsData, completedData] = await Promise.all([
                loadLessons(section),
                getCompletedLessons(section),
            ]);

            setLesson(lessonsData[parseInt(chapterId)]);
            setCompletedTopics(completedData);
            setLoading(false);
        };

        loadData();
    }, [section, chapterId, topicId]);

    const markAsCompleted = async () => {
        await saveLessonProgress(section, chapterId, topicId);
        setCompletedTopics((prev) => [...prev, { chapterId, topicId }]);
    };

    const isTopicCompleted = (topicIdx) => {
        return completedTopics.some(
            (item) =>
                item.chapterId === chapterId &&
                item.topicId === topicIdx.toString()
        );
    };

    if (loading) return <LoadingSpinner />;
    if (!lesson) return <div>Lesson not found</div>;

    const currentTopic = lesson.topics[parseInt(topicId)];

    return (
        <div className="lesson-detail">
            <Breadcrumbs />
            <div className="d-flex justify-content-end pb-3">
                <BookmarkButton
                    section={section}
                    chapterId={chapterId}
                    topicId={topicId}
                    topicName={currentTopic.topicName}
                />
            </div>
            <div className="lesson-body">
                <div id="lesson-content-wrapper">
                    <div className="main-content">
                        <div
                            className="lesson-content"
                            dangerouslySetInnerHTML={{
                                __html: currentTopic.content,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between">
                <Button
                    variant="primary"
                    onClick={markAsCompleted}
                    disabled={isTopicCompleted(parseInt(topicId))}
                >
                    {isTopicCompleted(parseInt(topicId))
                        ? "✓ Completed"
                        : "Mark as Completed"}
                </Button>
                <Button
                    variant="primary"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "instant",
                        })
                    }
                >
                    <Link
                        to={`${BASE_URL}/lesson/${section}/${chapterId}/${
                            parseInt(topicId) + 1
                        }`}
                    >
                        Next
                    </Link>
                </Button>
            </div>

            <Card className="mt-4 shadow-sm">
                <Card.Header>Topics in this Chapter</Card.Header>
                <ListGroup variant="flush">
                    {lesson.topics.map((topic, idx) => (
                        <ListGroup.Item
                            key={idx}
                            action
                            as={Link}
                            to={`${BASE_URL}/lesson/${section}/${chapterId}/${idx}`}
                            active={parseInt(topicId) === idx}
                            className="d-flex justify-content-between align-items-center"
                            variant="light"
                        >
                            {topic.topicName}
                            {isTopicCompleted(idx) && (
                                <CompletionBadge completed={true} />
                            )}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </div>
    );
};

export default LessonDetail;
