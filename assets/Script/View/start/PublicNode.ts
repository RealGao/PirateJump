import GameData from "../../Common/GameData";
import WXCtr from "../../Controller/WXCtr";
import GameCtr from "../../Controller/GameCtr";

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


    onLoad(){
        this.initNode();
        GameCtr.getInstance().setPublic(this);
    }

    start(){
        this.showCurrentShop();
        this.showGold();
        this.showDiamond();
        this.showPower();
    }

    initNode(){
        this._infoNode=this.node.getChildByName("infoNode");
        this._btnsNode=this.node.getChildByName("btnsNode");
        this.initInfoNode();
        this.initBtnsNode();
    }

    initInfoNode(){
        this._lb_gold=this._infoNode.getChildByName("lb_gold");
        this._lb_diamond=this._infoNode.getChildByName("lb_diamond");
        this._lb_power=this._infoNode.getChildByName("lb_power");
        this._lb_powerTime=this._infoNode.getChildByName("lb_powerTime");
        let btn_addDiamond=this._infoNode.getChildByName("btn_addDiamond");
        let btn_addPower=this._infoNode.getChildByName("btn_addPower");
        this._lb_powerTime.active=true;

        this.initBtnEvent(btn_addDiamond);
        this.initBtnEvent(btn_addPower);
        this.initPowerTime();
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


    showGold(){
        this._lb_gold.getComponent(cc.Label).string=GameData.gold+"";
    }

    showDiamond(){
        this._lb_diamond.getComponent(cc.Label).string=GameData.diamond+"";
    }


    hideGoldNode(){
        this._lb_gold.active=false;
        let icon_gold=this._infoNode.getChildByName("icon_gold");
        icon_gold.active=false;
    }

    showPower(){
        this._lb_power.getComponent(cc.Label).string=GameData.power+"/99";
    }

    showPowerTime(){
        console.log("log----------showPowerTime");
        if(GameData.power>=99){
            this._lb_powerTime.getComponent(cc.Label).string="体力值已满";
            this._lb_powerTime.scale=0.7;
        }else{
            this._lb_powerTime.scale=1.0;
            this._powerTime_min =Math.floor(GameData.powerTime/60);
            this._powerTime_sec =GameData.powerTime%60;
            this._lb_powerTime.getComponent(cc.Label).string= (this._powerTime_min>=10?this._powerTime_min:"0"+this._powerTime_min)+":"+
                                                     (this._powerTime_sec>=10?this._powerTime_sec:"0"+this._powerTime_sec);
        }
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
        this.showPowerTime();
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
                    this.node.parent.destroy();
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
}
