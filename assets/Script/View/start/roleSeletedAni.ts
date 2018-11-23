

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    iconSprite:cc.Sprite=null;

    @property(cc.SpriteFrame)
    rolesSprites:cc.SpriteFrame[]=[];

    init(roleId){
        this.iconSprite.spriteFrame=this.rolesSprites[roleId];
        let ani=this.iconSprite.node.getComponent(cc.Animation);
        let clips=ani.getClips();
        ani.play(clips[0].name);
        this.iconSprite.node.runAction(cc.sequence(
            cc.delayTime(clips[0].duration),
            cc.callFunc(()=>{
                ani.play(clips[1].name);
            })
        ))
    }
}
