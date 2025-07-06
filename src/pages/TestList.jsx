import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Row, Col, Accordion, Badge } from "react-bootstrap";
import { loadTests } from "../services/dataService";
// import { getTestAttempts } from '../services/parseService';
// import { getTestAttempts } from "../services/localStorageService";
import { getTestAttempts } from "../services/supabaseService";
import Breadcrumbs from "../components/Breadcrumbs";
import LoadingSpinner from "../components/LoadingSpinner";
import CompletionBadge from "../components/CompletionBadge";
import { BASE_URL } from "../services/utils";

const sectionNames = {
    PS: "Problem Solving",
    CR: "Critical Reasoning",
    RC: "Reading Comprehension",
    DI: "Data Insights",
};

const TestList = () => {
    const { section } = useParams();
    const [tests, setTests] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [testsData, attemptsData] = await Promise.all([
                loadTests(section),
                getTestAttempts(section),
            ]);

            setTests(testsData);
            setAttempts(attemptsData);
            setLoading(false);
        };

        loadData();
    }, [section]);

    const getTestScore = (chapterId, difficulty, testId) => {
        const attempt = attempts.find(
            (a) =>
                a.testId === testId &&
                a.chapterId === chapterId &&
                a.difficulty === difficulty
        );
        return attempt ? `${attempt.score}/${attempt.totalQuestions}` : null;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <Breadcrumbs />
            <h1 className="mb-4">{sectionNames[section]} Practice Tests</h1>

            {tests.map((testCategory, catIdx) => (
                <div key={catIdx} className="mb-5">
                    <h2 className="mb-3">{testCategory.name}</h2>

                    <Row>

                    {testCategory.subSections.map((subsection, subIdx) => (
                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Accordion
                            key={subIdx}
                            defaultActiveKey="0"
                            className=""
                        >
                            <Accordion.Item eventKey={subIdx.toString()}>
                                <Accordion.Header>
                                    {subsection.name}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row xs={1} md={2} lg={2} className="g-3 test-card-container">
                                        {subsection.tests.map(
                                            (test, testIdx) => {
                                                const score = getTestScore(
                                                    testCategory.name,
                                                    subsection.name,
                                                    test.name
                                                );

                                                return (
                                                    <Col key={testIdx}>
                                                        <Card className="test-card card-hover shadow-sm">
                                                            <Card.Body>
                                                                <Card.Title>
                                                                    <div>{test.name}</div>
                                                                    <CompletionBadge
                                                                        completed={(score)? true : false}
                                                                    />
                                                                </Card.Title>
                                                                <Card.Text>
                                                                    {
                                                                        test
                                                                            .questions
                                                                            .length
                                                                    }{" "}
                                                                    questions
                                                                </Card.Text>
                                                                <Link
                                                                    to={`${BASE_URL}/tests/${section}/${encodeURIComponent(
                                                                        testCategory.name
                                                                    )}/${encodeURIComponent(
                                                                        subsection.name
                                                                    )}/${encodeURIComponent(
                                                                        test.name
                                                                    )}`}
                                                                    className="stretched-link"
                                                                />
                                                            </Card.Body>
                                                        </Card>
                                                        {score && (
                                                            <Link
                                                                to={`${BASE_URL}/test-summary/${section}/${encodeURIComponent(
                                                                    testCategory.name
                                                                )}/${encodeURIComponent(
                                                                    subsection.name
                                                                )}/${encodeURIComponent(
                                                                    test.name
                                                                )}`}
                                                            >
                                                                <Badge
                                                                    bg="info"
                                                                    className="mb-2 mt-2"
                                                                >
                                                                    Score:{" "}
                                                                    {score}
                                                                </Badge>
                                                            </Link>
                                                        )}
                                                    </Col>
                                                );
                                            }
                                        )}
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                      </Col>
                    ))}

                    </Row>
                </div>
            ))}
        </div>
    );
};

export default TestList;
