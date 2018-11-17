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
    _mapsNode=null;
    _propsNode=null;
    _homeWorldNode=null;
    _charactersNode=null;

    _tipBuyMaps=null;
    _tipBuyProps=null;
    _tipBuyCharactor=null;

    _lightBtns=[];

    onLoad(){
        this.initNode();
        GameCtr.getInstance().setShop(this);
        GameCtr.getInstance().getStart().showStartBtns(false);
    }

    start(){
        this.showCurrentShop();
    }

    initNode(){
        this._btnsNode=this.node.getChildByName("btnsNode");

        this._lb_title=this.node.getChildByName("lb_title");
        this._mapsNode=this.node.getChildByName("mapsNode");
        this._propsNode=this.node.getChildByName("propsNode");
        this._homeWorldNode=this.node.getChildByName("homeWorldNode");
        this._charactersNode=this.node.getChildByName("charactersNode");
        
        this._mask=this.node.getChildByName("mask");

        this._mapsNode.getComponent('mapsNode').init();
        this._propsNode.getComponent("propsNode").init();
        this._charactersNode.getComponent('charactersNode').init();
        this._homeWorldNode.getComponent("homeWorldNode").init();

        this._mask.active=false;
        this._mapsNode.active=false;
        this._propsNode.active=false;
        this._homeWorldNode.active=false;
        this._charactersNode.active=false;

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
        this._lightBtns.push(btn_homeWorld);
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
                this.node.destroy();
                GameCtr.getInstance().getStart().showStartBtns(true);
            }else if(e.target.getName()=="btn_maps"){
                if(this._mapsNode.active){return;}

                this._mapsNode.active=true;
                this._propsNode.active=false;
                this._homeWorldNode.active=false;
                this._charactersNode.active=false;
                GameData.currentShopIndex=Shop.maps;
                this.seletedLightBtn("btn_maps");
                this._mapsNode.getComponent("mapsNode").doAction();
            }else if(e.target.getName()=="btn_props"){
                if(this._propsNode.active){return;}

                this._mapsNode.active=false;
                this._propsNode.active=true;
                this._homeWorldNode.active=false;
                this._charactersNode.active=false;
                GameData.currentShopIndex=Shop.props;
                this.seletedLightBtn("btn_props");
                this._propsNode.getComponent("propsNode").doAction();
            }else if(e.target.getName()=="btn_characters"){
                if(this._charactersNode.active){return}

                this._mapsNode.active=false;
                this._propsNode.active=false;
                this._homeWorldNode.active=false;
                this._charactersNode.active=true;
                GameData.currentShopIndex=Shop.characters;
                this.seletedLightBtn("btn_characters");
                this._charactersNode.getComponent("charactersNode").doAction();
            }else if(e.target.getName()=="btn_start"){
                cc.director.loadScene('Game');
            }else if(e.target.getName()=="btn_homeWorld"){
                if(this._homeWorldNode.active){return}

                this._mapsNode.active=false;
                this._propsNode.active=false;
                this._homeWorldNode.active=true;
                this._charactersNode.active=false;
                GameData.currentShopIndex=Shop.homeWorld;
                this.seletedLightBtn("btn_homeWorld");
                this._homeWorldNode.getComponent("homeWorldNode").doAction();
            }
        })
    }

    showCurrentShop(){
        if(GameData.currentShopIndex==Shop.maps){
            this._mapsNode.active=true;
            this.seletedLightBtn("btn_maps");
        }else if(GameData.currentShopIndex==Shop.props){
            this._mapsNode.active=true;
            this.seletedLightBtn("btn_props");
        }else if(GameData.currentShopIndex==Shop.characters){
            this._charactersNode.active=true;
            this.seletedLightBtn("btn_characters");
        }else if(GameData.currentShopIndex==Shop.homeWorld){
            this._homeWorldNode.active=true;
            this.seletedLightBtn("btn_homeWorld");
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
