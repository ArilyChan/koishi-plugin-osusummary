const Command = require("./src/command/Command");

class OsuSummary {
    /**
     * @param {Object} params
     * @param {String} params.apiKey osudaily apiKey，必要
     * @param {String} [params.host] osudaily网址，默认为"osudaily.net"
     */
    constructor(params) {
        this.globalConstant = {};
        this.globalConstant.apiKey = params.apiKey || "";
        this.globalConstant.host = params.host || "osudaily.net";
    }

    /**
     * 获得返回消息
     * @param {Number} qqId
     * @param {String} message 输入的消息
     */
    async apply(qqId, message) {
        try {
            if (!message.length || message.length < 2) return "";
            if (["!", "！"].indexOf(message.substring(0, 1)) < 0) return "";
            const commandObject = new Command(qqId, message.substring(1).trim(), this.globalConstant);
            const reply = await commandObject.apply();
            return reply;
        } catch (ex) {
            console.log(ex);
            return "";
        }
    }
}

module.exports.OsuSummary = OsuSummary;

// koishi插件
module.exports.name = "koishi-plugin-osusummary";
module.exports.apply = (ctx, options) => {
    const os = new OsuSummary(options);
    // eslint-disable-next-line consistent-return
    ctx.middleware(async (meta, next) => {
        try {
            const message = meta.message;
            const userId = meta.userId;
            const reply = await os.apply(userId, message);
            if (reply) await meta.$send(`[CQ:at,qq=${userId}]\n` + reply);
            else return next();
        } catch (ex) {
            console.log(ex);
            return next();
        }
    });
};
