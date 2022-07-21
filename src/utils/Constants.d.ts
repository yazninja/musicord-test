export declare const youTubePattern: RegExp;
export declare const audioPattern: RegExp;
export declare const youTubePlaylistPattern: RegExp;
export declare const youTubeBaseURL = "https://www.youtube.com";
export declare const innerTubeApiURL = "https://www.youtube.com/youtubei/v1";
export declare const youTubeVideoURL = "https://www.youtube.com/watch?v=";
export declare const youTubeChannelURL = "https://www.youtube.com/channel";
export declare const youTubePlaylistURL = "https://www.youtube.com/playlist";
export declare const lyricsApiUrl = "https://some-random-api.ml/lyrics?title=";
export declare const InnerTubeAndroidContext: {
    context: {
        client: {
            hl: string;
            gl: string;
            clientName: string;
            clientVersion: string;
            utcOffsetMinutes: number;
        };
        user: {};
        request: {};
    };
};
export declare const DefaultFFmpegArgs: string[];
export declare const ProgressBarOptions: {
    size: number;
    line: string;
    slider: string;
};
export declare enum ExtendedAudioPlayerStatus {
    Error = "error",
    Debug = "debug",
    Suscribe = "suscribe",
    Unsuscribe = "unsuscribe",
    StateChange = "stateChange"
}
export declare enum PlayerEvents {
    TrackStart = "trackStart",
    TrackFinished = "trackFinished",
    Pause = "pause",
    Resume = "resume",
    Stop = "stop",
    Connected = "connected",
    Disconnected = "disconnected",
    Error = "error",
    StreamError = "streamError",
    Debug = "debug"
}
export declare enum PrismOpusEncoderEvents {
    Close = "close",
    Data = "data",
    End = "end",
    Error = "error",
    Pause = "pause",
    Readable = "readable",
    Resume = "resume"
}
export declare const spotifyPattern: RegExp;
export declare const spotifyTrackPattern: RegExp;
export declare const spotifyApiURL = "https://api.spotify.com/v1/";
//# sourceMappingURL=Constants.d.ts.map