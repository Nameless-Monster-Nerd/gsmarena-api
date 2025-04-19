"use strict";
// src/services/brands.ts
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getDevice = exports.getBrand = exports.getBrands = void 0;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("./utils");
const getBrands = () => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, utils_1.getDataFromUrl)('/makers.php3');
    const $ = cheerio.load(html);
    const json = [];
    const brands = $('table').find('td');
    brands.each((_, el) => {
        var _a;
        const aBlock = $(el).find('a');
        json.push({
            id: ((_a = aBlock.attr('href')) === null || _a === void 0 ? void 0 : _a.replace('.php', '')) || '',
            name: aBlock.text().replace(' devices', '').replace(/[0-9]/g, '').trim(),
            devices: parseInt($(el).find('span').text().replace(' devices', ''), 10),
        });
    });
    return json;
});
exports.getBrands = getBrands;
const getNextPage = ($) => {
    const nextPage = $('a.prevnextbutton[title="Next page"]').attr('href');
    return nextPage ? nextPage.replace('.php', '') : false;
};
const getDevices = ($, devicesList) => {
    const devices = [];
    devicesList.each((_, el) => {
        var _a;
        const imgBlock = $(el).find('img');
        devices.push({
            id: ((_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.replace('.php', '')) || '',
            name: $(el).find('span').text(),
            img: imgBlock.attr('src'),
            description: imgBlock.attr('title'),
        });
    });
    return devices;
};
const getBrand = (brand) => __awaiter(void 0, void 0, void 0, function* () {
    let html = yield (0, utils_1.getDataFromUrl)(`/${brand}.php`);
    let $ = cheerio.load(html);
    let json = [];
    let devices = getDevices($, $('.makers').find('li'));
    json = [...json, ...devices];
    while (getNextPage($)) {
        html = yield (0, utils_1.getDataFromUrl)(`/${getNextPage($)}.php`);
        $ = cheerio.load(html);
        devices = getDevices($, $('.makers').find('li'));
        json = [...json, ...devices];
    }
    return json;
});
exports.getBrand = getBrand;
const getDevice = (device) => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, utils_1.getDataFromUrl)(`/${device}.php`);
    const $ = cheerio.load(html);
    const quickSpec = [
        { name: 'Display size', value: $('span[data-spec=displaysize-hl]').text() },
        { name: 'Display resolution', value: $('div[data-spec=displayres-hl]').text() },
        { name: 'Camera pixels', value: $('.accent-camera').text() },
        { name: 'Video pixels', value: $('div[data-spec=videopixels-hl]').text() },
        { name: 'RAM size', value: $('.accent-expansion').text() },
        { name: 'Chipset', value: $('div[data-spec=chipset-hl]').text() },
        { name: 'Battery size', value: $('.accent-battery').text() },
        { name: 'Battery type', value: $('div[data-spec=battype-hl]').text() },
    ];
    const name = $('.specs-phone-name-title').text();
    const img = $('.specs-photo-main a img').attr('src');
    const detailSpec = [];
    $('table').each((_, el) => {
        const category = $(el).find('th').text();
        const specN = $(el).find('tr');
        const specList = [];
        specN.each((_, ele) => {
            specList.push({
                name: $('td.ttl', ele).text(),
                value: $('td.nfo', ele).text(),
            });
        });
        if (category) {
            detailSpec.push({
                category,
                specifications: specList,
            });
        }
    });
    return {
        name,
        img,
        detailSpec,
        quickSpec,
    };
});
exports.getDevice = getDevice;
