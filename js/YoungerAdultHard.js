import { Displayer } from "./Displayer.js";
import { QuestionLoader } from "./QuestionLoader.js";
import { Poster } from "./writeData.js";

const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('PROLIFIC_PID');

const completionCode = "C1CFNKX8"; 
const completionURL = `https://app.prolific.com/submissions/complete?cc=${completionCode}`;

let displayer = new Displayer();
let poster = new Poster();
let questionLoader = new QuestionLoader();
let questions = await questionLoader.loadQuestions("https://docs.google.com/document/d/e/2PACX-1vTJEcnqhVVWAbo83L51fg4gsIsI1EdMihv2CRw5S1bkQQhnB8lRBV7ZvHUeREgcm7AT_yexBAnlJhCC/pub");

async function sleep(ms) { 
    return new Promise(resolve => { 
        let start = performance.now(); 
        let id = setInterval(() => { 
            if(performance.now() - start >= ms) { 
                clearInterval(id); resolve(); } 
        }, 10); 
    }); 
}

//let test = await poster.writeData("0000", "Young_Hard", `100%`);

let APR = 1000;
let WAIT = 2000;
let nCorrect = 0;
for(let i = 0; i < questions.length; i++) {
    let question = document.getElementById("question");
    question.textContent = "Question " + (i+1);

    let target_1 = document.getElementById("target_1");
    let target_2 = document.getElementById("target_2");
    target_1.textContent = questions[i][0];
    target_2.textContent = questions[i][1];

    let noise_1 = document.getElementById("noise_1");
    let noise_2 = document.getElementById("noise_2");
    noise_1.textContent = questions[i][2];
    noise_2.textContent = questions[i][3];

    let reminder = document.getElementById("reminder");
    let option_1 = document.getElementById("option_1");
    let option_2 = document.getElementById("option_2");
    let option_3 = document.getElementById("option_3");
    reminder.textContent = `Correct pairing for "${questions[i][4]}"`;
    option_1.textContent = questions[i][5];
    option_2.textContent = questions[i][6];
    option_3.textContent = questions[i][7];

    let choice = 0;
    option_1.onclick = () => { choice = 1; };
    option_2.onclick = () => { choice = 2; };
    option_3.onclick = () => { choice = 3; };

    let answer = questions[i][8];

    console.log("Question " + (i+1));
    console.log("APR: " + APR);

    displayer.show(["question"]);
    await sleep(WAIT);
    
    displayer.show(["targets", "target_1", "target_2"]);
    let s = performance.now();
    await sleep(APR);
    console.log(`Actual waiting time 1: ${performance.now()-s} ms`);

    displayer.show(["cross"]);
    await sleep(WAIT);

    displayer.show(["noise", "noise_1"]);
    s = performance.now();
    await sleep(APR);
    console.log(`Actual waiting time 2: ${performance.now()-s} ms`);

    displayer.show(["cross"]);
    await sleep(WAIT);

    displayer.show(["noise", "noise_2"]);
    s = performance.now();
    await sleep(APR);
    console.log(`Actual waiting time 3: ${performance.now()-s} ms\n`);

    displayer.show(["cross"]);
    await sleep(WAIT);

    displayer.show(["reminder", "options", "option_1", "option_2", "option_3"]);

    await new Promise(resolve => {
        let start = performance.now();
        let intervalID = setInterval(() => {
            if(choice != 0 || performance.now() - start >= 8000) {
                clearInterval(intervalID);
                resolve();
            }
        }, 20);
    });

    if(choice == answer) { nCorrect += 1; }

    let correctRate = parseFloat(nCorrect)/parseFloat(i+1);
    correctRate = correctRate.toFixed(2);
    correctRate = parseFloat(correctRate);

    APR = (correctRate >= 0.6) ? APR - 120 : APR + 180;
    APR = Math.max(APR, 200);
    APR = Math.min(APR, 5000);

    let analysis = document.getElementById("analysis");
    let datas = analysis.querySelectorAll("p");
    datas[0].textContent = `APR = ${APR}ms`;
    datas[1].textContent = 
    `Correct Rate = (\\(\\frac{正確題數(${nCorrect})}{已答題數(${i+1})} \\times 100\\%\\)) = ${(correctRate*100).toFixed(0)}%`;
    MathJax.typeset();

    displayer.show(["cross"]);
    await sleep(WAIT);
}

displayer.show(["taskFinish"]);
await sleep(WAIT);