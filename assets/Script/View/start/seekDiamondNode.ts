import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _lb_jewelCount=null;
    _lb_jewelSpeed=null;
    _lb_timeCount=null;
    _btn_levelUp=null;
    _lb_price=null;
    _price=null;

    _hour=0
    _min=0;
    _sec=0;
    _str_hour='';
    _str_min='';
    _str_sec='';

    onLoad(){
        this.initNode();
        this.initJewelTime();
        this.updateJewel();
    }


    initNode(){
        this._btn_levelUp=this.node.getChildByName("btn_levelUp");
        this._lb_price=this._btn_levelUp.getChildByName("lb_price");
        this._lb_jewelCount=this.node.getChildByName('lb_jewelCount');
        this._lb_jewelSpeed=this.node.getChildByName('lb_jewelSpeed');
        this._lb_timeCount=this.node.getChildByName('lb_timeCount');
        this.initBtnEvent(this._btn_levelUp);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_levelUp"){
                if(GameData.gold>=GameData.getJewelLevelUpPrice()){
                    GameData.jewelLevel+=1;
                    GameData.gold-=GameData.getJewelLevelUpPrice();
                    GameCtr.getInstance().getStart().showGold();
                    GameData.jewelTimeCount=GameData.getJewelProductionCycle()*60;
                    this.updateJewel();
                }else{
                    ViewManager.toast("金币不足")
                }
            }
        })
    }


    initJewelTime(){
        let jewelTimeCount=WXCtr.getStorageData("jewelTimeCount",-1);
        jewelTimeCount=-1;
        if(jewelTimeCount<0){
            this.startTimeCount(GameData.getJewelProductionCycle()*60);
        }else{
            let timeIterval=(new Date().getTime()-WXCtr.getStorageData("lastTime"))/1000;
            if(timeIterval-jewelTimeCount>=0){
                GameData.jewelCount+=GameData.getJewelOutPut();
                timeIterval-=jewelTimeCount;

                let cycle=Math.floor(timeIterval/GameData.getJewelProductionCycle()*60);
                GameData.jewelCount+=cycle*GameData.getJewelOutPut();
                let timeCount=timeIterval-cycle*GameData.getJewelProductionCycle()*60;
                this.startTimeCount(timeCount)
            }
        }
    }

    setJewelSpeed(speed){
        this._lb_jewelSpeed.getComponent(cc.Label).string=speed;
    }


    startTimeCount(timeCount){
        GameData.jewelTimeCount=timeCount;
        this.formatTime();
        this._lb_timeCount.getComponent(cc.Label).string=this._str_min+":"+this._str_sec;
        console.log("log--------GameData.jewelTimeCount=:",GameData.jewelTimeCount);
        this.schedule(()=>{
            this.timeCount();
        },1,cc.macro.REPEAT_FOREVER,0)
    }

    timeCount(){
        GameData.jewelTimeCount--;
        this.formatTime();
        this._lb_timeCount.getComponent(cc.Label).string=this._str_hour+':'+this._str_min+":"+this._str_sec;

        if(GameData.jewelTimeCount<=0){
            GameData.jewelCount+=GameData.getJewelOutPut();
            this._lb_jewelCount.getComponent(cc.Label).string=GameData.jewelCount;
            GameData.jewelTimeCount=GameData.getJewelProductionCycle()*60;
        }
    }

    formatTime(){
        this._hour=Math.floor(GameData.jewelTimeCount/3600);
        this._min=Math.floor(GameData.jewelTimeCount%3600/60)
        this._sec=GameData.jewelTimeCount%60;

        this._str_hour=this._hour>=10?this._hour+'':"0"+this._hour;
        this._str_min=this._min>=10?this._min+'':"0"+this._min;
        this._str_sec=this._sec>=10?this._sec+'':"0"+this._sec;
    }

    updateJewel(){
        this._price=GameData.getJewelLevelUpPrice();
        this._lb_price.getComponent(cc.Label).string=this._price;
        this._lb_jewelCount.getComponent(cc.Label).string=GameData.jewelCount;
        if(GameData.jewelLevel<=0){
            this._lb_jewelSpeed.getComponent(cc.Label).string='';
        }else{
            this._lb_jewelSpeed.getComponent(cc.Label).string=GameData.getJewelOutPut()+"/"+GameData.getJewelProductionCycle()/60+"小时";
        }
    }



}
