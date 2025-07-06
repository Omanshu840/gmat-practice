import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, ListGroup, Badge, Row, Col } from "react-bootstrap";
import { loadTests } from "../services/dataService";
// import { getTestAttempts } from '../services/parseService';
// import { getTestAttempts } from "../services/localStorageService";
import { getTestAttempts } from "../services/supabaseService";
import Breadcrumbs from "../components/Breadcrumbs";
import LoadingSpinner from "../components/LoadingSpinner";
import { BASE_URL, findTest } from "../services/utils";

const TestSummary = () => {
    const { section, chapterId, difficulty, testId } = useParams();
    const [test, setTest] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // Load test data
            const testsData = await loadTests(section);
            const foundTest = findTest(
                testsData,
                chapterId,
                difficulty,
                testId
            );
            setTest(foundTest);

            // Load attempt data
            const attemptsData = await getTestAttempts(section);
            const foundAttempt = attemptsData.find(
                (a) =>
                    a.chapterId === decodeURIComponent(chapterId) &&
                    a.difficulty === decodeURIComponent(difficulty) &&
                    a.testId === decodeURIComponent(testId)
            );
            setAttempt(foundAttempt);

            setLoading(false);
        };

        loadData();
    }, [chapterId, difficulty, section, testId]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) return <LoadingSpinner />;
    if (!test || !attempt) return <div>Test results not found</div>;

    const percentage = Math.round(
        (attempt.score / attempt.totalQuestions) * 100
    );
    const variant =
        percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "danger";

    return (
        <div>
            <Breadcrumbs />
            <h1 className="mb-4">Test Summary: {test.name}</h1>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Score</Card.Title>
                            <Badge bg={variant} className="fs-1 mb-2">
                                {attempt.score}/{attempt.totalQuestions}
                            </Badge>
                            <Card.Text>{percentage}% correct</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Time Taken</Card.Title>
                            <Card.Text className="fs-3">
                                {formatTime(attempt.timeTaken)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Performance</Card.Title>
                            <Card.Text>
                                {percentage >= 70 ? (
                                    <span className="text-success">
                                        Excellent! You're ready for the real
                                        test.
                                    </span>
                                ) : percentage >= 50 ? (
                                    <span className="text-warning">
                                        Good effort. Review the questions you
                                        missed.
                                    </span>
                                ) : (
                                    <span className="text-danger">
                                        Needs improvement. Study the related
                                        lessons.
                                    </span>
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h3 className="mb-3">Question Review</h3>
            <ListGroup className="mb-4">
                {test.questions.map((question, idx) => {
                    const isCorrect = attempt.answers[idx] === question.answer;

                    return (
                        <ListGroup.Item
                            key={idx}
                            variant={isCorrect ? "success" : "danger"}
                        >
                            <div className="">
                                <div className="text-end">
                                    <Badge
                                        bg={isCorrect ? "success" : "danger"}
                                        className="mb-2"
                                    >
                                        {isCorrect ? "Correct" : "Incorrect"}
                                    </Badge>
                                    <div>
                                        Your answer:{" "}
                                        {attempt.answers[idx] || "None"}
                                    </div>
                                    <div>Correct answer: {question.answer}</div>
                                </div>
                                <div>
                                    <strong>Question {idx + 1}</strong>
                                    <div className="exercise-attempt-container">
                                        <div className="exercise-attempt-box">
                                            <div
                                                className="test-question"
                                                dangerouslySetInnerHTML={{
                                                    __html: question.html,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>

            <div className="d-flex justify-content-between">
                <Link
                    to={`${BASE_URL}/tests/${section}`}
                    className="btn btn-outline-primary"
                >
                    Back to Tests
                </Link>
                <Link
                    to={`${BASE_URL}/test/${section}/${testId}`}
                    className="btn btn-primary"
                >
                    Retake Test
                </Link>
            </div>
        </div>
    );
};

export default TestSummary;
