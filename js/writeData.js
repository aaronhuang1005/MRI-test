export class Poster{
  async writeData(prolificID, table, present, response, ans, rt) {
    if (!prolificID) {
      alert("Error occured, please check your link.");
      console.error('Result(error): Prolific ID is missing.');
      return false;
    }

    const WRITE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzHdbwF4XclTVj55zVO_3VNAlv9i1Bb6Ztk95YWrN6AvpmCgchDPVh6wy1L_4_lcVDC/exec';
    // data.table
    // data.id, data.block, data.present, data.response, data.ans, data.acc, data.rt
    /*
    const payload = {
      id: prolificID,
      table: table,
      block: block,
      present: present,
      response: response,
      ans: ans,
      acc: (response === ans) ? 1 : 0;,
      rt: rt
    };
    */

    let temp = [];
    for(let i = 0 ; i < present.length ; i++){
      temp.push({id:prolificID, block:i+1, present:present[i], response:response[i], ans:ans[i], acc:(response[i] === ans[i]) ? 1 : 0, rt:rt[i]});
    }

    const payload = {
      table: table,
      rows:temp
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
        console.error('Result(error):', result.message);
        return false;
      }
    } catch (error) {
      console.error('Result(error):Error occured while sending data:');
      return false;
    }
  }
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

