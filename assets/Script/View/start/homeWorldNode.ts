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

    _logNodeTag=10001;
    _editHomeWorldTag=10002;
    _seekDiamondTag=10003;


    @property(cc.Prefab)
    pfSeekDiamond:cc.Prefab=null;

    @property(cc.Prefab)
    pfEditHomeWord:cc.Prefab=null;

    @property(cc.Prefab)
    pfLog:cc.Prefab=null;
    

    onLoad(){
        this.initNode();
        this.doAction();
    }

    initNode(){
        this._btn_log=this.node.getChildByName("btn_log");
        this._btn_seekDiamond=this.node.getChildByName("btn_seekDiamond");
        this._btn_editHomeWorld=this.node.getChildByName("btn_editHomeWorld");
        this._mask=this.node.getChildByName("mask");
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
                if(this.node.getChildByName("logNode")){
                    return;
                }
                this.hideBoatsInfo();
                this.destroyEditHomeWorld();
                this.destroySeekDiamond();
                this.showLog();
            }else if(e.target.getName()=="btn_seekDiamond"){
                if(this.node.getChildByName("seekDiamondNode")){
                    return
                }
                this.detroyLog();
                this.hideBoatsInfo();
                this.destroyEditHomeWorld();
                this.showSeekDiamond();
            }else if(e.target.getName()=="btn_editHomeWorld"){
                if(this.node.getChildByName("editHomeWorldNode")){
                    return;
                }
                this.detroyLog();
                this.hideBoatsInfo();
                this.destroySeekDiamond();
                this.showEditHomeWorld();
            }else if(e.target.getName()=="mask"){
                this.detroyLog();
                this.hideBoatsInfo();
                this.destroySeekDiamond();
                this.destroyEditHomeWorld();
            }
        })
    }

    showLog(){
        this.setMaskVisit(true);
        let logNode=cc.instantiate(this.pfLog);
        logNode.parent=this.node;
        logNode.tag=this._logNodeTag
    }

    detroyLog(){
        while(this.node.getChildByTag(this._logNodeTag)){
            this.node.removeChildByTag(this._logNodeTag)
        }
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
        console.log("log-----------showSeekDiamond------------");
        this.setMaskVisit(true);
        let seekDiamondNode=cc.instantiate(this.pfSeekDiamond);
        seekDiamondNode.parent=this.node;
        seekDiamondNode.tag=this._seekDiamondTag;
    }

    destroySeekDiamond(){
        while(this.node.getChildByTag(this._seekDiamondTag)){
            this.node.removeChildByTag(this._seekDiamondTag);
        }
        this.setMaskVisit(false);
    }

    showEditHomeWorld(){
        this.setMaskVisit(true);
        let editHomeWorldNode=cc.instantiate(this.pfEditHomeWord);
        editHomeWorldNode.parent=this.node;
        editHomeWorldNode.tag=this._editHomeWorldTag;
    }

    destroyEditHomeWorld(){
        this.setMaskVisit(false);
        while(this.node.getChildByTag(this._editHomeWorldTag)){
            this.node.removeChildByTag(this._editHomeWorldTag)
        }
    }

    doAction(){
        let icon=this.node.getChildByName("icon");
        icon.scale=1.0;
        icon.stopAllActions();
        icon.runAction(cc.sequence(
            cc.scaleTo(0.1,1.2),
            cc.scaleTo(0.2,0.9),
            cc.scaleTo(0.2,1.0),
        ))

        for(let i=0;i<this._boats.length;i++){
            this._boats[i].opacity=0;
            this._boats[i].stopAllActions();
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
