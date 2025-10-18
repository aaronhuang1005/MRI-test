import { Displayer } from "./Displayer.js";
import { QuestionLoader } from "./QuestionLoader.js";

let displayer = new Displayer();
let questionLoader = new QuestionLoader();

//let questions = await questionLoader.loadQuestions("https://docs.google.com/document/d/e/2PACX-1vSVkGKkMAg2qD67FaQpA-uog_fY4sgqwhNF1zWCgYibJUEbFWHNbldxu_WsB27Qj1HInyMYnaoYCknL/pub");

let questions = await questionLoader.loadQuestions("Easy_Condition 2.txt");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


console.debug(questions);
console.debug(questions[0]);

let APR = 1500;
let WAIT = 2000;
let nCorrect = 0;
for(let i = 0; i < questions.length; i++) {
    let question = document.getElementById("question");
    question.textContent = "Question " + (i+1);

    let target_1 = document.getElementById("target_1");
    let target_2 = document.getElementById("target_2");
    target_1.textContent = questions[i][0].split(" - ")[0];
    target_2.textContent = questions[i][0].split(" - ")[1];

    let noise_1 = document.getElementById("noise_1");
    let noise_2 = document.getElementById("noise_2");
    noise_1.textContent = questions[i][1];
    noise_2.textContent = questions[i][2];

    let reminder = document.getElementById("reminder");
    let option_1 = document.getElementById("option_1");
    let option_2 = document.getElementById("option_2");
    let option_3 = document.getElementById("option_3");
    reminder.textContent = `Correct pairing for "${questions[i][3]}"`;
    option_1.textContent = questions[i][4];
    option_2.textContent = questions[i][5];
    option_3.textContent = questions[i][6];

    let choice = 0;
    option_1.onclick = () => { choice = 1; };
    option_2.onclick = () => { choice = 2; };
    option_3.onclick = () => { choice = 3; };

    let answer = questions[i][7];

    displayer.show(["question"]);
    await sleep(WAIT);
    
    displayer.show(["targets", "target_1", "target_2"]);
    await sleep(APR);

    displayer.show(["cross"]);
    await sleep(WAIT);

    displayer.show(["noise", "noise_1"]);
    await sleep(APR);

    displayer.show(["cross"]);
    await sleep(WAIT);

    displayer.show(["noise", "noise_2"]);
    await sleep(APR);

    displayer.show(["cross"]);
    await sleep(WAIT);

    displayer.show(["reminder", "options", "option_1", "option_2", "option_3"]);

    await new Promise(resolve => {
        let start = Date.now();
        let intervalID = setInterval(() => {
            if(choice != 0 || Date.now() - start >= 8000) {
                clearInterval(intervalID);
                resolve("Minecraft");
            }
        }, 20);
    }); 

    if(choice == answer) { nCorrect += 1; }

    let correctRate = parseFloat(nCorrect)/parseFloat(i+1);
    APR = (correctRate >= 0.67) ? APR - 100 : APR + 200;
    APR = Math.max(APR, 200);
    APR = Math.min(APR, 5000);

    let analysis = document.getElementById("analysis");
    let datas = analysis.querySelectorAll("p");
    datas[0].textContent = `APR = ${APR}ms`;
    datas[1].textContent = 
    `Correct Rate = (\\(\\frac{正確題數(${nCorrect})}{已答題數(${i+1})} \\times 100\\%\\)) = ${(correctRate*100).toFixed(2)}%`;
    MathJax.typeset();

    displayer.show(["cross"]);
    await sleep(WAIT);
}

displayer.show(["taskFinish"]);
await sleep(WAIT);