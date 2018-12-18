import PromptDialog from "../View/view/PromptDialog";

const {ccclass, property} = cc._decorator;
@ccclass
export default class note extends PromptDialog {

    _bg=null;
    _lb_title=null;
    _lb_des=null;
    _btn_close=null;
  

    onLoad(){
        this._bg=this.node.getChildByName("bg");
        this._lb_title=this._bg.getChildByName("lb_title");
        this._lb_des=this._bg.getChildByName("lb_des");
        this._btn_close=this._bg.getChildByName("btn_close");
        this.initBtnEvent(this._btn_close);
        this.openAction();
        this.node.setLocalZOrder(10);
    }

    showNote(des){
        console.log("log-----------note=:",des);
        this._lb_title.getComponent(cc.Label).string=des.title;
        this._lb_des.getComponent(cc.Label).string=des.des;
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
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

}
