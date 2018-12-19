import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import WXCtr from "../../Controller/WXCtr";
import PromptDialog from "../view/PromptDialog";

const {ccclass, property} = cc._decorator;

enum Shop{
    maps=0,
    props,
    homeWorld,
    characters,
}

@ccclass
export default class shop extends PromptDialog {
    _btnsNode=null;
    _lb_title=null;
    _mask=null;
    _tipBuyMaps=null;
    _tipBuyProps=null;
    _tipBuyCharactor=null;

    _charactersNode=null;
    _mapsNode=null;
    _propsNode=null;

    _lightBtns=[];


    onLoad(){
        this.initNode();
        GameCtr.getInstance().setShop(this);
    }

    start(){
        this.showCurrentShop();
        this.showPublic();
    }

    initNode(){
        this._charactersNode=this.node.getChildByName("charactersNode");
        this._mapsNode=this.node.getChildByName("mapsNode");
        this._propsNode=this.node.getChildByName("propsNode");

        this._btnsNode=this.node.getChildByName("btnsNode");
        this._lb_title=this.node.getChildByName("lb_title");
        this._mask=this.node.getChildByName("mask");
        this._mask.active=false;
        this.initBtnsNode();
    }

    showPublic() {
        let comp = this.node.getChildByName("publicNode").getComponent("PublicNode");
        comp.showGold();
        comp.showDiamond();
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
                GameData.submitGameData();
                super.dismiss();
            }else if(e.target.getName()=="btn_maps"){
                if(cc.find("Canvas").getChildByName("mapsNode")){return;}
                this.showMapsNode();
                GameData.currentShopIndex=Shop.maps;
                this.seletedLightBtn("btn_maps");
            }else if(e.target.getName()=="btn_props"){
                if(cc.find("Canvas").getChildByName("propsNode")){return}
                this.showPropsNode();
                GameData.currentShopIndex=Shop.props;
                this.seletedLightBtn("btn_props");
            }else if(e.target.getName()=="btn_characters"){
                if(cc.find("Canvas").getChildByName("charactersNode")){return}
                this.showCharactersNode();
                GameData.currentShopIndex=Shop.characters;
                this.seletedLightBtn("btn_characters");
            }else if(e.target.getName()=="btn_start"){
                if(GameData.power>=5){
                    cc.director.loadScene("Game");
                }else{
                    GameCtr.getInstance().getToast().toast("体力值不足");
                }
            }else if(e.target.getName()=="btn_homeWorld"){
                // if(cc.find("Canvas").getChildByName("homeWorldNode")){return}
                // this.showHomeWorldNode();
                // this.destroyMapsNode();
                // this.destroyPropsNode();
                // this.destroyCharactersNode();
                // GameData.currentShopIndex=Shop.homeWorld;
                // this.seletedLightBtn("btn_homeWorld");
            }
        })
    }

    showCurrentShop(){
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
            // this.showHomeWorldNode();
            // this.seletedLightBtn("btn_homeWorld");
        }
    }

    showMapsNode(){
        this._mapsNode.active=true;
        this._propsNode.active=false;
        this._charactersNode.active=false;
        this._mapsNode.getComponent("mapsNode").doAction();
        GameCtr.getInstance().getPublic().setGoldNodeActive(true);
        WXCtr.showMapsRecorder();
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.callFunc(()=>{
                this._mapsNode.getComponent("mapsNode").updateSubDomainCanvas();
            })
        ))
    }

    showPropsNode(){
        this._mapsNode.active=false;
        this._propsNode.active=true;
        this._charactersNode.active=false;
        GameCtr.getInstance().getPublic().setGoldNodeActive(true);
        this._propsNode.getComponent("propsNode").doAction();
        WXCtr.hideMapsRecorder();
        this._mapsNode.getComponent("mapsNode").updateSubDomainCanvas();
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.callFunc(()=>{
                this._mapsNode.getComponent("mapsNode").updateSubDomainCanvas();
            })
        ))
    }

    showCharactersNode(){
        this._mapsNode.active=false;
        this._propsNode.active=false;
        this._charactersNode.active=true;
        GameCtr.getInstance().getPublic().setGoldNodeActive(true);
        WXCtr.hideMapsRecorder();
        this._mapsNode.getComponent("mapsNode").updateSubDomainCanvas();
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.callFunc(()=>{
                this._mapsNode.getComponent("mapsNode").updateSubDomainCanvas();
            })
        ))
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
        if(!this._tipBuyMaps) return;
        if(GameData.canBuyMaps()){
            this._tipBuyMaps.active=true;
        }else{
            this._tipBuyMaps.active=false;
        }
    }

    updateBtnPropsState(){
        if(!this._tipBuyProps) return;
        if(GameData.canBuyProps()){
            this._tipBuyProps.active=true;
        }else{
            this._tipBuyProps.active=false;
        }
    }

    updateBtnCharactorsState(){
        if(!this._tipBuyCharactor) return;
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
