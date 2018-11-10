const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _icon=null;
    _progress=null;
    _goal=0;
    
    @property(cc.SpriteFrame)
    iconArr:cc.SpriteFrame[]=[];

    onLoad(){
        this.initNode();
    }

    initNode(){
        this._icon=this.node.getChildByName("icon");
        this._progress=this.node.getChildByName('progress') 
    }

    init(goal,index){
        let currentNum=0;
        this._goal=goal;
        this._icon.getComponent(cc.Sprite).spriteFrame=this.iconArr[index];
        this._progress.getComponent(cc.ProgressBar).progress=currentNum/this._goal;
    }

}
