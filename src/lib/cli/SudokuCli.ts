import {readFile, readFileSync} from 'fs';
import minimist = require('minimist');
import * as _ from 'lodash';

/**
 * An interface used to return the command line options.
 */
export interface SudokuCliOptions {
    version: boolean;
    help: boolean;
    solver: boolean;
    backtrack: boolean;
    //TODO return file instead of string!
    file: string;
    sudokuString: string;
}

/**
 * A class with some static methods to handle command line options.
 */
export class SudokuCli {
    /**
     * This method accepts a string[] with the command line options
     * as node's process.argv reports it and returns a
     * {@code SudokuCliOptions} Object. It throws errors if the
     * given command line has errors.
     *
     * @param {string[]} argv the command line strings as {@code process.argv} returns it.
     * @returns {SudokuCliOptions} the options
     */
    static parseArguments(argv: string[]): SudokuCliOptions {
        // Preprocess the given string[]: remove not wanted arguments and remove
        // spaces and newlines between quotes.
        // remove first two arguments
        let cliArray = argv.slice(2);
        // transform to a string
        let cliString = cliArray.join('|');
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
        // transform back to string[]
        cliArray = cliString.split('|');

        //Use 'minimist' to parse the arguments
        let parsedArgs = minimist(cliArray, {
            string: ['string', 'file'],
            boolean: 'version'
        });

        //TODO handle unknown options!
        //TODO handle conflicting options!

        // return result
        let result = {
            sudokuString: parsedArgs['string'],
            file: parsedArgs['file'],
            solver: parsedArgs['s'] ? true : false,
            backtrack: parsedArgs['b'] ? true : false,
            help: parsedArgs['h'] ? true : false,
            version: parsedArgs['version'] ? true : false
        }

        return result;
    }

    /**
     * Returns a string with a message to show if
     * help is advised.
     *
     * @returns {string} the help message
     */
    static printHelp(): string {
        let message = `
        USAGE: node sudoku_cli [-sbh] [--version[=true]] [--string=sudokuString | --file=sudokuFile]
        
        OPTIONS:
            -s: solve with the solver
            -b: solve with the backtracker
            -h: print this help message
            --version[=true]: print a version message
            --string: The string to initialize the sudoku game. You may give either a string
                or a file.
            --file: The filename to initialize the sudoku game. You may give either a file
                or a string.  
        `;
        return message;
    }

    /**
     * Returns a message to show if the version was requested.
     *
     * @returns {string} the version message
     */
    static printVersion(): string {
        let fileData = readFileSync('../package.json', {encoding: 'utf8'});
        let packageJsonData = JSON.parse(fileData);
        return packageJsonData['main'] + ' Version: ' +packageJsonData['version'];
    }
}