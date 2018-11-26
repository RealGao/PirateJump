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
    _btn_close=null;
    _btn_open=null;
    _btn_buy=null;
    _btn_watchVedio=null;
    _tipNode=null;
    _bonusNode=null;
    _lb_surplusTimes=null;
    _lb_timeCount=null;
    _lottery=null;
    _progress=null;
    _bonusArr=[];
    _bonusData=[];
    _bonusTimesArr=[];
    _timeCount=0;
    _isLotterying=false;

    _tipWatchVedio=null;
    _tipBuy=null;

    _hour=-1;
    _min=-1;
    _sec=-1;

    onLoad(){
        this.initLotteryTimes();
        this.initData();
        this.initNode();
        this.initBonus();
        this.caculateTimeCount();
    }

    initLotteryTimes(){
        let lottery=localStorage.getItem("lottery")
        if(!lottery){
            GameData.lotteryTimes=10;
        }else{
            let lotteryObj=JSON.parse(lottery);
            if(lotteryObj.day==Util.getCurrTimeYYMMDD()){
                GameData.lotteryTimes=lotteryObj.times;
            }else{
                GameData.lotteryTimes=lotteryObj.times+5;
                GameData.lotteryTimes=GameData.lotteryTimes>10?10:GameData.lotteryTimes;
            }
        }
    }


    initData(){
        this._bonusData=[
            {gold:0,   diamond:10, propIndex:-1},
            {gold:0,   diamond:0,  prop:"prop_revive"},//"复活"
            {gold:100, diamond:0,  propIndex:-1},
            {gold:0,   diamond:20, propIndex:-1},
            {gold:0,   diamond:0,  prop:"prop_speedUp"},//转速
            {gold:200, diamond:0,  propIndex:-1},
            {gold:0,   diamond:50, propIndex:-1},
            {gold:0,   diamond:0,  prop:"prop_luckyGrass"},//幸运草
            {gold:200, diamond:0,  propIndex:-1},
            {gold:0,   diamond:0,  prop:"prop_time"},//加时器
        ]
    }

    initNode(){
        this._tipNode=this.node.getChildByName("tipNode");
        this._bonusNode=this.node.getChildByName("bonusNode");
        this._btn_close=this.node.getChildByName('btn_close');
        this._btn_open=this.node.getChildByName('btn_open');
        this._btn_buy=this.node.getChildByName('btn_buy');
        this._btn_watchVedio=this.node.getChildByName('btn_watchVedio');

        this._lb_surplusTimes=this.node.getChildByName("lb_surplusTimes");
        this._lb_timeCount=this.node.getChildByName("lb_timeCount");
        this._lottery=this.node.getChildByName("lottery");
        this._progress=this._tipNode.getChildByName("progress");
        this._tipWatchVedio=this._tipNode.getChildByName('tip01');
        this._tipBuy=this._tipNode.getChildByName("tip02");

        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_open);
        this.initBtnEvent(this._btn_buy);
        this.initBtnEvent(this._btn_watchVedio);

        if (!WXCtr.videoAd || GameCtr.surplusVideoTimes <= 0) {
            this._btn_watchVedio.active = false;
            this._tipWatchVedio.active=false;
            this._btn_buy.x=0;
            this._tipBuy.x=0;
        }

        this.setLotteryTimes();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/click", false);
            if(e.target.getName()=="btn_close"){
                if(this._isLotterying){
                    ViewManager.toast("宝箱开启中.....");
                    return;
                }
                this.node.destroy();
            }else if(e.target.getName()=="btn_open"){
                if(!this._isLotterying){
                    this.doLottery();
                }else {
                    ViewManager.toast("宝箱开启中.....");
                }
            }else if(e.target.getName()=="btn_buy"){
                this.buyLotteryTimes();
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
                            ViewManager.toast("视频未看完");
                        }
                    });
                    HttpCtr.clickStatistics(GameCtr.StatisticType.OFF_LINE_VEDIO);          //离线视频收益点击统计
                }
            }
        })
    }

    initBonus(){
        for(let i=0;i<10;i++){
            let bonus=this._bonusNode.getChildByName("bonus"+i);
            let bonusName=bonus.getChildByName("lbName");
            this._bonusArr.push(bonus);
        }
    }

    setLotteryTimes(){
        this._lb_surplusTimes.getComponent(cc.Label).string="("+GameData.lotteryTimes+"/"+10+")";
        this._progress.getComponent(cc.ProgressBar).progress=GameData.lotteryTimes/10;
    }


    doLottery(){
        if(this.isAirPortFull()){
            ViewManager.toast("没有空的机位");
            return;
        }

        if(GameData.lotteryTimes<=0){
            ViewManager.toast("开宝箱次数不足");
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
                    this._lottery.x=this._bonusArr[currentIndex].x;
                    this._lottery.y=this._bonusArr[currentIndex].y;
                    if(index==random){
                        this.getBonus(currentIndex)
                        //GameData.setMissonData("boxTimes", GameData.missionData.boxTimes+1);
                    }
                })
            ))
        }
    }


    getLotteryIndex(){
        for(let i=0;i<this._bonusArr.length;i++){
            if(this._lottery.x==this._bonusArr[i].x && this._lottery.y==this._bonusArr[i].y){
                return i;
            }
        }
        return null;
    }

    buyLotteryTimes(){
        if(GameData.lotteryTimes==10){
            ViewManager.toast("开宝箱次数已满");
        }

        if(GameData.diamond>=50){
            GameData.lotteryTimes++;
            GameData.lotteryTimes=GameData.lotteryTimes>10?10:GameData.lotteryTimes;
            this.setLotteryTimes();
            GameData.diamond-=50
            GameCtr.getInstance().getStart().showDiamond();;
        }else{
            ViewManager.toast("钻石不足");
        }
    }

    getBonus(index){
        this._isLotterying=false;
        let bonus=this._bonusData[index];
        if(bonus.airLevel>0){
            for(let i=0;i<GameCtr.selfPlanes.length;i++){
                if(GameCtr.selfPlanes[i]==0){
                    GameCtr.selfPlanes[i]=bonus.airLevel;
                    ViewManager.toast("获得"+bonus.airLevel+"级飞机");
                    GameCtr.getInstance().getGame().addPlane(bonus.airLevel);
                    return;
                }
            }
            ViewManager.toast("没有空的机位");
        }

        if(bonus.diamond>0){
            GameData.diamonds+=bonus.diamond;
            GameCtr.getInstance().getGame().setDiamonds();
            ViewManager.toast("获得"+bonus.diamond+"钻石"); 
        }
    }

    isAirPortFull(){
        for(let i=0;i<GameCtr.selfPlanes.length;i++){
            if(GameCtr.selfPlanes[i]<=0){
                return false;
            }
        }
        return true;
    }

    caculateTimeCount(){
        this._bonusTimesArr=[4,8,12,16,20,24];
        let date=new Date();
        let hour=date.getHours();
        let min=date.getMinutes();
        let sec=date.getSeconds();
       
        for(let i=0;i<this._bonusTimesArr.length;i++){
            if(this._bonusTimesArr[i]-hour>0){
                this._timeCount= (this._bonusTimesArr[i]-1-hour)*3600+ (59-min)*60 +(60-sec);
                this.timeCount()
                return;
            }
        }
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



}
