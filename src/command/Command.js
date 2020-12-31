"use strict";

const getUserData = require("../getUserData");
const utils = require("./utils");

class Command {
    /**
     * @param {Number} qqId 发送者Id
     * @param {String} message 消息
     * @param {Object} globalConstant 
     * @param {String} globalConstant.apiKey osudaily apiKey
     * @param {String} globalConstant.host osudaily网址
     */
    constructor(qqId, message, globalConstant) {
        this.qqId = qqId;
        /** @type {String} */
        this.message = (message) ? message.trim().replace(/&#(x)?(\w+);/g, function ($, $1, $2) {
            return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
        }) : "";
        this.commandString = "";
        this.argString = "";
        this.userInfo = { qqId: qqId, osuId: 0, defaultMode: 0 };
        this.globalConstant = globalConstant;
    }

    /**
     * 拆出指令和参数
     * @param {RegExp} commandReg 
     * @returns {Boolean} 消息是否符合指令形式
     */
    cutCommand() {
        const mr = /^([a-zA-Z0-9]+)/i.exec(this.message);
        if (mr === null) return false;
        else {
            this.commandString = mr[1].toLowerCase();
            this.argString = this.message.substring(this.commandString.length).trim();
            return true;
        }
    }

    async od2020() {
        let args = this.argString.split(",");
        let options = {};
        options.u = args[0];
        options.m = (args[1]) ? utils.getMode(args[1]) : 0;
        if (!options.u) return "请指定玩家ID";
        let user = await new getUserData(this.globalConstant.host, this.globalConstant.apiKey, options).getUserFull(new Date("2020-01-01"), new Date("2020-12-31"));
        return user.modes[options.m].summary();
    }

    async apply() {
        try {
            if (!this.cutCommand()) return "";
            else if (this.commandString === "od2020") return await this.od2020();
            return "";
        }
        catch (ex) {
            return ex;
        }
    }

}

module.exports = Command;