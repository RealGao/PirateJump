import GameData from "../../Common/GameData";
import WXCtr from "../../Controller/WXCtr";
import HttpCtr from "../../Controller/HttpCtr";
import GameCtr from "../../Controller/GameCtr";
import PromptDialog from "../view/PromptDialog";
import EventManager from "../../Common/EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class powerNotEnough extends PromptDialog {
    _bg=null;
    _btn_freeGet=null;
    _btn_askFriend=null;
    _btn_close=null;
    _lb_power=null;
    _lb_powerTime=null;

    _powerTime_min=null;
    _powerTime_sec=null;
    _shareTime=null;

    onLoad(){
        this.initNode();
        this.openAction();
        this.showPower();
        this.showPowerTime();
        this.doPowerTimeCount();
    }

    initNode(){
        this._bg=this.node.getChildByName("bg");
        this._btn_freeGet=this._bg.getChildByName("btn_freeGet");
        this._btn_askFriend=this._bg.getChildByName("btn_askFriend");
        this._btn_close=this._bg.getChildByName("btn_close");
        this._lb_power=this._bg.getChildByName("lb_power");
        this._lb_powerTime=this._bg.getChildByName("lb_timeCount");

        this._btn_askFriend.active = GameCtr.reviewSwitch;
        if (WXCtr.videoAd) {
            this._btn_freeGet.active = true;
        }

        this.initBtnEvent(this._btn_freeGet);
        this.initBtnEvent(this._btn_askFriend);
        this.initBtnEvent(this._btn_close);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_freeGet"){
                if (WXCtr.videoAd) {
                    WXCtr.showVideoAd();
                    WXCtr.onCloseVideo((res) => {
                        WXCtr.offCloseVideo();
                        if (res) {
                            let str_tip=null;
                            if(GameData.power<=79){
                                str_tip="获得20点体力";
                            }else if(GameData.power>79){
                                str_tip="获得"+(99 - GameData.power)+"点体力";
                            }
                            GameCtr.getInstance().getToast().toast(str_tip);
                            GameData.power+=20;
                            GameData.power=GameData.power>99?99:GameData.power;
                            //GameCtr.getInstance().getPublic().showPower();
                            EventManager.emit("POWER",null);
                            this.showPower();
                        }else{
                            GameCtr.getInstance().getToast().toast("视频未看完");
                        }
                    });
                }
            }else if(e.target.getName()=="btn_askFriend"){
               let callFunc=()=>{
                    let str_tip=null;
                    if(GameData.power<=89){
                        str_tip="获得10点体力";
                    }else if(GameData.power>89){
                        str_tip="获得"+(99-GameData.power)+"点体力";
                    }
                    GameCtr.getInstance().getToast().toast(str_tip);
                    GameData.power+=10;
                    GameData.power=GameData.power>99?99:GameData.power;
                    //GameCtr.getInstance().getPublic().showPower();
                    this.showPower();
                    EventManager.emit("POWER",null);
               }
                WXCtr.share({callback:callFunc});  
            }else if(e.target.getName()=="btn_close"){
                // this.node.destroy();
                super.dismiss();
            }
        })
    }


    openAction(){
        this._bg.scale=0.2;
        this._bg.stopAllActions();
        this._bg.runAction(cc.sequence(
            cc.scaleTo(0.1,1.1),
            cc.scaleTo(0.05,1.0),
        ))
    }




    doPowerTimeCount(){
        this.showPowerTime();
        this.schedule(()=>{
            this.showPowerTime();
            if(GameData.powerTime<=0){
                this.showPowerTime();   
                this.showPower();
            }
        },1,cc.macro.REPEAT_FOREVER)
    }

    showPower(){
        this._lb_power.getComponent(cc.Label).string=GameData.power+"/99";
    }

    showPowerTime(){
        // console.log("log----------showPowerTime");
        this._powerTime_min =Math.floor(GameData.powerTime/60);
        this._powerTime_sec =GameData.powerTime%60;
        this._lb_powerTime.getComponent(cc.Label).string= (this._powerTime_min>=10?this._powerTime_min:"0"+this._powerTime_min)+":"+
                                                    (this._powerTime_sec>=10?this._powerTime_sec:"0"+this._powerTime_sec);
        
    }

}
