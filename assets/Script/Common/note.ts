const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _bg=null;
    _lb_title=null;
    _btn_close=null;
    @property(cc.Label)
    lb_des:cc.Label[]=[];

    onLoad(){
        this._bg=this.node.getChildByName("bg");
        this._lb_title=this._bg.getChildByName("lb_title");
        this._btn_close=this._bg.getChildByName("btn_close");
        this.initBtnEvent(this._btn_close);
        this.openAction();
        this.node.setLocalZOrder(10);
    }

    showNote(des){
        console.log("log-----------note=:",des);
        this._lb_title.getComponent(cc.Label).string=des.title;
        for(let i=0;i<des.des.length;i++){
            this.lb_des[i].string=des.des[i];
        }
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
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

}
