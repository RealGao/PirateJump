const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _lb_log01=null;
    _lb_log02=null;

    _btn_recover=null;
    _btn_continue=null;


    init(){
        this.initNode();
    }

    initNode(){
        this._lb_log01=this.node.getChildByName("lb_log01");
        this._lb_log02=this.node.getChildByName("lb_log02");

        this._btn_recover=this.node.getChildByName("btn_recover");
        this._btn_continue=this.node.getChildByName("btn_contine");

        this._btn_recover.active=false;
        this._btn_continue.active=false;

        this.initBtnEvent(this._btn_recover);
        this.initBtnEvent(this._btn_continue);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_recover"){

            }else if(e.target.getName()=="btn_contine"){

            }
        })
    }

    
}
