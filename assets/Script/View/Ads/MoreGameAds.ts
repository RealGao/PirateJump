import EventManager from "../../Common/EventManager";
import GameCtr from "../../Controller/GameCtr";
import AdCell from "./AdCell";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoreGameAds extends cc.Component {
    @property(cc.Node)
    ndParent: cc.Node = null;

    private refreshIdx = 0;

    onLoad() {
        EventManager.on("REFRESH_AD", this.refreshAd, this);
        EventManager.on("SET_ADS_DATA", this.setAdsData, this);
    }

    onDestroy() {
        EventManager.off("REFRESH_AD", this.refreshAd, this);
        EventManager.off("SET_ADS_DATA", this.setAdsData, this);
    }

    start () {
        if(GameCtr.bannerDatas) {
            this.setAdsData();
        }
    }

    setAdsData() {
        if(!GameCtr.reviewSwitch) {
            this.ndParent.active = false;
            return;
        }else{
            this.ndParent.active = true;
        }
        let length = GameCtr.bannerDatas.length;
        length = length > this.node.childrenCount ? this.node.childrenCount : length;
        for (let i = 0; i < length; i++) {
            let nd = this.node.children[i];
            nd.active = true;
            let comp: AdCell = nd.getComponent(AdCell);
            let data = GameCtr.bannerDatas[i];
            comp.setData(data);
            this.refreshIdx = i;
        }
    }

    refreshAd(event) {
        if (this.refreshIdx >= GameCtr.bannerDatas.length - 1) return;
        let data = event.detail;
        if (data.type != "more") return;
        let idx = data.idx;
        let nd = this.node.children[idx];
        let comp: AdCell = nd.getComponent(AdCell);
        comp.setData(GameCtr.bannerDatas[++this.refreshIdx]);
    }

    close() {
        this.ndParent.x = -1000;
    }
    // update (dt) {}
}
