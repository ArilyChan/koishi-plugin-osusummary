class utils {
    // 整数每3位加逗号
    static format_number(n) {
        const b = parseInt(n).toString();
        const len = b.length;
        if (len <= 3) { return b }
        const r = len % 3;
        return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
    }

    // mode转string
    static getModeString(mode) {
        if (mode !== 0 && mode !== "0" && !mode) return "当你看到这条信息说明代码有漏洞惹";
        const modeString = mode.toString();
        if (modeString === "0") return "Standard";
        else if (modeString === "1") return "Taiko";
        else if (modeString === "2") return "Catch The Beat";
        else if (modeString === "3") return "Mania";
        return "未知";
    }

    static getDateString(date, isMS = false) {
        const year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        if (month.length === 1) month = "0" + month;
        let day = date.getDate().toString();
        if (day.length === 1) day = "0" + day;
        return (isMS) ? year + month + day : year + "-" + month + "-" + day;
    }

    /**
     * 易读化错误信息
     * @param {Object} apiObject
     * @returns {String}
     */
    static apiObjectToString(apiObject) {
        delete apiObject.k;
        const output = "（ " + JSON.stringify(apiObject) + " ）";
        return output;
    }

}


module.exports = utils;
