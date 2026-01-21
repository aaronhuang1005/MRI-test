import { Displayer } from "./Displayer.js";
import { QuestionLoader } from "./QuestionLoader.js";
import { Poster } from "./writeData.js";

// 網址參數和 Prolific ID
const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('PROLIFIC_PID');

// 完成代碼
const completionCode = "C1CFNKX8"; 
const completionURL = `https://app.prolific.com/submissions/complete?cc=${completionCode}`;

// 表單名稱
let table = "Old_Easy";

let displayer = new Displayer(); // 顯示器，用於顯示每個 Block
let poster = new Poster(); // 用於上傳測驗數據

// 載入題目
let questionLoader = new QuestionLoader();
let questions = await questionLoader.loadQuestions("https://docs.google.com/document/d/e/2PACX-1vSVkGKkMAg2qD67FaQpA-uog_fY4sgqwhNF1zWCgYibJUEbFWHNbldxu_WsB27Qj1HInyMYnaoYCknL/pub");

// 暫停一段時間(毫秒)
async function sleep(ms) { 
    return new Promise(resolve => { 
        let start = performance.now(); 
        let id = setInterval(() => { 
            if(performance.now() - start >= ms) { 
                clearInterval(id); resolve(); } 
        }, 10); 
    }); 
}

let APR = 1500; // trial 1 ~ 3 的持續時間
let WAIT = 2000; // 加號、題號的持續時間
let nCorrect = 0; // 作答正確次數
let vPresent = [];
let vResponse = [];
let vAns = [];
let vRt = [];

// 遍歷每個 block
for(let i = 0; i < questions.length; i++) {
    // 題號
    let block = i+1;
    let question = document.getElementById("question");
    question.textContent = "Question " + block;

    // 匹配單字
    let target_1 = document.getElementById("target_1");
    let target_2 = document.getElementById("target_2");
    target_1.textContent = questions[i][0];
    target_2.textContent = questions[i][1];

    // 干擾單字
    let noise_1 = document.getElementById("noise_1");
    let noise_2 = document.getElementById("noise_2");
    noise_1.textContent = questions[i][2];
    noise_2.textContent = questions[i][3];

    // 提示、選項
    let reminder = document.getElementById("reminder");
    let option_1 = document.getElementById("option_1");
    let option_2 = document.getElementById("option_2");
    let option_3 = document.getElementById("option_3");
    reminder.textContent = `Correct pairing for "${questions[i][4]}"`;
    option_1.textContent = questions[i][5];
    option_2.textContent = questions[i][6];
    option_3.textContent = questions[i][7];

    // 點擊事件
    let choice = 0;
    option_1.onclick = () => { choice = 1; };
    option_2.onclick = () => { choice = 2; };
    option_3.onclick = () => { choice = 3; };

    // 正確答案編號
    let answer = parseInt(questions[i][8]);

    // 正確答案單字
    let ans = questions[i][parseInt(answer) + 4];
    vAns.push(ans);

    // 顯示題號
    displayer.show(["question"]);
    await sleep(WAIT);
    
    // 顯示匹配單字
    displayer.show(["targets", "target_1", "target_2"]);
    await sleep(APR);

    // 顯示加號
    displayer.show(["cross"]);
    await sleep(WAIT);

    // 顯示干擾單字 1
    displayer.show(["noise", "noise_1"]);
    await sleep(APR);

    // 顯示加號
    displayer.show(["cross"]);
    await sleep(WAIT);

    // 顯示干擾單字 2
    displayer.show(["noise", "noise_2"]);
    await sleep(APR);

    // 顯示加號
    displayer.show(["cross"]);
    await sleep(WAIT);

    // 顯示提示、3個選項
    displayer.show(["reminder", "options", "option_1", "option_2", "option_3"]);

    // 等待受測者回答(限 8 秒)
    let rt = performance.now();
    await new Promise(resolve => {
        let start = performance.now();
        let intervalID = setInterval(() => {
            if(choice != 0 || performance.now() - start >= 8000) {
                clearInterval(intervalID);
                resolve();
            }
        }, 1);
    });

    // 反應時間
    rt = performance.now() - rt;
    vRt.push(rt);

    // 計算目前正確作答次數、選項
    let response = (choice > 0) ? questions[i][choice + 4] : "NULL";
    vResponse.push(response);
    if(choice == answer) { nCorrect += 1; }

    // 計算正確率(答對題數/總答題數)
    let correctRate = parseFloat(nCorrect)/parseFloat(block);
    correctRate = correctRate.toFixed(2);
    correctRate = parseFloat(correctRate);

    // 根據閾值、正確率，增減 Presentation Time
    vPresent.push(APR);
    APR = (correctRate >= 0.67) ? APR - 100 : APR + 200;
    APR = Math.max(APR, 200);
    APR = Math.min(APR, 5000);

    // 顯示加號
    displayer.show(["cross"]);
    await sleep(WAIT);
}

// 上傳資料中
displayer.show(["uploading"]);
let success = await new Promise(async (resolve, reject) => {
    // 上傳資料
    let status = await poster.writeData(prolificID, table, vPresent, vResponse, vAns, vRt);

    // 檢查狀態
    if(status) {
        resolve(true);
    }else {
        reject(false);
    }
});

// 如果上傳成功，導向 Prolific 完成頁面
if(success) {
    // 顯示完成
    displayer.show(["taskFinish"]);
    await sleep(WAIT);

    console.log("All the data has been uploaded successfully.");
    window.location.replace( // 前往 Gorilla 測驗
        `https://research.sc/participant/login/dynamic/15E487BE-7D34-463D-9E44-080B497D709D?
        external_id=${external_id}&
        external_session_id=${external_session_id}`
    );
    
}else {
    alert('Error occured while sending data, please try again later.');
}