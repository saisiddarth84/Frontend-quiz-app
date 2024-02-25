let toggleButton = document.querySelector('.toggle-button');
const allOptions = document.querySelectorAll('#option');
const quizOptionContainer = document.querySelectorAll('.quiz-option-container');
const submitButton = document.querySelector('.submit-button');
const questionNo = document.querySelector('#ques-no span')
const displayQuestion = document.querySelector('#question');
const resultContainer = document.querySelector('.result-container');


toggleButton.addEventListener('click',function(){
  if(!toggleButton.classList.contains('active')){
    toggleButton.classList.add('active');
    document.body.classList.add('dark-mode');
    document.querySelector('.select-quiz').classList.add('select-quiz-dark-mode');
    document.querySelector('.sun').src = 'public/icon-sun-light.svg'
    document.querySelector('.moon').src = 'public/icon-moon-light.svg';
    resultContainer.style.color = "rgb(49, 62, 81)";
    quizOptionContainer.forEach(element => {
        element.style.backgroundColor = "rgb(62, 76, 97,0.6)";
        element.style.borderColor = "rgb(62, 76, 97,0.6)";
    })
    
  } else{
    toggleButton.classList.remove('active')
    document.body.classList.remove('dark-mode');
    document.querySelector('.sun').src = 'public/icon-sun-dark.svg'
    document.querySelector('.moon').src = 'public/icon-moon-dark.svg'
    quizOptionContainer.forEach(element => {
        element.style.backgroundColor = "white";
        element.style.borderColor = "white";
    })
    document.querySelector('.select-quiz').classList.remove('select-quiz-dark-mode');
  }
});

let jsonPath = 'public/data.json';
let score = 0;
let quiz;
let quizIndex = 0;
let currentQuestion = 0;
let optionIndex = 0;
let allDataQuiz;
let correctIndex;
let correctAnswerElement;
let wrongAnswerElement;


fetch(jsonPath)
    .then(response => response.json())
    .then(data => {
        allDataQuiz = data;
    })

document.querySelector('.select-quiz').addEventListener('click',(e)=>{
    document.querySelector('.select-quiz').style.display = "none";
        document.querySelector('.display-option-container').style.display = "block";
        document.querySelector('.quiz-options').style.display = "block";
        document.querySelector('.pick-subject-text').style.display = "none";
        document.querySelector('.frontend').style.display = "none";
        document.querySelector('.welcome').style.display = "none";
        document.querySelector('#ques-no').style.display = "block";
        document.querySelector('#question').style.display = "block";
        document.querySelector('.submit-button').innerHTML = "Submit Answer"

    if(e.target.classList[1] === 'html' || e.target.parentElement.classList[1] === 'html'){
        quiz = 'html';
    } else if(e.target.classList[1] === 'css' || e.target.parentElement.classList[1] === 'css'){
        quiz = 'css'
    }
    else if(e.target.classList[1] === 'js' || e.target.parentElement.classList[1] === 'js'){
        quiz = 'js'
    }
    else if(e.target.classList[1] === 'accessibility' || e.target.parentElement.classList[1] === 'accessibility'){
        quiz = 'accessibility'
    }
    document.querySelector('.show-quiz-name img').src = `public/icon-${quiz}.svg`;
    document.querySelector('.show-quiz-name div').innerText = String(quiz).toUpperCase();

    startQuiz();
})

function startQuiz(){
    questionNo.innerText = currentQuestion + 1;
    findQuizIndex(quiz);
    displayQuestion.innerText = allDataQuiz.quizzes[quizIndex].questions[currentQuestion].question;
    allOptions.forEach((ele,index) => {
        ele.innerText = allDataQuiz.quizzes[quizIndex].questions[currentQuestion].options[optionIndex++];
        if(ele.innerText === allDataQuiz.quizzes[quizIndex].questions[currentQuestion].answer){
            correctIndex = index;
        }
    })    
}

let activeOption=null;
quizOptionContainer.forEach((element,index) => {
    element.addEventListener('click',function(){
       if(activeOption){
        activeOption.classList.remove('active-quiz-option');
        activeOption.querySelector('.option-letter').style.backgroundColor = ""
       activeOption.querySelector('.option-letter').style.color = ""

       }
       activeOption = element;
       element.classList.add('active-quiz-option');
       element.querySelector('.option-letter').style.backgroundColor = " rgb(84, 0, 163)"
       element.querySelector('.option-letter').style.color = "#fff"

    })
})



