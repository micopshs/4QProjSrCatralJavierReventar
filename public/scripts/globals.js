// stuff
class GlobalSettings {
    constructor() { }
    ;
    setSettings(form_data) {
        this.wordLength = Number(form_data.get("wordLength"));
        this.maxAttempts = Number(form_data.get("maxAttempts"));
        this.hintsPermitted = Boolean(form_data.get("hints"));
        this.correctColor = String(form_data.get("correctColor"));
        this.hintColor = String(form_data.get("hintColor"));
    }
}
;
let globalSettings = new GlobalSettings();
export default globalSettings;
//# sourceMappingURL=globals.js.map