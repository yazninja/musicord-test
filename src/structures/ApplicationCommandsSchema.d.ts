import { CommandData, DJSApplicationCommandsSchema } from '../utils/Interfaces';
export declare class ApplicationCommandsSchema {
    readonly commands: CommandData[];
    /**
     * Creates a new ApplicationCommandSchema.
     * @param {CommandOptions[]} options ApplicationCommandSchema options
     * @constructor
     * @example
     * const { ApplicationCommandSchema } = require()
     * const commandsSchema = new ApplicationCommandSchema([
     *      {
     *        name: 'play',
     *        implemented: true,
     *        description: 'Some description',
     *        options: {
     *            name: 'query',
     *            description: 'The song title you want to play'
     *         }
     *      }
     * ]);
     */
    constructor(options: CommandData[]);
    /**
     * Extracts slash commands formatted for DJS.
     * @returns {DJSApplicationCommandSchema[] | []}
     * @example
     * await rest.put(Routes.applicationGuildCommands('clientID', 'guildID'), { body: commandsSchema.extract() });
     */
    extract(): DJSApplicationCommandsSchema[] | [];
    /**
     * Checks if a value is within a range of numbers.
     * @param {number} n The number to check
     * @param {number} min The min number
     * @param {number} max The max number
     * @returns {boolean}
     * @private
     */
    private _isBetween;
}
//# sourceMappingURL=ApplicationCommandsSchema.d.ts.map