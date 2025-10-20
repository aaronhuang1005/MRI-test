export class Poster{
  async writeData(prolificID, table, message) {
    if (!prolificID) {
      alert("Error occured, please check your link.");
      console.error('Result(error): Prolific ID is missing.');
      return false;
    }

    const WRITE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzHdbwF4XclTVj55zVO_3VNAlv9i1Bb6Ztk95YWrN6AvpmCgchDPVh6wy1L_4_lcVDC/exec';
    const payload = {
      id: prolificID,
      table: table,
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

      if (result.result === 'success') {
        return true;
      }else{
        return false;
      }
    } catch (error) {
      return false;
    }
}

//writeData(prolificID, username.value, message.value);
}

/*
// Get Prolific ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('PROLIFIC_PID');

// The completion code and URL for Prolific
const completionCode = "C1CFNKX8"; 
const completionURL = `https://app.prolific.com/submissions/complete?cc=${completionCode}`;
window.location.replace(completionURL); 

console.error('Result(error):', error);
alert('Error occured while sending data, please try again later.');

*/

