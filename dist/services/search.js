"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const cheerio_1 = require("cheerio");
const utils_1 = require("./utils");
const search = (searchValue) => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, utils_1.getDataFromUrl)(`/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(searchValue)}`);
    const $ = (0, cheerio_1.load)(html);
    const json = [];
    const devices = $('.makers').find('li');
    devices.each((i, el) => {
        var _a, _b, _c, _d;
        const imgBlock = $(el).find('img');
        const id = (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.replace('.php', '')) !== null && _b !== void 0 ? _b : '';
        const name = (_d = (_c = $(el).find('span').html()) === null || _c === void 0 ? void 0 : _c.split('<br>').join(' ')) !== null && _d !== void 0 ? _d : '';
        const img = imgBlock.attr('src');
        const description = imgBlock.attr('title');
        json.push({ id, name, img, description });
    });
    return json;
});
exports.search = search;
// Run it (optional for testing)
// search('apple').then(console.log).catch(console.error);
