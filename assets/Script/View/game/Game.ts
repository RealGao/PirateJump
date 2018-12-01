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

    @property(cc.Prefab)
    pfBgMusic: cc.Prefab = null;

    @property(cc.Label)
    lbCountDown: cc.Label = null;

    @property(cc.Prefab)
    pfPause:cc.Prefab=null;

    public goldNum = 0;
    public time = 0;
    private combo = 0;                                  //连击数
    public maxCombo = 0;                               //最大连击数

    onLoad() {
        GameCtr.HadEnterdGame=true;
        GameData.power-=5;
        GameCtr.getInstance().setGame(this);
        WXCtr.onShow(() => {
            WXCtr.isOnHide = false;
            this.initBgMusic();
        });
    }

    onDestroy() {
    }

    start() {
        this.registerTouch();
        GameCtr.isGameOver = false;
        GameCtr.isPause = false;
        GameCtr.ins.mPirate.setType(GameData.currentRole);
        this.initProp();
        this.initIslands();

        this.countdown();

        AudioManager.getInstance().playSound("audio/gameStart", false);
        this.scheduleOnce(() => { GameCtr.playBgm(); }, 1.5);
    }

    initProp() {
        switch (GameData.currentMap) {
            case 0:
                this.time = 60;
                break;
            case 1:
                this.time = 90;
                break;
            case 2:
                this.time = 120;
                break;
        }
        if (GameData.prop_time > 0) {
            this.time += 10;
            GameData.prop_time--;
            this.showPropEffect(Game.GoodsType.ALARM);
        }
        if (GameData.prop_speedUp && GameData.currentRole != 1) {
            GameCtr.speedUp = true;
            GameData.prop_speedUp--;
        }
    }

    initBgMusic() {
        while (cc.find("Canvas").getChildByTag(GameCtr.musicTag)) {
            cc.find("Canvas").removeChildByTag(GameCtr.musicTag)
        }
        let music = cc.instantiate(this.pfBgMusic);
        if (music) {
            music.parent = cc.find("Canvas");
            music.tag = GameCtr.musicTag;
            music.getComponent("music").updatePlayState();
        }
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

    pause() {
        if(cc.find("Canvas").getChildByName("ndPause")){
            return;
        }
        let ndPause=cc.instantiate(this.pfPause);
        ndPause.parent=cc.find("Canvas")
        GameCtr.isPause = true;
        AudioManager.getInstance().musicOn = false;
    }

    resume() {
        GameCtr.isPause = false;
        AudioManager.getInstance().musicOn = true;
        this.countdown();
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
                let ani = Util.findChildByName("reviveEffect", this.ndPropEffect).getComponent(cc.Animation);
                ani.play();
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
        if (GameCtr.isPause) return;
        this.lbTime.string = this.time + "s";
        if (this.time > 0) {
            this.scheduleOnce(() => {
                this.time--;
                this.countdown();
            }, 1.0);
        } 
        if (this.time < 10) {
            AudioManager.getInstance().playSound("audio/countdown", false);
            this.lbCountDown.string = this.time + "";
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
