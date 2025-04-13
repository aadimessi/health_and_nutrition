// 🔹 Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Firebase Configuration
const firebaseConfig = {  
  apiKey: "AIzaSyAx2uEtVqd-H7Y9A_rtJROsWsJ5jUFGREg",
  authDomain: "health-and-nutrition-c6d82.firebaseapp.com",
  projectId: "health-and-nutrition-c6d82",
  storageBucket: "health-and-nutrition-c6d82.firebasestorage.app",
  messagingSenderId: "859137903870",
  appId: "1:859137903870:web:c16fb7469403c6245a69af",
  measurementId: "G-2WPGZJ6QZ7"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Function to Add Question to Firestore
async function addQuestion() {
    const questionText = document.getElementById('question-input').value.trim();
    const options = [
        document.getElementById('option1').value.trim(),
        document.getElementById('option2').value.trim(),
        document.getElementById('option3').value.trim(),
        document.getElementById('option4').value.trim()
    ];
    const correctAnswerIndex = document.getElementById('correct-answer').value;
    const correctAnswer = options[correctAnswerIndex]; // Store correct answer as text
    const saveButton = document.getElementById("saveQuestionBtn");

    if (!questionText || options.includes("")) {
        alert("⚠️ Please fill in all fields!");
        return;
    }

    saveButton.disabled = true; // Disable button to prevent multiple submissions

    try {
        await addDoc(collection(db, "quizQuestions"), {
            question: questionText,
            options: options,
            correctAnswer: correctAnswer
        });

        alert("✅ Question added successfully!");
        clearQuestionFields();
        displayQuestions(); // Refresh displayed questions
    } catch (error) {
        console.error("❌ Error adding question:", error);
        alert("Failed to save question.");
    } finally {
        saveButton.disabled = false; // Re-enable button
    }
}

// 🔹 Function to Display Questions from Firebase
async function displayQuestions() {
    const questionList = document.getElementById("question-list");
    questionList.innerHTML = "Loading...";

    try {
        const querySnapshot = await getDocs(collection(db, "quizQuestions"));
        questionList.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const questionData = docSnap.data();
            const questionId = docSnap.id;
            let li = document.createElement("li");
            li.innerHTML = `${questionData.question} <button onclick="deleteQuestion('${questionId}')">❌ Delete</button>`;
            questionList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error loading questions:", error);
        questionList.innerHTML = "Failed to load questions.";
    }
}

// 🔹 Function to Add Student to Firestore
async function addStudent() {
    const studentName = document.getElementById('student-name').value.trim();
    const studentID = document.getElementById('student-id').value.trim();
    const saveStudentBtn = document.getElementById("saveStudentBtn");

    if (!studentName || !studentID) {
        alert("⚠️ Please enter both student name and ID!");
        return;
    }

    saveStudentBtn.disabled = true; // Disable button during submission

    try {
        await addDoc(collection(db, "students"), {
            name: studentName,
            id: studentID
        });

        alert("✅ Student added successfully!");
        clearStudentFields();
        displayStudents(); // Refresh student list
    } catch (error) {
        console.error("❌ Error adding student:", error);
        alert("Failed to add student.");
    } finally {
        saveStudentBtn.disabled = false; // Re-enable button
    }
}

// 🔹 Function to Display Students from Firestore
async function displayStudents() {
    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "Loading...";

    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        studentList.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const studentData = docSnap.data();
            const studentId = docSnap.id;
            let li = document.createElement("li");
            li.innerHTML = `${studentData.name} (ID: ${studentData.id}) <button onclick="deleteStudent('${studentId}')">❌ Delete</button>`;
            studentList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error loading students:", error);
        studentList.innerHTML = "Failed to load students.";
    }
}

// 🔹 Function to Delete a Student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        await deleteDoc(doc(db, "students", id));
        alert("🗑️ Student deleted successfully!");
        displayStudents(); // Refresh the list
    } catch (error) {
        console.error("❌ Error deleting student:", error);
        alert("Failed to delete student.");
    }
}

// 🔹 Function to Clear Input Fields
function clearQuestionFields() {
    document.getElementById('question-input').value = "";
    document.getElementById('option1').value = "";
    document.getElementById('option2').value = "";
    document.getElementById('option3').value = "";
    document.getElementById('option4').value = "";
    document.getElementById('correct-answer').selectedIndex = 0;
}

function clearStudentFields() {
    document.getElementById('student-name').value = "";
    document.getElementById('student-id').value = "";
}

// 🔹 Event Listeners
document.getElementById("saveQuestionBtn").addEventListener("click", addQuestion);
document.getElementById("saveStudentBtn").addEventListener("click", addStudent);

// 🔹 Call functions on Page Load
window.onload = function () {
    displayQuestions();
    displayStudents();
};
