
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _icon_seleted=null;
    _lb_recordHolder=null;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this._icon_seleted=this.node.getChildByName('icon_seleted');
        this._lb_recordHolder=this.node.getChildByName("champion_frame").getChildByName("lb_recordHolder");
        this._icon_seleted.active=false;
    }

    setRecordHolder(recordHolder){
        this._lb_recordHolder.getComponent(cc.Label).string=recordHolder.name;
    }

    setLockState(lock){
        this.node.getComponent(cc.Button).interactable=lock;
    }

    setSeletedState(bool){
        this._icon_seleted.active=bool;
    }

   
}
