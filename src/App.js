import React, { useState } from "react";
import PSLessons from "./scripts/ps-lessons.json";
import PSTests from "./scripts/ps-tests.json";
import CRLessons from "./scripts/cr-lessons.json";
import CRTests from "./scripts/cr-tests.json";
import RCLessons from "./scripts/rc-lessons.json";
import RCTests from "./scripts/rc-tests.json";
import DILessons from "./scripts/di-lessons.json";
import LessonView from "./components/LessonView";
import {
    Accordion,
    Button,
    Card,
    Col,
    Container,
    Nav,
    Row,
    Tab,
    Tabs,
} from "react-bootstrap";
import TestView from "./components/TestView";

const App = () => {
    const [lessonIndex, setLessonIndex] = useState(0);
    const [topicIndex, setTopicIndex] = useState(0);
    const [testIndex, setTestIndex] = useState(0);
    const [subSectionIndex, setSubSectionIndex] = useState(0);
    const [sstIndex, setSSTIndex] = useState(0);
    const [view, setView] = useState("home");
    const [lessons, setLessons] = useState([]);
    const [tests, setTests] = useState([]);

    const onChangeView = (newView) => {
        setView(newView);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    };

    const onNextTopic = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
        if (lessons[lessonIndex].topics.length > topicIndex + 1) {
            setTopicIndex(topicIndex + 1);
        } else if (lessons.length > lessonIndex + 1) {
            setLessonIndex(lessonIndex + 1);
            setTopicIndex(0);
        }
    };

    const sections = [
        {
            name: "Quant",
            lessons: PSLessons,
        },
        {
            name: "Critical Reasoning",
            lessons: CRLessons,
        },
        {
            name: "Reading Comprehension",
            lessons: RCLessons,
        },
        {
            name: "Data Insights",
            lessons: DILessons,
        },
    ];

    const sectionTests = [
        {
            name: "Quant",
            tests: PSTests,
        },
        {
            name: "Critical Reasoning",
            tests: CRTests
        },
        {
            name: "Reading Comprehension",
            tests: RCTests
        }
    ];

    if (view === "home") {
        return (
            <div className="mb-5">
                <Container>
                    <h1 style={{textAlign: 'center'}}>GMAT Practice</h1>
                    <Tabs defaultActiveKey="lessons" variant="pills">
                        <Tab eventKey="lessons" title="Lessons">
                            {sections.map((section) => (
                                <Row>
                                    <h2 className="mb-4 mt-5">
                                        {section.name}
                                    </h2>
                                    {section.lessons.map((lesson, lIndex) => (
                                        <Col xs={12} md={6} lg={4}>
                                            <Accordion className="lesson-card">
                                                <Accordion.Item
                                                    eventKey={`${lIndex}`}
                                                >
                                                    <Accordion.Header>
                                                        {lesson.chapterName}
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        {lesson.topics.map(
                                                            (topic, iTopic) => (
                                                                <div
                                                                    className="topic"
                                                                    onClick={() => {
                                                                        setLessons(
                                                                            section.lessons
                                                                        );
                                                                        setLessonIndex(
                                                                            lIndex
                                                                        );
                                                                        setTopicIndex(
                                                                            iTopic
                                                                        );
                                                                        onChangeView(
                                                                            "topic"
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        topic.topicName
                                                                    }
                                                                </div>
                                                            )
                                                        )}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                        </Tab>
                        <Tab eventKey="tests" title="Tests">
                            {sectionTests.map((section) => (
                                <Row>
                                    <h2 className="mb-4 mt-5">
                                        {section.name}
                                    </h2>
                                    {section.tests.map((test, tIndex) => (
                                        <Col xs={12} md={6} lg={4}>
                                            <Accordion className="lesson-card">
                                                <Accordion.Item
                                                    eventKey={`${tIndex}`}
                                                >
                                                    <Accordion.Header>
                                                        {test.name}
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        {test.subSections.map(
                                                            (
                                                                subSection,
                                                                iSS
                                                            ) => (
                                                                <div>
                                                                    <div>
                                                                        {
                                                                            subSection.name
                                                                        }
                                                                    </div>
                                                                    {subSection.tests.map(
                                                                        (
                                                                            ssTests,
                                                                            iSST
                                                                        ) => (
                                                                            <div
                                                                                className="topic"
                                                                                onClick={() => {
                                                                                    setTestIndex(
                                                                                        tIndex
                                                                                    );
                                                                                    setSubSectionIndex(
                                                                                        iSS
                                                                                    );
                                                                                    setSSTIndex(
                                                                                        iSST
                                                                                    );
                                                                                    setTests(
                                                                                        section.tests
                                                                                    );
                                                                                    setView(
                                                                                        "test"
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {
                                                                                    ssTests.name
                                                                                }
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                        </Tab>
                    </Tabs>
                </Container>
            </div>
        );
    }

    if (view === "topic") {
        return (
            <div>
                <Container>
                    <Button
                        onClick={() => onChangeView("home")}
                        style={{ marginBottom: "20px" }}
                    >
                        Home
                    </Button>
                    <LessonView
                        html={lessons[lessonIndex].topics[topicIndex].content}
                    />

                    <Button
                        onClick={() => onNextTopic()}
                        style={{ marginTop: "20px", marginBottom: "50px" }}
                    >
                        Next Topic
                    </Button>
                </Container>
            </div>
        );
    }

    if (view === "test") {
        return (
            <div>
                <Container>
                    <Button
                        onClick={() => onChangeView("home")}
                        style={{ marginBottom: "20px" }}
                    >
                        Home
                    </Button>

                    <TestView
                        sectionName={tests[testIndex].name}
                        subSectionName={tests[testIndex].subSections[subSectionIndex].name}
                        testName={
                            tests[testIndex].subSections[subSectionIndex].tests[
                                sstIndex
                            ].name
                        }
                        questions={
                            tests[testIndex].subSections[subSectionIndex].tests[
                                sstIndex
                            ].questions
                        }
                    />
                </Container>
            </div>
        );
    }
};

export default App;
