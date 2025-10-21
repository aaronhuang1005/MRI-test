export class Displayer {
    constructor() {
        this.listID = [
            "cross", 
            "reminder",
            "noise", "noise_1", "noise_2",
            "targets", "target_1", "target_2", 
            "options", "option_1", "option_2", "option_3",
            "taskFinish",
            "uploading",
            "question"
        ];
    }

    show(listID) {
        for(let i = 0; i < this.listID.length; i++) {
            let id = this.listID[i];
            let bInclude = listID.includes(id);
            let dom = document.getElementById(id);

            dom.style.display = bInclude ? "flex" : "none";    
        }
    }
}