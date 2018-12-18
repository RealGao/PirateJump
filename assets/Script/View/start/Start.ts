import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import GameData from "../../Common/GameData";

import Toast from "../../Common/Toast";
import HttpCtr from "../../Controller/HttpCtr";
import ViewManager from "../../Common/ViewManager";

import AudioManager from "../../Common/AudioManager";
import EventManager from "../../Common/EventManager";

const {ccclass, property} = cc._decorator;
enum Shop{
    maps=0,
    props,
    homeWorld,
    characters,
}
declare let require: any;
@ccclass
export default class Start extends cc.Component {
    _btnsNode=null;
    _adsNode=null;
    _gameLogo=null;
    _carouselAdNode=null;
    _mask=null;
    _bg=null;
    _carouseAds=[];
    _carouselIndex=0;


    @property(cc.Node)
    ndLoading:cc.Node = null;

    @property(cc.ProgressBar)
    pgbLoading:cc.ProgressBar = null;

    @property(cc.Prefab)
    pfHelp:cc.Prefab=null;

    @property(cc.Prefab)
    pfAchievement:cc.Prefab=null;

    @property(cc.Prefab)
    pfShop:cc.Prefab=null;

    @property(cc.Prefab)
    ad:cc.Prefab=null;

    @property(cc.Prefab)
    pfTreatureBox:cc.Prefab=null;

    @property(cc.Prefab)
    pfRank:cc.Prefab=null;

    @property(cc.Prefab)
    pfBgMusic:cc.Prefab=null;

    @property(cc.Prefab)
    pfPublicNode:cc.Prefab=null;

    onLoad () {
        GameCtr.getInstance().setStart(this); 
        this.loadPackages();
        this.initNode();
        this.initBgMusic();
        this.initSoundState();
        WXCtr.getFriendRankingData();
        this.initPublicNode();
        if(GameCtr.HadEnterdGame){
            GameCtr.getInstance().getPublic().hidePowerNode();
            GameCtr.getInstance().getPublic().initPowerTime();
            // GameCtr.getInstance().getPublic().showGold();
            // GameCtr.getInstance().getPublic().showDiamond();
            GameCtr.getInstance().getPublic().showPower();
        }
        GameData.getAllLocalGameData();
        EventManager.on("REFRESH_BTN", this.refreshBtns, this);
        EventManager.on("HIDE_BTN_TIP", this.hideBtnTip, this);
    }

    onDestroy() {
        EventManager.off("REFRESH_BTN", this.refreshBtns, this);
        EventManager.off("HIDE_BTN_TIP", this.hideBtnTip, this);
    }

    start() {
        
    }

    startGame() {
        this.getBonusDiamonds();
        this.updateBtnShopState();
        this.updateBtnAchieveState();
        GameData.achievementsLevelData=GameData.getAchievementsLevelData();
        GameCtr.getInstance().getPublic().hidePowerNode();
        GameCtr.getInstance().getPublic().initPowerTime();
        // GameCtr.getInstance().getPublic().showGold();
        // GameCtr.getInstance().getPublic().showDiamond();
        GameCtr.getInstance().getPublic().showPower();
        WXCtr.onShow(() => {
            WXCtr.isOnHide = false;
            this.initBgMusic();
        });
        this.scheduleOnce(()=>{GameData.judgeShopBtns();}, 1)
        WXCtr.createBannerAd(100,300);
    }

    loadPackages() {
        WXCtr.loadSubPackages("subPackage", () => {
            console.log("log............分包加载完成---------");
        });
    }

