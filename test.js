const WRITE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzHdbwF4XclTVj55zVO_3VNAlv9i1Bb6Ztk95YWrN6AvpmCgchDPVh6wy1L_4_lcVDC/exec';

const urlParams = new URLSearchParams(window.location.search);

const completionCode = "C1CFNKX8"; 
const completionURL = `https://app.prolific.com/submissions/complete?cc=${completionCode}`;

const prolificID = urlParams.get('PROLIFIC_PID');

if (prolificID) {
    alert("Found Prolific ID:", prolificID);
    console.log("Prolific ID:", prolificID);
    // document.getElementById('participant_id_field').value = prolificID;
} else {
    // 参与者可能不是通过 Prolific 链接进入的
    alert("Missing Prolific ID, please check your link.");
}


async function writeData(prolificID, name, message) {
  const payload = {
    id: prolificID,
    name: name,
    message: message
  };

  try {
    const response = await fetch(WRITE_ENDPOINT, {
      redirect: "follow",
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    //const text = await response.text();
    //console.log("Raw response:", text);
    //const result = JSON.parse(text);

    console.log('Result:', result);

    if (result.result === 'success') {
      alert('Successfully send data.');
    }

  } catch (error) {
    console.error('Result(error):', error);
    alert('Error sending data, please try again.');
  }
}

//writeData('John Doe', 'Hello from GitHub Pages!');

const username = document.getElementById('name');

const message = document.getElementById('message');

const submitBtn = document.getElementById('button');

submitBtn.onclick= function(){
  if (!prolificID) {
    alert("Missing Prolific ID, please check your link.");
    return;
  }
  writeData(prolificID, username.value, message.value);
  window.location.replace(completionURL); 
  //alert('clicked');
};

