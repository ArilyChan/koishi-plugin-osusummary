const MotherShipApi = require("./ApiRequest");
const UserFull = require("./UserFull");

class getUserData {
    constructor(qqId, mode) {
        this.qqId = qqId;
        this.mode = mode;
    }

    async getUserFull(startDate, endDate) {
        const userInfo = await MotherShipApi.getQQInfo(this.qqId);
        const { userId, currentUname, mode } = userInfo;
        if (this.mode !== 0 && !this.mode) this.mode = mode;
        const userData = await MotherShipApi.getUserFull(userId, startDate, endDate, this.mode);
        if (userData.length < 10) throw currentUname + "数据量不足QAQ";
        const userObject = new UserFull(userData, startDate, endDate);
        return { currentUname, mode: this.mode, userObject };
    }
}

module.exports = getUserData;
