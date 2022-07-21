"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const events_1 = require("events");
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const prism_media_1 = __importDefault(require("prism-media"));
const SongSearcher_1 = require("./SongSearcher");
const Constants_1 = require("../utils/Constants");
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
const ClientVoiceSettings = {
    deaf: true,
    requestToSpeak: false,
    suppressed: false,
    [Symbol.iterator]: function* () { },
    /**
     * Sets if the client is deaf
     * @param {boolean} state
     * @returns {void}
     */
    setDeaf(state) {
        this.deaf = state ?? false;
    },
    /**
     * Generates a speak request if needed
     * @param {boolean} state
     * @returns {void}
     */
    speakRequest(state) {
        this.requestToSpeak = state ?? false;
    },
    /**
     * Sets the suppressed option
     * @param {boolean} state
     * @returns {void}
     */
    setSuppressed(state) {
        this.suppressed = state ?? false;
    },
};
class Player extends events_1.EventEmitter {
    /**
     * Creates a new Player.
     * @param {Map<string, QueueOptions>} queue The Musicord queue
     * @param {Guild} guild current guild
     */
    constructor(queue, guild, options) {
        super({
            captureRejections: true,
        });
        this.clientVoiceSettings = ClientVoiceSettings;
        this._songSearcher = new SongSearcher_1.SongSearcher();
        if (!queue || queue.constructor !== Map)
            throw new Error('The queue is required to create a player');
        if (!guild || guild instanceof discord_js_1.Guild == false)
            throw new Error('The guild is required to create a player');
        this._queue = queue;
        /**
         * The current guild
         * @type {Guild}
         */
        this.guild = guild;
        if (options && options.advancedOptions)
            Object.assign(this.options, options?.advancedOptions);
        const currentQueue = this._queue.get(guild.id);
        if (options && options.advancedOptions?.autoJoin === true && currentQueue?.voiceChannel !== null) {
            try {
                this.createVoiceConnection();
            }
            catch (err) {
                this.emit(Constants_1.PlayerEvents.Error, err);
            }
        }
    }
    /**
     * Checks if the bot is currently playing
     * @returns {boolean}
     */
    get isPlaying() {
        return this._queue.get(this.guild.id)?.playing ?? false;
    }
    /**
     * Gets the queue volume
     * @returns {number}
     */
    get volume() {
        return this._queue.get(this.guild.id)?.volume ?? 0.5;
    }
    /**
     * Gets the queue filters
     * @returns {string[]}
     */
    get filters() {
        return this._queue.get(this.guild.id)?.filters ?? [];
    }
    /**
     * Gets the queue songs
     * @returns {Song[]}
     */
    get queue() {
        return this._queue.get(this.guild.id)?.songs ?? [];
    }
    /**
     * Assigns an existing voice connection to the queue.
     * @param {VoiceConnection} connection {@link https://discord.js.org/#/docs/voice/stable/class/VoiceConnection Voice connection}
     * @returns {void}
     */
    assignVoiceConnection(connection) {
        if (!connection || connection instanceof voice_1.VoiceConnection === false)
            throw new TypeError('A voice connection is required to assign it to the queue');
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue)
            currentQueue.connection = connection;
    }
    /**
     * Adds a song to the queue.
     * @param {Song|string} song *YT url, custom .mp3 url or searched song*
     * @returns {Promise<void>}
     */
    async addSong(song) {
        if (!song)
            throw new TypeError('A song is required to add it to the queue');
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue && currentQueue.songs) {
            if (typeof song === 'string' && Constants_1.youTubePattern.test(song)) {
                const extractedVideo = await this._songSearcher.extractVideoInfo(song);
                currentQueue.songs.push(extractedVideo);
            }
            else if (typeof song === 'string' && Constants_1.audioPattern.test(song)) {
                currentQueue.songs.push({
                    url: song,
                    streamURL: song,
                });
            }
            else
                return;
        }
    }
    /**
     * Adds playlist songs to the queue
     * Only the first 100 songs will be added.
     * @param {string} url
     * @returns {Promise<void>}
     */
    async addPlaylist(url) {
        if (!url || !url.includes('list') || !Constants_1.youTubePlaylistPattern.test(url))
            throw new TypeError('A valid YouTube playlist URL is required to add videos from this playlist to the queue');
        const playlist = await this._songSearcher.fetchPlaylist(url);
        for (const video of playlist) {
            await this.addSong(video.url);
        }
    }
    /**
     * Set the ressource or channel bitrate.
     * Default value is 64000.
     * @param {number} value
     * @returns {void}
     */
    setBitrate(value) {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue) {
            if ((value && currentQueue.ressource) || currentQueue.playing)
                currentQueue.ressource?.encoder?.setBitrate(value);
            else if (currentQueue.voiceChannel)
                currentQueue.voiceChannel.bitrate = 64000;
        }
    }
    /**
     * Creates a voice connection if a voice channel is stored in the queue.
     * @returns {void}
     */
    createVoiceConnection() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue && !currentQueue.voiceChannel)
            return;
        if (currentQueue) {
            currentQueue.connection = (0, voice_1.joinVoiceChannel)({
                channelId: currentQueue.voiceChannel?.id,
                guildId: this.guild.id,
                adapterCreator: this.guild.voiceAdapterCreator,
            });
            this.emit(Constants_1.PlayerEvents.Connected, this.guild, currentQueue.textChannel, currentQueue?.voiceChannel);
        }
    }
    /**
     * Adds a filter to the queue.
     * @param {string} filter
     */
    setFilter(filter, applied) {
        if (!filter || typeof filter !== 'string')
            throw new TypeError('A filter is required to apply it');
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue) {
            if (applied === false) {
                if (filter in currentQueue.filters && currentQueue.filters.length > 0)
                    currentQueue.filters.slice(currentQueue.filters.indexOf(filter), 1);
            }
            else {
                if (!currentQueue.filters || currentQueue.filters.length > 0)
                    this.resetFilters();
                currentQueue.filters.push(filter);
            }
        }
    }
    /**
     * Resets the filters.
     * @returns {void}
     */
    resetFilters() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue)
            currentQueue.filters = [];
        else
            return;
    }
    /**
     * Gets all the queue songs
     * @returns {Song[]|undefined}
     */
    getSongs() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue)
            return currentQueue.songs;
    }
    /**
     * Gets the next song url.
     * @returns {string|undefined}
     */
    nextSong() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue && currentQueue.songs && Object.entries(currentQueue.songs).length >= 1) {
            return currentQueue.songs[0].url;
        }
    }
    /**
     * Stops the music, resets the queue, and destroys the voice connection.
     * @returns {void}
     */
    stop() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue) {
            this.emit(Constants_1.PlayerEvents.Stop, this.guild, currentQueue.textChannel);
            try {
                currentQueue.connection?.destroy();
                this.emit(Constants_1.PlayerEvents.Disconnected, this.guild, currentQueue.textChannel, currentQueue.voiceChannel);
            }
            catch (err) {
                this.emit(Constants_1.PlayerEvents.Error, err);
                sleep(5);
            }
            this._queue.delete(this.guild.id);
        }
    }
    /**
     * Skips the current song.
     * @returns {void}
     */
    skip() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue) {
            currentQueue.ressource?.audioPlayer?.stop();
        }
    }
    /**
     * Pauses the music.
     * @returns {void}
     */
    pause() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue && currentQueue.ressource) {
            if (currentQueue.ressource.audioPlayer?.state.status === voice_1.AudioPlayerStatus.Playing) {
                currentQueue.ressource.audioPlayer?.pause(true);
                this.emit(Constants_1.PlayerEvents.Pause, this.guild, currentQueue.textChannel);
            }
        }
    }
    /**
     * Resumes the music *(if paused)*.
     * @returns {void}
     */
    resume() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue && currentQueue.ressource) {
            if (currentQueue.ressource.audioPlayer?.state.status === voice_1.AudioPlayerStatus.Paused ||
                currentQueue.ressource.audioPlayer?.state.status === voice_1.AudioPlayerStatus.AutoPaused) {
                currentQueue.ressource.audioPlayer?.unpause();
                this.emit(Constants_1.PlayerEvents.Resume, this.guild, currentQueue.textChannel);
            }
        }
    }
    /**
     * Sets the volumesof the queue.
     * Changes the volume immediately if playing.
     * @param {Range<0, 101>} volume
     */
    setVolume(volume) {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue) {
            currentQueue.ressource?.volume?.setVolumeLogarithmic(volume);
            currentQueue.volume = volume;
        }
    }
    /**
     * Shuffles the queue
     * @returns {void}
     */
    shuffleQueue() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue && Object.keys(currentQueue.songs).length > 0) {
            const shuffledQueue = currentQueue.songs.slice();
            for (let i = shuffledQueue.length - 1; i > 0; i--) {
                const rand = Math.floor(Math.random() * (i + 1));
                [shuffledQueue[i], shuffledQueue[rand]] = [shuffledQueue[rand], shuffledQueue[i]];
            }
            currentQueue.songs = shuffledQueue;
        }
    }
    /**
     * Plays a song.
     * @param {Song|string} song
     * @param {VoiceChannel|StageChannel} channel
     * @returns {Promise<void>}
     */
    async play(song, channel) {
        if (!song)
            throw new TypeError('A song is required to play it');
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue) {
            if (currentQueue.playing === true) {
                if (song.toString().includes('list') && Constants_1.youTubePlaylistPattern.test(song))
                    return this.addPlaylist(song);
                else
                    return await this.addSong(typeof song === 'string' ? song : song.url);
            }
            if (!(currentQueue.connection instanceof voice_1.VoiceConnection)) {
                if (channel || currentQueue.voiceChannel !== undefined) {
                    currentQueue.connection = (0, voice_1.joinVoiceChannel)({
                        guildId: this.guild.id,
                        channelId: (currentQueue.voiceChannel !== undefined ? currentQueue.voiceChannel.id : channel?.id),
                        adapterCreator: this.guild.voiceAdapterCreator,
                    });
                    this.emit(Constants_1.PlayerEvents.Connected, this.guild, currentQueue.textChannel, currentQueue.voiceChannel ?? channel);
                }
                else
                    return;
            }
            if (song.toString().includes('list') && Constants_1.youTubePlaylistPattern.test(song))
                this.addPlaylist(song);
            else {
                if (currentQueue.songs === [] || currentQueue.songs[0]?.url !== song)
                    await this.addSong(typeof song === 'string' ? song : song.url);
            }
            if (currentQueue.songs.length === 0)
                return;
            const player = (0, voice_1.createAudioPlayer)({
                behaviors: {
                    noSubscriber: ('pause' || 'play'),
                },
            });
            this._setClientVoiceSettings(currentQueue.voiceChannel);
            currentQueue.ressource = (0, voice_1.createAudioResource)(this._createWritableStream(currentQueue.songs[0].streamURL), {
                inputType: 'opus',
                inlineVolume: true,
            });
            currentQueue.ressource.volume?.setVolumeLogarithmic(currentQueue.volume);
            currentQueue.connection?.subscribe(player);
            player.play(currentQueue.ressource);
            currentQueue.playing = true;
            try {
                await (0, voice_1.entersState)(player, voice_1.AudioPlayerStatus.Playing, 5000);
            }
            catch (error) {
                throw new Error(error);
            }
            this.emit(Constants_1.PlayerEvents.TrackStart, currentQueue.textChannel, currentQueue.songs[0]);
            this._handleVoiceState(player);
        }
        else
            return;
    }
    /**
     * Generates the current song progress bar.
     * @returns {string|undefined}
     */
    generateSongSlideBar() {
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue) {
            return (Constants_1.ProgressBarOptions.line
                .repeat(Math.round(Constants_1.ProgressBarOptions.size *
                (currentQueue.ressource?.playbackDuration / currentQueue.songs[0].msDuration)))
                .replace(/.$/, Constants_1.ProgressBarOptions.slider) +
                Constants_1.ProgressBarOptions.line.repeat(Constants_1.ProgressBarOptions.size -
                    Math.round(Constants_1.ProgressBarOptions.size *
                        (currentQueue.ressource?.playbackDuration / currentQueue.songs[0].msDuration))));
        }
    }
    /**
     * Sets the client voice settings for the current guild
     * @returns {void}
     * @private
     */
    _setClientVoiceSettings(voiceChannel) {
        this.guild.members.me?.voice.setDeaf(this.clientVoiceSettings.deaf);
        if (voiceChannel?.type === discord_js_1.ChannelType.GuildStageVoice) {
            this.guild.members.me?.voice.setRequestToSpeak(this.clientVoiceSettings.requestToSpeak);
            this.guild.members.me?.voice.setSuppressed(this.clientVoiceSettings.suppressed);
        }
    }
    /**
     * Awaits player events and handles them.
     * @param {AudioPlayer} player
     * @returns {Promise<void>}
     * @private
     */
    async _handleVoiceState(player) {
        player.on(voice_1.AudioPlayerStatus.Idle, (oldState, newState) => {
            const currentQueue = this._queue.get(this.guild.id);
            if (oldState.status === voice_1.AudioPlayerStatus.Playing && newState.status === voice_1.AudioPlayerStatus.Idle) {
                if (currentQueue) {
                    currentQueue.playing = false;
                    const lastSong = currentQueue.songs[0];
                    currentQueue.songs.shift();
                    if (Object.keys(currentQueue.songs).length === 0)
                        this.stop();
                    else {
                        this.emit(Constants_1.PlayerEvents.TrackFinished, currentQueue.textChannel, lastSong);
                        if (this.options && typeof this.options.autoNextSong === 'boolean' && this.options.autoNextSong === false)
                            return;
                        else
                            return this.play(currentQueue.songs[0].url);
                    }
                }
            }
        });
        player.on(Constants_1.ExtendedAudioPlayerStatus.Error, (err) => {
            this.emit(Constants_1.PlayerEvents.Error, String(err.message));
        });
        player.on(Constants_1.ExtendedAudioPlayerStatus.Debug, (msg) => {
            this.emit(Constants_1.PlayerEvents.Debug, msg);
        });
    }
    /**
     * Creates a writable stream.
     * @param {string} url
     * @returns {NodeJS.WritableStream}
     * @private
     */
    _createWritableStream(url) {
        const FFmpegTranscoder = new prism_media_1.default.FFmpeg({
            args: this._generateFFmpegArgsSchema(url),
            shell: false,
        });
        const opusEncoder = new prism_media_1.default.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 });
        const FFmpegStream = FFmpegTranscoder.pipe(opusEncoder);
        FFmpegStream.on(Constants_1.PrismOpusEncoderEvents.Close, () => {
            FFmpegTranscoder.destroy();
            try {
                opusEncoder.destroy();
            }
            catch (err) {
                this.emit(Constants_1.PlayerEvents.StreamError, err);
                sleep(5);
            }
        });
        FFmpegStream.on(Constants_1.PrismOpusEncoderEvents.Error, (err) => {
            FFmpegTranscoder.destroy();
            try {
                opusEncoder.destroy();
            }
            catch (encoderErr) {
                this.emit(Constants_1.PlayerEvents.StreamError, encoderErr);
            }
            this.emit(Constants_1.PlayerEvents.Error, String(err.message));
        });
        return FFmpegStream;
    }
    /**
     * Generates FFmpeg args.
     * @param {string} url
     * @returns {string[]}
     * @private
     */
    _generateFFmpegArgsSchema(url) {
        const FFmpegArgs = ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5'];
        FFmpegArgs.push('-i', url, '-analyzeduration', '0', '-loglevel', '0', '-f', 's16le', '-ar', '48000', '-ac', '2');
        const currentQueue = this._queue.get(this.guild.id);
        if (currentQueue && currentQueue.filters) {
            for (const filter of currentQueue.filters) {
                FFmpegArgs.push('-af', filter);
            }
        }
        return FFmpegArgs;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map