"use strict";

const querystring = require('querystring');
const fetch = require('node-fetch')

class OsuApi {
    static async apiCall(_path, _data, _host) {
        try {
            const contents = querystring.stringify(_data);
            const url = "https://" + _host + "/api" + _path + '?' + contents;
            return await fetch(url).then(res => res.json());
        }
        catch (ex) {
            throw "获取数据失败，可能服务器正在维护";
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
        const resp = await this.apiCall('/user', options, host);
        return resp;
    }

}

module.exports = OsuApi;
