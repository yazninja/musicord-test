import { FFmpegCustomEqualizerOptions } from '../utils/Interfaces';
export declare class FFmpegAudioFilters {
    /**
     * 8D audio
     * @type {string}
     */
    get rotatingAudio(): string;
    /**
     * Mono
     * @type {string}
     */
    get mono(): string;
    /**
     * Augmented stereo
     * @type {string}
     */
    get extraStereo(): string;
    /**
     * Vibrato
     * @type {string}
     */
    get vibrato(): string;
    /**
     * Play the sound in reverse
     * @type {string}
     */
    get reverse(): string;
    /**
     * Flanger
     * @type {string}
     */
    get flanger(): string;
    /**
     * 3D audio
     * @type {string}
     */
    get chorus(): string;
    /**
     * Right then left delay
     * @param {number} value The delay time **in seconds**
     * @returns {string}
     */
    pingPongDelay(value: number): string;
    /**
     * Speed sup/down the music
     * @param {number} value The speed value *(between 50% and 1000%)*
     * @returns {string}
     */
    speed(value: number): string;
    /**
     * basSSssS goes bRRRRR
     * @param {number} amount Boost intensity
     * @returns {string}
     * @example
     * queue.setFilters(AudioFilters.bassBoost(20));
     */
    bassBoost(amount: number): string;
    /**
     * tRRrrrRRRRemolo
     * @param {number} value Tremolo intensity *(between 0.1 and 20000)*
     * @returns {string}
     */
    tremolo(value: number): string;
    /**
     * Sets the volume (FFmpeg filter, not Discord bot volume)
     * @param {number} value The volume (no limit)
     * @returns {number}
     */
    volume(value: number): string;
    /**
     * 10 band equalizer
     * @param {FFmpegCustomEqualizerOptions} options At least 1 band is required **(percentage)**
     * @returns {string}
     * @example
     * AudioFilters.customEqualizer({
     *    band1: 99,
     *    band2: 45,
     *    band3: 54,
     *    band4: 53,
     *    band5: 52,
     *    band6: 51,
     *    band7: 50,
     *    band8: 49,
     *    band9: 48,
     *    band10: 47,
     * })
     */
    customEqualizer(options: FFmpegCustomEqualizerOptions): string;
    /**
     * Adds a custom filter
     * @param {string} filter The filter
     * @returns {string}
     */
    customFilter(filter: string): string;
    /**
     * Checks if a value is within a range of numbers
     * @param {number} n The number to check
     * @param {number} min The min number
     * @param {number} max The max number
     * @returns {boolean}
     * @private
     */
    private _isBetween;
}
//# sourceMappingURL=FFmpegAudioFilters.d.ts.map