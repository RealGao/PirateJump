const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_log=null;
    _btn_seekDiamond=null;
    _btn_editHomeWorld=null;
    _logNode=null;
    _seekDiamondNode=null;
    _editHomeWorldNode=null;
    _mask=null;
    _boats=[];

    init(){
        this.initNode();
    }

    initNode(){
        this._btn_log=this.node.getChildByName("btn_log");
        this._btn_seekDiamond=this.node.getChildByName("btn_seekDiamond");
        this._btn_editHomeWorld=this.node.getChildByName("btn_editHomeWorld");

        this._logNode=this.node.getChildByName("logNode");
        this._seekDiamondNode=this.node.getChildByName("seekDiamondNode");
        this._editHomeWorldNode=this.node.getChildByName("editHomeWorldNode");

        this._mask=this.node.getChildByName("mask");

        this._logNode.active=false;
        this._editHomeWorldNode.active=false;
        this._seekDiamondNode.active=false;
        this._mask.active=false;

        this.initBoats();
        this.initBtnEvent(this._btn_log);
        this.initBtnEvent(this._btn_seekDiamond);
        this.initBtnEvent(this._btn_editHomeWorld);
        this.initBtnEvent(this._mask);
    }

    initBoats(){
        for(let i=0;i<3;i++){
            let boat=this.node.getChildByName("boat_"+i);
            this._boats.push(boat);
            //boat.getComponent("boat").init();
        }
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_log"){
                if(this._logNode.active){return}
                this.hideBoatsInfo();
                this.hideEditHomeWorld();
                this.hideSeekDiamond();
                this.showLog();
            }else if(e.target.getName()=="btn_seekDiamond"){
                if(this._seekDiamondNode.active){return}
                this.hideLog();
                this.hideBoatsInfo();
                this.hideEditHomeWorld();
                this.showSeekDiamond();
            }else if(e.target.getName()=="btn_editHomeWorld"){
                if(this._editHomeWorldNode.active){return}
                this.hideLog();
                this.hideBoatsInfo();
                this.hideSeekDiamond();
                this.showEditHomeWorld();
            }else if(e.target.getName()=="mask"){
                this.hideLog();
                this.hideBoatsInfo();
                this.hideSeekDiamond();
                this.hideEditHomeWorld();
            }
        })
    }

    showLog(){
        this._logNode.active=true;
        this.hideBoatsInfo();
        this.hideSeekDiamond();
        this.setMaskVisit(true);
       
    }

    hideLog(){
        this._logNode.active=false;
        this.setMaskVisit(false);
    }

    setMaskVisit(bool){
        this._mask.active=bool;
    }

    hideBoatsInfo(){
        this.setMaskVisit(false)
        for(let i=0;i<this._boats.length;i++){
            this._boats[i].getComponent("boat").hideInfo()
        }
    }

    showSeekDiamond(){
        this.setMaskVisit(true);
        this._seekDiamondNode.active=true;
        this._seekDiamondNode.scale=0.2;
        this._seekDiamondNode.stopAllActions();
        this._seekDiamondNode.runAction(cc.sequence(
            cc.scaleTo(0.1,1.1),
            cc.scaleTo(0.05,1.0)
        ))
    }

    hideSeekDiamond(){
        this.setMaskVisit(false);
        this._seekDiamondNode.active=false;
    }

    showEditHomeWorld(){
        this.setMaskVisit(true);
        this._editHomeWorldNode.active=true;
        this._editHomeWorldNode.scale=0.2;
        this._editHomeWorldNode.stopAllActions();
        this._editHomeWorldNode.runAction(cc.sequence(
            cc.scaleTo(0.1,1.1),
            cc.scaleTo(0.05,1.0)
        ))
    }

    hideEditHomeWorld(){
        this.setMaskVisit(false);
        this._editHomeWorldNode.active=false;
    }

    doAction(){
        let icon=this.node.getChildByName("icon");
        icon.runAction(cc.sequence(
            cc.scaleTo(0.1,1.2),
            cc.scaleTo(0.2,0.9),
            cc.scaleTo(0.2,1.0),
        ))

        for(let i=0;i<this._boats.length;i++){
            this._boats[i].runAction(cc.sequence(
                cc.delayTime(i*0.3),
                cc.callFunc(()=>{
                    let ani=this._boats[i].getComponent(cc.Animation);
                    let clips=ani.getClips();
                    ani.play(clips[0].name);
                    this._boats[i].runAction(cc.sequence(
                        cc.delayTime(clips[0].duration),
                        cc.callFunc(()=>{
                            ani.play(clips[1].name);
                        })
                    ))
                })
            ))
        }
    }
}
