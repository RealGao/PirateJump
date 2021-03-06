import GameData from "../../Common/GameData";
import WXCtr from "../../Controller/WXCtr";
import GameCtr from "../../Controller/GameCtr";
import EventManager from "../../Common/EventManager";

enum Shop{
    maps=0,
    props,
    homeWorld,
    characters,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _infoNode=null;
    _btnsNode=null;
    _lb_gold=null;
    _lb_diamond=null;
    _lb_power=null;
    _lb_powerTime=null;
    _powerTime_min=0;
    _powerTime_sec=0;
    _tipBuyMaps=null;
    _tipBuyProps=null;
    _tipBuyCharactor=null;
    _lightBtns=[];

    _addPowerTimeArr=[];

    @property(cc.Prefab)
    pfMapsNode:cc.Prefab=null;

    @property(cc.Prefab)
    pfPropsNode:cc.Prefab=null;

    @property(cc.Prefab)
    pfHomeWorldNode:cc.Prefab=null;

    @property(cc.Prefab)
    pfCharactersNode:cc.Prefab=null;

    @property(cc.Prefab)
    pfPowerNotEnough:cc.Prefab=null;

    @property(cc.Node)
    ndPower: cc.Node = null;




    onLoad(){ 
        this.initNode();
        this.initData();
        GameCtr.getInstance().setPublic(this);
        EventManager.on("UPDATE_GOLD", this.refreshGold, this);
        EventManager.on("UPDATE_DIAMOND", this.refreshDiamod, this);
    }

    initNode(){
        this._infoNode=this.node.getChildByName("infoNode");
        this._btnsNode=this.node.getChildByName("btnsNode");
        this.initInfoNode();
        this.initBtnsNode();
        this.hideBtnNode();
    }

    initData(){
        for(let i=0;i<24*12;i++){
            this._addPowerTimeArr.push(5*60*i);
        }
    }

    hidePowerNode() {
        this.ndPower.active = false;
    }

    initInfoNode(){
        this._lb_gold=this._infoNode.getChildByName("lb_gold");
        this._lb_diamond=this._infoNode.getChildByName("lb_diamond");
        this._lb_power=this.ndPower.getChildByName("lb_power");
        this._lb_powerTime=this.ndPower.getChildByName("lb_powerTime");
        let btn_addDiamond=this._infoNode.getChildByName("btn_addDiamond");
        let btn_addPower=this.ndPower.getChildByName("btn_addPower");
        this._lb_powerTime.active=true;

        this.initBtnEvent(btn_addDiamond);
        this.initBtnEvent(btn_addPower);
    }


    initBtnsNode(){
        let btn_back=this._btnsNode.getChildByName("btn_back");
        let btn_maps=this._btnsNode.getChildByName("btn_maps");
        let btn_props=this._btnsNode.getChildByName("btn_props");
        let btn_start=this._btnsNode.getChildByName("btn_start");
        let btn_homeWorld=this._btnsNode.getChildByName("btn_homeWorld");
        let btn_characters=this._btnsNode.getChildByName("btn_characters");

        this._tipBuyMaps=btn_maps.getChildByName("tip");
        this._tipBuyProps=btn_props.getChildByName("tip");
        this._tipBuyCharactor=btn_characters.getChildByName("tip");

        this._lightBtns.push(btn_maps);
        this._lightBtns.push(btn_props);
        this._lightBtns.push(btn_characters);
        
        this.initBtnEvent(btn_back);
        this.initBtnEvent(btn_maps);
        this.initBtnEvent(btn_props);
        this.initBtnEvent(btn_start);
        this.initBtnEvent(btn_homeWorld);
        this.initBtnEvent(btn_characters);

        this.upBtnsState();
    }

    hideBtnNode(){
        this._btnsNode.active=false;
    }

    refreshGold() {
        this._lb_gold.getComponent(cc.Label).string=GameData.gold+"";
    }

    refreshDiamod() {
        this._lb_diamond.getComponent(cc.Label).string=GameData.diamond+"";
    }

    showGold(){
        if(!this._lb_gold) return;
        this._lb_gold.getComponent(cc.Label).string=GameData.gold+"";
    }

    showDiamond(){
        console.log("log---------showDimond=:",GameData.diamond);
        if(!this._lb_diamond) return;
        this._lb_diamond.getComponent(cc.Label).string=GameData.diamond+"";
    }



    setGoldNodeActive(bool){
        if(!this._lb_gold) return;
        this._lb_gold.active=bool;
        let icon_gold=this._infoNode.getChildByName("icon_gold");
        icon_gold.active=bool;
    }

