export interface SudokuCliOptions {
    version: boolean;
    help: boolean;
    solver: boolean;
    backtrack: boolean;
    file: string;
    sudokuString: string;
}

export class SudokuCli {
    static parseArguments(argv: string[]): SudokuCliOptions {
        let result = {
            version: false,
            help: false,
            solver: false,
            backtrack: false,
            file: '',
            sudokuString: ''
        }

        let sudokuStringArray = argv.slice(1);
        let sudokuString = sudokuStringArray.join('');
        result.sudokuString = sudokuString;
        //TODO implement
        return result;
    }
}