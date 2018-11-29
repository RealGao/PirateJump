/**
 * 游戏界面
 * 游戏逻辑自己实现
 */

import GameCtr from "../../Controller/GameCtr";
import NodePoolManager from "../../Common/NodePoolManager";
import ViewManager from "../../Common/ViewManager";
import GameData from "../../Common/GameData";
import HttpCtr from "../../Controller/HttpCtr";
import Util from "../../Common/Util";
import WXCtr from "../../Controller/WXCtr";
import CollisionMgr from "./CollisionMgr";
import AudioManager from "../../Common/AudioManager";
import CollisionBase from "./CollisionBase";


const { ccclass, property } = cc._decorator;
let collisionManager = cc.director.getCollisionManager();
collisionManager.enabled = true;

@ccclass
export default class Game extends cc.Component {

    static GoodsType = cc.Enum({
        ALARM: 0,                                               //时间
        LUCKY_GRASS: 1,                                         //幸运草
        REVIVE: 2,                                              //复活
        BOOSTER: 3,                                             //助推器
    });

    @property(cc.Node)
    ndGame: cc.Node = null;
    @property(cc.Node)
    ndCanvas: cc.Node = null;
    @property(cc.Node)
    ndIslandLayer: cc.Node = null;
    @property(cc.Node)
    ndPropEffect: cc.Node = null;
    @property(cc.Label)
    lbGold: cc.Label = null;
    @property(cc.Label)
    lbTime: cc.Label = null;
    @property(cc.Label)
    lbCombo: cc.Label = null;
    @property(cc.Label)
    lbCountDown: cc.Label = null;

    public goldNum = 0;
    private time = 0;
    private combo = 0;                                  //连击数
    public maxCombo = 0;                               //最大连击数

    onLoad() {
        GameCtr.getInstance().setGame(this);
    }

    onDestroy() {
    }

    start() {
        this.registerTouch();
        GameCtr.isGameOver = false;
        GameCtr.ins.mPirate.setType(GameData.currentRole);
        this.initIslands();
        this.time = 100;
        this.countdown();

        AudioManager.getInstance().playSound("audio/gameStart", false);
        this.scheduleOnce(() => { GameCtr.playBgm(); }, 1.5);
    }

    registerTouch() {
        this.ndCanvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event) {
        GameCtr.ins.mPirate.jump();
    }

    initIslands() {
        for (let i = 0; i < 5; i++) {
            CollisionMgr.addIsland();
        }
    }

    addGold(num = 1) {
        this.goldNum += num;
        this.lbGold.string = "" + this.goldNum;
    }

    addTime(num) {
        this.time += num;
        this.lbTime.string = this.time + "s";
    }

    addCombo(gold) {
        this.combo++;
        this.lbCombo.string = this.combo + "";
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        this.showComboGold(this.combo, gold);
    }

    clearCombo() {
        this.combo = 0;
        this.lbCombo.string = this.combo + "";
    }

    showPropEffect(type) {
        let nd = null;
        switch (type) {
            case Game.GoodsType.ALARM:
                nd = Util.findChildByName("propTime", this.ndPropEffect);
                break;
            case Game.GoodsType.LUCKY_GRASS:
                nd = Util.findChildByName("propLuckGrass", this.ndPropEffect);
                break;
            case Game.GoodsType.REVIVE:
                nd = Util.findChildByName("propRevive", this.ndPropEffect);
                break;
            case CollisionBase.CollisionType.MAGNET:
                nd = Util.findChildByName("ndMagent", this.ndPropEffect);
                break;
            case CollisionBase.CollisionType.SHIELD:
                nd = Util.findChildByName("ndShield", this.ndPropEffect);
                break;
            case CollisionBase.CollisionType.SIGHT:
                nd = Util.findChildByName("ndSight", this.ndPropEffect);
                break;
            case CollisionBase.CollisionType.ROTATE:
                nd = Util.findChildByName("ndRotate", this.ndPropEffect);
                break;
        }
        nd.stopAllActions();
        nd.runAction(cc.sequence(
            cc.fadeIn(0),
            cc.delayTime(0.5),
            cc.fadeOut(1.0)
        ));
    }

    showComboGold(combo, gold) {
        let nd = Util.findChildByName("ndCombo", this.ndPropEffect);
        let lbCombo = nd.getChildByName("lbCombo").getComponent(cc.Label);
        lbCombo.string = "" + combo;
        let lbGold = nd.getChildByName("lbGold").getComponent(cc.Label);
        lbGold.string = "" + gold;
        nd.stopAllActions();
        nd.runAction(cc.sequence(
            cc.fadeIn(0),
            cc.delayTime(0.5),
            cc.fadeOut(1.0)
        ));
    }

    countdown() {
        this.lbTime.string = this.time + "s";
        if (this.time >= 0) {
            this.scheduleOnce(() => {
                this.time--;
                this.countdown();
            }, 1.0);
        } else {
            GameCtr.isGameOver = true;
            GameCtr.gameOver();
        }
        if (this.time < 10) {
            AudioManager.getInstance().playSound("audio/countdown", false);
            this.lbCountDown.string = this.time + "s";
            this.lbCountDown.node.runAction(cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.5),
                    cc.scaleTo(0.5, 1.1),
                ),
                cc.spawn(
                    cc.fadeOut(0.4),
                    cc.scaleTo(0.4, 1.0),
                ),
            ))
        }
    }

    gameOver() {
        this.ndGame.runAction(cc.fadeOut(0.5));
        CollisionMgr.stopFit();
    }


    /**
     * 更多游戏
     */
    showMoreGame() {
        if (GameCtr.otherData) {
            WXCtr.gotoOther(GameCtr.otherData);
            HttpCtr.clickStatistics(GameCtr.StatisticType.MORE_GAME, GameCtr.otherData.appid);                               //更多游戏点击统计
        }
    }

    openCustomService() {
        HttpCtr.clickStatistics(GameCtr.StatisticType.GIFT);                                    //关注礼包点击统计
        WXCtr.customService();
    }


    /**
     * 排行榜
     */
    showRanking() {
        if (WXCtr.authed) {
            // let nd = cc.instantiate(this.pfRanking);
            // ViewManager.show({
            //     node: nd,
            //     maskOpacity: 200,
            // });
            HttpCtr.clickStatistics(GameCtr.StatisticType.RANKING);                               //排行榜点击统计
        } else {
            ViewManager.showAuthPop();
        }
    }

}
