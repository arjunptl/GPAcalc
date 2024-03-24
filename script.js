document.addEventListener("DOMContentLoaded", function () {
    const courseType = document.getElementById("course-type");
    const letterGrade = document.getElementById("letter-grade");
    const credits = document.getElementById("credits");
    const addCourseBtn = document.getElementById("add-course");
    const resetBtn = document.getElementById("reset");
    const coursesTable = document.getElementById("courses-table");
    const coursesBody = document.getElementById("courses-body");
    const calculateBtn = document.getElementById("calculate");
    const gpaResult = document.getElementById("gpa");
    const weightedToggle = document.getElementById("weighted-toggle");
    const tooltip = document.querySelector(".tooltip");
    const courses = [];

    let isWeighted = false;

    // Show the tooltip text on hover
    weightedToggle.addEventListener("mouseenter", function () {
        tooltip.querySelector(".tooltiptext").style.opacity = 1;
    });

    // Hide the tooltip text after a short delay on mouse leave
    weightedToggle.addEventListener("mouseleave", function () {
        setTimeout(function () {
            tooltip.querySelector(".tooltiptext").style.opacity = 0;
        }, 3000);
    });

    // Hide the tooltip text on touch devices after a short delay
    weightedToggle.addEventListener("touchstart", function () {
        tooltip.querySelector(".tooltiptext").style.opacity = 0;
        setTimeout(function () {
            tooltip.querySelector(".tooltiptext").style.opacity = 1;
        }, 3000);
    });

    // Event listener to toggle between weighted and unweighted GPA
    weightedToggle.addEventListener("change", function () {
        isWeighted = weightedToggle.checked;
    });

    // Event listener to add a course
    addCourseBtn.addEventListener("click", function () {
        const courseTypeValue = courseType.value;
        const letterGradeValue = letterGrade.value;
        const creditsValue = parseFloat(credits.value);

        if (creditsValue > 0) {
            const row = coursesBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);

            // Capitalize the first letter of the course type
            const capitalizedCourseType = courseTypeValue.charAt(0).toUpperCase() + courseTypeValue.slice(1);

            cell1.textContent = capitalizedCourseType;
            cell2.textContent = letterGradeValue;
            cell3.textContent = creditsValue;

            // Create a delete button for each row
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", function () {
                const rowIndex = row.rowIndex - 1;  // Adjust for the header row
                courses.splice(rowIndex, 1);
                row.remove();

                // If no courses left, hide the table
                if (courses.length === 0) {
                    coursesTable.style.display = "none";
                }
            });

            cell4.appendChild(deleteButton);

            courses.push({ courseType: courseTypeValue, letterGrade: letterGradeValue, credits: creditsValue });

            // Clear the input fields
            courseType.selectedIndex = 0;
            letterGrade.selectedIndex = 0;
            credits.value = 1;

            // Show the table when a course is added
            coursesTable.style.display = "table";
        }
    });

    // Event listener to reset the form
    resetBtn.addEventListener("click", function () {
        // Clear added courses
        courses.length = 0;
        coursesBody.innerHTML = "";

        // Reset GPA result
        gpaResult.textContent = "0.00";

        // Hide the table
        coursesTable.style.display = "none";
    });

    // Event listener to calculate GPA
    calculateBtn.addEventListener("click", function () {
        if (courses.length === 0) {
            gpaResult.textContent = "0.00";
            return;
        }

        let totalPoints = 0;
        let totalCredits = 0;

        for (const course of courses) {
            // Calculate GPA based on weighted or unweighted choice
            const gpa = isWeighted
                ? getWeightedGpa(course.letterGrade, course.courseType)
                : getUnweightedGpa(course.letterGrade);

            totalPoints += gpa * course.credits;
            totalCredits += course.credits;
        }

        if (totalCredits === 0) {
            gpaResult.textContent = "0.00";
        } else {
            gpaResult.textContent = (totalPoints / totalCredits).toFixed(3);
        }
    });

    // Function to get weighted GPA based on provided table
    function getWeightedGpa(letterGrade, courseType) {
        const weightedGpaTable = {
            'A': { 'academic': 4.0, 'honors': 4.5, 'AP': 5.0 },
            'B': { 'academic': 3.0, 'honors': 3.5, 'AP': 4.0 },
            'C': { 'academic': 2.0, 'honors': 2.5, 'AP': 3.0 },
            'D': { 'academic': 1.0, 'honors': 1.5, 'AP': 2.0 },
            'F': { 'academic': 0.0, 'honors': 0.0, 'AP': 0.0 },
            'FF': { 'academic': 0.0, 'honors': 0.0, 'AP': 0.0 },
        };

        return weightedGpaTable[letterGrade][courseType] || 0.0;  // Default to 0.0 for invalid inputs
    }

    // Function to get unweighted GPA based on a simple table
    function getUnweightedGpa(letterGrade) {
        const unweightedGpaTable = {
            'A': 4.0,
            'B': 3.0,
            'C': 2.0,
            'D': 1.0,
            'F': 0.0,
            'FF': 0.0,
        };

        return unweightedGpaTable[letterGrade] || 0.0;  // Default to 0.0 for invalid inputs
    }
});
