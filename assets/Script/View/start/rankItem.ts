import Util from "../../Common/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _lb_name=null;
    _lb_scroe=null;
    _lb_rank=null;
    _img_head=null;
    _modelSprite=null;
    
    @property(cc.SpriteFrame)
    modelSpritesFrame:cc.SpriteFrame[]=[];
    onLoad(){
        this.initNode();
    }

    initNode(){
        this._lb_name=this.node.getChildByName('lb_name');
        this._lb_rank=this.node.getChildByName('lb_rank');
        this._lb_scroe=this.node.getChildByName('lb_score');
        this._modelSprite=this.node.getChildByName("nameFrame");
        this._img_head=this.node.getChildByName("headFrame").getChildByName("head");
    }

    setName(name){
        this._lb_name.getComponent(cc.Label).string=name;
    }

    setRank(rank){
        this._lb_rank.getComponent(cc.Label).string=rank;
    }

    setScore(score){
        this._lb_scroe.getComponent(cc.Label).string=score;
    }

    setHeadImg(url){
        let sp=this._img_head.getComponent(cc.Sprite);
        Util.loadImg(sp,url);
    }

    setModel(model){
        let sp=this._modelSprite.getComponent(cc.Sprite)
        sp.spriteFrame=this.modelSpritesFrame[model];
    }


    
}
