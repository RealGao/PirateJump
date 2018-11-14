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

        //this._editHomeWorldNode.getComponent("editHomeWorldNode").init();


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
            this._boats.push(boat)
        }
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_log"){
                this.hideBoatsInfo();
                this.hideEditHomeWorld();
                this.hideSeekDiamond();
                this.showLog();
            }else if(e.target.getName()=="btn_seekDiamond"){
                this.hideLog();
                this.hideBoatsInfo();
                this.hideEditHomeWorld();
                this.showSeekDiamond();
            }else if(e.target.getName()=="btn_editHomeWorld"){
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
    }

    hideSeekDiamond(){
        this.setMaskVisit(false);
        this._seekDiamondNode.active=false;
    }

    showEditHomeWorld(){
        this.setMaskVisit(true);
        this._editHomeWorldNode.active=true;
    }

    hideEditHomeWorld(){
        this.setMaskVisit(false);
        this._editHomeWorldNode.active=false;
    }

    start () {

    }

}
