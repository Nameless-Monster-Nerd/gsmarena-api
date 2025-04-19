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
exports.get = void 0;
const cheerio_1 = require("cheerio");
const utils_1 = require("./utils");
const get = () => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, utils_1.getDataFromUrl)('/deals.php3');
    const $ = (0, cheerio_1.load)(html);
    const json = [];
    const categories = $('.sidebar.col.left').find('.module.module-rankings.s3');
    categories.each((i, el) => {
        const category = $(el).find('h4').text();
        const positions = $(el).find('tr');
        const ranks = [];
        positions.each((ind, ele) => {
            var _a, _b;
            const position = $('td[headers=th3a]', ele).text().replace('.', '');
            if (position) {
                const name = $('nobr', ele).text();
                const id = (_b = (_a = $('a', ele).attr('href')) === null || _a === void 0 ? void 0 : _a.replace('.php', '')) !== null && _b !== void 0 ? _b : '';
                const index = parseInt($('td[headers=th3c]', ele).text().replace(',', ''), 10);
                const element = {
                    position: parseInt(position, 10),
                    id,
                    name,
                };
                if (ind === 0) {
                    element.dailyHits = index;
                }
                else {
                    element.favorites = index;
                }
                ranks.push(element);
            }
        });
        json.push({
            category,
            list: ranks,
        });
    });
    return json;
});
exports.get = get;
// get().then(e => console.log(e))