    initNode(){
        
        this._btnsNode=this.node.getChildByName("btnsNode");
        this._adsNode=this.node.getChildByName("adNode");
        this._adsNode.active = false;
        
        this._gameLogo=this.node.getChildByName("gameLogo");
        this._bg=this.node.getChildByName("bg");

        this._gameLogo.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5,1.05),
            cc.scaleTo(0.5,1.0)
        )))

        this.initBtnsNode();
    }

    initPublicNode(){
        let publicNode=cc.instantiate(this.pfPublicNode);
        publicNode.parent=this.node;
        publicNode.getComponent("PublicNode").hideBtnNode();
        publicNode.getComponent("PublicNode").setGoldNodeActive(true);
        publicNode.setLocalZOrder(20);
    }


    initBtnsNode(){
        let btn_music=this._btnsNode.getChildByName("btn_music");
        let btn_help=this._btnsNode.getChildByName("btn_help");
        let btn_start=this._btnsNode.getChildByName("btn_start");
        let btn_invite=this._btnsNode.getChildByName("btn_invite");
        let btn_achievement=this._btnsNode.getChildByName("btn_achievement");
        let btn_rank=this._btnsNode.getChildByName("btn_rank");
        let btn_more=this._btnsNode.getChildByName("btn_more");
        let btn_prop=this._btnsNode.getChildByName("btn_prop");
        let btn_map=this._btnsNode.getChildByName("btn_map");
        let btn_role=this._btnsNode.getChildByName("btn_role");
        let btn_treatureBox=this._btnsNode.getChildByName("btn_treatureBox");

        this.initBtnEvent(btn_music);
        this.initBtnEvent(btn_help);
        this.initBtnEvent(btn_start);
        this.initBtnEvent(btn_invite);
        this.initBtnEvent(btn_achievement);
        this.initBtnEvent(btn_rank);
        this.initBtnEvent(btn_more);
        this.initBtnEvent(btn_prop);
        this.initBtnEvent(btn_map);
        this.initBtnEvent(btn_role);
        this.initBtnEvent(btn_treatureBox); 
    }

    refreshBtns(event) {
        let nd;
        if(event.detail == "prop"){
            nd = this._btnsNode.getChildByName("btn_prop");
        }else if(event.detail == "map") {
            nd = this._btnsNode.getChildByName("btn_map");
        }else if(event.detail == "role") {
            nd = this._btnsNode.getChildByName("btn_role");
        }
        let tip = nd.getChildByName("btn_exclaim");
        tip.active = true;
    }

    hideBtnTip(event) {
        let nd;
        if(event.detail == "prop"){
            nd = this._btnsNode.getChildByName("btn_prop");
        }else if(event.detail == "map") {
            nd = this._btnsNode.getChildByName("btn_map");
        }else if(event.detail == "role") {
            nd = this._btnsNode.getChildByName("btn_role");
        }
        let tip = nd.getChildByName("btn_exclaim");
        tip.active = false;
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_music"){
                GameCtr.musicState=-1*GameCtr.musicState;
                localStorage.setItem("musicState",GameCtr.musicState+'');
                this.showBtnMusicState();
            }else if(e.target.getName()=="btn_help"){
                ViewManager.showHelpPop();
                // GameData.gold=100000;
                // GameData.diamond=50000;
                // GameData.power=99;
                // GameCtr.getInstance().getPublic().showGold();
                // GameCtr.getInstance().getPublic().showDiamond();
                // GameCtr.getInstance().getPublic().showPower();
                
            }else if(e.target.getName()=="btn_start"){
                if(GameData.power>=5){
                    cc.director.loadScene("Game");
                }else{
                    GameCtr.getInstance().getToast().toast("体力值不足");
                }
            }else if(e.target.getName()=="btn_invite"){
               
            }else if(e.target.getName()=="btn_achievement"){
                let tip = e.target.getChildByName("btn_exclaim");
                tip.active = false;
                ViewManager.showArchievePop();
            }else if(e.target.getName()=="btn_treatureBox"){
                this.showTreatureBox();
            }else if(e.target.getName()=="btn_prop"){
                let tip = e.target.getChildByName("btn_exclaim");
                tip.active = false;
                this.showShop(Shop.props);
            }else if(e.target.getName()=="btn_map"){
                let tip = e.target.getChildByName("btn_exclaim");
                tip.active = false;
                this.showShop(Shop.maps);
            }else if(e.target.getName()=="btn_role"){
                let tip = e.target.getChildByName("btn_exclaim");
                tip.active = false;
                this.showShop(Shop.characters);
            }else if(e.target.getName()=="btn_addDiamond"){

            }else if(e.target.getName()=="btn_addPower"){

            }else if(e.target.getName()=="btn_rank"){
                this.showRank();
            }
        })
    }

    initSoundState(){
        GameCtr.musicState=localStorage.getItem('musicState');
        if(!GameCtr.musicState){
            GameCtr.musicState=1;
            localStorage.setItem('musicState',1+'');
        }else {
            GameCtr.musicState=Number(GameCtr.musicState)
        }
        this.showBtnMusicState();
    }

    initBgMusic(){
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

    fastRoleChange() {
        this.showShop(Shop.characters);
    }

    showShop(shopType){
        GameData.currentShopIndex = shopType;
        ViewManager.showMall();
    }

    showRoleInfo() {
        let info = GameData.rolesDes[GameData.currentRole];
        ViewManager.showCommonNote(info);
    }

    showRank(){
        if (WXCtr.authed) {
            if(cc.find("Canvas").getChildByName("rank")){
                return;
            }
            let rank=cc.instantiate(this.pfRank);
            rank.parent=cc.find("Canvas");
            rank.setLocalZOrder(30);
        } else {
            ViewManager.showAuthPop();
        }
        
    }

    showTreatureBox(){
        if(cc.find("Canvas").getChildByName("treatureBox")){
            return;
        }
        let treatrueBox=cc.instantiate(this.pfTreatureBox);
        treatrueBox.parent=cc.find("Canvas");
        treatrueBox.setLocalZOrder(30);
    }

    showBtnMusicState(){
        let mask=this._btnsNode.getChildByName("btn_music").getChildByName("mask");
        if(GameCtr.musicState>0){//音乐 音效开启
            mask.active=false;
            AudioManager.getInstance().soundOn = true;
            AudioManager.getInstance().musicOn = true;
        }else{//音乐 音效关闭
            mask.active=true;
            AudioManager.getInstance().soundOn = false;
            AudioManager.getInstance().musicOn = false;
        }

        let music = cc.find("Canvas").getChildByTag(GameCtr.musicTag);
        if (music) {
            music.getComponent("music").updatePlayState();
        }
    }

    showStartBtns(bool){
        this._btnsNode.active=bool;
        this._gameLogo.active=bool;
        // this._adsNode.active=bool;
    }

    

    setMaskVisit(bool){
        this._mask.active=bool;
    }



    showLoading(){
        this.pgbLoading.node.active = true;
        let plane = this.pgbLoading.node.getChildByName("plane");
        if (this.pgbLoading.progress <= 1) {
            this.scheduleOnce(() => {
                plane.x = this.pgbLoading.node.width * this.pgbLoading.progress - (this.pgbLoading.node.width / 2);
                this.pgbLoading.progress += 0.005;
                this.showLoading();
            }, 0.02);
        }else {
            this.pgbLoading.progress = 0;
            plane.x = this.pgbLoading.node.width * this.pgbLoading.progress - (this.pgbLoading.node.width / 2);
            this.showLoading();
        }
    }

   

    /*广告*/
    requestAds(){
        if(!GameCtr.reviewSwitch){return;}//受审核开关控制
        //请求广告数据  进行展示
    }

    showAds(adsArr){
        if(adsArr && adsArr.length>0){
            let adsContent=this._adsNode.getChildByName("adsContent");
            for(let i=0;i<adsArr.length;i++){
                let ad=cc.instantiate(this.ad);
                ad.parent=adsContent;
                ad.getComponent("ad").init(adsArr[i]);
            }
        }
        this.showCarouselAd(adsArr);
    }


    showCarouselAd(adsArr){
        for(let i=0;i<adsArr.length;i++){
            let ad=cc.instantiate(this.ad);
            ad.parent=this._carouselAdNode;
            ad.scale=1.0;
            ad.getComponent("ad").init(adsArr[i]);
            ad.x=i==0?0:1800;
            this._carouseAds.push(ad);
        }
        this._carouselIndex=0;
        this.scheduleOnce(()=>{
            this._carouseAds[this._carouselIndex].getComponent("ad").doShake();
        },2)
        this.scheduleOnce(this.doCarousel.bind(this),5);

    }

    doCarousel(){
        if(this._carouseAds.length<=1){ //广告位推荐位大于1个，才有轮播功能
            return 
        }
        this._carouseAds[this._carouselIndex].x=0;
        this._carouseAds[this._carouselIndex].getComponent("ad").doShake();
        for(let i=0;i<this._carouseAds.length;i++){
            if(i==this._carouselIndex){
                continue;
            }
            this._carouseAds[i].rotation=0;
            this._carouseAds[i].getComponent("ad").stopActions();
            this._carouseAds[i].x=1800;//移除屏幕之外
        }

        this._carouselIndex++;
        this._carouselIndex=this._carouselIndex%this._carouseAds.length;
        this.scheduleOnce(this.doCarousel.bind(this),5);
    }

    


    updateBtnShopState(){
        let btn_shop=this._btnsNode.getChildByName("btn_shop");
        let tipShopping=btn_shop.getChildByName("tipShopping");
        if(GameData.canShopping()){
            tipShopping.active=true;
        }else{
            tipShopping.active=false;
        }
    }

    updateBtnAchieveState(){
        let btn_achieve=this._btnsNode.getChildByName("btn_achievement");
        let tipAchieve=btn_achieve.getChildByName("btn_exclaim");
        if(GameData.canGetAchieve()){
            tipAchieve.active=true;
        }else{
            tipAchieve.active=false;
        }
    }

    getBonusDiamonds(){
        let bounusDiamonds=GameData.getBonusDiamonds();
        if(bounusDiamonds>0){

        }else{

        }
    }
}
