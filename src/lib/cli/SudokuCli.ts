import minimist = require('minimist');
import * as _ from 'lodash';

export interface SudokuCliOptions {
    version: boolean;
    help: boolean;
    solver: boolean;
    backtrack: boolean;
    file: string;
    sudokuString: string;
}

//TODO dokument!
export class SudokuCli {
    //TODO dokument and comment!
    static parseArguments(argv: string[]): SudokuCliOptions {
        let cliArray = argv.slice(2);
        let cliString = cliArray.join(' ');
        // count single and double quotes
        let quoteIndices: number[] = [];
        let quotes = _.filter(cliString, (value, index) => {
            if (value === '\'' || value === '"') {
                quoteIndices.push(index);
                return true;
            }
            return false;
        });
        if (quotes.length % 2) {
            throw new Error('Unmatching quotes!')
        } else {
            //remove spaces and newlines between quotes
            quoteIndices.forEach((value, index, array) => {
                if (index % 2 === 0) {
                    let beginIndex = value;
                    let endIndex = array[index + 1];
                    let cliCharArray = cliString.split('');
                    _.remove(cliCharArray, (char, charIndex) => {
                        if (charIndex >= beginIndex && charIndex <= endIndex) {
                            if (char === ' ' || char === '\n') {
                                return true;
                            }
                        }
                        return false;
                    });
                    cliString = cliCharArray.join('');
                }
            });
        }

        cliArray = cliString.split(' ');
        let parsedArgs = minimist(cliArray, {
            string: ['string', 'file'],
            boolean: 'version'
        });

        let result = {
            sudokuString: parsedArgs['string'],
            file: parsedArgs['file'],
            solver: parsedArgs['s'] ? true : false,
            backtrack: parsedArgs['b'] ? true : false,
            help: parsedArgs['h'] ? true : false,
            version: parsedArgs['version'] ? true : false
        }
        //TODO handle unknown options!
        //TODO handle conflicting options!
        return result;
    }

    //TODO dokument!
    static printHelp(): string {
        //TODO implement!
        return '';
    }

    //TODO dokument!
    static printVersion(): string {
        //TODO implement!
        return '';
    }
}