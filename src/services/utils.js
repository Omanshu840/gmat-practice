export const BASE_URL = "/gmat-practice"

export const findTest = (testsData, chapterId, difficulty, testId) => {
    const chapter = testsData.find(
        (ch) => ch.name === decodeURIComponent(chapterId)
    );

    if (chapter) {
        const subsection = chapter.subSections.find(
            (sub) => sub.name === decodeURIComponent(difficulty)
        );
        if (subsection) {
            const foundTest = subsection.tests.find(
                (t) => t.name === decodeURIComponent(testId)
            );
            return foundTest;
        }
    }
    return null;
};

export const makeModalFunctional = () => {
    const exerciseDiv = document.querySelector(".exercise-preview");

    if (exerciseDiv) {
        console.log("Exercise preview div found");
        exerciseDiv.onclick = function () {
            console.log("Exercise preview clicked!");
            let modal = document.querySelector(
                '[aria-labelledby="reading-comprehension-question-modal"]'
            );
            if (!modal) {
                modal = document.querySelector(
                    '[aria-labelledby="table-analysis-question-modal"]'
                );
            }
            if (!modal) {
                modal = document.querySelector(
                    '[aria-labelledby="multi-source-question-modal"]'
                );
            }
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
};

export const makeTabsFunctional = () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");
    const sectionPanels = document.querySelectorAll(".section-panel");

    const handleClick = (e) => {
        e.preventDefault();

        // Set active tab
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const selectedTab = e.currentTarget.getAttribute("data-tab-name");

        // Show matching tab panel, hide others
        tabPanels.forEach((panel) => {
            if (panel.getAttribute("data-tab-name") === selectedTab) {
                panel.classList.remove("d-none");
            } else {
                panel.classList.add("d-none");
            }
        });

        const selectedSection =
            e.currentTarget.getAttribute("data-section-name");
        // Show matching section panel, hide others
        sectionPanels.forEach((panel) => {
            if (panel.getAttribute("data-section-name") === selectedSection) {
                panel.classList.remove("d-none");
            } else {
                panel.classList.add("d-none");
            }
        });
    };

    return { tabButtons, handleClick };
};

export const makeTableSortFunctional = () => {
    const select = document.querySelector(
        '.sort-by-wrapper select[for="table-analysis-0"]'
    );
    const table = document.querySelector("#table-analysis-0");
    const tbody = table?.querySelector("tbody");

    if (!select || !table || !tbody) return {};

    const handleSort = (e) => {
        const colIndex = parseInt(e.target.value, 10);
        if (colIndex === -1) return; // Skip "Select..."

        const rows = Array.from(tbody.querySelectorAll("tr"));

        rows.sort((rowA, rowB) => {
            const cellA = rowA.children[colIndex].textContent
                .trim()
                .replace(/[$,]/g, "");
            const cellB = rowB.children[colIndex].textContent
                .trim()
                .replace(/[$,]/g, "");

            const isNumeric =
                !isNaN(parseFloat(cellA)) && !isNaN(parseFloat(cellB));

            if (isNumeric) {
                return parseFloat(cellA) - parseFloat(cellB);
            } else {
                return cellA.localeCompare(cellB);
            }
        });

        rows.forEach((row) => tbody.appendChild(row)); // Apply sorted order
    };

    return { select, handleSort };
};

export const makeSolutionButtonFunctional = () => {
    const toggleBtn = document.querySelector(".toggle-info-box");
    const infoBox = document.querySelector(".info-box");

    if (!toggleBtn || !infoBox) return {};

    const showSpan = toggleBtn.querySelector(".show-solution");
    const hideSpan = toggleBtn.querySelector(".hide-solution");

    // Initial state: show "Show solution", hide "Hide solution"
    if (showSpan && hideSpan) {
        showSpan.style.display = "inline";
        hideSpan.style.display = "none";
        // Toggle visibility of info box
        if (!infoBox.classList.contains("d-none")) {
            infoBox.classList.toggle("d-none");
        }
    }

    const handleClick = (e) => {
        e.preventDefault();

        // Toggle visibility of info box
        infoBox.classList.toggle("d-none");

        const isVisible = !infoBox.classList.contains("d-none");

        // Toggle text/icons
        if (showSpan && hideSpan) {
            showSpan.style.display = isVisible ? "none" : "inline";
            hideSpan.style.display = isVisible ? "inline" : "none";
        }
    };

    return { toggleBtn, handleClick };
};
