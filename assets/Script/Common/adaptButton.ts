

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

 onLoad(){
    var size = cc.view.getFrameSize();
    let long = size.width > size.height ? size.width : size.height;
    let short = size.width <= size.height ? size.width : size.height;
    if (long / short > (896 / 414)) {
            var size = cc.view.getFrameSize();
            let long = size.width > size.height ? size.width : size.height;
            let short = size.width <= size.height ? size.width : size.height;
            if (long / short > (896 / 414)) {
                let widget = this.node.getComponent(cc.Widget);
                widget.target=cc.find("Canvas");
                widget.top = 50;
            }
          
        
    }
 }
}
