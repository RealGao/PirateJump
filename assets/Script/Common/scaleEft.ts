const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    start(){
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.1,1.2),
            cc.scaleTo(0.2,0.9),
            cc.scaleTo(0.2,1.0),
        ))
    }
}
