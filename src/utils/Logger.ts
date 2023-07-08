// CURRENTLY UNUSED

/** A colorful logger to highlight important actions. */
export default class Logger {
    /** Whether or not to log messages. */
    public static enabled: boolean = true;

    static log(...args: any[]) {
        if (this.enabled) console.log(`%c[${Date().split(" ")[4]}]: ${args.join(" ")}`, 'color: blue;');
    }

    static err(...args: any[]) {
        if (this.enabled) console.log(`%c[${Date().split(" ")[4]}]: ${args.join(" ")}`, 'color: red;');
    }

    static success(...args: any[]) {
        if (this.enabled) console.log(`%c[${Date().split(" ")[4]}]: ${args.join(" ")}`, 'color: green;');
    }

    static warn(...args: any[]) {
        if (this.enabled) console.log(`%c[${Date().split(" ")[4]}]: ${args.join(" ")}`, 'color: yellow;');
    }

    static debug(...args: any[]) {
        if (this.enabled) console.log(args.join(" "));
    }
}; 