import { Displayer } from "./Displayer_v2.js";
import { QuestionLoader } from "./QuestionLoader.js";
import { Poster } from "./writeData.js";

// 網址參數
const urlParams = new URLSearchParams(window.location.search);
const external_id = urlParams.get('external_id');
const external_session_id = urlParams.get('external_session_id');

// 表單名稱
let table = "Young_Hard";

let displayer = new Displayer(); // 顯示器，用於顯示每個 Block
let poster = new Poster(); // 用於上傳測驗數據

// 載入題目
let questionLoader = new QuestionLoader();
let questions = await questionLoader.loadQuestions("https://docs.google.com/document/d/e/2PACX-1vQJRIzM1EYpOoa3tGaYqa5Ecij4d-3Rg2qKyrxWRQx7X7gPPsGAq8vQwKE3XIqsTP6e4KVAtxQIqkBL/pub");

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

let APR = 4000; // word pairs 的呈現秒數
let NAPR = 1000; // 1 noise word 的持續時間
let WAIT = 2000; // 加號、題號的持續時間
let nCorrect = 0; // 作答正確次數
let vCorrect = []; // 答題正確與否紀錄
let vAP = []; // 紀錄每次的正確率百分比
let vPresent = [];
let vResponse = [];
let vAns = [];
let vRt = [];

// 遍歷每個 block
for(let i = 0; i < questions.length; i++) {
    // 題號
    let block = i+1;
    let question = document.getElementById("question");
    question.textContent = "Trial " + block;

    // 用於隨機排序 word pairs
    let arr = [[0,1], [2,3], [4,5], [6,7]];
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // 匹配單字
    let target_1 = document.getElementById("target_1");
    let target_2 = document.getElementById("target_2");
    let target_3 = document.getElementById("target_3");
    let target_4 = document.getElementById("target_4");
    let target_5 = document.getElementById("target_5");
    let target_6 = document.getElementById("target_6");
    let target_7 = document.getElementById("target_7");
    let target_8 = document.getElementById("target_8");
    target_1.textContent = questions[i][arr[0][0]];
    target_2.textContent = questions[i][arr[0][1]];
    target_3.textContent = questions[i][arr[1][0]];
    target_4.textContent = questions[i][arr[1][1]];
    target_5.textContent = questions[i][arr[2][0]];
    target_6.textContent = questions[i][arr[2][1]];
    target_7.textContent = questions[i][arr[3][0]];
    target_8.textContent = questions[i][arr[3][1]];

    // 干擾單字
    let noise_1 = document.getElementById("noise_1");
    let noise_2 = document.getElementById("noise_2");
    noise_1.textContent = questions[i][8];
    noise_2.textContent = questions[i][9];

    // 提示、選項
    let reminder = document.getElementById("reminder");
    let option_1 = document.getElementById("option_1");
    let option_2 = document.getElementById("option_2");
    let option_3 = document.getElementById("option_3");
    reminder.textContent = `Correct pairing for "${questions[i][10]}"`;
    option_1.textContent = questions[i][11];
    option_2.textContent = questions[i][12];
    option_3.textContent = questions[i][13];

    // 點擊事件
    let choice = 0;
    option_1.onclick = () => { choice = 1; };
    option_2.onclick = () => { choice = 2; };
    option_3.onclick = () => { choice = 3; };

    // 正確答案編號
    let answer = parseInt(questions[i][14]);

    // 正確答案單字
    let ans = questions[i][parseInt(answer) + 10];
    vAns.push(ans);

    // 顯示題號
    displayer.show(["question"]);
    await sleep(WAIT);
    
    // 顯示匹配單字
    displayer.show([
        "targets",
        "pair_1", "target_1", "target_2", 
        "pair_2", "target_3", "target_4", 
        "pair_3", "target_5", "target_6", 
        "pair_4", "target_7", "target_8"
    ]);
    await sleep(APR);

    // 顯示加號
    displayer.show(["cross"]);
    await sleep(WAIT);

    // 顯示干擾單字 1
    displayer.show(["noise", "noise_1"]);
    await sleep(NAPR);

    // 顯示加號
    displayer.show(["cross"]);
    await sleep(WAIT);

    // 顯示干擾單字 2
    displayer.show(["noise", "noise_2"]);
    await sleep(NAPR);

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
    let response = (choice > 0) ? questions[i][choice + 10] : "NULL";
    vResponse.push(response);

    nCorrect = 0; // 歸零
    vCorrect.push(choice == answer); // 紀錄答題正確與否
    if(vCorrect.length > 10) vCorrect.shift(); // 最多保留最近十筆作答正確與否的資料

    // 計算最近 10 筆內的答對題數
    for(let i = 0; i < vCorrect.length; i++)
        nCorrect += vCorrect[i];

    // 計算正確率(答對題數/答題數(最高10筆))
    let correctRate = parseFloat(nCorrect)/parseFloat(vCorrect.length);
    correctRate = correctRate.toFixed(2);
    correctRate = parseFloat(correctRate);

    // 紀錄正確率
    vAP.push(correctRate * 100);

    // 根據閾值、正確率，增減 Presentation Time
    vPresent.push(APR);

    // 如果正確率剛好在 criterion 上，就不 PR 就不變
    if(correctRate > 0.67) {
        APR -= 400;
    }else if(correctRate < 0.67) {
        APR += 600;
    }

    // 取最大最小值
    APR = Math.max(APR, 2000);
    APR = Math.min(APR, 10000);

    // 顯示加號
    displayer.show(["cross"]);
    await sleep(WAIT);
}

// 上傳資料中
displayer.show(["uploading"]);
let success = await new Promise(async (resolve, reject) => {
    // 上傳資料
    let status = await poster.writeData(external_id, table, vPresent, vResponse, vAns, vRt, vAP);

    // 檢查狀態
    if(status) {
        resolve(true);
    }else {
        reject(false);
    }
});

// 完成代碼
const completionCode = "C7NT30YK";
const completionURL = `https://app.prolific.com/submissions/complete?cc=${completionCode}`;

// 如果上傳成功，導向 Prolific 完成頁面
if(success) {
    // 顯示完成
    displayer.show(["taskFinish"]);
    await sleep(WAIT);

    console.log("All the data has been uploaded successfully.");
    window.location.replace(completionURL);
    
}else {
    alert('Error occured while sending data, please try again later.');
}