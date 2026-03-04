// ==============================
// ADMIN PASSWORD
// ==============================

const ADMIN_PASSWORD = "admin123";


// ==============================
// ADMIN LOGIN
// ==============================

function loginAdmin() {

    const pass = document.getElementById("adminPass").value;

    if (pass === ADMIN_PASSWORD) {

        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";

        loadAdminPanel();

    } else {
        alert("Wrong password!");
    }
}


// ==============================
// LOAD ADMIN PANEL
// ==============================

function loadAdminPanel(){

    loadRegisteredStudents();
    loadExamResults();
}


// ==============================
// LOAD REGISTERED STUDENTS
// ==============================

function loadRegisteredStudents(){

    let students = JSON.parse(localStorage.getItem("students")) || {};
    let registeredHTML = "";

    if(Object.keys(students).length === 0){

        registeredHTML = "<p>No registered students yet.</p>";

    } else {

        registeredHTML += `
        <table>
            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
            </tr>
        `;

        for(let id in students){

            registeredHTML += `
            <tr>
                <td>${id}</td>
                <td>${students[id].name}</td>
                <td>${studentClass}</td>
            </tr>
            `;
        }

        registeredHTML += "</table>";
    }

    document.getElementById("registeredTable").innerHTML = registeredHTML;
}


// ==============================
// LOAD EXAM RESULTS
// ==============================

function loadExamResults(){

    let resultsHTML = `
    <table>
        <tr>
            <th>Student ID</th>
            <th>Subject</th>
            <th>Score</th>
            <th>Action</th>
        </tr>
    `;

    let foundResult = false;

    for(let i = 0; i < localStorage.length; i++){

        let key = localStorage.key(i);

        // Skip the students registration storage
        if(key === "students") continue;

        // Results stored as ID_subject
        if(key.includes("_")){

            let result = JSON.parse(localStorage.getItem(key));

            if(result && result.score !== undefined){

                let parts = key.split("_");
                let studentID = parts[0];
                let subject = parts[1];

                resultsHTML += `
                <tr>
                    <td>${studentID}</td>
                    <td>${subject.toUpperCase()}</td>
                    <td>${result.score} / ${result.total}</td>
                    <td>
                        <button onclick="deleteResult('${key}')">Delete</button>
                    </td>
                </tr>
                `;

                foundResult = true;
            }
        }
    }

    resultsHTML += "</table>";

    if(!foundResult){
        resultsHTML = "<p>No exam attempts yet.</p>";
    }

    document.getElementById("resultsTable").innerHTML = resultsHTML;
}


// ==============================
// DELETE SINGLE RESULT
// ==============================

function deleteResult(key){

    if(confirm("Delete this result?")){

        localStorage.removeItem(key);
        loadExamResults();
    }
}


// ==============================
// CLEAR ALL RESULTS
// ==============================

function clearAllResults(){

    if(confirm("Clear ALL exam results?")){

        for(let i = 0; i < localStorage.length; i++){

            let key = localStorage.key(i);

            if(key !== "students" && key.includes("_")){
                localStorage.removeItem(key);
                i--; // adjust index after removal
            }
        }

        loadExamResults();
    }
}
