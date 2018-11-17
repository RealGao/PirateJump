const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _lb_note=null;
    _btn_close=null;

    onLoad(){
        this._lb_note=this.node.getChildByName("lb_note");
        this._btn_close=this.node.getChildByName("btn_close");

        this.initBtnEvent(this._btn_close);
    }

    showNote(note){
        this._lb_note.getComponent(cc.Label).string=note;
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
            }
        })
    }

}
