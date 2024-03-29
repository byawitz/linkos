import chalk from "chalk";
import Env from "@/utils/Env.ts";

/**
 * Colorful log wrapper using the chalk package.
 */
export default class Log {
    public static error(text: string, boldText: string = 'Error:') {
        console.log(chalk.red.bold(boldText), chalk.red(text))
    }

    public static instructions(text: string, boldText: string = '') {
        console.log(chalk.cyan.bold(boldText), chalk.cyan(text))
    }

    public static info(text: string, boldText: string = '') {
        console.log(chalk.white.bold(boldText), chalk.white(text))
    }

    public static good(text: string, boldText: string = '✅ ') {
        console.log(chalk.green.bold(boldText), chalk.green(text))
    }

    static debug(debug: string) {
        if (Env.ENVIRONMENT.toLowerCase() !== Env.ENVIRONMENT_PRODUCTION)
            console.log(chalk.blue.bold(debug))
    }
}