import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import WXCtr from "../../Controller/WXCtr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Node)
    ndOver: cc.Node = null;
    @property(cc.Node)
    ndResult: cc.Node = null;
    @property(cc.Node)
    ndMall: cc.Node = null;
    @property(cc.Node)
    ndArchieve: cc.Node = null;

    @property(cc.Label)
    lbGold: cc.Label = null;
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

    @property(cc.Label)
    lbLuckyGlass: cc.Label = null;
    @property(cc.Label)
    lbTurn: cc.Label = null;
    @property(cc.Label)
    lbRevive: cc.Label = null;
    @property(cc.Label)
    lbTime: cc.Label = null;

    @property(cc.Sprite)
    sprRole: cc.Sprite = null;
    @property(cc.Sprite)
    sprLevelProgress: cc.Sprite = null;
    @property([cc.SpriteFrame])
    roleFrames: cc.SpriteFrame[] = [];
    @property(cc.Label)
    lbRoleLevel: cc.Label = null;

    @property(cc.Prefab)
    pfMall: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    private combo = 0;
    private gold = 0;
    private roleData;

    onLoad () {
        GameCtr.getInstance().setGameOver(this);
    }

    start () {

    }
    showResult() {
        this.ndOver.active = true;
        this.showRoleInfo();
        this.showScore();
        this.showBagInfo();
    }

    showScore() {
        this.combo = GameCtr.ins.mGame.maxCombo;
        GameData.combo += this.combo;
        this.gold = GameCtr.ins.mGame.goldNum;
        this.lbCombo.string = this.combo+"";
        this.lbComboScore.string =  "" + this.combo * 10;
        let score = this.gold + this.combo * 10;
        this.lbTotalScore.string = score + "";
        this.lbLevelScore.string = "" + this.roleData._level * 10;
        GameData.maxScore = score > GameData.maxScore ? score : GameData.maxScore;

        this.lbBest.string = GameData.maxScore + "";

        GameData.gold += this.roleData._level * 10+ score;
        this.lbGold.string = GameData.gold + "";
        GameData.addGoldOfRole(score);
    }

    showRoleInfo() {
        this.roleData = GameData.getCurrentRoleLevel();
        this.lbRoleLevel.string = this.roleData._level+"";
        this.sprRole.spriteFrame = this.roleFrames[GameData.currentRole];
        this.sprLevelProgress.fillRange = this.roleData._currentGold / this.roleData._targetGold;
    }

    showBagInfo() {
        this.lbLuckyGlass.string = GameData.prop_luckyGrass + "/10";
        this.lbTurn.string = GameData.prop_revive + "/10";
        this.lbRevive.string = GameData.prop_revive + "/10";
        this.lbTime.string = GameData.prop_time + "/10";
    }

    showArchievement() {

    }

    restart() {
        GameCtr.gameStart();
        
    }

    share() {
        WXCtr.share();
    }

    showMall() {
        let nd = cc.instantiate(this.pfMall);
        nd.parent = this.ndMall;
        this.ndMall.active = true;
        this.ndResult.active = false;
        this.ndArchieve.active = false;
    }

    // update (dt) {}
}
