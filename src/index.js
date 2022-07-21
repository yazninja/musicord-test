"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioFilters = exports.version = void 0;
const FFmpegAudioFilters_1 = require("./structures/FFmpegAudioFilters");
var package_json_1 = require("../package.json");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return package_json_1.version; } });
__exportStar(require("./structures/Musicord"), exports);
__exportStar(require("./structures/SongSearcher"), exports);
__exportStar(require("./structures/ApplicationCommandsSchema"), exports);
exports.AudioFilters = new FFmpegAudioFilters_1.FFmpegAudioFilters();
__exportStar(require("./structures/Player"), exports);
__exportStar(require("./utils/Constants"), exports);
__exportStar(require("./utils/Interfaces"), exports);
//# sourceMappingURL=index.js.map