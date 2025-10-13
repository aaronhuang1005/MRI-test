// The endpoints for Google Apps Script web app
const WRITE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzHdbwF4XclTVj55zVO_3VNAlv9i1Bb6Ztk95YWrN6AvpmCgchDPVh6wy1L_4_lcVDC/exec';

// Get Prolific ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('PROLIFIC_PID');
const studyID = urlParams.get('STUDY_ID');

// The completion code and URL for Prolific
const completionCode = "C1CFNKX8"; 
const completionURL = `https://app.prolific.com/submissions/complete?cc=${completionCode}`;

// Get references to HTML elements
const username = document.getElementById('name');
const message = document.getElementById('message');
const submitBtn = document.getElementById('button');

// Function to write data to Google Sheets via Google Apps Script
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
    // Old usage to get HTML response
    // const text = await response.text();
    // console.log("Raw response:", text);
    // const result = JSON.parse(text);

    //console.log('Result:', result);

    if (result.result === 'success') {
      alert('Successfully send data.');
    }

  } catch (error) {
    console.error('Result(error):', error);
    alert('Error sending data, please try again.');
  }
}

// Check if Prolific ID is present
/*
if (prolificID) {
    console.log("Prolific ID:", prolificID);
    // Optionally, pre-fill the Prolific ID field
    // document.getElementById('participant_id_field').value = prolificID;
} else {
    alert("Missing Prolific ID, please check your link.");
}
*/

// Example usage:
// writeData('Aaron Huang', 'Hello from GitHub Pages!');

// Handle form submission Btn
submitBtn.onclick= function(){
  //alert('clicked');

  // Basic validation
  if (!prolificID || studyID != "68ecafb3bde1c0da67737564") {
    alert("Error occured, please check your link.");
    return;
  }

  if (!username.value) {
    alert("Please enter your name.");
    return;
  }

  writeData(prolificID, username.value, message.value);

  // Use replace to avoid user going back to the form page
  window.location.replace(completionURL); 
};

