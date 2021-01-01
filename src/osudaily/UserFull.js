const utils = require("../utils");

class Line {
    constructor(lineData) {
        this.A = parseInt(lineData.A);
        this.S = parseInt(lineData.S);
        this.SS = parseInt(lineData.SS);
        this.accuracy = parseFloat(lineData.accuracy); // 99.134
        this.date = new Date(lineData.date);
        this.level = parseFloat(lineData.level);
        this.playcount = parseInt(lineData.playcount);
        this.pp = parseInt(lineData.pp);
        this.rankcountry = parseInt(lineData.rankcountry);
        this.rankedscore = parseInt(lineData.rankedscore);
        this.rankworld = parseInt(lineData.rankworld);
        this.totalscore = parseInt(lineData.totalscore);
    }

    compareValue(oldLine, type) {
        const thisValue = this[type];
        const oldValue = oldLine[type];
        return thisValue - oldValue;
    }
}

class DeltaLine {
    /**
     * @param {Number} index newLine所在lines的index
     * @param {Line} newLine
     * @param {Line} oldLine
     */
    constructor(index, newLine, oldLine) {
        this.index = index;
        this.date = newLine.date;
        this.newLine = newLine;
        this.oldLine = oldLine;
        this.dA = newLine.compareValue(oldLine, "A");
        this.dS = newLine.compareValue(oldLine, "S");
        this.dSS = newLine.compareValue(oldLine, "SS");
        this.dAccuracy = newLine.compareValue(oldLine, "accuracy");
        this.dLevel = newLine.compareValue(oldLine, "level");
        this.dPlaycount = newLine.compareValue(oldLine, "playcount");
        this.dPP = newLine.compareValue(oldLine, "pp");
        this.dRankcountry = newLine.compareValue(oldLine, "rankcountry");
        this.dRankedscore = newLine.compareValue(oldLine, "rankedscore");
        this.dRankworld = newLine.compareValue(oldLine, "rankworld");
        this.dTotalscore = newLine.compareValue(oldLine, "totalscore");
    }
}

class Achievement {
    constructor() {
        this.ach = {};
    }

    addAchieve(dateString, event) {
        if (!this.ach[dateString]) this.ach[dateString] = [event];
        else this.ach[dateString].push(event);
    }

    toString() {
        let output = "";
        // 排序
        const res = Object.keys(this.ach).sort((a, b) => { return new Date(a) - new Date(b) });
        // eslint-disable-next-line guard-for-in
        for (const key in res) {
            output += res[key] + "\n  " + this.ach[res[key]].join("\n  ") + "\n";
        }
        return output;
    }
}

class Mode {
    /**
     * @param {*} data
     * @param {Date} startDate
     * @param {Date} endDate
     */
    constructor(data, startDate, endDate) {
        this.mode = data.mode;
        this.lines = data.lines.map((lineData) => new Line(lineData)).filter((line) => {
            return (startDate <= line.date && line.date <= endDate);
        }).sort((a, b) => a.date - b.date);
        this.newestLine = this.lines[this.lines.length - 1];
        this.oldestLine = this.lines[0];
        this.dEntireLine = new DeltaLine(this.lines.length - 1, this.newestLine, this.oldestLine);
        // 注意，dLines的index总是比lines小1
        this.dLines = this.lines.map((line, index) => {
            if (index <= 0) return null;
            return new DeltaLine(index, line, this.lines[index - 1]);
        }).slice(1);
        this.achievement = new Achievement();
    }

    getMaxContinuousPlaying() {
        let maxContinuousPlayingDays = 0;
        let nowContinuousPlayingDays = 0;
        let maxContinuousPlayingEndDay = "";
        // eslint-disable-next-line array-callback-return
        this.dLines.map((dline, index) => {
            if (dline.dPlaycount > 0 && index < this.dLines.length - 1) nowContinuousPlayingDays += 1;
            else {
                if (nowContinuousPlayingDays > maxContinuousPlayingDays) {
                    maxContinuousPlayingDays = nowContinuousPlayingDays;
                    maxContinuousPlayingEndDay = utils.getDateString(dline.date);
                }
                nowContinuousPlayingDays = 0;
            }
        });
        if (maxContinuousPlayingEndDay === utils.getDateString(this.newestLine.date)) this.achievement.addAchieve(maxContinuousPlayingEndDay, "到此为止，您已经坚持" + maxContinuousPlayingDays + "天连续游玩osu，并且可能还要继续下去...");
        else this.achievement.addAchieve(maxContinuousPlayingEndDay, "您中断了为期" + maxContinuousPlayingDays + "天的连续osu生活QAQ");
    }


