import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _icon_seleted=null;
    _lb_recordHolder=null;
    _starsNode=null;
    _btn_buy=null;
    _lb_price=null;
    _iconGold=null;
    _iconDiamond=null;
    _mask=null;
    _price={gold_price:null,diamond_price:null};
    _name=null;


    init(info){
        this._price.gold_price=info.gold_price;
        this._price.diamond_price=info.diamond_price;
        this._name=info.name;

        this.initNode();
        this.showPrice();
        this.showMapState();
        this.showBtnBuyState();
    }

    initNode(){
        this._mask=this.node.getChildByName("mask");
        this._btn_buy=this.node.getChildByName("btn_buy");
        this._lb_price=this._btn_buy.getChildByName("lb_price");
        this._iconGold=this._btn_buy.getChildByName("icon_gold");
        this._iconDiamond=this._btn_buy.getChildByName("icon_diamond");

        this._icon_seleted=this.node.getChildByName('icon_seleted');
        this._lb_recordHolder=this.node.getChildByName("champion_frame").getChildByName("lb_recordHolder");
    
        this._starsNode=this.node.getChildByName("starsNode");
        for(let i=0;i<this._starsNode.children.length;i++){
            this._starsNode.children[i].active=false;
        }

        this._mask.active=false;
        this._btn_buy.active=false;
        this._lb_price.active=false;
        this._iconGold.active=false;
        this._iconDiamond.active=false;
        this._icon_seleted.active=false;
       
        this.initBtnEvent(this._btn_buy);
    }

    
    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_buy"){
                this.doBuy();
            }
        })
    }

    showRecordHolder(recordHolder){
        this._lb_recordHolder.getComponent(cc.Label).string=recordHolder.name;
    }

    showPrice(){
        if(this._price.gold_price<=0 && this._price.diamond_price<=0){
            return;
        }
        this._btn_buy.active=true;
        this._lb_price.active=true;
        if(this._price.gold_price>0){
            this._iconGold.active=true;
            this._lb_price.getComponent(cc.Label).string=this._price.gold_price;
        }
        if(this._price.diamond_price>0){
            this._iconDiamond.active=true;
            this._lb_price.getComponent(cc.Label).string=this._price.diamond_price;
        }
    }

    doBuy(){
        if(this._price.gold_price>0){
            if(GameData.gold>=this._price.gold_price){
                GameData.gold-=this._price.gold_price;
                GameCtr.getInstance().getStart().showGold();
                GameCtr.getInstance().getStart().updateBtnShopState();
                GameCtr.getInstance().getShop().upBtnsState();
                this._btn_buy.active=false;
                this.setLockState(true);
                GameData.setMapStateByName(this._name,0)
            }else{
                ViewManager.toast("金币不足");
            }
        }

        if(this._price.diamond_price>0){
            if(GameData.diamond>=this._price.diamond_price){
                GameData.diamond-=this._price.diamond_price;
                GameCtr.getInstance().getStart().showDiamond();
                GameCtr.getInstance().getStart().updateBtnShopState();
                GameCtr.getInstance().getShop().upBtnsState();
                this._btn_buy.active=false;
                this.setLockState(true);
                GameData.setMapStateByName(this._name,0)
            }else{
                ViewManager.toast("钻石不足");
            }
        }
    }

    setLockState(lock){
        this.node.getComponent(cc.Button).interactable=lock;
    }

    setSeletedState(bool){
        this._icon_seleted.active=bool;
    }


    showMapState(){
        if(GameData.getMapStateByName(this._name)<0){
            /* 未解锁 */
            this.setLockState(false);
        }else{
            /* 已解锁 */
            this.setLockState(true);
            this.showStars()
        }
    }

    showBtnBuyState(){
        if(GameData.getMapStateByName(this._name)>=0){
            /* 已解锁 */
            this._btn_buy.active=false;
        }else {
            /* 未解锁 */
            this._btn_buy.active=true;
            if(GameData.gold>this._price.gold_price && GameData.diamond>=this._price.diamond_price){
                /* 满足解锁条件 */
                this._btn_buy.opacity=255;
                this._mask.active=false;
            }else{
                /* 不满足解锁条件 */
                this._btn_buy.opacity=150;
                this._mask.active=true;
            }
        }
    }

    showStars(){
        for(let i=0;i<GameData.getMapStateByName(this._name);i++){
            let star=this._starsNode.getChildByName("star"+i);
            star.ative=true;
        }
    }

    getState(){
        return GameData.getMapStateByName(this._name);
    }
}