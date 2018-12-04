import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_help=null;
    _btn_buy=null;
    _btn_upLevel=null;
    _lb_level=null;
    _starsNode=null;
    _lb_priceGet=null;
    _lb_priceUpLevel=null;
    _icon_prop=null;
    _bg=null;

    _name=null;
    _level=null;
    _priceGet=null;
    _priceLevelUp=null;
    _initialDamage=null;
    _bonusDamage=null;
    _mask=null;

    @property(cc.SpriteFrame)
    starFrames:cc.SpriteFrame[]=[];
    

    init(info){
        this.initData(info);
        this.initNode();
        this.initStars();
        this.initLockState();
    }

    initData(info){
        this._name=info.name;
        this._priceGet=info.priceGet;
        this._priceLevelUp=info.priceUpLevel;
        this._initialDamage=info.initialDamage;
        this._bonusDamage=Math.floor(GameData.getHomeWorldPropLevel(this._name)/10);
    }

    initNode(){
        this._bg=this.node.getChildByName("bg");
        this._mask=this.node.getChildByName("mask");
        this._icon_prop=this.node.getChildByName("icon_prop");
        this._btn_buy=this.node.getChildByName("btn_buy");
        this._btn_help=this.node.getChildByName("btn_help");
        this._btn_upLevel=this.node.getChildByName("btn_upLevel");
        
        this._lb_level=this.node.getChildByName("lb_level");
        this._starsNode=this.node.getChildByName("starsNode");

        this._lb_priceGet=this._btn_buy.getChildByName("lb_price");
        this._lb_priceUpLevel=this._btn_upLevel.getChildByName("lb_price");

        this._mask.active=false;
        this._btn_buy.active=false;
        this._btn_upLevel.active=false;


        this._lb_level.getComponent(cc.Label).string=GameData.getHomeWorldPropLevel(this._name);
        this._lb_priceGet.getComponent(cc.Label).string=this._priceGet;
        this._lb_priceUpLevel.getComponent(cc.Label).string=this._priceLevelUp;

        this.initBtnEvent(this._btn_buy);
        this.initBtnEvent(this._btn_help);
        this.initBtnEvent(this._btn_upLevel);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_buy"){
                console.log("log-----------clickBtnBuy----------");
                this.doBuy();
            }else if(e.target.getName()=="btn_help"){
                console.log("log-----------clickBtnHelp----------");
                this.showHelp();
            }else if(e.target.getName()=="btn_upLevel"){
                console.log("log-----------clickBtnLevelUP----------");
                this.doLevelUp();
            }
        })
    }


    initStars(){
        for(let i=0;i<this._starsNode.children.length;i++){
            this._starsNode.children[i].active=false;
        }

        for(let i=0;i<this._initialDamage;i++){
            let star=this._starsNode.getChildByName('star'+i);
            star.active=true;
            star.getComponent(cc.Sprite).spriteFrame=this.starFrames[0]
        }

        for(let i=this._initialDamage;i<this._bonusDamage+this._initialDamage;i++){
            let star=this._starsNode.getChildByName('star'+i); 
            star.active=true;
            star.getComponent(cc.Sprite).spriteFrame=this.starFrames[1]
        }
    }



    doBuy(){
        if(GameData.diamond>=this._priceGet){
            GameData.diamond-=this._priceGet;
            GameData.homeWorldPropLevelUp(this._name);
            GameCtr.getInstance().getPublic().showDiamond();
            if(cc.director.getScene().name=="Start"){
                GameCtr.getInstance().getStart().updateBtnShopState();
            }else if(cc.director.getScene().name=="Game"){
                GameCtr.ins.mGameOver.updateBtnShopState();
            }
            GameCtr.getInstance().getPublic().upBtnsState();
            this.setLevel();
            this.updateHomeWorldProps();
            this._btn_buy.active=false;
            this._btn_upLevel.active=true;

        }else{
            GameCtr.getInstance().getToast().toast("钻石不足");
        }
    }

    showHelp(){

    }

    doLevelUp(){
        if(GameData.diamond>=this._priceLevelUp){
            GameData.diamond-=this._priceLevelUp;
            GameData.homeWorldPropLevelUp(this._name);
            GameCtr.getInstance().getPublic().showDiamond();
            if(cc.director.getScene().name=="Start"){
                GameCtr.getInstance().getStart().updateBtnShopState();
            }else if(cc.director.getScene().name=="Game"){
                GameCtr.ins.mGameOver.updateBtnShopState();
            }
            GameCtr.getInstance().getPublic().upBtnsState();
            this.setLevel();
            this.updateHomeWorldProps();
            this._btn_buy.active=false;
            this._btn_upLevel.active=true;
        }else{
            GameCtr.getInstance().getToast().toast("钻石不足");
        }
    }

    initLockState(){
        if(GameData.getHomeWorldPropLevel(this._name)>0){
            /*已购买*/
            this._btn_buy.active=false;
            this._btn_upLevel.active=true;
            this._bg.getComponent(cc.Button).interactable=true;
            this._icon_prop.getComponent(cc.Button).interactable=true;
            this.setBtnState(this._btn_upLevel,this._priceLevelUp);
        }else{
            /*未购买*/
            this._btn_buy.active=true;
            this._btn_upLevel.active=false;
            this._bg.getComponent(cc.Button).interactable=false;
            this._icon_prop.getComponent(cc.Button).interactable=false;
            this.setBtnState(this._btn_buy,this._priceGet);
        }
       
    }

    updateHomeWorldProps(){
        this.node.parent.parent.getComponent("propsNode").updateHomeWorldPropsBtnsState();
    }

    setBtnState(btn,price){
        if(GameData.diamond>=price){
            this._mask.active=false;
            btn.opacity=255;
        }else{
            this._mask.active=true;
            btn.opacity=150;
        }
    }

    setLevel(){
        this._lb_level.getComponent(cc.Label).string=GameData.getHomeWorldPropLevel(this._name);
    }
}
