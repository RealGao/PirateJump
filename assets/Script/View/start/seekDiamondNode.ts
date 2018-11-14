const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _lb_jewelCount=null;
    _lb_jewelSpeed=null;
    _lb_timeCount=null;
    _btn_levelUp=null;

    _timeCount=0;
    _min=0;
    _sec=0;
    _str_min='';
    _str_sec='';



    initNode(){
        this._lb_jewelCount=this.node.getChildByName('lb_jewelCount');
        this._lb_jewelSpeed=this.node.getChildByName('lb_jewelSpeed');
        this._lb_timeCount=this.node.getChildByName('lb_timeCount');
        this._btn_levelUp=this.node.getChildByName("btn_levelUp");

        this.initBtnEvent(this._btn_levelUp);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_levelUp"){
                console.log("log-------btn_levelUp--------");
            }
        })
    }

    setJewelCount(count){
        this._lb_jewelCount.getComponent(cc.Label).string=count;
    }

    setJewelSpeed(speed){
        this._lb_jewelSpeed.getComponent(cc.Label).string=speed;
    }


    startTimeCount(timeCount){
        this._timeCount=timeCount;

        this.schedule(()=>{
            this.timeCount();
        },cc.macro.REPEAT_FOREVER,1)
    }

    timeCount(){
        this._timeCount--;
        this._min=Math.floor(this._timeCount/60)
        this._sec=this._timeCount%60;
        this._str_min=this._min>=10?this._min+'':"0"+this._min;
        this._str_sec=this._sec>=10?this._sec+'':"0"+this._sec;

        this._lb_timeCount.getComponent(cc.Label).string=this._str_min+":"+this._str_sec;

        if(this._timeCount<=0){
            this.unscheduleAllCallbacks();
        }
    }



}
