import { Playlist, SearchedPlaylist, SearchedSong, SearchOptions, Song, SongLyrics, SongSearcherOptions } from '../utils/Interfaces';
export declare class SongSearcher {
    private _apiKey;
    private _spotifyApiKey;
    private _innerTubeContext;
    private _limit;
    /**
     * Creates a new SongSearcher
     * @param {SongSearcher} options
     */
    constructor(options?: SongSearcherOptions);
    /**
     * Searchs a song
     * @param {string} args
     * @param {SearchOptions} options
     * @returns {Promise<SearchedSong[]>}
     */
    search(args: string, options?: SearchOptions): Promise<SearchedSong[]>;
    /**
     * Extracts infos from a YouTube video
     * @param {string} url
     * @returns {Promise<Song>}
     */
    extractVideoInfo(url: string): Promise<Song>;
    /**
     * Searchs a playlist and returns the 100 first songs of it.
     * This method also works for YouTube mixes.
     * @param {string} url The YouTube playlist url.
     * @returns {Promise<SearchedPlaylist[]>}
     */
    fetchPlaylist(url: string): Promise<SearchedPlaylist[]>;
    /**
     * Extracts playlist title and description.
     * Works for YouTube mixes too.
     * The returned description will be empty if the inserted link is a mix.
     * @param {string} url The YouTube playlist url.
     * @returns
     */
    extractPlaylistInfo(url: string): Promise<Playlist>;
    /**
     * Gets a song lyrics
     * @param {string} query Song title
     * @returns {Promise<SongLyrics|undefined>}
     * @example
     *
     */
    getLyrics(query: string): Promise<SongLyrics | undefined>;
    /**
     * Adds results for a searched video
     * @param{any[]} results
     * @param {SearchedSong[]} returnData
     * @private
     */
    private _addResults;
    /**
     * Gets an InnerTube API key and set the Innertube context, depending on your computer
     * @returns {Promise<void>}
     * @private
     */
    private _initInnerTubeApiKey;
    /**
     * Generates body to fetch YouTube API
     * @param {string} url
     * @returns {object}
     * @private
     */
    private _generateExtractBody;
    /**
     * Humanizes seconds
     * @param {number} secs
     * @returns {string}
     * @private
     */
    private _humanizeSeconds;
}
//# sourceMappingURL=SongSearcher.d.ts.map