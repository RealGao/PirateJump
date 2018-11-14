import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_buy=null;
    _btn_help=null;
    _lb_count=null;
    _lb_price=null;
    _mask=null;
    _price=0;
    _count=0;
    

    onLoad(){
        this.initNode();
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
                if(GameData.gold>=this._price){
                    if(this._count>=10){return}
                    this._count++;
                    GameData.gold-=this._price;
                    this.setCount();
                }else{
                    ViewManager.toast("金币不足");
                }
            }
        })
    }

    setPrice(price){
        this._price=price;
        this._lb_price.getComponent(cc.Label).string=price;
    }

    setCount(count=null){
        if(count){
            this._count=this._count;
        }
        this._lb_count.getComponent(cc.Label).string=this._count+"/10";
        if(this._count>=10){
            this._btn_buy.opacity=150;
            this._mask.active=true;
        }else{
            this._mask.active=false;
        }
    }

    showHelp(){
       
    }
}
