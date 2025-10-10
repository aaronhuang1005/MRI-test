const WRITE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxqbE2XskOSxH-lsVCwWPrkv47j3RfClvkaRwfmcCjTNHKP_BXeerx4bg7nHPb6lfbN/exec';


async function writeData(name, message) {
  const payload = {
    name: name,
    message: message
  };

  try {
    const response = await fetch(WRITE_ENDPOINT, {
      redirect: "follow",
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('寫入結果:', result);

    if (result.result === 'success') {
      alert('資料成功寫入 Google Sheet！');
    }

  } catch (error) {
    console.error('寫入資料失敗:', error);
    alert('寫入資料失敗，請稍後再試。');
  }
}

//writeData('John Doe', 'Hello from GitHub Pages!');

const username = document.getElementById('name');

const message = document.getElementById('message');

const submitBtn = document.getElementById('button');

submitBtn.onclick= function(){
  writeData(username.value, message.value);
  //alert('clicked');
};

