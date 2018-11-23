

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START,(e)=>{
            this.node.parent.scale=0.95;
        })

        this.node.on(cc.Node.EventType.TOUCH_END,(e)=>{
            this.node.parent.scale=1.0;
        })

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(e)=>{
            this.node.parent.scale=1.0;
        })
    }
}
