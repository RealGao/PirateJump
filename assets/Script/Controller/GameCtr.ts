//全局控制类

import AudioManager from "../Common/AudioManager";
import WXCtr from "./WXCtr";
import Http from "../Common/Http";
import UserManager from "../Common/UserManager";
import Game from "../View/game/Game";
import GameData from "../Common/GameData";
import ViewManager from "../Common/ViewManager";
import Start from "../View/start/Start";
import Pirate from "../View/game/Pirate";
import Shop from "../View/start/shop";
import Toast from "../Common/Toast"
import GameOver from "../View/game/GameOver";
import Public from "../View/start/PublicNode";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCtr {
    public static ins: GameCtr;
    public mGame: Game;
    public mGameOver: GameOver;
    public mPirate: Pirate;
    public mStart: Start;
    public mShop:Shop;
    public mToast:Toast;

    public mPublic:Public;
    

    public static bannerId = null;
    public static score: number = 0;
    public static rankingEntrance = "Start";            //排行榜界面入口，默认开始界面

    public static friendsCircleImg = "";                //分享到朋友圈图片地址
    public static reviewSwitch = false;                 //审核开关

    static otherData = null;                            //更多游戏（单独一个图标）
    static sliderDatas = null;                          //新游推荐
    static bannerDatas = null;                          //更多游戏列表（抽屉广告）
    static hotDatas = null;                             //火爆在线广告
    static shareSwitch = null;

    public static shareGoldTimes = 5;                           //剩余分享得金币次数

    public static surplusVideoTimes = 6;                            //剩余看视频次数

    public static IPONEX_HEIGHT=2436;                                                 
    public static HadEnterdGame = false;                              //游戏是否已经开始
    public static isGameOver = false;

    public static onLineLastTime = null;
    public static OnClickStat = false;                              //点击统计开关，appid不受限制

    public static musicTag=-2000;
    public static gameToken=-1;

    public static fightStartGold=0;
    public static musicState=null;

    public static isPause = false;                                  //游戏暂停
    public static speedUp = false;                                  //小岛转动加速
    public static isInfinite = false;                               //是否是无限模式

    public static isShareing=false;

    public static StatisticType = cc.Enum({                         //统计类型
        SPEED: 1,                                                   //加速分享
        INVITE: 2,                                                  //邀请
        MORE_GAME: 3,                                               //更多游戏
        UFO: 4,                                                     //UFO
        GIFT: 5,                                                    //关注礼包
        MALL: 6,                                                    //商城
        RANKING: 7,                                                 //排行榜
        FAST_BUY: 8,                                                //快捷购买
        SHARE_GOLD: 9,                                              //金币不足分享
        OFF_LINE_SHARE: 10,                                         //离线分享收益
        OFF_LINE_VEDIO: 11,                                         //离线视频收益
        BANNER_SLIDER: 12,                                          //今日新游统计
    });

    constructor() {
        GameCtr.ins = this;
        WXCtr.getLaunchOptionsSync();
        WXCtr.getSystemInfo();
        WXCtr.getAuthSetting();
        WXCtr.showShareMenu();
        WXCtr.initSharedCanvas();
        WXCtr.setVideoAd();
    }

    static getInstance() {
        if (!GameCtr.ins) {
            GameCtr.ins = new GameCtr();
        }
        return GameCtr.ins;
    }

    //设置game实例(游戏)
    setGame(game: Game) {
        this.mGame = game;
    }

    
    setPirate(pirate: Pirate) {
        this.mPirate = pirate;
    }

    getGame(){
        return this.mGame;
    }

    //设置start实例（开始界面）
    setStart(start: Start) {
        this.mStart = start;
    }

    getStart(){
        return this.mStart;
    }

    //设置shop实例
    setShop(shop: Shop) {
        this.mShop = shop;
    }

    getShop(){
        return this.mShop;
    }

    setToast(toast:Toast){
        this.mToast=toast
    }

    getToast(){
        return this.mToast;
    }

    setPublic(publicNode:Public){
        this.mPublic=publicNode;
    }

    getPublic(){
        return this.mPublic;
    }

    setGameOver(gameOver: GameOver) {
        this.mGameOver = gameOver;
    }

    //场景切换
    static gotoScene(sceneName) {
        cc.director.loadScene(sceneName);
        AudioManager.getInstance().stopAll();
    }

    //显示排行榜
    static showRanking(entrance) {
        GameCtr.rankingEntrance = entrance;
        GameCtr.gotoScene("Ranking");
    }


    //播放背景音乐
    static playBgm() {
        AudioManager.getInstance().playMusic("audio/bgm", true);
    }

    //增加分数
    static addScore(num) {
        if (GameCtr.ins) {
            GameCtr.score += num;
        }
    }

    //获取广告配置 1.猜你喜欢  2.爆款游戏  3.游戏结束  4.游戏中
    static getAdList(data,type){
        let arr=[];
        for(let i=0;i<data.length;i++){
            if(data[i].status==type){
                arr.push(data[i])
            }
        }
        return arr
    }

    // 游戏结束
    static gameOver(type) {
        GameCtr.isGameOver = true;
        GameCtr.ins.mGame.gameOver(type);
        // setTimeout(() => {
        //     GameCtr.ins.mGameOver.showResult();
        // }, 1500);
    }

    // 游戏开始
    static gameStart() {
        GameData.submitGameData();
        GameCtr.gotoScene("Game");
    }

    static canBuyRole(){
        // if(GameData.gold>=GameData.rolePrice[GameData.currentLockedRole].gold){
        //     return true
        // }

        // if(GameData.diamond>=GameData.rolePrice[5].diamond){

        // }

    }

}
