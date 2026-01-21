let pos = document.getElementById('pos');
let cross = document.getElementById('cross');
let btnBack = document.getElementById('btnBack');
let btnNext = document.getElementById('btnNext');
let btnStart = document.getElementById('btnStart');
let divNextBack = document.getElementById('divNextBack');
let divInstrution_0 = document.getElementById('divInstrution_0');
let divInstrution_1 = document.getElementById('divInstrution_1');
let divInstrution_2 = document.getElementById('divInstrution_2');
let divInstrution_3 = document.getElementById('divInstrution_3');
let divInstrution_4 = document.getElementById('divInstrution_4');
let divInstructionCover = document.getElementById('divInstructionCover');

const urlParams = new URLSearchParams(window.location.search);
let external_id = urlParams.get('external_id');
let external_session_id = urlParams.get('external_session_id');

// function: 暫停一段時間(毫秒)
async function sleep(ms) { 
    return new Promise(resolve => { 
        let start = performance.now(); 
        let id = setInterval(() => { 
            if(performance.now() - start >= ms) { 
                clearInterval(id); resolve(); } 
        }, 100); 
    }); 
}

// 按照順序儲存每個頁面
let pages = [
    divInstructionCover, 
    divInstrution_0, 
    divInstrution_1, 
    divInstrution_2, 
    divInstrution_3, 
    divInstrution_4, 
    cross
];

// 當前頁面位置(索引)
let position = 0;

// 設定開始按鈕的監聽事件
btnStart.addEventListener('click', async () => {
    position = 1; // 指向第一頁

    // 修改頁碼
    pos.textContent = `${position}/${pages.length-2}`;

    // 隱藏封面 & 開始按鈕
    divInstructionCover.style.opacity = '0';
    btnStart.style.opacity = '0';

    // 緩衝(為了消失動畫)
    await sleep(300);

    // 取消物件的介面佔據空間
    divInstructionCover.style.display = 'none';
    btnStart.style.display = 'none';

    // 顯示第一頁 & Next/Back 按鈕
    pages[position].style.display = 'flex';
    pages[position].style.opacity = '0';
    divNextBack.style.display = 'flex';
    divNextBack.style.opacity = '0';

    // 緩衝(為了消失動畫)
    await sleep(100);
    pages[position].style.opacity = '1';
    divNextBack.style.opacity = '1';
});

// 這布林變數用於判斷頁面是否正在移動
let moving = false;

// 設定 Next 按鈕的監聽事件
btnNext.addEventListener('click', async () => {
    // 如果目前正在移動頁面，就不做任何事
    if(moving) { return; }

    moving = true; // 正在移動頁面

    // 如果目前是最後一頁，則前往正式測驗
    if(position >= pages.length-2) { 
        // 隱藏當前頁面 & 按紐
        let currentPage = pages[position];
        currentPage.style.opacity = '0';
        divNextBack.style.opacity = '0';

        // 位置(索引)加1
        position += 1;

        // 緩衝(為了消失動畫)
        await sleep(300);

        // 取消當前頁面的介面佔據空間
        currentPage.style.display = 'none';
        divNextBack.style.display = 'none';

        // 顯示下一頁
        pages[position].style.display = 'flex';
        pages[position].style.opacity = '0';

        // 緩衝(為了消失動畫)
        await sleep(100);
        pages[position].style.opacity = '1';

        moving = false; // 頁面移動完成

        // 顯示十字
        await sleep(3000);

        // 等待十字消失
        pages[position].style.opacity = '0';
        await sleep(1000);

        external_id = external_id ? external_id : 'external_id_null';
        external_session_id = external_session_id ? external_session_id : 'external_session_id_null';
        window.location.replace(`./YoungerAdultHard.html?external_id=${external_id}&external_session_id=${external_session_id}`);

        return; 
    }

    // 隱藏當前頁面
    let currentPage = pages[position];
    currentPage.style.transform = 'translateX(-256px)';
    currentPage.style.opacity = '0';

    // 位置(索引)加1
    position += 1;

    // 修改頁碼
    pos.textContent = `${position}/${pages.length-2}`;

    // 緩衝(為了消失動畫)
    await sleep(300);
    currentPage.style.transform = 'translate(0, 0)'; // 回到原位

    // 取消當前頁面的介面佔據空間
    currentPage.style.display = 'none';

    // 顯示下一頁
    pages[position].style.display = 'flex';
    pages[position].style.opacity = '0';
    pages[position].style.transform = 'translate(256px, 0)';

    // 緩衝(為了消失動畫)
    await sleep(100);
    pages[position].style.opacity = '1';
    pages[position].style.transform = 'translate(0, 0)'; // 回到原位

    moving = false; // 頁面移動完成
});

// 設定 Back 按鈕的監聽事件
btnBack.addEventListener('click', async () => {
    // 如果目前是第一頁，不做任何事
    if(position <= 1 || moving) { return; }

    moving = true; // 正在移動頁面

    // 隱藏當前頁面
    let currentPage = pages[position];
    currentPage.style.transform = 'translate(256px, 0)';
    currentPage.style.opacity = '0';

    // 位置(索引)減1
    position -= 1;

    // 修改頁碼
    pos.textContent = `${position}/${pages.length-2}`;

    // 緩衝(為了消失動畫)
    await sleep(300);
    currentPage.style.transform = 'translate(0, 0)'; // 回到原位

    // 取消當前頁面的介面佔據空間
    currentPage.style.display = 'none';

    // 顯示前一頁
    pages[position].style.display = 'flex';
    pages[position].style.opacity = '0';
    pages[position].style.transform = 'translate(-256px, 0)';

    // 緩衝(為了消失動畫)
    await sleep(100);
    pages[position].style.opacity = '1';
    pages[position].style.transform = 'translate(0, 0)'; // 回到原位

    moving = false; // 頁面移動完成
});




