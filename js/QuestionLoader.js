export class QuestionLoader {
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
}