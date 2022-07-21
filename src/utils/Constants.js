"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotifyApiURL = exports.spotifyTrackPattern = exports.spotifyPattern = exports.PrismOpusEncoderEvents = exports.PlayerEvents = exports.ExtendedAudioPlayerStatus = exports.ProgressBarOptions = exports.DefaultFFmpegArgs = exports.InnerTubeAndroidContext = exports.lyricsApiUrl = exports.youTubePlaylistURL = exports.youTubeChannelURL = exports.youTubeVideoURL = exports.innerTubeApiURL = exports.youTubeBaseURL = exports.youTubePlaylistPattern = exports.audioPattern = exports.youTubePattern = void 0;
exports.youTubePattern = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
exports.audioPattern = /(?:((?:https|http):\/\/)|(?:\/)).+(?:.mp3|mp4)/gm;
exports.youTubePlaylistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
exports.youTubeBaseURL = 'https://www.youtube.com';
exports.innerTubeApiURL = 'https://www.youtube.com/youtubei/v1';
exports.youTubeVideoURL = 'https://www.youtube.com/watch?v=';
exports.youTubeChannelURL = 'https://www.youtube.com/channel';
exports.youTubePlaylistURL = 'https://www.youtube.com/playlist';
exports.lyricsApiUrl = 'https://some-random-api.ml/lyrics?title=';
exports.InnerTubeAndroidContext = {
    context: {
        client: {
            hl: 'en',
            gl: 'US',
            clientName: 'ANDROID',
            clientVersion: '17.09.33',
            utcOffsetMinutes: 0,
        },
        user: {},
        request: {},
    },
};
exports.DefaultFFmpegArgs = ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5'];
exports.ProgressBarOptions = {
    size: 20,
    line: '▬',
    slider: '🔘',
};
var ExtendedAudioPlayerStatus;
(function (ExtendedAudioPlayerStatus) {
    ExtendedAudioPlayerStatus["Error"] = "error";
    ExtendedAudioPlayerStatus["Debug"] = "debug";
    ExtendedAudioPlayerStatus["Suscribe"] = "suscribe";
    ExtendedAudioPlayerStatus["Unsuscribe"] = "unsuscribe";
    ExtendedAudioPlayerStatus["StateChange"] = "stateChange";
})(ExtendedAudioPlayerStatus = exports.ExtendedAudioPlayerStatus || (exports.ExtendedAudioPlayerStatus = {}));
var PlayerEvents;
(function (PlayerEvents) {
    PlayerEvents["TrackStart"] = "trackStart";
    PlayerEvents["TrackFinished"] = "trackFinished";
    PlayerEvents["Pause"] = "pause";
    PlayerEvents["Resume"] = "resume";
    PlayerEvents["Stop"] = "stop";
    PlayerEvents["Connected"] = "connected";
    PlayerEvents["Disconnected"] = "disconnected";
    PlayerEvents["Error"] = "error";
    PlayerEvents["StreamError"] = "streamError";
    PlayerEvents["Debug"] = "debug";
})(PlayerEvents = exports.PlayerEvents || (exports.PlayerEvents = {}));
var PrismOpusEncoderEvents;
(function (PrismOpusEncoderEvents) {
    PrismOpusEncoderEvents["Close"] = "close";
    PrismOpusEncoderEvents["Data"] = "data";
    PrismOpusEncoderEvents["End"] = "end";
    PrismOpusEncoderEvents["Error"] = "error";
    PrismOpusEncoderEvents["Pause"] = "pause";
    PrismOpusEncoderEvents["Readable"] = "readable";
    PrismOpusEncoderEvents["Resume"] = "resume";
})(PrismOpusEncoderEvents = exports.PrismOpusEncoderEvents || (exports.PrismOpusEncoderEvents = {}));
exports.spotifyPattern = /(https?:\/\/open.spotify.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|))/;
exports.spotifyTrackPattern = /((http:\/\/(open\.spotify\.com\/.*|spoti\.fi\/.*|play\.spotify\.com\/.*))|(https:\/\/(open\.spotify\.com\/.*|play\.spotify\.com\/.*)))/i;
exports.spotifyApiURL = 'https://api.spotify.com/v1/';
//# sourceMappingURL=Constants.js.map