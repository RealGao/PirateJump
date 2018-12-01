import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";

const {ccclass, property} = cc._decorator;

enum Shop{
    maps=0,
    props,
    homeWorld,
    characters,
}

@ccclass
export default class NewClass extends cc.Component {
    _btnsNode=null;
    _lb_title=null;
    _mask=null;
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

    onLoad(){
        this.initNode();
        GameCtr.getInstance().setShop(this);
        console.log("log---------cc.director.getScene().name=:",cc.director.getScene().name);
        if(cc.director.getScene().name=="Start"){
            GameCtr.getInstance().getStart().showStartBtns(false);
        }
    }

    start(){
        this.showCurrentShop();
    }

    initNode(){
        this._btnsNode=this.node.getChildByName("btnsNode");
        this._lb_title=this.node.getChildByName("lb_title");
        this._mask=this.node.getChildByName("mask");
        this._mask.active=false;
        this.initBtnsNode();
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

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_back"){
                console.log("cc.director.getScene().name=:",cc.director.getScene().name);
                if(cc.director.getScene().name=="Start"){
                    this.node.destroy();
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
            }
        })
    }

    showCurrentShop(){
        this.node.destroy();
        if(GameData.currentShopIndex==Shop.maps){
            this.showMapsNode();
            this.seletedLightBtn("btn_maps");
        }else if(GameData.currentShopIndex==Shop.props){
            this.showPropsNode();
            this.seletedLightBtn("btn_props");
        }else if(GameData.currentShopIndex==Shop.characters){
            this.showCharactersNode();
            this.seletedLightBtn("btn_characters");
        }else if(GameData.currentShopIndex==Shop.homeWorld){
            this.showHomeWorldNode();
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

    setMaskVisit(bool){
        this._mask.active=bool;
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
