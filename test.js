let questions = [
    {
        question: "What is 2 + 2?",
        options: ["2", "3", "4", "5"],
        answer: 2
    },
    {
        question: "Capital of Nigeria?",
        options: ["Lagos", "Abuja", "Kano", "Ibadan"],
        answer: 1
    }
];

let score = 0;
let timeLeft = 120;
let timer;

function startExam() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("examScreen").style.display = "block";
    displayAllQuestions();
    startTimer();
}

function displayAllQuestions() {
    let container = document.getElementById("questionContainer");
    container.innerHTML = "";

    questions.forEach((q, qIndex) => {
        let questionBlock = document.createElement("div");
        questionBlock.classList.add("question-block");

        questionBlock.innerHTML = `
            <h3>${qIndex + 1}. ${q.question}</h3>
            ${q.options.map((opt, optIndex) => `
                <label>
                    <input type="radio" 
                           name="question${qIndex}" 
                           value="${optIndex}">
                    ${String.fromCharCode(65 + optIndex)}. ${opt}
                </label>
            `).join("")}
        `;

        container.appendChild(questionBlock);
    });
}

function submitExam() {
    score = 0;

    questions.forEach((q, qIndex) => {
        let selected = document.querySelector(
            `input[name="question${qIndex}"]:checked`
        );

        if (selected && parseInt(selected.value) === q.answer) {
            score++;
        }
    });

    clearInterval(timer);
    document.getElementById("examScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";
    document.getElementById("score").innerText =
        "Your Score: " + score + " / " + questions.length;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText =
            "Time: " + timeLeft + "s";

        if (timeLeft <= 0) {
            clearInterval(timer);
            submitExam();
        }
    }, 1000);
}
