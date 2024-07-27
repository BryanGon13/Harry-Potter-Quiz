/* Questions Data */
const quizData = [
    {
        question: "In which Harry Potter film does the endearing character Dobby face his untimely death?",
        options: ["Harry Potter and the Deathly Hallows: Part One", "Harry Potter and the Deathly Hallows: Part Two",
         "Harry Potter and the Order of the Phoenix", "Harry Potter and the Prisoner of Azkaban"],
        correct: "Harry Potter and the Deathly Hallows: Part One",
    },
    {
        question: "What spell is used to disarm an opponent in the Harry Potter series?",
        options: ["Expelliarmus", "Stupefy", "Petrificus Totalus", "Reducto"],
        correct: "Expelliarmus",
    },
    {
        question: "Which professor at Hogwarts is known for their expertise in Potions and also serves as the head of Slytherin House?",
        options: ["Severus Snape", "Horace Slughorn", "Gilderoy Lockhart", "Filius Flitwick"],
        correct: "Severus Snape",
    },
    {
        question: "What is the name of the dark wizard who seeks to conquer the wizarding world and is known as 'He-Who-Must-Not-Be-Named'?",
        options: ["Lord Voldemort", "Gellert Grindelwald", "Bellatrix Lestrange", "Ron Weasley"],
        correct: "Lord Voldemort",
    },
    {
        question: "What is the name of the magical platform at King's Cross Station that witches and wizards use to board the Hogwarts Express?",
        options: ["Platform 9¾", "Platform 8¾", "Platform 9", "Platform 109"],
        correct: "Platform 9¾",
    },
    {
        question: "What is the name of the magical map that shows the location of everyone within Hogwarts?",
        options: ["Marauders Map", "Magical Map", "Hogwarts Tracker", "Revelio"],
        correct: "Marauders Map"
    },
    {
        question: "In Harry Potter and the Half-Blood Prince, who is revealed to be the Half-Blood Prince?",
        options: ["Severus Snape", "Tom Riddle", "Harry Potter", "Sirius Black"],
        correct: "Severus Snape",
    },
    {
        question: "In Harry Potter and the Prisoner of Azkaban, who is revealed to be Harry's godfather?",
        options: ["Sirius Black", "Severus Snape", "Draco Malfoy", "Gellert Grindelwald"],
        correct: "Sirius Black",
    },
    {
        question: "In Harry Potter and the Deathly Hallows: Part 2, which Horcrux does Neville Longbottom destroy using the Sword of Gryffindor?",
        options: ["Nagini", "Tom Riddle's Diary", "Salazar Slytherins Locket", "Helga Hufflepuffs Cup"],
        correct: "Nagini",
    },
    {
        question: "Which professor teaches Transfiguration at Hogwarts?",
        options: ["Minerva McGonagall", "Filius Flitwick", "Sybill Trelawney", "Horace Slughorn"],
        correct: "Minerva McGonagall",
    },     
];
/* End of Questions Data */

/* DOM Elements */
const quizContainer = document.querySelector(".quiz-container");
const questionElement = document.querySelector(".quiz-container .question");
const optionsElement = document.querySelector(".quiz-container .options");
const nextButton = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const questionIndicator = document.querySelector(".quiz-container .question-indicator");

let questionNumber = 0;
let score = 0;
const MAX_QUESTIONS = 10;

/* Shuffle Array Function */
const shuffleArray = (array) => {
    // Create a copy of the array and shuffle it
    return array.slice().sort(() => Math.random() - 0.5);
};

// Shuffle quiz data
let shuffledQuizData = shuffleArray(quizData);

/* Reset Local Storage */
const resetLocalStorage = () => {
    // Remove all stored answers from local storage
    for (let i = 0; i < MAX_QUESTIONS; i++){
        localStorage.removeItem(`userAnswer_${i}`);
    }
};

// Reset local storage when quiz starts
resetLocalStorage();

