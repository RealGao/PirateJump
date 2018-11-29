import GameCtr from "../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Toast extends cc.Component {

    @property(cc.Node)
    Toast:cc.Node=null;

    @property(cc.Label)
    lb_note: cc.Label = null;

    onLoad(){
        GameCtr.getInstance().setToast(this);
    }

    toast(str,callFunc=null,duration=1.5){
        if(this.Toast.opacity>0){
            return;
        }

        this.lb_note.string=str;
        this.Toast.stopAllActions();
        this.Toast.y=80;
        this.lb_note.node.y=80;
        this.Toast.opacity=150;
        this.lb_note.node.opacity=255;
        this.Toast.runAction(cc.sequence(
            cc.moveBy(duration/3*2,cc.p(0,70)).easing(cc.easeIn(duration)),
            cc.fadeOut(duration/3),
            cc.callFunc(()=>{
                if(callFunc){
                    callFunc()
                }
            })
        ))

        this.lb_note.node.runAction(cc.sequence(
            cc.moveBy(duration/3*2,cc.p(0,70)).easing(cc.easeIn(duration)),
            cc.fadeOut(duration/3),
        ))
    }

    
}
