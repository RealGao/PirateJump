import GameCtr from "../../Controller/GameCtr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _btn_close=null;
    _btn_arrowRight=null;
    _btn_arrowLeft=null;
    _contentNode=null;
    onLoad(){
        this.initNode();
    }

    initNode(){
        this._btn_close=this.node.getChildByName('btn_close');
        this._btn_arrowRight=this.node.getChildByName('btn_arrowRight');
        this._btn_arrowLeft=this.node.getChildByName("btn_arrowLeft");
        this._contentNode=this.node.getChildByName("contentNode");

        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_arrowRight);
        this.initBtnEvent(this._btn_arrowLeft);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.getInstance().getStart().setMaskVisit(false);
            }else if(e.target.getName()=="btn_arrowRight"){
                
            }else if(e.target.getName()=="btn_arrowLeft"){

            }
        })
    }

}
