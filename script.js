
//Function to update the display
function updateDisplay() {
    const rows = formatContainer.querySelectorAll(".row");
    rows.forEach((row, index) => {
        const reachInput = row.querySelector("input[placeholder='Reach']");
        const likesInput = row.querySelector("input[placeholder='Likes']");
        const commentsInput = row.querySelector("input[placeholder='Comments']");
        const savesInput = row.querySelector("input[placeholder='Saves']");
        reachInput.name = `reach_${index}`;
        likesInput.name = `likes_${index}`;
        commentsInput.name = `comments_${index}`;
        savesInput.name = `saves_${index}`;
    });
}


//Makes sure that a new format is added if clicked on the addformat button
document.addEventListener("DOMContentLoaded", function () {
    const addFormatButton = document.querySelector(".add-format-button");
    const formatContainer = document.querySelector(".container");

    addFormatButton.addEventListener("click", function () {
        const newFormat = document.createElement("div");
        newFormat.classList.add("format");
        newFormat.innerHTML = `
            <div class="format-header">
                <input class="formatName" type="text" placeholder="Enter Format Name">
                <button class="add-row-button">+</button>
            </div>
            <div class="format-rows">
                <div class="row">
                    <input type="number" placeholder="Reach">
                    <input type="number" placeholder="Likes">
                    <input type="number" placeholder="Comments">
                    <input type="number" placeholder="Saves">
                </div>
            </div>
        `;
        formatContainer.insertBefore(newFormat, formatContainer.firstChild);
    });
    
    //Makes sure that a new row is added if clicked on the addrow button
    formatContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-row-button")) {
            const newRow = document.createElement("div");
            newRow.classList.add("row");
            newRow.innerHTML = `
                <input type="number" placeholder="Reach">
                <input type="number" placeholder="Likes">
                <input type="number" placeholder="Comments">
                <input type="number" placeholder="Saves">
            `;
            const format = event.target.closest(".format");
            const rows = format.querySelector(".format-rows");
            rows.appendChild(newRow);
        }
    });
});

//Analyze button:
document.addEventListener("DOMContentLoaded", function () {
    const addFormatButton = document.querySelector(".add-format-button");
    const formatContainer = document.querySelector(".container");
    const analyzeButton = document.querySelector(".analyze-button");
    const errorMessage = document.querySelector(".error-message");

    analyzeButton.addEventListener("click", function () {
        const allFormats = document.querySelectorAll(".format");

        // Check if all data is filled out for each format
        let allDataEntered = true;
        allFormats.forEach((format, index) => {
            const formatName = format.querySelector(".formatName").value;
            const rows = format.querySelectorAll(".row");
            let formatDataEntered = formatName.trim() !== "";
            rows.forEach((row) => {
                const inputs = row.querySelectorAll("input[type='number']");
                inputs.forEach((input) => {
                    if (input.value.trim() === "") {
                        formatDataEntered = false;
                    }
                });
            });
            if (!formatDataEntered) {
                allDataEntered = false;
            }
        });

        // Update the error message at the bottom
        if (!allDataEntered) {
            errorMessage.innerText = "Enter all data for all formats";
        } else {
            errorMessage.innerText = ""; // Clear the error message
        }

        // If all data is entered, proceed with analysis
        if (allDataEntered) {
            // Perform analysis here
            console.log("Analysis started...");
        }
    });
});

// Bar chart for analyzing:
document.addEventListener("DOMContentLoaded", function () {
    const formatContainer = document.querySelector(".container");
    const analyzeButton = document.querySelector(".analyze-button");

    analyzeButton.addEventListener("click", function () {
        const allFormats = document.querySelectorAll(".format");
        const chartData = {
            labels: [],
            averageComments: [],
            averageLikes: [],
            averageReach: [],
            averageSaves: [],
        };

        allFormats.forEach((format, index) => {
            const formatName = format.querySelector(".formatName").value;
            chartData.labels.push(formatName);

            const rows = format.querySelectorAll(".row");
            const comments = [];
            const likes = [];
            const reach = [];
            const saves = [];

            rows.forEach((row) => {
                const inputs = row.querySelectorAll("input[type='number']");
                const reachInput = Number(inputs[0].value);
                const likesInput = Number(inputs[1].value);
                const commentsInput = Number(inputs[2].value);
                const savesInput = Number(inputs[3].value);

                reach.push(reachInput);
                likes.push(likesInput);
                comments.push(commentsInput);
                saves.push(savesInput);
            });

            // Calculate averages
            const averageComments = comments.reduce((a, b) => a + b, 0) / comments.length;
            const averageLikes = likes.reduce((a, b) => a + b, 0) / likes.length;
            const averageReach = reach.reduce((a, b) => a + b, 0) / reach.length;
            const averageSaves = saves.reduce((a, b) => a + b, 0) / saves.length;

            chartData.averageComments.push(averageComments);
            chartData.averageLikes.push(averageLikes);
            chartData.averageReach.push(averageReach);
            chartData.averageSaves.push(averageSaves);
        });

        // Call a function to render the chart with only average stats
        renderChart(chartData);
    });
});

// Function to render the chart
function renderChart(data) {
    const canvas = document.getElementById("stats-chart");
    if (canvas) {
        // Check if a chart instance already exists and destroy it
        const chart = Chart.getChart(canvas);
        if (chart) {
            chart.destroy();
        }

        const ctx = canvas.getContext("2d");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: "Average Comments",
                        data: data.averageComments,
                        backgroundColor: "rgba(255, 99, 71, 0.5)", // Brighter color
                    },
                    {
                        label: "Average Likes",
                        data: data.averageLikes,
                        backgroundColor: "rgba(54, 162, 235, 0.5)", // Brighter color
                    },
                    {
                        label: "Average Reach",
                        data: data.averageReach,
                        backgroundColor: "rgba(153, 102, 255, 0.5)", // Brighter color
                    },
                    {
                        label: "Average Saves",
                        data: data.averageSaves,
                        backgroundColor: "rgba(255, 206, 86, 0.5)", // Brighter color
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
}
