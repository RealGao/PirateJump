import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_buy=null;
    _btn_help=null;
    _lb_count=null;
    _lb_price=null;
    _mask=null;
    _info=null;

    @property(cc.Prefab)
    pfNote:cc.Prefab=null;
   
    
    init(info){
        console.log("log------propItem initInfo=:",info);
        this._info=info;
        this.initNode();
        this.showPrice();
        this.showCount();
    }
        
    
    initNode(){
        this._mask=this.node.getChildByName("mask");
        this._btn_buy=this.node.getChildByName("btn_buy");
        this._btn_help=this.node.getChildByName("btn_help");
        this._lb_count=this.node.getChildByName("lb_count");
        this._lb_price=this._btn_buy.getChildByName("lb_price");
        
        this._mask.active=false;

        this.initBtnEvent(this._btn_buy);
        this.initBtnEvent(this._btn_help);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_help"){
                this.showDes();
            }else if(e.target.getName()=="btn_buy"){
                this.doBuy();
                
            }
        })
    }

    doBuy(){
        if(this._info.priceGold>0){
            if(GameData.gold>=this._info.priceGold){
                if(GameData.getProp(this._info.name)>=10){return}
                AudioManager.getInstance().playSound("audio/buy");
                GameData.addProp(this._info.name);
                GameData.gold-=this._info.priceGold;
                GameCtr.getInstance().getPublic().showGold();
                if(cc.director.getScene().name=="Start"){
                    GameCtr.getInstance().getStart().updateBtnShopState();
                }
                GameCtr.getInstance().getPublic().upBtnsState();
                this.showCount();
            }else{
                GameCtr.getInstance().getToast().toast("金币不足");
            }
        }else if(this._info.priceDiamond>0){
            if(GameData.diamond>=this._info.priceDiamond){
                if(GameData.getProp(this._info.name)>=10){return}
                AudioManager.getInstance().playSound("audio/buy");
                GameData.addProp(this._info.name);
                GameData.diamond-=this._info.priceDiamond;
                GameCtr.getInstance().getPublic().showDiamond();
                if(cc.director.getScene().name=="Start"){
                    GameCtr.getInstance().getStart().updateBtnShopState();
                }
                GameCtr.getInstance().getPublic().upBtnsState();
                this.showCount();
            }else{
                GameCtr.getInstance().getToast().toast("钻石不足");
            }
        }
    }

    showPrice(){
        if(this._info.priceGold>0){
            this._lb_price.getComponent(cc.Label).string=this._info.priceGold;
        }else if(this._info.priceDiamond>0){
            this._lb_price.getComponent(cc.Label).string=this._info.priceDiamond;
        }
        
    }

    showCount(){
        this._lb_count.getComponent(cc.Label).string=GameData.getProp(this._info.name)+"/10";
        if(GameData.getProp(this._info.name)>=10){
            this._btn_buy.opacity=150;
            this._mask.active=true;
        }else{
            this._mask.active=false;
        }
    }

    showDes(){
        if(cc.find("Canvas").getChildByName("note")){
            return;
        }
        let des=cc.instantiate(this.pfNote);
        des.parent=cc.find("Canvas");
        des.getComponent("note").showNote(this._info);
    }
}
