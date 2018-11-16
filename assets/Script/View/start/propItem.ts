import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_buy=null;
    _btn_help=null;
    _lb_count=null;
    _lb_price=null;
    _mask=null;
    _info={name:null,price:null};
   
    
    init(info){
        console.log("log------propItem initInfo=:",info);
        this._info.name=info.name;
        this._info.price=info.price;

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
                this.showHelp();
            }else if(e.target.getName()=="btn_buy"){
                if(GameData.gold>=this._info.price){
                    if(GameData.getProp(this._info.name)>=10){return}
                    GameData.addProp(this._info.name);
                    GameData.gold-=this._info.price;
                    GameCtr.getInstance().getStart().showGold();
                    GameCtr.getInstance().getStart().updateBtnShopState();
                    GameCtr.getInstance().getShop().upBtnsState();
                    this.showCount();
                }else{
                    ViewManager.toast("金币不足");
                }
            }
        })
    }

    showPrice(){
        this._lb_price.getComponent(cc.Label).string=this._info.price;
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

    showHelp(){
       
    }
}
