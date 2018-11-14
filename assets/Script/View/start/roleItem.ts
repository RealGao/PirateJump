import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _mask=null;
    _btn_help=null;
    _btn_buy=null;
    _lb_level=null;
    _lb_price=null;
    _icon_seleted=null;
    _icon_seletedFrame=null;
    _progress=null;
    _roleInfo={name:"",level:0,gold:0,diamond:0};

    init(info){
        this.initInfo(info);
        this.initNode();
    }

    initInfo(info){
        this._roleInfo.gold=info.gold;
        this._roleInfo.diamond=info.diamond;
        this._roleInfo.name=info.name;
        this._roleInfo.level=GameData.getRoleLevelByName(info.name);
    }

    initNode(){
        this._mask=this.node.getChildByName("mask");
        this._btn_buy=this.node.getChildByName("btn_buy");
        this._btn_help=this.node.getChildByName("btn_help");
        this._lb_level=this.node.getChildByName("lb_level");
        this._lb_price=this._btn_buy.getChildByName("lb_price");
        this._icon_seleted=this.node.getChildByName("icon_seleted");
        this._icon_seletedFrame=this.node.getChildByName("icon_seletedFrame");
        this._progress=this.node.getChildByName("progress");

        
      
        this._icon_seleted.active=false;
        this._icon_seletedFrame.active=false;

        this.initBtnEvent(this._btn_buy);
        this.initBtnEvent(this._btn_help);
        this.showLevel();
        this.showPrice();
        this.showBtnBuyState();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_buy"){
                this.doBuy();
                console.log("log-------点击购买----------");
            }else if(e.target.getName()=="btn_help"){
                //this.showHelp();
            }
        })
    }

    doBuy(){
        if(this._roleInfo.gold>0){
            if(GameData.gold>=this._roleInfo.gold){
                GameData.gold-=this._roleInfo.gold;
                GameCtr.getInstance().getStart().showGold();
                GameData.doUpRoleLevelByName(this._roleInfo.name);
                this.node.parent.parent.getComponent("charactersNode").hideSeletedStates();
                this.node.parent.parent.getComponent("charactersNode").updateRoleBtnState();
                this.showLevel();
                this.setSeletedState(true);
                this._btn_buy.active=false;
                this.node.getComponent(cc.Button).interactable=true;
            }else{
                ViewManager.toast("金币不足")
            }
        }
        
        if(this._roleInfo.diamond>0){
            if(GameData.diamond>=this._roleInfo.diamond){
                GameData.diamond-=this._roleInfo.diamond;
                GameCtr.getInstance().getStart().showDiamond();
                GameData.doUpRoleLevelByName(this._roleInfo.name);
                this.node.parent.parent.getComponent("charactersNode").hideSeletedStates();
                this.node.parent.parent.getComponent("charactersNode").updateRoleBtnState();
                this.showLevel();
                this.setSeletedState(true);
                this._btn_buy.active=false;
                this.node.getComponent(cc.Button).interactable=true;
            }else{
                ViewManager.toast("钻石不足")
            }
        }
    }

    showPrice(){
        if(this._lb_price){
            if(this._roleInfo.gold>0){
                this._lb_price.getComponent(cc.Label).string=this._roleInfo.gold;
            }
            if(this._roleInfo.diamond>0){
                this._lb_price.getComponent(cc.Label).string=this._roleInfo.diamond;
            }
        }
    }

    showLevel(){
        this._lb_level.getComponent(cc.Label).string=GameData.getRoleLevelByName(this._roleInfo.name);
    }

    getLevel(){
        return GameData.getRoleLevelByName(this._roleInfo.name);
    }

    showBtnBuyState(){
        if(GameData.getRoleLevelByName(this._roleInfo.name)){//已解锁
            this._btn_buy.active=false;
            this._mask.active=false;
            this.setLockState(true);
        }else{
            this.setLockState(false);
            this._btn_buy.active=true;
            this._mask.active=true;
            if(GameData.gold>=this._roleInfo.gold && GameData.diamond>=this._roleInfo.diamond){
                this._btn_buy.opacity=255;
                this._btn_buy.getComponent(cc.Button).interactable=true;
            }else{
                this._btn_buy.opacity=150;
                this._btn_buy.getComponent(cc.Button).interactable=false;
            }
        }
    }

    setLockState(lock){
        this.node.getComponent(cc.Button).interactable=lock;
    }

    setSeletedState(bool){
        this._icon_seleted.active=bool;
        this._icon_seletedFrame.active=bool;
    }

}
