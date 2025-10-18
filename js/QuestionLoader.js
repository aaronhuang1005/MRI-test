export class QuestionLoader {
    /*
    async loadQuestions(src) {
        let response = await fetch(src);
        let textHTML = await response.text();

        let parser = new DOMParser();
        let HTML = parser.parseFromString(textHTML, "text/html");

        let lines = HTML.querySelectorAll("p");

        let questions = [];
        for(let i = 0; i < lines.length; i++) {
            questions.push(lines[i].innerText.match(/[A-Za-z0-9]+/g));
        }

        return questions;
    }
    */
    
    async loadQuestions(src){
        var textByLine = [];
        let questions = [];
        const result = await fetch("https://aaronhuang1005.github.io/MRI-test/text/"+src)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const decoder = new TextDecoder('utf-16le');
                const textfile = decoder.decode(buffer);
                textByLine = textfile.split("\n");
                //console.log(textByLine);
                //main();
                for (var i = 0; i < textByLine.length; i++) {
                    var text = textByLine[i].split("\t");

                    // A-B
                    var paired_text = text[0];
                    var noise = text.slice(1,3);
                    var question = text[3];

                    // 4, 5, 6
                    var option = text.slice(4,6);
                    option.push(text[6].split(" ")[0]);

                    var ans = Number(text[6].split(" ")[1]) - 1;
                    questions.push([paired_text, noise[0], noise[1], question, option[0], option[1], option[2], ans]);
                }
            })
            .catch(error => {
                console.error(error);
        });
        return questions;
    }
}