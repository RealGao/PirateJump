import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import GameData from "../../Common/GameData";
const {ccclass, property} = cc._decorator;
declare let require: any;
@ccclass
export default class Start extends cc.Component {
    _infoNode=null;
    _btnsNode=null;
    _adsNode=null;
    _lb_gold=null;
    _lb_diamond=null;
    _lb_power=null;
    _lb_powerTime=null;
    _gameLogo=null;
    _carouselAdNode=null;
    _mask=null;
    _bg=null;
    _carouseAds=[];
    _carouselIndex=0;
    _powerTime_min=0;
    _powerTime_sec=0;

    @property(cc.Node)
    ndLoading:cc.Node = null;

    @property(cc.ProgressBar)
    pgbLoading:cc.ProgressBar = null;

    @property(cc.SpriteFrame)
    bgSpriteFrames:cc.SpriteFrame[]=[];

    @property(cc.Prefab)
    help:cc.Prefab=null;

    @property(cc.Prefab)
    achievement:cc.Prefab=null;

    @property(cc.Prefab)
    shop:cc.Prefab=null;

    @property(cc.Prefab)
    ad:cc.Prefab=null;

    onLoad () {
        GameCtr.getInstance().setStart(this); 
        this.initNode();
        this.initSoundState();
        
    }

    startGame() {
        this.showGold();
        this.showDiamond();
        this.showPower();
        this.initPowerTime();
        this.updateBtnShopState();
    }

