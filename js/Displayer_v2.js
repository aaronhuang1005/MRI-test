export class Displayer {
    constructor() {
        this.listID = [
            "cross", 
            "reminder",
            "noise", "noise_1", "noise_2",
            "targets", 
                "pair_1", "target_1", "target_2", 
                "pair_2", "target_3", "target_4", 
                "pair_3", "target_5", "target_6", 
                "pair_4", "target_7", "target_8", 
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