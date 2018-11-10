import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_help=null;
    _btn_buy=null;
    _lb_level=null;
    _lb_price=null;
    _icon_seleted=null;
    _icon_seletedFrame=null;
    _progress=null;

    _price=0;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this._btn_buy=this.node.getChildByName("btn_buy");
        this._btn_help=this.node.getChildByName("btn_help");
        this._lb_level=this.node.getChildByName("lb_level");
        this._lb_price=this._btn_buy.getChildByName("lb_price");
        this._icon_seleted=this.node.getChildByName("icon_seleted");
        this._icon_seletedFrame=this.node.getChildByName("icon_seletedFrame");
        this._progress=this.node.getChildByName("progress");
      
        this._lb_price.getComponent(cc.Label).string=this._price;
        this._icon_seleted.active=false;
        this._icon_seletedFrame.active=false;

        this.initBtnEvent(this._btn_buy);
        this.initBtnEvent(this._btn_help);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_buy"){
                if(GameData.gold>=this._price){
                    GameData.gold-=this._price;
                    this._btn_buy.active=false;
                    this.node.getComponent(cc.Button).interactable=true;
                }else{
                    ViewManager.toast("金币不足")
                }
            }else if(e.target.getName()=="btn_help"){
                //this.showHelp();
            }
        })
    }

    initPrice(price){
        this._price=price;
        if(this._lb_price){
            this._lb_price.getComponent(cc.Label).string=this._price;
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