    showPower(){
        if(!this._lb_power) return;
        this._lb_power.getComponent(cc.Label).string=GameData.power+"/99";
    }

    showPowerTime(){
        // console.log("log----------showPowerTime");
        if(GameData.power>=99){
            this._lb_powerTime.getComponent(cc.Label).string="体力值已满";
            this._lb_powerTime.scale=0.7;
        }else{
            this._lb_powerTime.scale=1.0;
            this._powerTime_min =Math.floor(GameData.powerTime/60);
            this._powerTime_sec =GameData.powerTime%60;
            this._lb_powerTime.getComponent(cc.Label).string= (this._powerTime_min>=10?this._powerTime_min:"0"+this._powerTime_min)+":"+ (this._powerTime_sec>=10?this._powerTime_sec:"0"+this._powerTime_sec);
        }
    }

    initPowerTime(){
        let date=new Date();
        let hour=date.getHours();
        let min=date.getMinutes();
        let sec=date.getSeconds();
        let currentTimeStamp=hour*3600+60*min+sec;

        let lastPowerTime=WXCtr.getStorageData("lastPowerTime",0);
        let lastTime=lastPowerTime>GameData.lastTime?lastPowerTime:GameData.lastTime
        let lastDate=new Date(lastTime);
       

        let last_hour=lastDate.getHours();
        let last_min=lastDate.getMinutes();
        let last_sec=lastDate.getSeconds();

        let lastTimeStamp=last_hour*3600+last_min*60+last_sec;

        for(let i=0;i<this._addPowerTimeArr.length;i++){
            if(this._addPowerTimeArr[i]>lastTimeStamp && this._addPowerTimeArr[i]<currentTimeStamp){
                GameData.power++;
                GameData.power=GameData.power>=99?99:GameData.power;
            }
        }
        this.showPower();
        this.showPowerTime();
        console.log("log-----------lastTimeStamp=:",lastTimeStamp);
        console.log("log-----------currentTimeStamp=:",currentTimeStamp);
        console.log("log-----------this._addPowerTimeArr=:",this._addPowerTimeArr);

        for(let i=0;i<this._addPowerTimeArr.length;i++){
            if(this._addPowerTimeArr[i]-currentTimeStamp>0){
                GameData.powerTime=this._addPowerTimeArr[i]-currentTimeStamp;
                this.doPowerTimeCount();
                return;
            }
        } 
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


    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_back"){
                console.log("cc.director.getScene().name=:",cc.director.getScene().name);
                if(cc.director.getScene().name=="Start"){
                    this.hideBtnNode();
                    this.destroyMapsNode();
                    this.destroyPropsNode();
                    this.destroyHomeWorldNode();
                    this.destroyCharactersNode();
                    GameCtr.getInstance().getStart().showStartBtns(true);
                }else if(cc.director.getScene().name=="Game"){
                    cc.director.loadScene("Start");
                }
            }else if(e.target.getName()=="btn_maps"){
                if(cc.find("Canvas").getChildByName("mapsNode")){return;}
                this.showMapsNode();
                this.destroyPropsNode();
                this.destroyHomeWorldNode();
                this.destroyCharactersNode();
                GameData.currentShopIndex=Shop.maps;
                this.seletedLightBtn("btn_maps");
            }else if(e.target.getName()=="btn_props"){
                if(cc.find("Canvas").getChildByName("propsNode")){return}
                this.showPropsNode();
                this.destroyMapsNode();
                this.destroyHomeWorldNode();
                this.destroyCharactersNode();
                GameData.currentShopIndex=Shop.props;
                this.seletedLightBtn("btn_props");
            }else if(e.target.getName()=="btn_characters"){
                if(cc.find("Canvas").getChildByName("charactersNode")){return}
                this.showCharactersNode();
                this.destroyMapsNode();
                this.destroyPropsNode();
                this.destroyHomeWorldNode();
                GameData.currentShopIndex=Shop.characters;
                this.seletedLightBtn("btn_characters");
            }else if(e.target.getName()=="btn_start"){
                if(GameData.power>=5){
                    cc.director.loadScene("Game");
                }else{
                    GameCtr.getInstance().getToast().toast("体力值不足");
                }
            }else if(e.target.getName()=="btn_homeWorld"){
                if(cc.find("Canvas").getChildByName("homeWorldNode")){return}
                this.showHomeWorldNode();
                this.destroyMapsNode();
                this.destroyPropsNode();
                this.destroyCharactersNode();
                GameData.currentShopIndex=Shop.homeWorld;
                this.seletedLightBtn("btn_homeWorld");
            }else if(e.target.getName()=="btn_addPower"){
                if(cc.find("Canvas").getChildByName("powerNotEnough")){
                    return;
                }
                this.showPowerNotEnough();
            }
        })
    }

    showCurrentShop(){
        this._btnsNode.active=true;
        this.setGoldNodeActive(true);
        if(GameData.currentShopIndex==Shop.maps){
            this.seletedLightBtn("btn_maps");
        }else if(GameData.currentShopIndex==Shop.props){

            this.seletedLightBtn("btn_props");
        }else if(GameData.currentShopIndex==Shop.characters){

            this.seletedLightBtn("btn_characters");
        }else if(GameData.currentShopIndex==Shop.homeWorld){

            this.seletedLightBtn("btn_homeWorld");
        }
    }

    showMapsNode(){
        let mapNode=cc.instantiate(this.pfMapsNode);
        mapNode.parent=cc.find("Canvas");
        mapNode.tag=GameData.mapNodeTag;
    }

    showPropsNode(){
        let propsNode=cc.instantiate(this.pfPropsNode);
        propsNode.parent=cc.find("Canvas");
        propsNode.tag=GameData.propsNodeTag;
    }

    showCharactersNode(){
        let charactersNode=cc.instantiate(this.pfCharactersNode);
        charactersNode.parent=cc.find("Canvas");
        charactersNode.tag=GameData.charactersNodeTag;
    }

    showHomeWorldNode(){
        let homeWorldNode=cc.instantiate(this.pfHomeWorldNode);
        homeWorldNode.parent=cc.find("Canvas");
        homeWorldNode.tag=GameData.homeWorldNodeTag;
    }

    showPowerNotEnough(){
        let powerNotEnough=cc.instantiate(this.pfPowerNotEnough);
        powerNotEnough.parent=cc.find("Canvas");
        powerNotEnough.setLocalZOrder(50);
    }

    destroyMapsNode(){
        while(cc.find("Canvas").getChildByTag(GameData.mapNodeTag)){
            cc.find("Canvas").removeChildByTag(GameData.mapNodeTag);
        }
    }

    destroyPropsNode(){
        while(cc.find("Canvas").getChildByTag(GameData.propsNodeTag)){
            cc.find("Canvas").removeChildByTag(GameData.propsNodeTag);
        }
    }

    destroyCharactersNode(){
        while(cc.find("Canvas").getChildByTag(GameData.charactersNodeTag)){
            cc.find("Canvas").removeChildByTag(GameData.charactersNodeTag)
        }
    }

    destroyHomeWorldNode(){
        while(cc.find("Canvas").getChildByTag(GameData.homeWorldNodeTag)){
            cc.find("Canvas").removeChildByTag(GameData.homeWorldNodeTag)
        }
    }



    seletedLightBtn(btnName){
        for(let i=0;i<this._lightBtns.length;i++){
            if(this._lightBtns[i].name==btnName){
                this._lightBtns[i].getComponent("lightBtn").setSeletedState(true);
            }else{
                this._lightBtns[i].getComponent("lightBtn").setSeletedState(false);
            }
        }
    }

    showLightBtnsTip(){
        for(let i=0;i<this._lightBtns.length;i++){
            this._lightBtns[i].getComponent("lightBtn").JudgeShowLight();
        }
    }



    updateBtnMapsState(){
        if(GameData.canBuyMaps()){
            this._tipBuyMaps.active=true;
        }else{
            this._tipBuyMaps.active=false;
        }
    }

    updateBtnPropsState(){
        if(GameData.canBuyProps()){
            this._tipBuyProps.active=true;
        }else{
            this._tipBuyProps.active=false;
        }
    }

    updateBtnCharactorsState(){
        if(GameData.canBuyCharactors()){
            this._tipBuyCharactor.active=true;
        }else{
            this._tipBuyCharactor.active=false;
        }
    }

    upBtnsState(){
        this.updateBtnMapsState();
        this.updateBtnPropsState();
        this.updateBtnCharactorsState();
    }


    onDestroy(){
        console.log("log-------------------------publicNode onDestroy()-------");
        WXCtr.setStorageData("lastPowerTime",new Date().getTime());
        WXCtr.setStorageData("powerTime", GameData.powerTime);
        EventManager.off("UPDATE_GOLD", this.refreshGold, this);
        EventManager.off("UPDATE_DIAMOND", this.refreshDiamod, this);
    }
}
