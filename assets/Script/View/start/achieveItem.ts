const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _info=null;
    _progress=null;
    
    onLoad(){
        this.initNode();
    }

    initNode(){
        this._progress=this.node.getChildByName('progress') 
    }

    init(info,current,target){
        this._info=info;
        this._progress.getComponent(cc.ProgressBar).progress=current/target;
    }

}
