
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _lb_name=null;
    _lb_score=null;
    _lb_jewel=null;
    _infoNode=null;
    _starsNode=null;
    _btn_go=null;
    _boat=null;

    _maxScore=0;
    _jewelCount=0;
    _stars=[];
    _posArr=[];

    onLoad(){
        this.initData();
        this.initNode();
    }

    initData(){
        this._posArr=[
            [0],
            [0,1],
            [0,1,2],
            [0,1,2,3],
            [0,1,2,3,4],
        ]
    }

    initNode(){
        this._infoNode=this.node.getChildByName("infoNode");
        this._starsNode=this.node.getChildByName("starsNode");
        this._lb_name=this.node.getChildByName("lb_name");
        this._boat=this.node.getChildByName("boat");


        this._lb_score=this._infoNode.getChildByName("lb_score");
        this._lb_jewel=this._infoNode.getChildByName("lb_jewel");
        this._btn_go=this._infoNode.getChildByName("btn_go");

        this._infoNode.active=false;

        for(let i=0;i<this._starsNode.children.length;i++){
            this._starsNode.children[i].active=false;
            this._stars.push(this._starsNode.children[i]);
        }

        this.initBntEvent(this._boat);
        this.initBntEvent(this._btn_go);
    }



    init(info){
        this._maxScore=info.maxScore;
        this._jewelCount=info.jewelCount;

        this._lb_name.getComponent(cc.Label).string=info.name;
        this._lb_score.getComponent(cc.Label).string=info.maxScore;
        this._lb_jewel.getComponent(cc.Label).string=info.jewelCount;

        this.showStars(4);
    }

    hideInfo(){
        this._infoNode.active=false;
    }

    initBntEvent(node){
        node.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="boat"){
                if(!this._infoNode.active){
                    this.node.parent.getComponent("homeWorldNode").detroyLog();
                    this.node.parent.getComponent("homeWorldNode").hideBoatsInfo();
                    this.node.parent.getComponent("homeWorldNode").destroySeekDiamond();
                    this.node.parent.getComponent("homeWorldNode").destroyEditHomeWorld();
                    this.node.parent.getComponent("homeWorldNode").setMaskVisit(true);
                    this.showInfoNode();
                }
            }else if(e.target.getName()=="btn_go"){
                console.log("log-----------click--btn_go-----");
            }
        })
    }

    showInfoNode(){
        this._infoNode.active=true;
        this._infoNode.scale=0.2;
        this._infoNode.stopAllActions();
        this._infoNode.runAction(cc.sequence(
            cc.scaleTo(0.1,1.1),
            cc.scaleTo(0.05,1.0),
        ))
    }


    showStars(count){
        let stars=this._posArr[count-1];
        for(let i=0;i<stars.length;i++){
            this._stars[stars[i]].active=true;
        } 
    }

}
