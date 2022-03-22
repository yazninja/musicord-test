export const youTubePattern: RegExp = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
export const audioPattern: RegExp = /(?:((?:https|http):\/\/)|(?:\/)).+(?:.mp3|mp4)/gm;
export const youTubePlaylistPattern: RegExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;

export const youTubeBaseURL = 'https://www.youtube.com';
export const innerTubeApiURL = 'https://www.youtube.com/youtubei/v1';
export const youTubeVideoURL = 'https://www.youtube.com/watch?v=';
export const youTubeChannelURL = 'https://www.youtube.com/channel';
export const youTubePlaylistURL = 'https://www.youtube.com/playlist';

export const lyricsApiUrl = 'https://some-random-api.ml/lyrics?title=';

export const InnerTubeAndroidContext = {
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

export const DefaultFFmpegArgs = ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5'];

export const ProgressBarOptions = {
  size: 20,
  line: '▬',
  slider: '🔘',
};

export enum ExtendedAudioPlayerStatus {
  Error = 'error',
  Debug = 'debug',
  Suscribe = 'suscribe',
  Unsuscribe = 'unsuscribe',
  StateChange = 'stateChange',
}

export enum PlayerEvents {
  Error = 'error',
  Debug = 'debug',
  TrackStart = 'trackStart',
  TrackFinished = 'trackFinished',
  Disconnected = 'disconnected',
}
