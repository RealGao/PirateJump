

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _bgWhite=null;
    _bgYellow=null;
    _isSeleted=false;

    onLoad(){
        this._bgWhite=this.node.getChildByName("bg_white");
        this._bgYellow=this.node.getChildByName("bg_yellow");
        this._bgWhite.active=false;
        this._bgYellow.active=true;
    }

    setSeletedState(bool){
        this._isSeleted=bool;
        this.unscheduleAllCallbacks()
        this.node.stopAllActions();
        if(this._isSeleted){
            this.schedule(()=>{
                this._bgWhite.active=!this._bgWhite.active;
                this._bgYellow.active=!this._bgYellow.active
            },0.3);

            this.node.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.25,1.1),
                cc.scaleTo(0.25,1.0)
            )))
        }
        this._bgWhite.active=false;
        this._bgYellow.active=true;
        this.node.scale=1.0;
    }
}
