"use strict";
// src/services/deals.ts
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
exports.getDeals = void 0;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("./utils");
const getDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, utils_1.getDataFromUrl)('/deals.php3');
    const $ = cheerio.load(html);
    const json = [];
    const devices = $('#body').find('.pricecut');
    devices.each((i, el) => {
        var _a;
        const img = $(el).find('.row a img').attr('src');
        const url = $(el).find('.row a.image').attr('href');
        const name = $(el).find('.row .phone div h3').text();
        const id = ((_a = $(el).find('.row .phone div a').attr('href')) === null || _a === void 0 ? void 0 : _a.replace('.php', '')) || '';
        const description = $(el).find('.row .phone p a').text();
        const price = (0, utils_1.getPrice)($(el).find('.row .phone .deal a.price').text());
        const deal = {
            memory: $(el).find('.row .phone .deal a.memory').text(),
            storeImg: $(el).find('.row .phone .deal a.store img').attr('src'),
            price: price.price,
            currency: price.currency,
            discount: parseFloat($(el).find('.row .phone .deal a.discount').text()),
        };
        const device = {
            id,
            img,
            url,
            name,
            description,
            deal,
            history: [],
        };
        const historyList = $(el).find('.history .stats');
        historyList.children().each((index, elem) => {
            if (index % 2 === 0) {
                device.history.push({ time: $(elem).text() });
            }
            else {
                const historyPrice = (0, utils_1.getPrice)($(elem).text());
                const entry = device.history[Math.floor(index / 2)];
                entry.price = historyPrice.price;
                entry.currency = historyPrice.currency;
            }
        });
        json.push(device);
    });
    return json;
});
exports.getDeals = getDeals;
