"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongSearcher = void 0;
const undici_1 = require("undici");
const Constants_1 = require("../utils/Constants");
class SongSearcher {
    /**
     * Creates a new SongSearcher
     * @param {SongSearcher} options
     */
    constructor(options) {
        this._limit = 10;
        if (options && typeof options.customInnertubeContext === 'object') {
            this._innerTubeContext = options.customInnertubeContext;
            Object.assign(this._innerTubeContext, { user: {}, request: {} });
        }
        if (options && typeof options.spotifyApiKey === 'string')
            this._spotifyApiKey = options.spotifyApiKey;
    }
    /**
     * Searchs a song
     * @param {string} args
     * @param {SearchOptions} options
     * @returns {Promise<SearchedSong[]>}
     */
    async search(args, options) {
        if (!args || typeof args !== 'string' || Constants_1.youTubePattern.test(args))
            throw new TypeError('A valid search term or youtube URL is required to search for a song');
        if (this._apiKey === undefined)
            await this._initInnerTubeApiKey();
        this._limit = options?.maxResults ?? 10;
        const { body } = await (0, undici_1.request)(`${Constants_1.innerTubeApiURL}/search?key=${this._apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                context: this._innerTubeContext,
                query: args,
                type: String(),
            }),
        });
        const returnData = [];
        const jsonData = await body.json();
        for (const content of jsonData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
            .contents) {
            if (content.itemSectionRenderer) {
                this._addResults(content.itemSectionRenderer.contents, returnData);
            }
            else
                break;
        }
        return returnData;
    }
    /**
     * Extracts infos from a YouTube video
     * @param {string} url
     * @returns {Promise<Song>}
     */
    async extractVideoInfo(url) {
        if (!url || typeof url !== 'string' || !Constants_1.youTubePattern.test(url))
            throw new TypeError('A valid youtube URL is required to extract information from a video');
        if (this._apiKey === undefined)
            await this._initInnerTubeApiKey();
        const { body } = await (0, undici_1.request)(`${Constants_1.innerTubeApiURL}/player?key=${this._apiKey}`, {
            method: 'POST',
            body: JSON.stringify(this._generateExtractBody(url)),
        });
        const jsonData = await body.json();
        return {
            id: jsonData.videoDetails.videoId,
            url: `${Constants_1.youTubeVideoURL}${jsonData.videoDetails.videoId}`,
            title: jsonData.videoDetails.title,
            duration: this._humanizeSeconds(Number(jsonData.videoDetails.lengthSeconds)),
            msDuration: Number(jsonData.videoDetails.lengthSeconds) * 1000,
            description: jsonData.videoDetails.shortDescription,
            thumbnails: jsonData.videoDetails.thumbnail.thumbnails,
            channel: {
                id: jsonData.videoDetails.channelId,
                title: jsonData.videoDetails.author,
                url: `${Constants_1.youTubeChannelURL}/${jsonData.videoDetails.channelId}`,
            },
            streamURL: jsonData.streamingData.formats.slice(-1)[0].url,
        };
    }
    /**
     * Searchs a playlist and returns the 100 first songs of it.
     * This method also works for YouTube mixes.
     * @param {string} url The YouTube playlist url.
     * @returns {Promise<SearchedPlaylist[]>}
     */
    async fetchPlaylist(url) {
        if (!url || typeof url !== 'string' || !Constants_1.youTubePlaylistPattern.test(url) || !url.includes('list'))
            throw new TypeError('To fetch a playlist you must insert a valid Youtube playlist URL');
        if (this._apiKey === undefined)
            await this._initInnerTubeApiKey();
        const playlistId = url.match(/[?&]list=([^#\&\?]+)/)[1];
        const isMix = playlistId.startsWith('RD');
        const returnData = [];
        let maxResults = 100;
        if (!isMix) {
            const { body } = await (0, undici_1.request)(`${Constants_1.innerTubeApiURL}/browse?key=${this._apiKey}`, {
                method: 'POST',
                body: JSON.stringify({
                    context: this._innerTubeContext,
                    browseId: `VL${playlistId}`,
                }),
            });
            const jsonData = await body.json();
            const playlistTracks = jsonData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0]
                .itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
            for (const e of playlistTracks) {
                maxResults--;
                if (maxResults === 0)
                    break;
                const i = e.playlistVideoRenderer;
                returnData.push({
                    title: i.title.runs[0].text,
                    videoId: i.videoId,
                    url: `${Constants_1.youTubeVideoURL}${i.videoId}`,
                    isPlayable: i.isPlayable,
                    index: Number(i.index.simpleText),
                });
            }
        }
        else {
            const { body } = await (0, undici_1.request)(`${Constants_1.innerTubeApiURL}/next?key=${this._apiKey}`, {
                method: 'POST',
                body: JSON.stringify({
                    context: this._innerTubeContext,
                    playlistId,
                }),
            });
            const json = await body.json();
            const playlistTracks = json.contents.twoColumnWatchNextResults.playlist.playlist.contents;
            for (const e of playlistTracks) {
                maxResults--;
                if (maxResults === 0)
                    break;
                const i = e.playlistPanelVideoRenderer;
                returnData.push({
                    title: i.title.simpleText,
                    videoId: i.videoId,
                    url: `${Constants_1.youTubeVideoURL}${i.videoId}`,
                    isPlayable: true,
                    index: 0,
                });
            }
        }
        return returnData;
    }
    /**
     * Extracts playlist title and description.
     * Works for YouTube mixes too.
     * The returned description will be empty if the inserted link is a mix.
     * @param {string} url The YouTube playlist url.
     * @returns
     */
    async extractPlaylistInfo(url) {
        if (!url || typeof url !== 'string' || !Constants_1.youTubePlaylistPattern.test(url) || !url.includes('list'))
            throw new TypeError('coucou');
        if (this._apiKey === undefined)
            await this._initInnerTubeApiKey();
        const playlistId = url.match(/[?&]list=([^#\&\?]+)/)[1];
        const isMix = playlistId.startsWith('RD');
        if (!isMix) {
            const { body } = await (0, undici_1.request)(`${Constants_1.innerTubeApiURL}/browse?key=${this._apiKey}`, {
                method: 'POST',
                body: JSON.stringify({
                    context: this._innerTubeContext,
                    browseId: `VL${playlistId}`,
                }),
            });
            const jsonData = await body.json();
            const playlistMeta = jsonData.metadata.playlistMetadataRenderer;
            return { title: playlistMeta.title, description: playlistMeta.description };
        }
        else {
            const { body } = await (0, undici_1.request)(`${Constants_1.innerTubeApiURL}/next?key=${this._apiKey}`, {
                method: 'POST',
                body: JSON.stringify({
                    context: this._innerTubeContext,
                    playlistId,
                }),
            });
            const jsonData = await body.json();
            const mixMeta = jsonData.contents.twoColumnWatchNextResults.playlist;
            return { title: mixMeta.playlist.title, description: String() };
        }
    }
    /**
     * Gets a song lyrics
     * @param {string} query Song title
     * @returns {Promise<SongLyrics|undefined>}
     * @example
     *
     */
    async getLyrics(query) {
        const { body } = await (0, undici_1.request)(`${Constants_1.lyricsApiUrl}${encodeURIComponent(query)}`);
        const jsonData = await body.json();
        if (jsonData.error)
            return undefined;
        if (jsonData.lyrics.length >= 2048)
            jsonData.lyrics = jsonData.lyrics.slice(0, 0 - (jsonData.lyrics.length - 2000)) + '...';
        return { title: jsonData.title, lyrics: jsonData.lyrics };
    }
    /**
     * Adds results for a searched video
     * @param{any[]} results
     * @param {SearchedSong[]} returnData
     * @private
     */
    _addResults(results, returnData) {
        for (const data of results) {
            if (returnData.length >= this._limit)
                break;
            const video = data.videoRenderer;
            if (video) {
                returnData.push({
                    type: 'video',
                    id: video.videoId,
                    url: `${Constants_1.youTubeVideoURL}${video.videoId}`,
                    title: video.title.runs[0].text,
                    thumbnails: video.thumbnail.thumbnails,
                    description: video.detailedMetadataSnippets?.[0].snippetText.runs.map((v) => v.text).join(''),
                    duration: video.lengthText?.simpleText ?? '0:00',
                    msDuration: video.lengthText?.simpleText
                        .split(':')
                        .map(Number)
                        .reduce((acc, time) => 60 * acc + time) * 1000 ?? 0,
                    channel: {
                        id: video.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
                        url: `${Constants_1.youTubeChannelURL}/${video.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId}`,
                        title: video.ownerText.runs[0].text,
                        thumbnails: video.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
                    },
                });
            }
        }
    }
    /**
     * Gets an InnerTube API key and set the Innertube context, depending on your computer
     * @returns {Promise<void>}
     * @private
     */
    async _initInnerTubeApiKey() {
        const { body } = await (0, undici_1.request)(`${Constants_1.youTubeBaseURL}?hl=en`);
        const jsonData = await JSON.parse(/ytcfg.set\(({.+?})\)/s.exec(await body.text())[1]);
        this._apiKey = jsonData.INNERTUBE_API_KEY;
        if (this._innerTubeContext === null || Object.keys(this._innerTubeContext ?? []).length === 0)
            this._innerTubeContext = jsonData.INNERTUBE_CONTEXT;
    }
    /**
     * Generates body to fetch YouTube API
     * @param {string} url
     * @returns {object}
     * @private
     */
    _generateExtractBody(url) {
        const videoId = url.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\/?\?v=|\/embed\/|\/)([^\s&\?\/\#]+)/)[1];
        return Object.assign(Constants_1.InnerTubeAndroidContext, { videoId });
    }
    /**
     * Humanizes seconds
     * @param {number} secs
     * @returns {string}
     * @private
     */
    _humanizeSeconds(secs) {
        return (secs - (secs %= 60)) / 60 + (9 < secs ? ':' : ':0') + secs;
    }
}
exports.SongSearcher = SongSearcher;
//# sourceMappingURL=SongSearcher.js.map