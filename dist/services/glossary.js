"use strict";
// src/services/glossary.ts
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
exports.getTerm = exports.get = void 0;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("./utils");
const get = () => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, utils_1.getDataFromUrl)('/glossary.php3');
    const $ = cheerio.load(html);
    const json = [];
    const parentTerms = $('#body').find('.st-text');
    parentTerms.children().each((index, el) => {
        if (index % 2 === 0) {
            json.push({ letter: $(el).text(), list: [] });
        }
        else {
            const terms = $(el).find('a');
            terms.each((i, ele) => {
                var _a, _b;
                const id = (_b = (_a = $(ele).attr('href')) === null || _a === void 0 ? void 0 : _a.replace('glossary.php3?term=', '')) !== null && _b !== void 0 ? _b : '';
                const name = $(ele).text();
                json[Math.floor(index / 2)].list.push({ id, name });
            });
        }
    });
    return json;
});
exports.get = get;
const getTerm = (term) => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, utils_1.getDataFromUrl)(`/glossary.php3?term=${encodeURIComponent(term)}`);
    const $ = cheerio.load(html);
    const body = $('#body');
    const title = body.find('.review-header .article-hgroup h1').text();
    const text = body.find('.st-text').first().html();
    return {
        title,
        html: text,
    };
});
exports.getTerm = getTerm;
(0, exports.get)();
