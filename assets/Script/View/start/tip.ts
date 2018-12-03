const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _bg=null
    _btn_sure=null;
    _btn_close=null;
    _lb_des=null;
    _callFunc=null;
    _des=null;
    
    onLoad(){
        this._bg=this.node.getChildByName("bg");
        this._btn_sure=this._bg.getChildByName("btn_sure");
        this._btn_close=this._bg.getChildByName("btn_close");
        this._lb_des=this._bg.getChildByName('lb_des');
        this.initBtnEvent(this._btn_sure);
        this.initBtnEvent(this._btn_close);

        this.openAction();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_sure"){
                if(this._callFunc){
                    this._callFunc()
                }
            }else if(e.target.getName()=="btn_close"){
                this.node.destroy();
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

    initCallFunc(callFunc,des){
        this._callFunc=callFunc;
        this._lb_des.getComponent(cc.Label).string=des;
    }
}
