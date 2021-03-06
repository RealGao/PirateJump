//import Util from "../../Common/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class rankItem extends cc.Component {
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
        this.createImage(url,sp);
    }

    setModel(model){
        let sp=this._modelSprite.getComponent(cc.Sprite)
        sp.spriteFrame=this.modelSpritesFrame[model];
    }

    createImage(avatarUrl,sp) {
        if (window.wx != undefined) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        sp.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this._img_head.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                this._img_head.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, (err, texture) => {
                sp.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }


    
}
