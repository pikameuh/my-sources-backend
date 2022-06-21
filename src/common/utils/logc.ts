import { Color } from "../enums/colors.enum";


export class LogC {


    static log(msg: any, color: Color) {
        if (process.env.LOG === 'true') {
            console.log(this.getColoredDate() + color + msg + Color.Reset);
        }
    }

    static logTitle(msg: string, color: Color) {
        if (process.env.LOG === 'true') {
            console.log('\n' + this.getColoredDate() + color + msg + Color.Reset);
        }
    }

    static logDefault(msg: string) {
        console.log(msg);
    }

    static getIn(msg: any, c: Color): string {
        return c + msg + Color.Reset;
    }

    static getColoredDate(): string {
        return Color.FgWhite + this.getFormatedDate() + '     ';
    }

    static getFormatedDate(): string {
        const current_datetime = new Date()
        const formatted_date =  " " + current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() + ":" + current_datetime.getMilliseconds();
        return formatted_date;
    }
}