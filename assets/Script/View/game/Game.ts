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


const { ccclass, property } = cc._decorator;
let collisionManager = cc.director.getCollisionManager();
collisionManager.enabled = true;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    ndGame: cc.Node = null;
    @property(cc.Node)
    ndCanvas: cc.Node = null;
    @property(cc.Node)
    ndIslandLayer: cc.Node = null;
    @property(cc.Label)
    lbGold: cc.Label = null;
    @property(cc.Label)
    lbTime: cc.Label = null;
    @property(cc.Label)
    lbCombo: cc.Label = null;
    
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
        this.scheduleOnce(()=>{GameCtr.playBgm();}, 1.5);
    }

    registerTouch() {
        this.ndCanvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event) {
        GameCtr.ins.mPirate.jump();
    }

    initIslands() {
        for(let i = 0; i < 5; i++) {
            CollisionMgr.addIsland();
        }
    }

    addGold(num = 1) {
        this.goldNum += num;
        this.lbGold.string = ""+this.goldNum;
    }

    addTime(num) {
        this.time += num;
        this.lbTime.string = this.time + "s";
    }

    addCombo() {
        this.combo++;
        this.lbCombo.string = this.combo + "";
        if(this.combo > this.maxCombo) this.maxCombo = this.combo;
    }

    clearCombo() {
        this.combo = 0;
        this.lbCombo.string = this.combo + "";
    }

    countdown() {
        this.lbTime.string = this.time + "s";
        if(this.time > 0){
            this.scheduleOnce(()=>{
                this.time--;
                this.countdown();
            }, 1.0);
        }else{
            GameCtr.isGameOver = true;
            GameCtr.gameOver();
        }
        if(this.time < 10) {
            AudioManager.getInstance().playSound("audio/countdown", false);
        }
    }

    gameOver() {
        this.ndGame.runAction(cc.fadeOut(0.5));
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
