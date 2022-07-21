"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Musicord = void 0;
const discord_js_1 = require("discord.js");
const package_json_1 = require("../../package.json");
const Player_1 = require("./Player");
class Musicord {
    /**
     * Create a new Musicord
     * @param {MusicordOptions} options Musicord options
     */
    constructor(options) {
        this.options = {};
        this.queue = new Map();
        /**
         * Musicord options
         * @type {MusicordOptions|{}}
         */
        Object.assign(this.options, options);
    }
    /**
     * Musicord version
     * @type {string}
     */
    get version() {
        return package_json_1.version;
    }
    /**
     * Initializes a new queue if it does not exist.
     * Update the queue if it already exists.
     * @param {Guild} guild Message guild
     * @param {InitQueueOptions} options Options to init queue *(required)*
     * @returns {Player} An audio player
     */
    initQueue(guild, options) {
        if (!guild || guild instanceof discord_js_1.Guild === false)
            throw new TypeError('A Guild is required to initialize a queue');
        if (!options || typeof options !== 'object')
            throw new TypeError('Some options are required to initialize a queue');
        if (!this.existQueue(guild))
            this.queue.set(guild.id, this._generateQueueSchema(guild, options));
        else {
            const currentQueue = this.queue.get(guild.id);
            if (options.textChannel !== currentQueue?.textChannel || options.voiceChannel !== currentQueue.voiceChannel)
                this.queue.set(guild.id, this._generateQueueSchema(guild, options));
        }
        return new Player_1.Player(this.queue, guild, options);
    }
    /**
     * Deletes the queue for this guild
     * @param {Guild} guild The queue guild
     * @returns {void} Void
     */
    deleteQueue(guild) {
        if (this.existQueue(guild))
            this.queue.delete(guild.id);
    }
    /**
     * Chekcks if a queue exists
     * @param {Guild} guild The queue guild
     * @returns {boolean} Boolean
     */
    existQueue(guild) {
        return this.queue.has(guild.id);
    }
    /**
     * Gets a specific queue
     * @param {Guild} guild The queue guild
     * @returns {Player|undefined} Player|undefined
     */
    getQueue(guild) {
        if (!guild || guild instanceof discord_js_1.Guild == false)
            throw new TypeError('A Guild is required to initialize a queue');
        if (this.existQueue(guild))
            return new Player_1.Player(this.queue, guild);
        else
            return undefined;
    }
    /**
     * Gets queue infos
     * @param {Guild} guild The queue guild
     * @returns {QueueOptions|undefined} QueueOptions|undefined
     */
    getQueueInfo(guild) {
        return this.queue.get(guild.id);
    }
    /**
     * Generates what will be stored in the queue.
     * @param {Guild} guild The queue guild
     * @param {InitQueueOptions} options Options to init the queue
     * @returns {QueueOptions} QueueOptions
     */
    _generateQueueSchema(guild, options) {
        return {
            guild: guild,
            textChannel: options.textChannel,
            voiceChannel: options.voiceChannel ?? undefined,
            connection: null,
            songs: [],
            volume: options.advancedOptions?.volume ?? 0.5,
            playing: false,
            filters: [],
        };
    }
}
exports.Musicord = Musicord;
//# sourceMappingURL=Musicord.js.map