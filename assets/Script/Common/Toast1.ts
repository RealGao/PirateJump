import GameCtr from "../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Toast extends cc.Component {

    @property(cc.Node)
    Toast:cc.Node=null;

    @property(cc.Label)
    lb_note: cc.Label = null;

    init(str,callFunc=null,duration=1.5){
        console.log("log-----------------toast1-----init");
        this.lb_note.string=str;
        this.Toast.stopAllActions();
        this.Toast.y=80;
        this.lb_note.node.y=80;
        this.Toast.opacity=200;
        this.lb_note.node.opacity=255;
        this.Toast.runAction(cc.sequence(
            cc.moveBy(duration/3*2,cc.p(0,70)).easing(cc.easeIn(duration)),
            cc.fadeOut(duration/3),
            cc.callFunc(()=>{
                if(callFunc){
                    callFunc()
                }
                this.node.destroy();
            })
        ))

        this.lb_note.node.runAction(cc.sequence(
            cc.moveBy(duration/3*2,cc.p(0,70)).easing(cc.easeIn(duration)),
            cc.fadeOut(duration/3),
        ))
    }

    
}
