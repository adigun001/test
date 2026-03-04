function registerStudent() {
    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentId").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();
    const message = document.getElementById("message");

    if (!name || !id || !studentClass) {
        message.innerText = "All fields are required!";
        message.style.color = "red";
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || {};

    if (students[id]) {
        message.innerText = "Student ID already exists!";
        message.style.color = "red";
        return;
    }

    students[id] = {
        name: name,
        class: studentClass
    };

    localStorage.setItem("students", JSON.stringify(students));

    message.innerText = "Registration successful!";
    message.style.color = "green";

    document.getElementById("studentName").value = "";
    document.getElementById("studentId").value = "";
    document.getElementById("studentClass").value = "";
}