    getMaxIncrease() {
        // A增长最多
        let maxIncreaseAValue = 0;
        let maxIncreaseAEnd = "";
        // S增长最多
        let maxIncreaseSValue = 0;
        let maxIncreaseSEnd = "";
        // SS增长最多
        let maxIncreaseSSValue = 0;
        let maxIncreaseSSEnd = "";
        // pc增长最多
        let maxIncreasePCValue = 0;
        let maxIncreasePCEnd = "";
        // PP增长最多
        let maxIncreasePPValue = 0;
        let maxIncreasePPEnd = "";
        // PP倒退最多
        let maxDecreasePPValue = 0;
        let maxDecreasePPEnd = "";
        // acc增长最多
        let maxIncreaseAccValue = 0;
        let maxIncreaseAccEnd = "";
        // acc倒退最多
        let maxDecreaseAccValue = 0;
        let maxDecreaseAccEnd = "";
        // eslint-disable-next-line array-callback-return
        this.dLines.map((dline) => {
            if (dline.dA > maxIncreaseAValue) {
                maxIncreaseAValue = dline.dA;
                maxIncreaseAEnd = utils.getDateString(dline.date);
                if (dline.oldLine.A <= 0) this.achievement.addAchieve(utils.getDateString(dline.date), "这天，您获得了人生中该模式的第一个A！");
            }
            if (dline.dS > maxIncreaseSValue) {
                maxIncreaseSValue = dline.dS;
                maxIncreaseSEnd = utils.getDateString(dline.date);
                if (dline.oldLine.S <= 0) this.achievement.addAchieve(utils.getDateString(dline.date), "这天，您获得了人生中该模式的第一个S！");
            }
            if (dline.dSS > maxIncreaseSSValue) {
                maxIncreaseSSValue = dline.dSS;
                maxIncreaseSSEnd = utils.getDateString(dline.date);
                if (dline.oldLine.SS <= 0) this.achievement.addAchieve(utils.getDateString(dline.date), "这天，您获得了人生中该模式的第一个SS！");
            }
            if (dline.dPlaycount > maxIncreasePCValue) {
                maxIncreasePCValue = dline.dPlaycount;
                maxIncreasePCEnd = utils.getDateString(dline.date);
            }
            if (dline.dPP > maxIncreasePPValue) {
                maxIncreasePPValue = dline.dPP;
                maxIncreasePPEnd = utils.getDateString(dline.date);
            }
            if (dline.dPP < maxDecreasePPValue) {
                maxDecreasePPValue = dline.dPP;
                maxDecreasePPEnd = utils.getDateString(dline.date);
            }
            if (dline.dAccuracy > maxIncreaseAccValue) {
                maxIncreaseAccValue = dline.dAccuracy;
                maxIncreaseAccEnd = utils.getDateString(dline.date);
            }
            if (dline.dAccuracy < maxDecreaseAccValue) {
                maxDecreaseAccValue = dline.dAccuracy;
                maxDecreaseAccEnd = utils.getDateString(dline.date);
            }
        });
        if (maxIncreaseAValue > 0) this.achievement.addAchieve(maxIncreaseAEnd, "这天您挖了" + maxIncreaseAValue + "个A坑");
        if (maxIncreaseSValue > 0) this.achievement.addAchieve(maxIncreaseSEnd, "这天您打了" + maxIncreaseSValue + "个S！");
        if (maxIncreaseSSValue > 0) this.achievement.addAchieve(maxIncreaseSSEnd, "这天您打了" + maxIncreaseSSValue + "个SS！");
        if (maxIncreasePCValue > 99) this.achievement.addAchieve(maxIncreasePCEnd, "这天您打了" + maxIncreasePCValue + " PC！");
        if (maxIncreasePPValue > 10) this.achievement.addAchieve(maxIncreasePPEnd, "这天您增加了" + maxIncreasePPValue + " PP！");
        if (maxDecreasePPValue < 0) this.achievement.addAchieve(maxDecreasePPEnd, "这天您倒刷了" + (-maxDecreasePPValue) + " PP（也可能是pp系统调整）");
        if (maxIncreaseAccValue > 0.3) this.achievement.addAchieve(maxIncreaseAccEnd, "这天您提升了" + maxIncreaseAccValue.toFixed(2) + "%acc！");
        if (maxDecreaseAccValue < -0.3) this.achievement.addAchieve(maxDecreaseAccEnd, "这天您降低了" + (-maxDecreaseAccValue).toFixed(2) + "%acc...");
    }

    getPPStepDate() {
        let aimPPStep = parseInt(this.oldestLine.pp / 1000) + 1;
        // eslint-disable-next-line array-callback-return
        this.lines.map((line) => {
            if (parseInt(line.pp / 1000) >= aimPPStep) {
                this.achievement.addAchieve(utils.getDateString(line.date), "这天，您的pp终于超过了" + parseInt(line.pp / 1000) * 1000);
                aimPPStep = parseInt(line.pp / 1000) + 1;
            }
        });
    }

    getRankStepDate() {
        let aimRankStep = parseInt(Math.log10(this.oldestLine.rankworld)) - 1;
        // eslint-disable-next-line array-callback-return
        this.lines.map((line) => {
            const dg = parseInt(Math.log10(this.oldestLine.rankworld));
            if (dg <= aimRankStep) {
                this.achievement.addAchieve(utils.getDateString(line.date), "这天，您终于进入了" + (dg + 1) + "位数");
                aimRankStep = dg;
            }
        });
    }

    summary() {
        // 先遍历一遍DeltaLine，获取最长连续游玩天数
        this.getMaxContinuousPlaying();
        // 再遍历一遍DeltaLine，获取各数据的增长最多日期
        this.getMaxIncrease();
        // 再遍历一遍Line，获取跨越整千pp时间
        this.getPPStepDate();
        // 再遍历一遍Line，获取rank进位时间
        this.getRankStepDate();

        return this.achievement.toString();
    }

}

class UserFull {
    constructor(data, startDate, endDate) {
        // this.id = parseInt(data.id);
        this.osu_id = parseInt(data.osu_id);
        this.username = data.username;
        this.country = parseInt(data.country);
        this.last_update = new Date(data.last_update);
        this.modes = {};
        if (data.modes[0]) this.modes[0] = new Mode(data.modes[0], startDate, endDate);
        if (data.modes[1]) this.modes[1] = new Mode(data.modes[1], startDate, endDate);
        if (data.modes[2]) this.modes[2] = new Mode(data.modes[2], startDate, endDate);
        if (data.modes[3]) this.modes[3] = new Mode(data.modes[3], startDate, endDate);
    }


}

module.exports = UserFull;
