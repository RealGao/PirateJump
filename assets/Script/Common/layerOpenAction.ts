

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    onLoad(){
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.1,1.1),
            cc.scaleTo(0.05,1.0)
        ))
    }
}
