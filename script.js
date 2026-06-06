// ----------------------
// QUIZ DATA
// ----------------------

const quizData = {

html: {

easy: [
{
question:"What does HTML stand for?",
answers:["Hyper Text Markup Language","Home Tool Markup Language","Hyper Transfer Machine Language","Hyper Text Main Language"],
correct:0
},
{
question:"Which tag creates a paragraph?",
answers:["<p>","<h1>","<div>","<span>"],
correct:0
}
],

medium: [
{
question:"Which tag creates a hyperlink?",
answers:["<a>","<link>","<url>","<href>"],
correct:0
}
],

hard: [
{
question:"Which attribute opens a link in a new tab?",
answers:["target='_blank'","newtab","tab=open","window=new"],
correct:0
}
]

},

css: {

easy: [
{
question:"CSS is used for?",
answers:["Styling","Database","Programming","Networking"],
correct:0
},
{
question:"Which property changes text color?",
answers:["color","font-color","text-color","background"],
correct:0
}
],

medium: [
{
question:"Which layout system is one-dimensional?",
answers:["Flexbox","Grid","Float","Table"],
correct:0
}
],

hard: [
{
question:"Which unit is relative to root font size?",
answers:["rem","px","cm","vh"],
correct:0
}
]

},

javascript: {

easy: [
{
question:"JavaScript is mainly used for?",
answers:["Interactivity","Database","Styling","Hosting"],
correct:0
},
{
question:"Which keyword declares a variable?",
answers:["let","variable","define","int"],
correct:0
}
],

medium: [
{
question:"Which method logs to console?",
answers:["console.log()","print()","echo()","write()"],
correct:0
}
],

hard: [
{
question:"Convert JSON string to object?",
answers:["JSON.parse()","JSON.stringify()","parseJSON()","toObject()"],
correct:0
}
]

}

};

// ----------------------
// ELEMENTS
// ----------------------

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");

const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

const resultBox = document.getElementById("result-box");
const quizBox = document.getElementById("quiz-box");

const scoreText = document.getElementById("score-text");

const playerInput = document.getElementById("player-name");

const leaderboardList =
document.getElementById("leaderboard-list");

const themeToggle =
document.getElementById("theme-toggle");

const highScoreElement =
document.getElementById("high-score");

// ----------------------
// VARIABLES
// ----------------------

let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 20;

// ----------------------
// THEME TOGGLE
// ----------------------

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("light");

localStorage.setItem(
"theme",
document.body.classList.contains("light")
? "light"
: "dark"
);

});

if(localStorage.getItem("theme")==="light"){
document.body.classList.add("light");
}

// ----------------------
// HIGH SCORE
// ----------------------

function loadHighScore(){

const high =
localStorage.getItem("highScore") || 0;

highScoreElement.textContent = high;
}

loadHighScore();

// ----------------------
// START QUIZ
// ----------------------

startBtn.addEventListener("click",()=>{

const player =
playerInput.value.trim();

if(player===""){
alert("Enter your name first");
return;
}

const category =
document.getElementById("category").value;

const difficulty =
document.getElementById("difficulty").value;

questions =
quizData[category][difficulty];

currentQuestion = 0;
score = 0;

if(difficulty==="easy") timeLeft=20;
if(difficulty==="medium") timeLeft=15;
if(difficulty==="hard") timeLeft=10;

quizBox.classList.remove("hidden");
resultBox.classList.add("hidden");

showQuestion();

});

// ----------------------
// SHOW QUESTION
// ----------------------

function showQuestion(){

clearInterval(timer);

resetState();

let q = questions[currentQuestion];

questionEl.textContent =
q.question;

q.answers.forEach((answer,index)=>{

const button =
document.createElement("button");

button.classList.add("answer-btn");

button.textContent = answer;

button.onclick = ()=>selectAnswer(index);

answerButtons.appendChild(button);

});

updateProgress();

startTimer();

}

// ----------------------
// TIMER
// ----------------------

function startTimer(){

let difficulty =
document.getElementById("difficulty").value;

if(difficulty==="easy") timeLeft=20;
if(difficulty==="medium") timeLeft=15;
if(difficulty==="hard") timeLeft=10;

timerEl.textContent = timeLeft;

timer = setInterval(()=>{

timeLeft--;

timerEl.textContent = timeLeft;

if(timeLeft<=0){

clearInterval(timer);

nextQuestion();

}

},1000);

}

// ----------------------
// ANSWERS
// ----------------------

function selectAnswer(index){

clearInterval(timer);

const correct =
questions[currentQuestion].correct;

const buttons =
document.querySelectorAll(".answer-btn");

buttons.forEach((btn,i)=>{

btn.disabled = true;

if(i===correct){
btn.classList.add("correct");
}

if(i===index && i!==correct){
btn.classList.add("wrong");
}

});

if(index===correct){
score++;
}

nextBtn.style.display="block";

}

// ----------------------
// NEXT
// ----------------------

nextBtn.addEventListener(
"click",
nextQuestion
);

function nextQuestion(){

currentQuestion++;

if(currentQuestion < questions.length){

showQuestion();

}else{

showResult();

}

}

// ----------------------
// RESULT
// ----------------------

function showResult(){

quizBox.classList.add("hidden");

resultBox.classList.remove("hidden");

let percentage =
Math.round(
(score/questions.length)*100
);

scoreText.innerHTML = `
👤 ${playerInput.value}<br><br>
🏆 Score: ${score}/${questions.length}<br><br>
📊 Percentage: ${percentage}%
`;

if(score > (localStorage.getItem("highScore")||0)){

localStorage.setItem(
"highScore",
score
);

loadHighScore();

}

saveLeaderboard(
playerInput.value,
percentage
);

if(percentage>=80){

confetti({
particleCount:150,
spread:120,
origin:{y:0.6}
});

}

}

// ----------------------
// LEADERBOARD
// ----------------------

function saveLeaderboard(name,score){

let board =
JSON.parse(
localStorage.getItem("leaderboard")
) || [];

board.push({name,score});

board.sort(
(a,b)=>b.score-a.score
);

board = board.slice(0,5);

localStorage.setItem(
"leaderboard",
JSON.stringify(board)
);

renderLeaderboard();

}

function renderLeaderboard(){

let board =
JSON.parse(
localStorage.getItem("leaderboard")
)||[];

leaderboardList.innerHTML="";

board.forEach(player=>{

let li =
document.createElement("li");

li.innerHTML =
`${player.name}
<span>${player.score}%</span>`;

leaderboardList.appendChild(li);

});

}

renderLeaderboard();

// ----------------------
// PROGRESS
// ----------------------

function updateProgress(){

const progress =
((currentQuestion+1)
/ questions.length) *100;

progressBar.style.width =
progress + "%";

progressText.textContent =
Math.round(progress) + "%";

}

// ----------------------
// RESET
// ----------------------

function resetState(){

nextBtn.style.display="none";

answerButtons.innerHTML="";

}

restartBtn.addEventListener(
"click",
()=>{

resultBox.classList.add("hidden");

quizBox.classList.add("hidden");

}
);