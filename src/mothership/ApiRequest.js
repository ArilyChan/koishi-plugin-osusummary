const querystring = require("querystring");
const fetch = require("node-fetch");
const utils = require("../utils");

class OsuApi {
    static async apiCall(url, times = 0) {
        const MAX_RETRY = 10;
        try {
            // console.log(url);
            const data = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/octet-stream" },
                credentials: "include",
                timeout: 10000,
            }).then((res) => res.json());
            return data;
        }
        catch (ex) {
            if (times >= MAX_RETRY) {
                throw "从白菜获取数据失败";
            }
            console.log("获取数据失败，第" + (times + 1) + "次重试");
            return this.apiCall(url, times + 1);
        }
    }

    /**
     * @param {Number} userId
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Number} mode
     */
    static async getUserFull(userId, startDate, endDate, mode) {
        const data = {};
        data.start = utils.getDateString(startDate, true);
        data.limit = Math.ceil((endDate - startDate) / (1000 * 3600 * 24)) - 1;
        data.mode = mode;
        const contents = querystring.stringify(data);
        const url = "https://www.mothership.top/api/v1/userinfo/" + userId + "?" + contents;
        const resp = await this.apiCall(url);
        if (resp.code === 3) {
            // 起始时间过早
            const newStartDate = new Date(resp.data.year + "-" + resp.data.month + "-" + resp.data.day);
            const newData = await this.getUserFull(userId, newStartDate, endDate, mode);
            return newData;
        }
        if (resp.code !== 0) throw resp.status;
        return resp.data;
    }


    /**
     * @param {Number} qqId
     */
    static async getQQInfo(qqId) {
        const url = "https://www.mothership.top/api/v1/user/qq/" + qqId;
        const resp = await this.apiCall(url);
        if (resp.code !== 0) throw resp.status;
        const userId = resp.data.userId;
        const currentUname = resp.data.currentUname;
        const mode = resp.data.mode;
        return { userId, currentUname, mode };
    }

}

module.exports = OsuApi;
