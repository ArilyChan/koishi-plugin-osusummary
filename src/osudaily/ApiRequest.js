const querystring = require("querystring");
const fetch = require("node-fetch");

class OsuApi {
    static async apiCall(_path, _data, _host, times = 0) {
        const MAX_RETRY = 2;
        try {
            const contents = querystring.stringify(_data);
            const url = "https://" + _host + "/api" + _path + "?" + contents;
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
                throw "从osudaily获取数据失败，可能服务器正在维护";
            }
            console.log("获取失败，第" + (times + 1) + "次重试");
            return this.apiCall(_path, _data, _host, times + 1);
        }
    }

    /**
     * Retrieve general user data, also with the possibility of retrieving all the collected data since the registration.
     * @param {Object} options
     * @param {String|Number} options.u user osu_id (or username is s is set to 1) (required)
     * @param {Number} [options.s] whether or not the u parameter is a string (0 = id, 1 = string). Optional, 0 by default.
     * @param {Number} [options.m] mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, all modes are returned by default.
     * @param {String} host osudaily.net (required)
     * @param {String} apiKey api key (required).
     */
    static async getUserFull(options, host, apiKey) {
        options.min = 0;
        options.k = apiKey;
        const resp = await this.apiCall("/user", options, host);
        return resp;
    }

}

module.exports = OsuApi;
