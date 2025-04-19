"use strict";
// src/utils/gsmUtils.ts (or wherever you want to place it)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrice = exports.getDataFromUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const getDataFromUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://www.gsmarena.com${url}`);
    return response.data;
});
exports.getDataFromUrl = getDataFromUrl;
const getPrice = (text) => {
    const value = text.replace(',', '').split(' ');
    return {
        currency: value[0],
        price: parseFloat(value[1]),
    };
};
exports.getPrice = getPrice;
