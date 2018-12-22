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
import Guide from "./Guide";


const { ccclass, property } = cc._decorator;
let collisionManager = cc.director.getCollisionManager();
collisionManager.enabled = true;

enum Revive_Type {
    revive = 0,
    time
}

enum Compare_type {
    Game,
    Over
}

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
    ndBg: cc.Node = null;
    @property(cc.Node)
    ndAlign: cc.Node = null;
    @property(cc.Node)
    ndIslandLayer: cc.Node = null;
    @property(cc.Node)
    ndPropEffect: cc.Node = null;
    @property(cc.Node)
    ndTimeUp: cc.Node = null;

    @property(cc.Label)
    lbGold: cc.Label = null;
    @property(cc.Node)
    ndScorePgb: cc.Node = null;
    @property(cc.Label)
    lbTime: cc.Label = null;
    @property(cc.Label)
    lbCombo: cc.Label = null;
    @property(cc.Sprite)
    sprScorePgb: cc.Sprite = null;
    @property([cc.Node])
    stars: cc.Node[] = [];

    @property(cc.Sprite)
    sprBeyond: cc.Sprite = null;

    @property(cc.Node)
    ndMiniShop: cc.Node = null;

    @property(cc.Node)
    ndPause: cc.Node = null;

    @property(cc.Prefab)
    pfBgMusic: cc.Prefab = null;

    @property(cc.Label)
    lbCountDown: cc.Label = null;

    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = [];

    public goldNum = 0;
    public time = 0;
    private combo = 0;                                  //连击数
    public maxCombo = 0;                               //最大连击数
    private roleData = null;

    public hasRevivedByVedio = false;                          //是否看视频复活过
    public hasAddTimeByVedio = false;                          //是否看视频加时间

    private stopCountDown = false;

    private tex: cc.Texture2D = null;

    onLoad() {
        this.alignSceen();
        GameCtr.HadEnterdGame = true;
        GameData.power -= 5;
        GameCtr.getInstance().setGame(this);
        WXCtr.onShow(() => {
            WXCtr.isOnHide = false;
            this.initBgMusic();
        });
        WXCtr.getSelfData();
        this.tex = new cc.Texture2D();
        WXCtr.initSharedCanvas();
        WXCtr.hideBannerAd();
    }

    onDestroy() {
    }

    alignSceen() {
        var size = cc.view.getFrameSize();
        let long = size.width > size.height ? size.width : size.height;
        let short = size.width <= size.height ? size.width : size.height;
        if (long / short > (896 / 414)) {
            let widget = this.ndAlign.getComponent(cc.Widget);
            widget.top = 40;
            widget.bottom = 0;
        }
    }

    start() {
        this.registerTouch();
        GameCtr.isGameOver = false;
        GameCtr.isPause = false;
        GameCtr.isInfinite = false;
        this.hasRevivedByVedio = false;
        this.hasAddTimeByVedio = false;
        GameCtr.ins.mPirate.setType(GameData.currentRole);
        this.roleData = GameData.getCurrentRoleLevel();
        Guide.setGuideStorage();
        this.setBg();
        this.initProp();
        this.initIslands();
        this.countdown();
        if (GameCtr.musicState > 0) {
            AudioManager.getInstance().musicOn = true;
        }
        AudioManager.getInstance().playSound("audio/gameStart", false);
        this.scheduleOnce(() => {
            GameCtr.playBgm();
            let nd = this.ndGame.getChildByName("miniCellPos");
            this.sprBeyond.node.position = nd.position;
            WXCtr.compareScore(GameData.currentMap, 0, Compare_type.Game);
            this.scheduleOnce(() => { this._updateSubDomainCanvas(); }, 1);
        }, 1.5);
        this.showMiniShop();
    }

    showMiniShop() {
        if((GameData.prop_luckyGrass >= 5 && GameData.prop_revive >= 0 && GameData.prop_speedUp >0 && GameData.prop_time >0 ) || GameData.gold <1000 || GameData.guideStep <= 2){
            return;
        }
        this.ndMiniShop.active = true;
        GameCtr.isPause = true;
        let propsContent=this.ndMiniShop.getChildByName("propsContent");
        /*普通道具*/
        for(let i=0;i<4;i++){
            let prop=propsContent.getChildByName('prop'+i);
            prop.getComponent("propItem").init(GameData.propsInfo[i]);
        }
    }

    hideMiniShop() {
        this.ndMiniShop.active = false;
        GameCtr.isPause = false;
        this.countdown();
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
            case 3:
                this.time = 30;
                GameCtr.isInfinite = true;
        }
        if (GameData.currentRole == 3) this.time += 10;
        this.lbTime.string = this.time + "";
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

    setBg() {
        let idx = Math.floor(Math.random() * 3);
        idx = GameData.currentMap > 2 ? idx : GameData.currentMap;
        for (let i = 0; i < this.ndBg.childrenCount; i++) {
            let spr = this.ndBg.children[i].getComponent(cc.Sprite);
            spr.spriteFrame = this.bgFrames[idx];
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
        this.showScorePgb();
    }

    showScorePgb() {
        if (GameData.currentMap == 3) {
            this.ndScorePgb.active = false;
            return;
        }
        let curScore = this.goldNum + this.maxCombo * 10 + this.roleData._level * 10;
        let data = GameData.mapsInfo[GameData.currentMap];
        let progress = curScore / data.top;
        progress = progress >= 1 ? 1 : progress;
        this.sprScorePgb.fillRange = progress;

        for (let i = 0; i < this.stars.length; i++) {
            let star = this.stars[i];
            if (star.color == cc.Color.WHITE) {
                continue
            };
            if (curScore > data.rate[i]) {
                star.color = cc.Color.WHITE;
            }
        }

        WXCtr.compareScore(GameData.currentMap, curScore, Compare_type.Game);
        this.scheduleOnce(() => { this._updateSubDomainCanvas(); }, 1);
    }

    addTime(num) {
        this.time += num;
        if (this.time < 0) return;
        this.lbTime.string = this.time + "";
        if (this.time > 0 && this.stopCountDown) {
            this.countdown();
        }
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
        this.ndPause.active = true;
        GameCtr.isPause = true;
        AudioManager.getInstance().setMusicVolume(0);
        GameData.submitGameData();
    }

    resume() {
        this.ndPause.active = false;
        GameCtr.isPause = false;
        AudioManager.getInstance().setMusicVolume(1);
        this.countdown();
        WXCtr.hideBannerAd();
    }

    showPropEffect(type, wpos = null) {
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
                let ndEffect = Util.findChildByName("reviveEffect", this.ndPropEffect);
                let ani = ndEffect.getComponent(cc.Animation);
                let tPos = ndEffect.parent.convertToNodeSpaceAR(wpos);
                ndEffect.position = tPos;
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
        if (GameCtr.isPause || GameCtr.isInfinite || GameCtr.isGameOver) return;
        if (this.time > 0) {
            this.stopCountDown = false;
            this.scheduleOnce(() => {
                this.time--;
                this.lbTime.string = this.time + "";
                this.countdown();
            }, 1.0);
        } else {
            this.stopCountDown = true;
            if (GameCtr.ins.mPirate.isLanded) {
                this.timeUp();
            }
        }
        if (this.time < 10 && !GameCtr.isGameOver) {
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

    timeUp() {
        this.ndTimeUp.runAction(cc.sequence(
            cc.scaleTo(0, 1.5),
            cc.fadeIn(0.2),
            cc.delayTime(1),
            cc.fadeOut(0.5),
        ));
        GameCtr.gameOver(Revive_Type.time);
    }

    gameOver(type) {
        this.ndGame.runAction(cc.fadeOut(0.5));
        CollisionMgr.stopFit();
        setTimeout(() => {
            if (type == Revive_Type.revive && !this.hasRevivedByVedio && this.time >= 10) {
                GameCtr.ins.mGameOver.showOver(type);
            } else if (type == Revive_Type.time && !this.hasAddTimeByVedio) {
                GameCtr.ins.mGameOver.showOver(type);
            } else {
                GameCtr.ins.mGameOver.showOver(-1);
            }
        }, 1500);
    }

    restart() {
        if (GameData.power >= 5) {
            GameCtr.gameStart();
        } else {
            GameCtr.getInstance().getToast().toast("体力值不足");
        }
    }

    back() {
        GameCtr.gotoScene("Start");
    }

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined && this.tex != null && this.sprBeyond.node.active && this.sprBeyond) {
            console.log("log---------刷新子域的纹理");
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.sprBeyond.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }


    /**
     * 更多游戏
     */
    showMoreGame() {
        if (GameCtr.otherData) {
            WXCtr.gotoOther(GameCtr.otherData);
        }
    }

    openCustomService() {
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
        } else {
            ViewManager.showAuthPop();
        }
    }

}
