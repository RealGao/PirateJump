import EventManager from "../../Common/EventManager";
import GameCtr from "../../Controller/GameCtr";
import AdCell from "./AdCell";

// 火爆广告

const { ccclass, property } = cc._decorator;

@ccclass
export default class HotAds extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    private refreshIdx = 0;

    onLoad() {
        EventManager.on("REFRESH_AD", this.refreshAd, this);
        EventManager.on("SET_ADS_DATA", this.setAdsData, this);
    }

    onDestroy() {
        EventManager.off("REFRESH_AD", this.refreshAd, this);
        EventManager.off("SET_ADS_DATA", this.setAdsData, this);
    }

    start() {
        if(GameCtr.hotDatas) {
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
        let length = GameCtr.hotDatas.length;
        length = length > this.node.childrenCount ? this.node.childrenCount : length;
        for (let i = 0; i < length; i++) {
            let nd = this.node.children[i]
            let comp: AdCell = nd.getComponent(AdCell);
            let data = GameCtr.hotDatas[i];
            comp.setData(data);
            this.refreshIdx = i;
        }
    }

    refreshAd(event) {
        if (this.refreshIdx >= GameCtr.hotDatas.length - 1) return;
        let data = event.detail;
        if (data.type != "hot") return;
        let idx = data.idx;
        let nd = this.node.children[idx];
        let comp: AdCell = nd.getComponent(AdCell);
        comp.setData(GameCtr.hotDatas[++this.refreshIdx]);
    }
    // update (dt) {}
}
