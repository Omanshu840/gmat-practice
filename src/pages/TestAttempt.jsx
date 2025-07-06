import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { loadTests } from "../services/dataService";
// import { saveTestAttempt } from "../services/parseService";
// import { saveTestAttempt } from "../services/localStorageService";
import { saveTestAttempt } from "../services/supabaseService";
import Breadcrumbs from "../components/Breadcrumbs";
import LoadingSpinner from "../components/LoadingSpinner";
import TestTimer from "../components/TestTimer";
import { BASE_URL, findTest, makeSolutionButtonFunctional, makeTableSortFunctional, makeTabsFunctional } from "../services/utils";

const TestAttempt = () => {
    const { section, chapterId, difficulty, testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    //Make tabs functional
    useEffect(() => {
        const {tabButtons, handleClick} = makeTabsFunctional();
        if(!tabButtons) return;
        tabButtons.forEach((btn) => {
            btn.addEventListener("click", handleClick);
        });

        // Cleanup
        return () => {
            tabButtons.forEach((btn) => {
                btn.removeEventListener("click", handleClick);
            });
        };
    }, [test, currentQuestion]);

    // Make table sort functional
    useEffect(() => {
        const {select, handleSort} = makeTableSortFunctional();
        if(!select) return;
        select.addEventListener("change", handleSort);

        // Cleanup
        return () => {
            select.removeEventListener("change", handleSort);
        };
    }, [test, currentQuestion]);

    // Add See Solution Button
    useEffect(() => {
        const {toggleBtn, handleClick} = makeSolutionButtonFunctional();
        if(!toggleBtn) return;
        toggleBtn.addEventListener("click", handleClick);

        // Cleanup
        return () => {
            toggleBtn.removeEventListener("click", handleClick);
        };
    }, [test, currentQuestion]);

    useEffect(() => {
        const loadTestData = async () => {
            const testsData = await loadTests(section);

            const foundTest = findTest(
                testsData,
                chapterId,
                difficulty,
                testId
            );

            if (foundTest) {
                setTest(foundTest);
                setAnswers(Array(foundTest.questions.length).fill(null));
            }

            setLoading(false);
        };

        loadTestData();
    }, [chapterId, difficulty, section, testId]);

    const handleAnswerSelect = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < test.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleSubmit = async () => {
        // Calculate score
        const score = test.questions.reduce((acc, question, idx) => {
            return acc + (answers[idx] === question.answer ? 1 : 0);
        }, 0);

        // Save attempt
        await saveTestAttempt({
            section,
            chapterId,
            difficulty,
            testId: test.name,
            answers,
            score,
            totalQuestions: test.questions.length,
            timeTaken: test.questions.length * 2 * 60, // 2 minutes per question
        });

        navigate(
            `${BASE_URL}/test-summary/${section}/${chapterId}/${difficulty}/${encodeURIComponent(
                test.name
            )}`
        );
    };

    const handleTimeout = () => {
        handleSubmit();
    };

    if (loading) return <LoadingSpinner />;
    if (!test) return <div>Test not found</div>;

    const question = test.questions[currentQuestion];
    const totalQuestions = test.questions.length;
    const timeLimit = totalQuestions * 2 * 60; // 2 minutes per question in seconds

    return (
        <div>
            <Breadcrumbs />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    Question {currentQuestion + 1} of {totalQuestions}
                </div>
                <div
                    className="options"
                    style={{ display: "flex", columnGap: "10px" }}
                >
                    {["A", "B", "C", "D", "E"].map((option) => (
                        <div
                            style={{
                                backgroundColor:
                                    answers[currentQuestion] === option
                                        ? "#277DB0"
                                        : "white",
                                padding: "10px 15px",
                                boxShadow:
                                    "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
                                color:
                                    answers[currentQuestion] === option
                                        ? "white"
                                        : "",
                            }}
                            onClick={() => handleAnswerSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
                <TestTimer initialTime={timeLimit} onTimeout={handleTimeout} />
                {currentQuestion < totalQuestions - 1 ? (
                    <Button variant="primary" onClick={handleNext}>
                        Next
                    </Button>
                ) : (
                    <Button variant="success" onClick={handleSubmit}>
                        Submit Test
                    </Button>
                )}
            </div>

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
    );
};

export default TestAttempt;
