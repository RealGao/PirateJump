import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import WXCtr from "../../Controller/WXCtr";
import ViewManager from "../../Common/ViewManager";
import RecommendAds from "../Ads/RecommendAds";
import HotAds from "../Ads/HotAds";


const { ccclass, property } = cc._decorator;

enum Shop {
    maps = 0,
    props,
    homeWorld,
    characters,
}

enum Revive_Type {
    revive = 0,
    time
}

enum Compare_type {
    Game,
    Over
}

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Node)
    ndOver: cc.Node = null;
    @property(cc.Node)
    ndMall: cc.Node = null;

    @property(cc.Node)
    ndResult: cc.Node = null;
    @property(cc.Label)
    lbCollect: cc.Label = null;
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

    @property(cc.Node)
    ndMiniRank: cc.Node = null;
    @property(cc.Label)
    lbRankTotalScore: cc.Label = null;
    @property(cc.Sprite)
    sprScorePgb: cc.Sprite = null;
    @property(cc.Sprite)
    sprMap: cc.Sprite = null;
    @property(cc.Label)
    lbPower: cc.Label = null;
    @property([cc.Node])
    stars: cc.Node[] = [];
    @property([cc.SpriteFrame])
    mapFrames: cc.SpriteFrame[] = [];

    @property(cc.Node)
    ndRevive: cc.Node = null;
    @property(cc.Node)
    ndReviveType: cc.Node = null;
    @property(cc.Node)
    ndTimeType: cc.Node = null;
    @property(cc.Label)
    lbCurScore: cc.Label = null;


    @property(cc.Prefab)
    pfMall: cc.Prefab = null;

    @property(cc.Prefab)
    pfAchievement: cc.Prefab = null;

    @property(cc.Prefab)
    pfRank: cc.Prefab = null;

    @property(cc.Prefab)
    pfPublicNode: cc.Prefab = null;

    @property(cc.Sprite)
    sprMiniRank: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    private combo = 0;
    private gold = 0;
    private curScore = 0;
    private roleData;
    private reviveType;
    private tex: cc.Texture2D = null;

    onLoad() {
        this.tex = new cc.Texture2D();
        WXCtr.initSharedCanvas();
        GameCtr.getInstance().setGameOver(this);
    }

    start() {

    }

    showOver(type) {
        this.ndOver.active = true;
        this.roleData = GameData.getCurrentRoleLevel();
        this.combo = GameCtr.ins.mGame.maxCombo;
        this.gold = GameCtr.ins.mGame.goldNum;
        this.curScore = this.gold + this.combo * 10 + this.roleData._level * 10;
        GameData.submitScore(this.curScore);
        if (type != -1) {
            this.showRevive(type);
        } else {
            this.showResult();
        }
    }

    showResult() {
        this.ndResult.active = true;
        this.ndMiniRank.active = false;
        this.ndRevive.active = false;
        this.sprMiniRank.node.active = false;
        this.sprMiniRank.spriteFrame = null;
        this.showResultScore();
        GameData.submitGameData();
        this.scheduleOnce(() => { this._updateSubDomainCanvas(); }, 0.5);
        WXCtr.getFriendRankingData();

        let recommend: RecommendAds = this.ndResult.getChildByName("RecommendAds").getComponent(RecommendAds);
        recommend.setAdsData();
        let hot: HotAds = this.ndResult.getChildByName("HotAds").getComponent(HotAds);
        hot.setAdsData();
    }

    showResultScore() {
        this.roleData = GameData.getCurrentRoleLevel();
        GameData.combo += this.combo;
        this.lbCombo.string = this.combo + "";
        this.lbCollect.string = this.gold + "";
        this.lbComboScore.string = "" + this.combo * 10;
        this.lbTotalScore.string = this.curScore + "";
        this.lbLevelScore.string = "" + this.roleData._level * 10;
        GameData.gold += this.curScore;

        GameData.maxScore = this.curScore > GameData.maxScore ? this.curScore : GameData.maxScore;
        let maxScore = GameData.getMaxScore();
        maxScore = this.curScore > maxScore ? this.curScore : maxScore;
        this.lbBest.string = maxScore + "";

        GameData.addGoldOfRole(this.curScore);
    }

    share() {
        console.log("分享！！！！！！！！！！！！！！");
        WXCtr.share();
    }

    showMiniRank() {
        this.ndMiniRank.active = true;
        this.ndResult.active = false;
        this.ndRevive.active = false;
        this.sprMiniRank.node.active = true;
        WXCtr.showMiniRanking(GameData.currentMap);
        this.scheduleOnce(() => { this._updateSubDomainCanvas(); }, 1)

        this.lbRankTotalScore.string = this.curScore + "";
        this.lbPower.string = GameData.power + "/99";

        let data = GameData.mapsInfo[GameData.currentMap];
        let progress = this.curScore / data.top;
        progress = progress >= 1 ? 1 : progress;
        this.sprScorePgb.fillRange = progress;

        for (let i = 0; i < this.stars.length; i++) {
            let star = this.stars[i];
            if (this.curScore > data.rate[i]) {
                star.color = cc.color(255,255,255);
            }
        }
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

    showMall() {
        GameData.currentShopIndex = Shop.maps;
        ViewManager.showMall();
    }

    //复活界面相关
    showRevive(type) {
        this.ndRevive.active = true;
        this.ndResult.active = false;
        this.ndMiniRank.active = false;

        this.lbCurScore.string = this.curScore + "";
        this.reviveType = type;
        if (type == Revive_Type.revive) {
            this.ndReviveType.active = true;
            this.ndTimeType.active = false;
        } else {
            this.ndTimeType.active = true;
            this.ndReviveType.active = false;
        }
        this.sprMiniRank.node.active = true;
        WXCtr.compareScore(GameData.currentMap, this.curScore, Compare_type.Over);
        this.scheduleOnce(() => { this._updateSubDomainCanvas(); }, 1)
    }

    clickVedio() {
        if (WXCtr.videoAd) {
            WXCtr.showVideoAd();
            WXCtr.onCloseVideo((res) => {
                WXCtr.offCloseVideo();
                if (res) {
                    this.revive();
                    this.close();
                } else {
                    this.showResult();
                }
            });
        }

    }

    revive() {
        GameCtr.ins.mGame.ndGame.runAction(cc.fadeIn(0));
        if (this.reviveType == Revive_Type.time) {
            GameCtr.ins.mGame.time += 10;
            GameCtr.ins.mGame.hasAddTimeByVedio = true;
        } else {
            GameCtr.ins.mGame.hasRevivedByVedio = true;
        }
        GameCtr.isGameOver = false;
        GameCtr.ins.mGame.countdown();
        GameCtr.ins.mPirate.revive();
    }

    //
    close() {
        this.sprMiniRank.node.active = false;
        this.ndOver.active = false;
        WXCtr.hideBannerAd();
    }

    showRank() {
        if(WXCtr.authed) {
            if (cc.find("Canvas").getChildByName("achievement")) {
                return;
            }
            let nd = cc.instantiate(this.pfRank);
            nd.parent = cc.find("Canvas");
            nd.setLocalZOrder(25);
        }else{
            ViewManager.showAuthPop();
        }
    }

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined && this.tex != null && this.sprMiniRank.node.active && this.sprMiniRank) {
            console.log("log---------刷新子域的纹理");
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.sprMiniRank.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }
}
