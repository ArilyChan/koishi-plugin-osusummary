"use strict";

const OsudailyApi = require("./ApiRequest");
const utils = require("./utils");
const UserFull = require("./UserFull");

class getUserData {
    constructor(host, apiKey, params) {
        this.host = host;
        this.apiKey = apiKey;
        this.params = params;
        this.options = this.setOptions(params);
    }

    // 判断字符串是否为正整数
    checkInt(nubmer) {
        var re = /^\d+$/;
        return (re.test(nubmer));
    }
    setOptions(params) {
        let options = {};
        // 直接获取所有模式数据太大了，只按模式获取
        options.m = params.m;
        let u = params.u;
        if (!u) throw "玩家名为空";
        // 带引号强制字符串形式
        if ((u.length > 4) && (u.substring(0, 1) === "\"") && (u.substring(u.length - 1) === "\"")) {
            options.u = u.substring(1, u.length - 1);
            options.s = 1;
        }
        else if (this.checkInt(u)) {
            options.u = u;
            options.s = 0;
        }
        else {
            options.u = u;
            options.s = 1;
        }
        return options;
    }

    async getUserFull(startDate, endDate) {
        const user = await OsudailyApi.getUserFull(this.options, this.host, this.apiKey);
        if (user.error) throw user.error + "\n" + utils.apiObjectToString(this.options) + "\n可能该用户尚未注册osudaily.net账号";
        let gamemode = this.options.m || 0;
        if (user.modes[gamemode].lines.length < 10) throw "该用户数据量不足QAQ";
        let userObject = new UserFull(user, startDate, endDate);
        return userObject;
    }
}

module.exports = getUserData;