import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Node)
    ndOver: cc.Node = null;
    @property(cc.Label)
    lbCombo: cc.Label = null;
    @property(cc.Label)
    lbComboScore: cc.Label = null;
    @property(cc.Label)
    lbBest: cc.Label = null;
    @property(cc.Label)
    lbTotalScore: cc.Label = null;
    @property(cc.Label)
    lbLevelScore: cc.Label = null;

    @property(cc.Sprite)
    sprRole: cc.Sprite = null;
    @property(cc.Sprite)
    sprLevelProgress: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showScore() {
        this.lbCombo.string = GameCtr.ins.mGame.maxCombo+"";
        this.lbComboScore.string =  "" + GameCtr.ins.mGame.maxCombo * 10;
        this.lbBest.string = GameData.maxScore + "";
        // this.lbGoldScore.string = GameCtr.ins.mGame.goldNum * 10
        // this.lbLevelScore.string = GameData.cu
    }

    showRoleInfo() {

    }

    showBagInfo() {

    }

    showArchievement() {

    }

    restart() {

    }

    share() {

    }

    showMall() {

    }

    back() {
        
    }

    // update (dt) {}
}
