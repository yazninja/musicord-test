import { EventEmitter } from 'events';
import { Guild, GuildTextBasedChannel, StageChannel, TextChannel, VoiceBasedChannel, VoiceChannel } from 'discord.js';
import { VoiceConnection, AudioPlayerError } from '@discordjs/voice';
import { InitQueueOptions, QueueOptions, Range, Song, AdvancedQueueOptions } from '../utils/Interfaces';
declare const ClientVoiceSettings: {
    deaf: boolean;
    requestToSpeak: boolean;
    suppressed: boolean;
    [Symbol.iterator]: () => Generator<never, void, unknown>;
    /**
     * Sets if the client is deaf
     * @param {boolean} state
     * @returns {void}
     */
    setDeaf(state: boolean): void;
    /**
     * Generates a speak request if needed
     * @param {boolean} state
     * @returns {void}
     */
    speakRequest(state: boolean): void;
    /**
     * Sets the suppressed option
     * @param {boolean} state
     * @returns {void}
     */
    setSuppressed(state: boolean): void;
};
export declare interface Player extends EventEmitter {
    /**
     * Emitted when a track starts.
     * @param {TextChannel|GuildTextBasedChannel} listener
     * @param {Song} listener
     * @event Player#trackStart
     */
    on(event: 'trackStart', listener: (channel: TextChannel | GuildTextBasedChannel, song: Song) => void | Promise<void> | any): this;
    /**
     * Emitted when a track is finished.
     * @param {TextChannel|GuildTextBasedChannel} listener
     * @param {Song} listener
     * @event Player#trackFinished
     */
    on(event: 'trackFinished', listener: (channel: TextChannel | GuildTextBasedChannel, song: Song) => void | Promise<void> | any): this;
    /**
     * Emitted when the music is turned off
     * @param {Guild} listener
     * @param {TextChannel|GuildTextBasedChannel} listener
     * @event Player#pause
     */
    on(event: 'pause', listener: (guild: Guild, channel: TextChannel | GuildTextBasedChannel) => void | Promise<void> | any): this;
    /**
     * Emitted when the music is turned on
     * @param {Guild} listener
     * @param {TextChannel|GuildTextBasedChannel} listener
     * @event Player#resume
     */
    on(event: 'resume', listener: (guild: Guild, channel: TextChannel | GuildTextBasedChannel) => void | Promise<void> | any): this;
    /**
     * Emitted when the music is stopped
     * @param {Guild} listener
     * @param {TextChannel|GuildTextBasedChannel} listener
     * @event Player#stop
     */
    on(event: 'stop', listener: (guild: Guild, channel: TextChannel | GuildTextBasedChannel) => void | Promise<void> | any): this;
    /**
     * Emitted when the client is connected to a voice channel.
     * This event will not be emitted is you used the `assignVoiceConnection()` method.
     * @param {Guild} listener
     * @param {TextChannel|GuildTextBasedChannel} listener
     * @param {VoiceBasedChannel|VoiceChannel} listener
     * @event Player#connected
     */
    on(event: 'connected', listener: (guild: Guild, channel: TextChannel | GuildTextBasedChannel, voiceChannel: VoiceBasedChannel | VoiceChannel) => void | Promise<void> | any): this;
    /**
     * Emitted when the client is disconnected to a voice channel.
     * @param {Guild} listener
     * @param {TextChannel|GuildTextBasedChannel} listener
     * @param {VoiceBasedChannel|VoiceChannel} listener
     * @event Player#disconnected
     */
    on(event: 'disconnected', listener: (guild: Guild, channel: TextChannel | GuildTextBasedChannel, voiceChannel: VoiceBasedChannel | VoiceChannel) => void | Promise<void> | any): this;
    /**
     * Emitted when an error occured
     * @param {AudioPlayerError|Error|string|any} listener
     * @event Player#error
     */
    on(event: 'error', listener: (error: AudioPlayerError | Error | string | any) => void | Awaited<void> | any): this;
    /**
     * Emitted when a debug information is communicated by Discord.Js/voice
     * @param {string} listener
     * @event Player#debug
     */
    on(event: 'debug', listener: (msg: string) => void | Awaited<void> | any): this;
}
export declare class Player extends EventEmitter {
    clientVoiceSettings: typeof ClientVoiceSettings;
    readonly guild: Guild;
    readonly options: AdvancedQueueOptions | any;
    private _queue;
    private _songSearcher;
    /**
     * Creates a new Player.
     * @param {Map<string, QueueOptions>} queue The Musicord queue
     * @param {Guild} guild current guild
     */
    constructor(queue: Map<string, QueueOptions>, guild: Guild, options?: InitQueueOptions);
    /**
     * Checks if the bot is currently playing
     * @returns {boolean}
     */
    get isPlaying(): boolean;
    /**
     * Gets the queue volume
     * @returns {number}
     */
    get volume(): number;
    /**
     * Gets the queue filters
     * @returns {string[]}
     */
    get filters(): string[];
    /**
     * Gets the queue songs
     * @returns {Song[]}
     */
    get queue(): Song[];
    /**
     * Assigns an existing voice connection to the queue.
     * @param {VoiceConnection} connection {@link https://discord.js.org/#/docs/voice/stable/class/VoiceConnection Voice connection}
     * @returns {void}
     */
    assignVoiceConnection(connection: VoiceConnection): void;
    /**
     * Adds a song to the queue.
     * @param {Song|string} song *YT url, custom .mp3 url or searched song*
     * @returns {Promise<void>}
     */
    addSong(song: Song | string): Promise<void>;
    /**
     * Adds playlist songs to the queue
     * Only the first 100 songs will be added.
     * @param {string} url
     * @returns {Promise<void>}
     */
    addPlaylist(url: string): Promise<void>;
    /**
     * Set the ressource or channel bitrate.
     * Default value is 64000.
     * @param {number} value
     * @returns {void}
     */
    setBitrate(value?: number): void;
    /**
     * Creates a voice connection if a voice channel is stored in the queue.
     * @returns {void}
     */
    createVoiceConnection(): void;
    /**
     * Adds a filter to the queue.
     * @param {string} filter
     */
    setFilter(filter: string, applied?: boolean): void;
    /**
     * Resets the filters.
     * @returns {void}
     */
    resetFilters(): void;
    /**
     * Gets all the queue songs
     * @returns {Song[]|undefined}
     */
    getSongs(): Song[] | undefined;
    /**
     * Gets the next song url.
     * @returns {string|undefined}
     */
    nextSong(): string | undefined;
    /**
     * Stops the music, resets the queue, and destroys the voice connection.
     * @returns {void}
     */
    stop(): void;
    /**
     * Skips the current song.
     * @returns {void}
     */
    skip(): void;
    /**
     * Pauses the music.
     * @returns {void}
     */
    pause(): void;
    /**
     * Resumes the music *(if paused)*.
     * @returns {void}
     */
    resume(): void;
    /**
     * Sets the volumesof the queue.
     * Changes the volume immediately if playing.
     * @param {Range<0, 101>} volume
     */
    setVolume(volume: Range<0, 101>): void;
    /**
     * Shuffles the queue
     * @returns {void}
     */
    shuffleQueue(): void;
    /**
     * Plays a song.
     * @param {Song|string} song
     * @param {VoiceChannel|StageChannel} channel
     * @returns {Promise<void>}
     */
    play(song: Song | string, channel?: VoiceChannel | StageChannel): Promise<void>;
    /**
     * Generates the current song progress bar.
     * @returns {string|undefined}
     */
    generateSongSlideBar(): string | undefined;
    /**
     * Sets the client voice settings for the current guild
     * @returns {void}
     * @private
     */
    private _setClientVoiceSettings;
    /**
     * Awaits player events and handles them.
     * @param {AudioPlayer} player
     * @returns {Promise<void>}
     * @private
     */
    private _handleVoiceState;
    /**
     * Creates a writable stream.
     * @param {string} url
     * @returns {NodeJS.WritableStream}
     * @private
     */
    private _createWritableStream;
    /**
     * Generates FFmpeg args.
     * @param {string} url
     * @returns {string[]}
     * @private
     */
    private _generateFFmpegArgsSchema;
}
export {};
//# sourceMappingURL=Player.d.ts.map