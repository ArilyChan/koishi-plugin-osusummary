const utils = require("../utils");

class Line {
    constructor(lineData) {
        this.accuracy = parseFloat(lineData.accuracy); // 99.96505
        this.count50 = parseInt(lineData.count50);
        this.count100 = parseInt(lineData.count100);
        this.count300 = parseInt(lineData.count300);
        this.tth = this.count50 + this.count100 + this.count300;
        this.countRankA = parseInt(lineData.countRankA);
        this.countRankS = parseInt(lineData.countRankS);
        this.countRankSh = parseInt(lineData.countRankSh);
        this.countRankSs = parseInt(lineData.countRankSs);
        this.countRankSsh = parseInt(lineData.countRankSsh);
        this.A = this.countRankA;
        this.S = this.countRankSh + this.countRankS;
        this.SS = this.countRankSsh + this.countRankSs;
        this.level = parseFloat(lineData.level);
        this.mode = lineData.mode;
        this.playcount = parseInt(lineData.playcount);
        this.rankworld = parseInt(lineData.ppRank);
        this.pp = parseInt(lineData.ppRaw);
        this.rankedscore = parseInt(lineData.rankedScore);
        this.totalscore = parseInt(lineData.totalScore);
        this.userId = lineData.userId;
        this.date = new Date(lineData.queryDate.year + "-" + lineData.queryDate.month + "-" + lineData.queryDate.day);
    }

    compareValue(oldLine, type) {
        const thisValue = this[type];
        const oldValue = oldLine[type];
        return thisValue - oldValue;
    }
}

class DeltaLine {
    /**
     * @param {Line} newLine
     * @param {Line} oldLine
     */
    constructor(newLine, oldLine) {
        this.date = newLine.date;
        this.newLine = newLine;
        this.oldLine = oldLine;
        // 因为是日期生成的date，间隔一定是一整天的倍数
        this.isContinuous = (Math.round((newLine.date - oldLine.date) / (1000 * 3600 * 24)) === 1);
        this.dA = newLine.compareValue(oldLine, "A");
        this.dS = newLine.compareValue(oldLine, "S");
        this.dSS = newLine.compareValue(oldLine, "SS");
        this.dAccuracy = newLine.compareValue(oldLine, "accuracy");
        this.dLevel = newLine.compareValue(oldLine, "level");
        this.dPlaycount = newLine.compareValue(oldLine, "playcount");
        this.dPlaycount = newLine.compareValue(oldLine, "playcount");
        this.dTTH = newLine.compareValue(oldLine, "tth");
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

class UserFull {
    /**
     * @param {*} data
     * @param {Date} startDate
     * @param {Date} endDate
     */
    constructor(data, startDate, endDate) {
        this.lines = data.filter((d) => d).map((lineData) => new Line(lineData)).filter((line) => {
            return (startDate <= line.date && line.date <= endDate);
        }).sort((a, b) => a.date - b.date);
        this.newestLine = this.lines[this.lines.length - 1];
        this.oldestLine = this.lines[0];
        this.dEntireLine = new DeltaLine(this.newestLine, this.oldestLine);
        this.dLines = this.lines.map((line, index) => {
            if (index <= 0) return null;

            const dl = new DeltaLine(line, this.lines[index - 1]);
            if (!dl.isContinuous) return null;
            return dl;

        }).filter((d) => d);
        this.achievement = new Achievement();
    }


    getMaxIncrease() {
        // SS增长最多
        let maxIncreaseSSValue = 0;
        let maxIncreaseSSEnd = "";
        // pc增长最多
        let maxIncreasePCValue = 0;
        let maxIncreasePCEnd = "";
        // tth增长最多
        let maxIncreaseTTHValue = 0;
        let maxIncreaseTTHEnd = "";
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
            if (dline.dSS > maxIncreaseSSValue) {
                maxIncreaseSSValue = dline.dSS;
                maxIncreaseSSEnd = utils.getDateString(dline.date);
                if (dline.oldLine.SS <= 0) this.achievement.addAchieve(utils.getDateString(dline.date), "这天，您获得了人生中该模式的第一个SS！");
            }
            if (dline.dPlaycount > maxIncreasePCValue) {
                maxIncreasePCValue = dline.dPlaycount;
                maxIncreasePCEnd = utils.getDateString(dline.date);
            }
            if (dline.dTTH > maxIncreaseTTHValue) {
                maxIncreaseTTHValue = dline.dTTH;
                maxIncreaseTTHEnd = utils.getDateString(dline.date);
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
        if (maxIncreaseSSValue > 0) this.achievement.addAchieve(maxIncreaseSSEnd, "这天您刷了" + maxIncreaseSSValue + "个SS！");
        if (maxIncreasePCValue > 99) this.achievement.addAchieve(maxIncreasePCEnd, "这天您打了" + maxIncreasePCValue + " PC！");
        if (maxIncreasePCValue > 999) this.achievement.addAchieve(maxIncreaseTTHEnd, "这天您打了" + maxIncreaseTTHValue + "下！");
        if (maxIncreasePPValue > 10) this.achievement.addAchieve(maxIncreasePPEnd, "这天您增加了" + maxIncreasePPValue + " PP！");
        if (maxDecreasePPValue < 0) this.achievement.addAchieve(maxDecreasePPEnd, "这天您倒刷了" + (-maxDecreasePPValue) + " PP（也可能是pp系统调整）");
        if (maxIncreaseAccValue > 0.1) this.achievement.addAchieve(maxIncreaseAccEnd, "这天您提升了" + maxIncreaseAccValue.toFixed(2) + "%acc！");
        if (maxDecreaseAccValue < -0.1) this.achievement.addAchieve(maxDecreaseAccEnd, "这天您降低了" + (-maxDecreaseAccValue).toFixed(2) + "%acc...");
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
        // 先遍历一遍DeltaLine，获取各数据的增长最多日期
        this.getMaxIncrease();
        // 再遍历一遍Line，获取跨越整千pp时间
        this.getPPStepDate();
        // 再遍历一遍Line，获取rank进位时间
        this.getRankStepDate();

        return this.achievement.toString();
    }

}

module.exports = UserFull;
