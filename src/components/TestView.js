import React, { useState } from "react";
import { Breadcrumb, Button, Container, Row } from "react-bootstrap";

const TestView = ({ sectionName, subSectionName, testName, questions }) => {
    const [qIndex, setQIndex] = useState(0);

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>{sectionName}</Breadcrumb.Item>
                <Breadcrumb.Item>{subSectionName}</Breadcrumb.Item>
                <Breadcrumb.Item active>{testName}</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className="mb-3"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    Question {qIndex + 1} of {questions.length}
                </div>
                <Button onClick={() => setQIndex(qIndex + 1)}>Next</Button>
            </div>
            <div className="exercise-attempt-container">
                <div className="exercise-attempt-box">
                    <div
                        className="test-question"
                        dangerouslySetInnerHTML={{
                            __html: questions[qIndex].html,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TestView;
