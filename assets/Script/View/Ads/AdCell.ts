// 第三方广告cell
import Util from "../../Common/Util";
import WXCtr from "../../Controller/WXCtr";
import EventManager from "../../Common/EventManager";
import HttpCtr from "../../Controller/HttpCtr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdCell extends cc.Component {

    static AdType = cc.Enum({
        HOT_AD: 0,                                          //火爆在线
        RECOMMEND_AD: 1,                                    //今日新游推荐
        MORE_GAME: 2,                                       //更多游戏列表
    });

    @property({
        type: AdCell.AdType
    })
    type = AdCell.AdType.HOT_AD;

    @property
    idx: number = 0;

    @property(cc.Sprite)
    sprIcon: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:
    public data;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    start() {

    }

    resetCell() {
        this.sprIcon.spriteFrame = null;
        let ndTitle = this.node.getChildByName("title");
        if (ndTitle) {
            ndTitle.getComponent(cc.Label).string = "";
        }
        let ndNum = this.node.getChildByName("num");
        if(ndNum) {
            ndNum.getComponent(cc.Label).string = "";
        }
    }

    setData(data) {
        this.resetCell();
        this.data = data;
        Util.loadImg(this.sprIcon, data.img);
        let ndTitle = this.node.getChildByName("title");
        if (ndTitle) {
            ndTitle.getComponent(cc.Label).string = data.title;
        }
        let ndNum = this.node.getChildByName("num");
        if(ndNum && data.er) {
            ndNum.getComponent(cc.Label).string = data.er + "";
        }
    }

    onTouchStart() {
        HttpCtr.clickStatistics(HttpCtr.StatisticType.BANNER_SLIDER, this.data.appid);
        if (this.data.open) {
            WXCtr.previewImg(this.data.openimg);
        } else {
            WXCtr.gotoOther(this.data);
        }
        let data = {
            idx: this.idx
        };
        switch (this.type) {
            case AdCell.AdType.HOT_AD:
                data["type"] = "hot";
                break;
            case AdCell.AdType.RECOMMEND_AD:
                data["type"] = "recommend";
                break;
            case AdCell.AdType.MORE_GAME:
                data["type"] = "more";
                break;
        }

        EventManager.emit("REFRESH_AD", data);
    }

    // update (dt) {}
}