/* Check User's Answer Function */
const checkAnswer = (e) => {
    let userAnswer = e.target.textContent;
    if (userAnswer === shuffledQuizData[questionNumber].correct) {
        // Correct answer
        score++;
        e.target.classList.add("correct");
        
        // Store the correct answer count
        let correctAnswers = localStorage.getItem("correctAnswers");
        if (!correctAnswers) {
            correctAnswers = [];
        } else {
            correctAnswers = JSON.parse(correctAnswers);
        }
        correctAnswers.push(questionNumber);
        localStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));
    } else {
        // Incorrect answer
        e.target.classList.add("incorrect");
    }

    // Store the user's answer in local storage
    localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);

    // Disable all options after an answer is selected
    let allOptions = document.querySelectorAll(".quiz-container .option");
    allOptions.forEach((o) => {
        o.classList.add("disabled");
    });
};


/* Create and Display Question Function */
const createQuestion = () => {
    // Update question indicator (e.g., "Question 1 of 10")
    questionIndicator.innerHTML = 'Question ' + (questionNumber + 1) + ' of ' + MAX_QUESTIONS;
    optionsElement.innerHTML = "";
    questionElement.innerHTML = shuffledQuizData[questionNumber].question;

    // Shuffle the options to randomize their order
    const shuffledOptions = shuffleArray(shuffledQuizData[questionNumber].options);

    // Create buttons for each option
    shuffledOptions.forEach((option) => { 
        const optionButton = document.createElement("button");
        optionButton.classList.add("option");
        optionButton.innerHTML = option;
        optionButton.addEventListener("click", (e) => {
            checkAnswer(e);
        });
        optionsElement.appendChild(optionButton);
    });
};

/* Retake Quiz Function */
const retakeQuiz = () => {
    // Reset question number and score
    questionNumber = 0;
    score = 0;
    shuffledQuizData = shuffleArray(quizData);
    resetLocalStorage();

    // Recreate the first question
    createQuestion();
    quizResult.style.display = "none";
    quizContainer.style.display = "block";
};

/* Display Quiz Result Function */
const displayQuizResult = () => {
    quizResult.style.display = "flex";
    quizContainer.style.display = "none";
    quizResult.innerHTML = "";

    // Calculate results
    const totalQuestions = MAX_QUESTIONS;
    const attemptedQuestions = Math.min(MAX_QUESTIONS, questionNumber + 1);
    const correctAnswers = localStorage.getItem("correctAnswers") ? JSON.parse(localStorage.getItem("correctAnswers")).length : 0;
    const incorrectAnswers = attemptedQuestions - correctAnswers;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    const totalScore = score; // or use a different calculation if needed

    // Create the result table
    const resultTable = document.createElement("table");
    resultTable.innerHTML = `
        <tr>
            <td>Total Questions</td>
            <td><span class="total-question">${totalQuestions}</span></td>
        </tr>
        <tr>
            <td>Questions Attempted</td>
            <td><span class="total-attempt">${attemptedQuestions}</span></td>
        </tr>
        <tr>
            <td>Correct</td>
            <td><span class="total-correct">${correctAnswers}</span></td>
        </tr>
        <tr>
            <td>Incorrect</td>
            <td><span class="total-incorrect">${incorrectAnswers}</span></td>
        </tr>
        <tr>
            <td>Percentage</td>
            <td><span class="percentage">${percentage}%</span></td>
        </tr>
        <tr>
            <td>Total Score</td>
            <td><span class="total-score">${totalScore}</span></td>
        </tr>
    `;
    quizResult.appendChild(resultTable);

    // Create and display the retake quiz button
    const retakeBtn = document.createElement("button");
    retakeBtn.classList.add("retake-btn");
    retakeBtn.innerHTML = "Retake Quiz";
    retakeBtn.addEventListener("click", retakeQuiz);
    quizResult.appendChild(retakeBtn);
};


// Initialize the first question
createQuestion();

/* Display Next Question Function */
const displayNextQuestion = () => {
    if (questionNumber >= MAX_QUESTIONS - 1){
        // Display quiz results if all questions have been answered
        displayQuizResult();
        return;
    }

    // Move to the next question
    questionNumber++;
    createQuestion();
};

// Add event listener for the "Next" button
nextButton.addEventListener("click", displayNextQuestion);
