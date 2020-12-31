

class utils {
    /**
     * 模式字符串转mod
     * @param {String} modeString 模式字符串
     * @returns {0|1|2|3}
     */
    static getMode(modeString) {
        try {
            let s = modeString.toString().trim().toLowerCase();
            if (s === "0" || s === "1" || s === "2" || s === "3") return parseInt(s);
            else if (s.indexOf("std") >= 0) return 0;
            else if (s.indexOf("standard") >= 0) return 0;
            else if (s.indexOf("click") >= 0) return 0;
            else if (s.indexOf("泡泡") >= 0) return 0;
            else if (s.indexOf("taiko") >= 0) return 1;
            else if (s.indexOf("鼓") >= 0) return 1;
            else if (s.indexOf("catch") >= 0) return 2;
            else if (s.indexOf("ctb") >= 0) return 2;
            else if (s.indexOf("接") >= 0) return 2;
            else if (s.indexOf("mania") >= 0) return 3;
            else if (s.indexOf("key") >= 0) return 3;
            else if (s.indexOf("骂娘") >= 0) return 3;
            else if (s.indexOf("琴") >= 0) return 3;
            else if (s === "s") return 0;
            else if (s === "t") return 1;
            else if (s === "c") return 2;
            else if (s === "m") return 3;
            else return 0;
        }
        catch (ex) {
            return 0;
        }
    }

}
module.exports = utils;