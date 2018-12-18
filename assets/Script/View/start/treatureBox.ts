import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import Util from "../../Common/Util";
import ViewManager from "../../Common/ViewManager";
import AudioManager from "../../Common/AudioManager";
import WXCtr from "../../Controller/WXCtr";
import HttpCtr from "../../Controller/HttpCtr";


const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _bg=null;
    _btn_fight=null;
    _btn_return=null;
    _btn_open=null;
    _btn_watchVedio=null;
    _tipNode=null;
    _bonusNode=null;
    _lb_surplusTimes=null;
    _lb_timeCount=null;
    _lottery=null;
    _progress=null;
    _bonusPosArr=[];
    _bonusData=[];
    _bonusTimesArr=[];
    _timeCount=0;
    _isLotterying=false;
    _icon_time0=null;
    _icon_time1=null;
    _hour=-1;
    _min=-1;
    _sec=-1;

    onLoad(){
        this.initData();
        this.initNode();
        this.caculateTimeCount();
        this.opAction();
    }

    initData(){
        this._bonusData=[
            {gold:0,   diamond:10, prop:null,             des:"获取10颗钻石"},
            {gold:0,   diamond:0,  prop:"prop_revive",    des:"获取复活道具"},
            {gold:100, diamond:0,  prop:null,             des:"获取100颗金币"},
            {gold:0,   diamond:20, prop:null,             des:"获取20颗钻石"},
            {gold:0,   diamond:0,  prop:"prop_speedUp",   des:"获取加速道具"},
            {gold:200, diamond:0,  prop:null,             des:"获取200颗金币"},
            {gold:0,   diamond:50, prop:null,             des:"获取50颗钻石"},
            {gold:0,   diamond:0,  prop:"prop_luckyGrass",des:"获取幸运草道具"},
            {gold:500, diamond:0,  prop:null,             des:"获取500颗金币"},
            {gold:0,   diamond:0,  prop:"prop_time",      des:"获取加时器道具"},
        ]

        this._bonusPosArr=[{x:-172,y:132},{x:-53,y:132},{x:63,y:132},{x:179,y:132},{x:179,y:13},
                            {x:179,y:-105},{x:63,y:-105},{x:-53,y:-105},{x:-172,y:-105},{x:-172,y:13}]
    }

    initNode(){
        this._bg=this.node.getChildByName("bg");
        this._btn_fight=this.node.getChildByName("btn_fight");
        this._btn_return=this.node.getChildByName("btn_return");

        this._icon_time0=this._bg.getChildByName("icon_time0");
        this._icon_time1=this._bg.getChildByName("icon_time1");

        this._tipNode=this._bg.getChildByName("tipNode");
        this._bonusNode=this._bg.getChildByName("bonusNode");
        this._btn_open=this._bg.getChildByName('btn_open');
        this._btn_watchVedio=this._bg.getChildByName('btn_watchVedio');

        this._lb_surplusTimes=this._bg.getChildByName("lb_surplusTimes");
        this._lb_timeCount=this._bg.getChildByName("lb_timeCount");
        this._lottery=this._bg.getChildByName("lottery");
        this._progress=this._tipNode.getChildByName("progress");

        this.initBtnEvent(this._btn_fight);
        this.initBtnEvent(this._btn_return);
        this.initBtnEvent(this._btn_open);
        this.initBtnEvent(this._btn_watchVedio);

        if (!WXCtr.videoAd || GameCtr.surplusVideoTimes <= 0) {
            this._btn_watchVedio.active = false;
            this._icon_time0.active=false;
            this._icon_time1.active=false;
        }
        this.setLotteryTimes();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_return"){
                if(this._isLotterying){
                    GameCtr.getInstance().getToast().toast("宝箱开启中.....");
                    return;
                }
                WXCtr.setStorageData("lastLotteryTime",new Date().getTime());
                this.node.destroy();
            }else if(e.target.getName()=="btn_open"){
                if(!this._isLotterying){
                    this.doLottery();
                }else {
                    GameCtr.getInstance().getToast().toast("宝箱开启中.....");
                }
            }else if(e.target.getName()=="btn_fight"){
                if(GameData.power>=5){
                    cc.director.loadScene("Game");
                }else{
                    GameCtr.getInstance().getToast().toast("体力值不足");
                }
            }else if(e.target.getName()=="btn_watchVedio"){
                if (WXCtr.videoAd) {
                    WXCtr.showVideoAd();
                    WXCtr.onCloseVideo((res) => {
                        WXCtr.offCloseVideo();
                        if (res) {
                            GameData.lotteryTimes+=2;
                            GameData.lotteryTimes=GameData.lotteryTimes>10?10:GameData.lotteryTimes;
                            this.setLotteryTimes();
                        }else{
                            GameCtr.getInstance().getToast().toast("视频未看完");
                        }
                    });
                }
            }
        })
    }



    setLotteryTimes(){
        this._lb_surplusTimes.getComponent(cc.Label).string="("+GameData.lotteryTimes+"/"+10+")";
        this._progress.getComponent(cc.ProgressBar).progress=GameData.lotteryTimes/10;
    }


    doLottery(){

        if(GameData.lotteryTimes<=0){
            GameCtr.getInstance().getToast().toast("开宝箱次数不足");
            return;
        }
        this._isLotterying=true;
        GameData.lotteryTimes--;
        this.setLotteryTimes();
        this._lottery.active=true;
        let random=Math.floor(Math.random()*10)+20;
        let currentIndex=this.getLotteryIndex();
        let index=0;
        for(let i=0;i<random;i++){
            let delayTime=0;
            if(random-i==3){
                delayTime=0.3
            }else if(random-i==2){
                delayTime=0.7
            }else if(random-i==1){
                delayTime=1.2
            }
            this.node.runAction(cc.sequence(
                cc.delayTime(0.1*i+delayTime),
                cc.callFunc(()=>{
                    index++;
                    currentIndex++;
                    currentIndex=currentIndex>=10?0:currentIndex;
                    this._lottery.x=this._bonusPosArr[currentIndex].x;
                    this._lottery.y=this._bonusPosArr[currentIndex].y;
                    if(index==random){
                        this.getBonus(currentIndex)
                    }
                })
            ))
        }
    }


    getLotteryIndex(){
        for(let i=0;i<this._bonusPosArr.length;i++){
            if(this._lottery.x==this._bonusPosArr[i].x && this._lottery.y==this._bonusPosArr[i].y){
                return i;
            }
        }
        return null;
    }



    getBonus(index){
        this._isLotterying=false;
        let bonus=this._bonusData[index];

        if(bonus.diamond>0){
            GameData.diamond+=bonus.diamond;
            // GameCtr.getInstance().getPublic().showDiamond();
        }

        if(bonus.gold>0){
            GameData.gold+=bonus.gold;
            // GameCtr.getInstance().getPublic().showGold();
        }

        if(bonus.prop){
            if(GameData[bonus.prop]>=10){
                GameCtr.getInstance().getToast().toast("该道具已满"); 
                return;
            }
            GameData[bonus.prop]+=1;
        }
        GameCtr.getInstance().getToast().toast(bonus.des); 
    }

    caculateTimeCount(){
        let timeIterval=Math.floor((new Date().getTime()-GameData.lastTime)/1000);
        let timeIterval1=Math.floor((new Date().getTime()-WXCtr.getStorageData("lastLotteryTime",0))/1000);
        if(timeIterval1<timeIterval){
            timeIterval=timeIterval1;
        }

        let interval_hour=Math.floor(timeIterval/3600);

        
        this._bonusTimesArr=[4,8,12,16,20,24];
        let date=new Date();
        let hour=date.getHours();
        let min=date.getMinutes();
        let sec=date.getSeconds();
        if(min*60+sec<timeIterval%3600){
            interval_hour+=1;
        }
        let pre_hour= hour-interval_hour;
        console.log("log---------timeIterval pre_hour currentSec  lastSec  =:",timeIterval,pre_hour,min*60+sec, timeIterval%3600);
        for(let i=pre_hour+1;i<hour;i++ ){
            for(let j=0; j<this._bonusTimesArr.length;j++){
                if(i==this._bonusTimesArr[j]){
                    GameData.lotteryTimes++;
                    GameData.lotteryTimes=GameData.lotteryTimes>=10?10:GameData.lotteryTimes;
                }
            }
        }

    


        for(let i=0;i<this._bonusTimesArr.length;i++){

            if(this._bonusTimesArr[i]-hour>0){
                this._timeCount= (this._bonusTimesArr[i]-1-hour)*3600+ (59-min)*60 +(60-sec);
                this.timeCount()
                return;
            }
        }

        this.setLotteryTimes();
    }

    timeCount(){
        if(this._timeCount==0){
            GameData.lotteryTimes++;
            GameData.lotteryTimes=GameData.lotteryTimes>=10?10:GameData.lotteryTimes;
            this._timeCount=14400;
        }
        this._hour=Math.floor(this._timeCount/3600);
        this._min=Math.floor(this._timeCount%3600/60);
        this._sec=Math.floor(this._timeCount%60);

        let str_hour=this._hour<10?"0"+this._hour:this._hour+"";
        let str_min=this._min<10?"0"+this._min:this._min+"";
        let str_sec=this._sec<10?"0"+this._sec:this._sec+"";

        this._lb_timeCount.getComponent(cc.Label).string=str_hour+":"+str_min+":"+str_sec;
        this._timeCount--;
        this.scheduleOnce(()=>{
            this.timeCount()
        },1);
    }

    opAction(){
        this._bg.scale=0.2;
        this._bg.stopAllActions();
        this._bg.runAction(cc.sequence(
            cc.scaleTo(0.1,1.1),
            cc.scaleTo(0.05,1.0),
        ))
    }

}
