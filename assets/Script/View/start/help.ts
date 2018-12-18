import GameCtr from "../../Controller/GameCtr";
import PromptDialog from "../view/PromptDialog";
import Guide from "../game/Guide";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends PromptDialog {
    _bg=null;
    _btn_close=null;

    onLoad(){
        this.initNode();
        this.openAction();
    }

    initNode(){
        this._bg=this.node.getChildByName('bg');
        this._btn_close=this._bg.getChildByName('btn_close');
        this.initBtnEvent(this._btn_close);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                // this.node.destroy();
                Guide.setGuideStorage();
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
