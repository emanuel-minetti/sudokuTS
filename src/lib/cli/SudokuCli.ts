import minimist = require('minimist');
import {ParsedArgs, Opts} from "minimist";
import * as _ from 'lodash';

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
        result.sudokuString = parsedArgs['string'];
        result.file = parsedArgs['file'];
        result.solver = parsedArgs['s'] ? true : false;
        result.backtrack = parsedArgs['b'] ? true : false;
        result.help = parsedArgs['h'] ? true : false;
        result.version = parsedArgs['version'] ? true : false;
        //TODO handle unknown options!
        //TODO handle conflicting options!
        return result;
    }

    static printHelp(): string {
        //TODO implement!
        return '';
    }

    static printVersion(): string {
        //TODO implement!
        return '';
    }
}