function selectCorrectAnswer(){
    quizOptionContainer.forEach((element,index) =>{
        if(index === correctIndex){
            correctAnswerElement = element;
            element.classList.remove("active-quiz-option")
            element.style.borderColor = "green";
            element.lastElementChild.firstElementChild.style.display = "block";
            element.querySelector('.option-letter').style.backgroundColor = "green"; 
            element.querySelector('.option-letter').style.color = "white"; 
            element.disabled = true;
        }
        element.classList.add('disable-click');
    })
}

let isSubmit = false;
let isAnswered = false;
submitButton.addEventListener('click',function(){
    if(submitButton.innerText === 'Play Again'){
        resetHomePage();
    }
    else if(submitButton.innerText === 'Submit Quiz'){
        showQuizResult();
        
    }
    else if(!isSubmit){
        quizOptionContainer.forEach((element,index) =>{
            if(element.classList.contains('active-quiz-option')){
                isAnswered = true;
                if(index === correctIndex){
                    score++;
                    correctAnswerElement = element;
                    element.classList.remove("active-quiz-option")
                    element.style.borderColor = "green";
                    element.querySelector('#correct-icon').style.display = "block";     
                    element.querySelector('.option-letter').style.backgroundColor = "green"; 
                    element.querySelector('.option-letter').style.color = "white";     
                } else{
                    wrongAnswerElement = element;
                    element.classList.remove("active-quiz-option")
                    element.style.borderColor = "red";
                    element.querySelector('#incorrect-icon').style.display = "block";
                    element.querySelector('.option-letter').style.backgroundColor = "red";   
                }
                selectCorrectAnswer();
            }
        })
        if(isAnswered){
            submitButton.innerText = "Next Question"
            isSubmit = true;
            isAnswered = false;
        } else{
            alert('Select a option')
        }

        if(currentQuestion + 1 === 10){
            submitButton.innerText = "Submit Quiz";
        }
        
    } else {
        optionIndex = 0;
        currentQuestion++;
        submitButton.innerText = "Submit Answer";
        clearPreviousOptionSelected(correctAnswerElement,wrongAnswerElement);
        startQuiz();
    }
})

function clearPreviousOptionSelected(correctAnswerElement,wrongAnswerElement) {
    
        quizOptionContainer.forEach((element,index) =>{
            element.classList.remove('disable-click');
            element.querySelector('.option-letter').style.backgroundColor = "";  
            element.querySelector('.option-letter').style.color = "";  
        })
        if(!toggleButton.classList.contains('active')){
            correctAnswerElement.style.borderColor = "";
        } else{
            correctAnswerElement.style.borderColor = "rgb(62, 76, 97,0.6)";
        }
        correctAnswerElement.lastElementChild.firstElementChild.style.display = "none";  
        if(wrongAnswerElement){
            if(!toggleButton.classList.contains('active')){
                wrongAnswerElement.style.borderColor = "";
            } else{
                wrongAnswerElement.style.borderColor = "rgb(62, 76, 97,0.6)";
            }
        wrongAnswerElement.lastElementChild.lastElementChild.style.display = "none";
        }
        activeOption.classList.remove('active-quiz-option');
        isSubmit = false;
}

function findQuizIndex(q){
    if(q === 'html')
        quizIndex = 0;
    else if(q === 'css')
        quizIndex = 1;
    else if(q === 'js')
        quizIndex = 2;
    else if(q === 'accessibility')
        quizIndex = 3;
}

function showQuizResult(){
    document.querySelector('.quiz-options').style.display = "none";
    questionNo.parentElement.style.display = "none";
    displayQuestion.style.display = "none";
    document.querySelector('.welcome').style.display = "block"
    document.querySelector('.frontend').style.display = "block"
    document.querySelector('.welcome').innerText = "Quiz Completed"
    document.querySelector('.frontend').innerText = "Your Score is..."
    submitButton.innerText = "Play Again";
    resultContainer.style.display = "block";
    resultContainer.querySelector('img').src = `public/icon-${quiz}.svg`
    resultContainer.querySelector('.quiz-name').innerText  = String(quiz).toUpperCase();
    resultContainer.querySelector('.score').innerText = score;
    clearPreviousOptionSelected(correctAnswerElement,wrongAnswerElement)
}


function resetHomePage(){
    resultContainer.style.display = "none";
    document.querySelector('.welcome').innerText = "Welcome to"
    document.querySelector('.frontend').innerText = "Frontend Quiz!";
    document.querySelector('.select-quiz').style.display = "block";
    document.querySelector('.pick-subject-text').style.display = "block";
    document.querySelector('.display-option-container').style.display = "none"
    document.querySelector('.show-quiz-name img').src = "";
    document.querySelector('.show-quiz-name div').innerText = "";
    quizIndex = 0;
    currentQuestion = 0;
    optionIndex = 0;
    score = 0;
}