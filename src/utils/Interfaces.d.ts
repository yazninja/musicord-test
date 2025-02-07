import { AudioResource, VoiceConnection } from '@discordjs/voice';
import { VoiceChannel, Guild, VoiceBasedChannel, StageChannel, TextChannel, GuildTextBasedChannel, TextBasedChannel } from 'discord.js';
export interface MusicordOptions {
    ytApiKey: string;
}
export interface CommandData {
    cmdName: string;
    implemented: boolean;
    description: string;
    options?: {
        name: string;
        description: string;
        type: number;
        required?: boolean;
    };
}
declare type DJSSlashCommandsType = 'STRING' | 'BOOLEAN' | 'NUMBER' | 'CHANNEL';
export interface DJSApplicationCommandsSchema {
    name: string;
    description: string;
    options?: {
        name?: string;
        type?: DJSSlashCommandsType | any;
        description?: string;
        required?: boolean;
    }[];
}
declare type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
export declare type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
export interface AdvancedQueueOptions {
    autoJoin?: boolean;
    volume?: Range<0, 101>;
    autoNextSong?: boolean;
}
export interface InitQueueOptions {
    textChannel: TextChannel | GuildTextBasedChannel | TextBasedChannel;
    voiceChannel?: VoiceBasedChannel | VoiceChannel | StageChannel;
    advancedOptions?: AdvancedQueueOptions;
}
export interface FFmpegCustomEqualizerOptions {
    band1?: Range<0, 101>;
    band2?: Range<0, 101>;
    band3?: Range<0, 101>;
    band4?: Range<0, 101>;
    band5?: Range<0, 101>;
    band6?: Range<0, 101>;
    band7?: Range<0, 101>;
    band8?: Range<0, 101>;
    band9?: Range<0, 101>;
    band10?: Range<0, 101>;
}
export interface Song {
    id: string;
    url: string;
    title: string;
    msDuration: number;
    duration: string;
    description: string;
    thumbnails: ThumbnailsOptions[];
    channel: {
        id: string;
        title: string;
        url: string;
    };
    streamURL: string;
}
interface ThumbnailsOptions {
    url: string;
    width: number;
    height: number;
}
export interface SearchedSong {
    type: 'video' | 'playlist';
    id: string;
    url: string;
    title: string;
    thumbnails: ThumbnailsOptions[];
    description: string;
    duration: string;
    msDuration: number;
    channel: {
        id: string;
        url: string;
        title: string;
        thumbnails: ThumbnailsOptions[];
    };
}
export interface SongSearcherOptions {
    spotifyApiKey?: string;
    customInnertubeContext: {
        client: string;
        gl: string;
        clientName: 'WEB' | string;
        clientVersion: string;
        utcOffsetMinutes: 0 | number;
    };
}
export interface SearchOptions {
    maxResults?: Range<0, 101>;
}
export interface QueueOptions {
    guild?: Guild;
    textChannel?: TextChannel | GuildTextBasedChannel | TextBasedChannel;
    voiceChannel?: VoiceBasedChannel | VoiceChannel | StageChannel;
    connection?: VoiceConnection | null;
    songs: Song[];
    volume: number;
    playing?: boolean;
    filters: string[];
    ressource?: AudioResource<any> | undefined;
}
export interface PlayerEventsList {
    trackStart: string;
}
export interface SearchedPlaylist {
    title: string;
    videoId: string;
    index: number;
    isPlayable: boolean;
    url: string;
}
export interface SongLyrics {
    title: string;
    lyrics: string;
}
export interface Playlist {
    title: string;
    description: string;
}
export interface ClientVoiceSettingsOptions {
    deaf: boolean;
    requestToSpeak: boolean;
    suppressed: boolean;
}
export {};
//# sourceMappingURL=Interfaces.d.ts.map