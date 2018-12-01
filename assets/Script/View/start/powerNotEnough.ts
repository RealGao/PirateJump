const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _bg=null;
    _btn_freeGet=null;
    _btn_askFriend=null;
    _btn_close=null;
    _lb_power=null;
    _lb_timeCount=null;

    onLoad(){

    }

    initNode(){
        this._bg=this.node.getChildByName("bg");
        this._btn_freeGet=this._bg.getChildByName("btn_freeGet");
        this._btn_askFriend=this._bg.getChildByName("btn_askFriend");
        this._btn_close=this._bg.getChildByName("btn_close");
        this._lb_power=this._bg.getChildByName("lb_power");
        this._lb_timeCount=this._bg.getChildByName("lb_timeCount");
    }


    openAction(){
        
    }
}
