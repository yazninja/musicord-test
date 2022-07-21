import { Guild } from 'discord.js';
import { InitQueueOptions, MusicordOptions, QueueOptions } from '../utils/Interfaces';
import { Player } from './Player';
export declare class Musicord {
    readonly options: MusicordOptions | {};
    readonly queue: Map<string, QueueOptions>;
    /**
     * Create a new Musicord
     * @param {MusicordOptions} options Musicord options
     */
    constructor(options?: MusicordOptions);
    /**
     * Musicord version
     * @type {string}
     */
    get version(): string;
    /**
     * Initializes a new queue if it does not exist.
     * Update the queue if it already exists.
     * @param {Guild} guild Message guild
     * @param {InitQueueOptions} options Options to init queue *(required)*
     * @returns {Player} An audio player
     */
    initQueue(guild: Guild, options: InitQueueOptions): Player;
    /**
     * Deletes the queue for this guild
     * @param {Guild} guild The queue guild
     * @returns {void} Void
     */
    deleteQueue(guild: Guild): void;
    /**
     * Chekcks if a queue exists
     * @param {Guild} guild The queue guild
     * @returns {boolean} Boolean
     */
    existQueue(guild: Guild): boolean;
    /**
     * Gets a specific queue
     * @param {Guild} guild The queue guild
     * @returns {Player|undefined} Player|undefined
     */
    getQueue(guild: Guild): Player | undefined;
    /**
     * Gets queue infos
     * @param {Guild} guild The queue guild
     * @returns {QueueOptions|undefined} QueueOptions|undefined
     */
    getQueueInfo(guild: Guild): QueueOptions | undefined;
    /**
     * Generates what will be stored in the queue.
     * @param {Guild} guild The queue guild
     * @param {InitQueueOptions} options Options to init the queue
     * @returns {QueueOptions} QueueOptions
     */
    private _generateQueueSchema;
}
//# sourceMappingURL=Musicord.d.ts.map