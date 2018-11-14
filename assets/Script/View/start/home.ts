

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _icon=null;
    _star=null;
    _level=null;
    _seletedFrame=null;
    _btn_seletedHome=null;
    _btn_getHome=null;
    _btn_adjustHome=null;

    _lockState=null;

    onLoad(){
        this.initNode();
    }


    initNode(){
        this._icon=this.node.getChildByName("icon");
        this._star=this.node.getChildByName("star");
        this._level=this.node.getChildByName("level");
        this._seletedFrame=this.node.getChildByName("seletedFrame");

        this._btn_seletedHome=this.node.getChildByName("btn_seletedHome");
        this._btn_getHome=this.node.getChildByName("btn_getHome");
        this._btn_adjustHome=this.node.getChildByName("btn_adjustHome");

        this._seletedFrame.active=false;
        this._btn_seletedHome.active=false;
        this._btn_getHome.active=false;
        this._btn_adjustHome.active=false;

        this.initBtnEvent(this._btn_seletedHome);
        this.initBtnEvent(this._btn_seletedHome);
        this.initBtnEvent(this._btn_seletedHome);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_seletedHome"){
                this.node.parent.getComponent("editHomeWorldNode").hideSeletedFrames();
                this.setSeletedState(true)
            }else if(e.target.getName()=="btn_getHome"){

            }else if(e.target.getName()=="btn_adjustHome"){

            }
        })
    }


    setlockState(bool){
        this._lockState=bool;
        this._star.getComponent(cc.Button).interactable=bool;
        this._icon.getComponent(cc.Button).interactable=bool;

        //如果此家园没有解锁，则显示获取家园按钮
        if(!bool){
            this._btn_adjustHome.active=false;
            this._btn_getHome.active=true;
            this._btn_seletedHome.active=false;
        }
    }

    setSeletedState(bool){
        if(!this._lockState){return};

        this._seletedFrame.active=bool;
        if(bool){
            this._btn_adjustHome.active=true;
            this._btn_getHome.active=false;
            this._btn_seletedHome.active=false;
        }else{
            this._btn_adjustHome.active=false;
            this._btn_getHome.active=false;
            this._btn_seletedHome.active=true;
        }
    }

}
