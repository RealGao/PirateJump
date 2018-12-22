import EventManager from "../../Common/EventManager";
import AdCell from "./AdCell";
import GameCtr from "../../Controller/GameCtr";

// 今日新游推荐

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecommendAds extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    private turnIdx = 0;
    private tmpAds;

    onLoad() {
        EventManager.on("REFRESH_AD", this.refreshAd, this);
        EventManager.on("SET_ADS_DATA", this.setAdsData, this);
    }

    onDestroy() {
        EventManager.off("REFRESH_AD", this.refreshAd, this);
        EventManager.off("SET_ADS_DATA", this.setAdsData, this);
    }

    start () {
        if(GameCtr.sliderDatas) {
            this.setAdsData();
        }
    }

    setAdsData() {
        if(!GameCtr.reviewSwitch) {
            this.node.opacity = 0;
            return;
        }else{
            this.node.opacity = 255;
        }
        
        this.tmpAds = Array.from(GameCtr.sliderDatas);
        let length = this.tmpAds.length;
        length = length > this.node.childrenCount ? this.node.childrenCount : length;
        for (let i = 0; i < length; i++) {
            let nd = this.node.children[i]
            let comp: AdCell = nd.getComponent(AdCell);
            let data = this.tmpAds[i];
            comp.setData(data);
            this.turnIdx = i;
        }
        this.moveItems();
    }



    refreshAd(event) {
        if (this.tmpAds.length <= 4) return;
        let data = event.detail;
        if (data.type != "recommend") return;
        let idx = data.idx;
        let nd = this.node.children[idx];
        let comp: AdCell = nd.getComponent(AdCell);
        let tmpData = comp.data;
        this.turnIdx++;
        this.turnIdx = this.turnIdx >= this.tmpAds.length ? 0 : this.turnIdx;
        comp.setData(this.tmpAds[this.turnIdx]);
        console.log("clickAd == ", tmpData);
        this.removeAdData(tmpData);
        console.log("GameCtr.sliderDatas == ", GameCtr.sliderDatas);
    }

    removeAdData(data) {
        for (let i = 0; i < this.tmpAds.length; i++) {
            let info = this.tmpAds[i];
            if (info.img == data.img) {
                this.tmpAds.splice(i, 1);
                return;
            }
        }
    }

    moveItems() {
        if (this.tmpAds.length <= 4) return;
        this.scheduleOnce(() => {
            for (let i = 0; i < this.node.childrenCount; i++) {
                let nd = this.node.children[i];
                nd.runAction(cc.moveBy(1.0, cc.v2(-134, 0)));
            };
            this.moveItems();
        }, 10.0);

    }

    update(dt) {
        if (!GameCtr.sliderDatas || !this.tmpAds || this.tmpAds.length <= 4) return;
        for (let i = 0; i < this.node.childrenCount; i++) {
            let nd = this.node.children[i];
            if (nd.x <= -335) {
                nd.x += 670;
                let comp: AdCell = nd.getComponent(AdCell);
                this.turnIdx++;
                this.turnIdx = this.turnIdx >= this.tmpAds.length ? 0 : this.turnIdx;
                comp.setData(this.tmpAds[this.turnIdx])
            }
        };
    }
}
