// Firebase configuration
const firebaseConfig = {
            apiKey: "AIzaSyAdvbkZaLSJsJlaAkURHACbt2cJtemBa5U",
            authDomain: "quiz-app-e8d1d.firebaseapp.com",
            projectId: "quiz-app-e8d1d",
            storageBucket: "quiz-app-e8d1d.appspot.com",
            messagingSenderId: "421848385039",
            appId: "1:421848385039:web:cbb560cf9d839752ce457a",
            measurementId: "G-MBCSZVWMZP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let questions = [];
let currentQuestionIndex = 0;

// Load questions from Firestore
function loadQuestions() {
    db.collection("questions").get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.error("No questions found in the database.");
            alert("No questions available. Please add questions in Firestore.");
            return;
        }
        
        questions = [];
        querySnapshot.forEach((doc) => {
            questions.push(doc.data());
        });
        
        if (questions.length > 0) {
            displayQuestion();
        }
    }).catch((error) => {
        console.error("Error loading questions: ", error);
    });
}

// Display the current question
function displayQuestion() {
    const questionContainer = document.getElementById("question-container");
    const optionsContainer = document.getElementById("options-container");
    
    if (!questions || questions.length === 0) {
        console.error("Questions array is empty or undefined.");
        return;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !currentQuestion.options) {
        console.error("Invalid question format or missing options.");
        return;
    }

    // Clear previous content
    questionContainer.innerHTML = currentQuestion.question || "[No question text]";
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

// Check the selected answer
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
        alert("Correct!");
    } else {
        alert("Wrong! The correct answer is: " + currentQuestion.correctAnswer);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        alert("Quiz completed!");
    }
}

// Start the quiz
window.onload = () => {
    loadQuestions();
};

// HTML example structure:
// <div id="question-container"></div>
// <div id="options-container"></div>

// Let me know if you need any adjustments! 🚀
