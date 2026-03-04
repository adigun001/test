// ======================================
// CBT EXAM SYSTEM
// ======================================

let studentName = "";
let selectedSubject = "";
let questions = [];
let userAnswers = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 300;
let timer;


// ======================================
// SAFE SUBJECT LOADER
// ======================================

function getSubjects(){
    return {
        ict: ict || [],
        mth: mth || [],
        phy: phy || [],
        chm: chm || []
    };
}


// ======================================
// LOGIN + START EXAM
// ======================================

function loginStudent(){

    const nameInput = document.getElementById("studentName").value.trim();
    const idInput = document.getElementById("studentID").value.trim();
    const subjectInput = document.getElementById("subjectSelect").value;

    if(!nameInput || !idInput){
        alert("Enter Name and Student ID");
        return;
    }

    if(!subjectInput){
        alert("Select Subject");
        return;
    }

    // Check registered students
    let students = JSON.parse(localStorage.getItem("students")) || {};

    if(!students[idInput]){
        alert("Student not registered!");
        return;
    }

    studentName = nameInput;
    selectedSubject = subjectInput;

    const examKey = idInput + "_" + subjectInput;

    // Prevent multiple attempts
    if(localStorage.getItem(examKey)){
        const oldResult = JSON.parse(localStorage.getItem(examKey));

        document.getElementById("startScreen").style.display = "none";
        document.getElementById("resultScreen").style.display = "block";

        document.getElementById("score").innerHTML = `
            Candidate: <strong>${oldResult.name}</strong><br>
            Subject: <strong>${subjectInput.toUpperCase()}</strong><br><br>
            Score: ${oldResult.score} / ${oldResult.total}
        `;
        return;
    }

    const subjects = getSubjects();
    questions = subjects[selectedSubject];

    if(!questions || questions.length === 0){
        alert("No questions available for this subject");
        return;
    }

    shuffleArray(questions);

    userAnswers = new Array(questions.length).fill(null);
    currentQuestion = 0;
    timeLeft = 300;

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("examScreen").style.display = "block";

    showQuestion();
    startTimer();
}


// ======================================
// SHUFFLE QUESTIONS
// ======================================

function shuffleArray(array){
    for(let i=array.length-1;i>0;i--){
        let j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]] = [array[j],array[i]];
    }
}


// ======================================
// SHOW QUESTION
// ======================================

function showQuestion(){

    const q = questions[currentQuestion];
    const container = document.getElementById("questionContainer");

    container.innerHTML = `
        <h2>${currentQuestion+1}. ${q.question}</h2>

        ${q.options.map((opt,index)=>`
            <button class="${userAnswers[currentQuestion]===index?'selected':''}"
            onclick="selectAnswer(${index})">
            ${index+1}. ${opt}
            </button>
        `).join("")}
    `;

    generateQuestionNumbers();
    updateProgress();
}


// ======================================
// SELECT ANSWER
// ======================================

function selectAnswer(index){
    userAnswers[currentQuestion] = index;
    showQuestion();
}


// ======================================
// NAVIGATION
// ======================================

function nextQuestion(){
    if(currentQuestion < questions.length-1){
        currentQuestion++;
        showQuestion();
    }
}

function previousQuestion(){
    if(currentQuestion > 0){
        currentQuestion--;
        showQuestion();
    }
}


// ======================================
// QUESTION NUMBERS PANEL
// ======================================

function generateQuestionNumbers(){

    const container = document.getElementById("questionNumbers");
    container.innerHTML = "";

    questions.forEach((_,index)=>{

        const btn = document.createElement("button");
        btn.innerText = index+1;
        btn.classList.add("number-btn");

        if(userAnswers[index] !== null){
            btn.classList.add("answered");
        }

        if(index === currentQuestion){
            btn.classList.add("current");
        }

        btn.onclick = ()=>{
            currentQuestion = index;
            showQuestion();
        };

        container.appendChild(btn);
    });
}


// ======================================
// PROGRESS BAR
// ======================================

function updateProgress(){

    const answered = userAnswers.filter(a=>a!==null).length;
    const total = questions.length;

    const percent = (answered/total)*100;

    document.getElementById("progressBar").style.width = percent + "%";

    document.getElementById("progressText").innerText =
        `Answered ${answered} of ${total}`;
}


// ======================================
// TIMER
// ======================================

function startTimer(){

    clearInterval(timer);

    timer = setInterval(()=>{

        timeLeft--;

        let minutes = Math.floor(timeLeft/60);
        let seconds = timeLeft%60;

        minutes = minutes<10?"0"+minutes:minutes;
        seconds = seconds<10?"0"+seconds:seconds;

        const timerElement = document.getElementById("timer");
        timerElement.innerText = `Time: ${minutes}:${seconds}`;

        if(timeLeft <= 60){
            timerElement.style.color="red";
        }

        if(timeLeft <= 0){
            submitExam();
        }

    },1000);
}


// ======================================
// SUBMIT EXAM
// ======================================

function submitExam(){

    clearInterval(timer);

    score = 0;

    for(let i=0;i<questions.length;i++){
        if(userAnswers[i] === questions[i].answer){
            score++;
        }
    }

    const studentID = document.getElementById("studentID").value.trim();
    const examKey = studentID + "_" + selectedSubject;

    const resultData = {
        name: studentName,
        score: score,
        total: questions.length
    };

    localStorage.setItem(examKey, JSON.stringify(resultData));

    document.getElementById("examScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";

    document.getElementById("score").innerHTML = `
        Candidate: <strong>${studentName}</strong><br>
        Subject: <strong>${selectedSubject.toUpperCase()}</strong><br><br>
        Score: ${score} / ${questions.length}
    `;
}
