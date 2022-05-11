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
        if (localStorage.getItem("VERBATIMLSglobalsettings") !== undefined) {
            Object.assign(this, JSON.parse(localStorage.getItem("VERBATIMLSglobalsettings")));
        }
    }
    setSettings(formdata) {
        this.wordLength = Number(formdata.get("wordLength"));
        this.maxAttempts = Number(formdata.get("maxAttempts"));
        this.hintsPermitted = Boolean(formdata.get("hints"));
        this.correctColor = String(formdata.get("correctColor"));
        this.hintColor = String(formdata.get("hintColor"));
        // use commented line when functionality is added
        //this.useWordPool = Boolean(formdata.get("useWordPool"));
        this.useWordPool =
            formdata.get("wordPool") === undefined ||
                Array(formdata.get("wordPool")) === [""];
        /* Previous validatory system (add later if necessary as array.maps)
        for (let i = 0; i < listArray.length; i++) {
        if (listArray[i].includes(" ")) listArray.splice(i, 1);
      }
    
      for (let i = 0; i < listArray.length; i++) {
        if (listArray[i] == "") continue;
        outputArray.push(listArray[i]);
      }
        */
        this.wordPool = String(formdata.get("wordPool")).split(" ");
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
        localStorage.setItem("VERBATIMLSglobalsettings", JSON.stringify(this));
    }
}
const globalSettings = new GlobalSettings();
export default globalSettings;
//# sourceMappingURL=globals.js.map