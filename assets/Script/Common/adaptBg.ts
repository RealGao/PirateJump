

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    onLoad(){
        let widget=this.node.getComponent(cc.Widget);
        widget.target=cc.find("Canvas");
        widget.top=0;
        widget.bottom=0;
    }
}
