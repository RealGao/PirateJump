import WXCtr from "../../Controller/WXCtr";
import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import HttpCtr from "../../Controller/HttpCtr";
import ViewManager from "../../Common/ViewManager";

/**
 * 新手引导
 */

const {ccclass, property} = cc._decorator;

let handleName = ["stepOne", "stepTwo", "stepThree"];

@ccclass
export default class Guide extends cc.Component {

    @property(cc.Node)
    ndGuide: cc.Node = null;
    @property(cc.Node)
    ndHand: cc.Node = null;
    @property(cc.Node)
    ndGuideTip: cc.Node = null;

    public mask: cc.Mask;

    public static ins: Guide;

    private static stepTwoTime = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Guide.ins = this;
    }

    close() {
        this.ndGuide.active = false;
    }

    static setGuideStorage() {
        if(!GameCtr.ins.mGame || !Guide.ins.ndGuide) return;
        if(GameData.guideStep <= 2){
            Guide.showGuideStep(GameData.guideStep);
            Guide.ins.ndGuide.active = true;
        }else{
            Guide.ins.ndGuide.active = false;
        }
    }

    private static showGuideStep(step) {
        Guide.ins[handleName[step]]();
    }

    stepOne() {
        GameCtr.isPause = true;
        Guide.ins.ndHand.x = 0;
        Guide.ins.ndGuideTip.x = 0;
        ViewManager.showHelpPop();
        GameData.guideStep++;
    }

    stepTwo() {
        if(Guide.stepTwoTime == 0) {
            GameCtr.ins.mGame.resume();
        }
        GameCtr.ins.mPirate.showSight(1000);
        if(Guide.stepTwoTime >=3){
            GameData.guideStep++;
            Guide.setGuideStorage();
        }
        Guide.stepTwoTime++;
        
    }

    stepThree() {
        GameData.guideStep++;
        Guide.ins.ndHand.active = false;
        Guide.ins.ndHand.x = -1000;
        Guide.ins.ndGuideTip.x = -1000;
        GameCtr.ins.mPirate.showSight(0);
    }
    // update (dt) {}
}
