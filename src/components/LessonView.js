import React, { useEffect } from "react";
import { Container } from "react-bootstrap";

const LessonView = ({ html }) => {
    useEffect(() => {
        const exerciseDiv = document.querySelector(".exercise-preview");

        if (exerciseDiv) {
            console.log("Exercise preview div found");
            exerciseDiv.onclick = function () {
                console.log("Exercise preview clicked!");
                const modal = document.querySelector(
                    '[aria-labelledby="reading-comprehension-question-modal"]'
                );
                if (modal) {
                    modal.style.opacity = "1";
                    modal.style.display = "block";

                    const dialog = modal.querySelector(".modal-dialog");
                    if (dialog) {
                        dialog.style.transform = "translate(0, 0)";
                    }

                    const closeButton = modal.querySelector(
                        'button[aria-label="Close"].btn-close[data-bs-dismiss="modal"]'
                    );
                    if (closeButton) {
                        closeButton.onclick = function () {
                            modal.style.display = "none";
                            modal.style.opacity = "0";
                        };
                    }
                }
            };
        }
    }, [html]);

	useEffect(() => {
		// Add attributes to the body tag
        document.body.setAttribute("data-controller", "lessons");
        document.body.setAttribute("data-action", "show");

		// Optional: Clean up when component unmounts
        return () => {
            document.body.removeAttribute("data-controller");
            document.body.removeAttribute("data-action");
        };
	}, [])

    return (
        <div className="lesson-body">
            <div id="lesson-content-wrapper">
                <div className="main-content">
                    <div
                        className="lesson-content"
                        dangerouslySetInnerHTML={{
                            __html: html,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LessonView;
