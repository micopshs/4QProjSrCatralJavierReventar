// stuff

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

// I don't know why, but the set_settings thing needs Color to be 
// equivalent to string.
type Color = RGB | RGBA | HEX | string;

class GlobalSettings {
    wordLength: number;
    maxAttempts: number;
    hintsPermitted: boolean;
    correctColor: Color;
    hintColor: Color;

    constructor() {};
    setSettings(form_data: FormData) {
        this.wordLength = Number(form_data.get("wordLength"));
        this.maxAttempts = Number(form_data.get("maxAttempts"));
        this.hintsPermitted = Boolean(form_data.get("hints"));
        this.correctColor = String(form_data.get("correctColor"));
        this.hintColor = String(form_data.get("hintColor"));
    }
};

let globalSettings = new GlobalSettings()

export default globalSettings;