    initNode(){
        this._infoNode=this.node.getChildByName("infoNode");
        this._btnsNode=this.node.getChildByName("btnsNode");
        this._adsNode=this.node.getChildByName("adNode");

        this._lb_gold=this._infoNode.getChildByName("lb_gold");
        this._lb_diamond=this._infoNode.getChildByName("lb_diamond");
        this._lb_power=this._infoNode.getChildByName("lb_power");
        this._lb_powerTime=this._infoNode.getChildByName("lb_powerTime");
        this._gameLogo=this.node.getChildByName("gameLogo");
        this._bg=this.node.getChildByName("bg");

        this._gameLogo.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5,1.05),
            cc.scaleTo(0.5,1.0)
        )))

        this._infoNode.setLocalZOrder(10);
        this.initBtnsNode();
    }


    initBtnsNode(){
        let btn_music=this._btnsNode.getChildByName("btn_music");
        let btn_help=this._btnsNode.getChildByName("btn_help");
        let btn_start=this._btnsNode.getChildByName("btnStartNode").getChildByName("btn_start");
        let btn_invite=this._btnsNode.getChildByName("btn_invite");
        let btn_achievement=this._btnsNode.getChildByName("btn_achievement");
        let btn_rank=this._btnsNode.getChildByName("btn_rank");
        let btn_more=this._btnsNode.getChildByName("btn_more");
        let btn_shop=this._btnsNode.getChildByName("btn_shop");
        let btn_addDiamond=this._infoNode.getChildByName("btn_addDiamond");
        let btn_addPower=this._infoNode.getChildByName("btn_addPower");


        this.initBtnEvent(btn_music);
        this.initBtnEvent(btn_help);
        this.initBtnEvent(btn_start);
        this.initBtnEvent(btn_invite);
        this.initBtnEvent(btn_achievement);
        this.initBtnEvent(btn_rank);
        this.initBtnEvent(btn_more);
        this.initBtnEvent(btn_shop);
        this.initBtnEvent(btn_addDiamond);
        this.initBtnEvent(btn_addPower);

        
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_music"){
                GameCtr.musicState=-1*GameCtr.musicState;
                localStorage.setItem("musicState",GameCtr.musicState+'')
                this.showBtnMusicState();
            }else if(e.target.getName()=="btn_help"){
                GameData.gold=200000;
                GameData.diamond=10000;
                //this.showHelp();
            }else if(e.target.getName()=="btn_start"){
                GameCtr.gameStart();
            }else if(e.target.getName()=="btn_invite"){
               
            }else if(e.target.getName()=="btn_achievement"){
                this.showAchievement();
            }else if(e.target.getName()=="btn_shop"){
               
                this.showShop();
            }else if(e.target.getName()=="btn_addDiamond"){

            }else if(e.target.getName()=="btn_addPower"){

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

    initPowerTime(){
        let powerTimeCount=WXCtr.getStorageData("powerTime");
        console.log("log--------powerTimeCount=:",powerTimeCount);
        if(!powerTimeCount){
            console.log("log------------d1111111111111")
            GameData.powerTime=5*60;
            this.doPowerTimeCount();
        }else{
            console.log("log------------d2222222222222")
            let timeIterval=Math.floor((new Date().getTime()-WXCtr.getStorageData("lastTime"))/1000);
            console.log('log------------timeTerval=:',timeIterval);
            if(timeIterval-powerTimeCount>=0){
                GameData.power+=1;
                timeIterval-=powerTimeCount;
                let cycle=Math.floor(timeIterval/5*60);
                GameData.power+=cycle;
                GameData.powerTime=timeIterval-cycle*5*60;
                console.log("log------------d3333333333333")
            }else{
                console.log("log------------d4444444444444")
                GameData.powerTime=powerTimeCount-timeIterval;
            }
            console.log("log--------GameData.powerTime=:",GameData.powerTime);
            this.doPowerTimeCount();
        }
    }

    showHelp(){
        if(cc.find("Canvas").getChildByName("help")){
            return;
        }
        this.setMaskVisit(true);
        let help=cc.instantiate(this.help);
        help.parent=cc.find("Canvas")
    }

    showAchievement(){
        if(cc.find("Canvas").getChildByName("achievement")){
            return;
        }
        this.setMaskVisit(true);
        let achievement=cc.instantiate(this.achievement);
        achievement.parent=cc.find("Canvas");
    }


    showShop(){
        if(cc.find("Canvas").getChildByName("shop")){
            return;
        }
        let shop=cc.instantiate(this.shop);
        shop.parent=cc.find("Canvas");
    }

    showBtnMusicState(){
        let mask=this._btnsNode.getChildByName("btn_music").getChildByName("mask");
        if(GameCtr.musicState>0){//音乐 音效开启
            mask.active=false;
        }else{//音乐 音效关闭
            mask.active=true;
        }
    }

    showStartBtns(bool){
        this._btnsNode.active=bool;
        this._gameLogo.active=bool;
        this._adsNode.active=bool;
    }

    showGold(){
        this._lb_gold.getComponent(cc.Label).string=GameData.gold+"";
    }

    showDiamond(){
        this._lb_diamond.getComponent(cc.Label).string=GameData.diamond+"";
    }

    showPower(){
        this._lb_power.getComponent(cc.Label).string=GameData.power+"/99";
    }

    showPowerTime(){
        // if(GameData.power>=99){
        //     this._lb_powerTime.active=false
        // }else{
            this._lb_powerTime.active=true;
            this._powerTime_min =Math.floor(GameData.powerTime/60);
            this._powerTime_sec =GameData.powerTime%60;
            this._lb_powerTime.getComponent(cc.Label).string= (this._powerTime_min>=10?this._powerTime_min:"0"+this._powerTime_min)+":"+
                                                     (this._powerTime_sec>=10?this._powerTime_sec:"0"+this._powerTime_sec);
        //}
    }

    setMaskVisit(bool){
        this._mask.active=bool;
    }

    setBgByIndex(index){
        this._bg.getComponent(cc.Sprite).spriteFrame=this.bgSpriteFrames[index];
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

    doPowerTimeCount(){
        this.showPowerTime();
        this.schedule(()=>{
            GameData.powerTime--;
            this.showPowerTime();
            if(GameData.powerTime<=0){
                GameData.powerTime=5*60;
                GameData.power++;
                GameData.power=GameData.power>=99?99:GameData.power;
                this.showPowerTime();   
                this.showPower();
            }
        },1,cc.macro.REPEAT_FOREVER)
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


    

   
}
