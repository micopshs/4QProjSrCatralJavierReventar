// stuff
class GlobalSettings {
    constructor() {
        this.wordLength = undefined;
        this.maxAttempts = undefined;
        this.hintsPermitted = undefined;
        this.correctColor = undefined;
        this.useWordPool = undefined;
        this.hintColor = undefined;
        this.wordPool = undefined;
        if (localStorage.getItem("VERBATIM_LS_global_settings") !== undefined) {
            Object.assign(this, JSON.parse(localStorage.getItem("VERBATIM_LS_global_settings")));
        }
    }
    setSettings(form_data) {
        this.wordLength = Number(form_data.get("wordLength"));
        this.maxAttempts = Number(form_data.get("maxAttempts"));
        this.hintsPermitted = Boolean(form_data.get("hints"));
        this.correctColor = String(form_data.get("correctColor"));
        this.hintColor = String(form_data.get("hintColor"));
        // use commented line when functionality is added
        //this.useWordPool = Boolean(form_data.get("useWordPool"));
        this.useWordPool =
            form_data.get("wordPool") === undefined ||
                Array(form_data.get("wordPool")) === [""];
        /* Previous validatory system (add later if necessary as array.maps)
        for (let i = 0; i < listArray.length; i++) {
        if (listArray[i].includes(" ")) listArray.splice(i, 1);
      }
    
      for (let i = 0; i < listArray.length; i++) {
        if (listArray[i] == "") continue;
        outputArray.push(listArray[i]);
      }
        */
        this.wordPool = String(form_data.get("wordPool")).split(" ");
    }
    isEmpty() {
        return (this.wordLength === undefined ||
            this.maxAttempts === undefined ||
            this.hintsPermitted === undefined ||
            this.correctColor === undefined ||
            this.hintColor === undefined ||
            this.useWordPool === undefined
        // do not include wordPool itself
        );
    }
    saveSettings() {
        localStorage.setItem("VERBATIM_LS_global_settings", JSON.stringify(this));
    }
}
let globalSettings = new GlobalSettings();
export default globalSettings;
//# sourceMappingURL=globals.js.map