import Util from "../../Common/Util";
import CollisionMgr from "./CollisionMgr";
import CollisionBase from "./CollisionBase";
import GameCtr from "../../Controller/GameCtr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Props extends CollisionBase {

    static PropType = cc.Enum({
        GOLD: 0,                                                //金币
        CHEST: 1,                                               //宝箱
        ALARM: 2,                                               //时间
        MAGNET: 3,                                              //磁铁
        SIGHT: 4,                                               //路线
        SHIELD: 5,                                              //盾牌
        ROTATE: 6,                                              //旋转
        BOOM: 7,                                                //炸弹
    });
    @property({
        type: Props.PropType
    })
    type = Props.PropType.GOLD;
    @property(cc.BoxCollider)
    collider: cc.BoxCollider = null;

    @property(cc.Node)
    ndRotate: cc.Node = null;
    @property(cc.Animation)
    aniShake: cc.Animation = null;
    @property(cc.Node)
    ndNoBg: cc.Node = null;
    @property(cc.Node)
    ndBg: cc.Node = null;
    @property(cc.Node)
    ndBoom: cc.Node = null;

    public isDynamic = false;
    public autoMove = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.ndNoBg.active = false;
        this.ndBoom.active = false;
        this.ndBg.active = false;
    }

    start() {

    }

    setType(type) {
        this.type = type;
        let spr;
        if (type == Props.PropType.GOLD || type == Props.PropType.CHEST) {
            this.ndNoBg.active = true;
            spr = this.ndNoBg.getComponent(cc.Sprite);
        } else if (type == Props.PropType.BOOM) {
            this.ndBoom.active = true;
        }
        else {
            this.ndBg.active = true;
            spr = Util.findChildByName("icon", this.ndBg).getComponent(cc.Sprite);
            this.ndBg.rotation = -this.node.rotation;
            this.collider.size = cc.size(45, 45);
            this.collider.offset = cc.v2(0, 0);
        }
        switch (type) {
            case Props.PropType.GOLD:
                this.collisionType = CollisionBase.CollisionType.GOLD;
                CollisionMgr.setPropFrame(spr, 0);
                this.collider.size = cc.size(35, 35);
                this.collider.offset = cc.v2(-2, 0);
                this.isDynamic = true;
                CollisionMgr.mCollisionMgr.dynamicProps.push(this.node);
                break;
            case Props.PropType.CHEST:
                this.collisionType = CollisionBase.CollisionType.CHEST;
                CollisionMgr.setPropFrame(spr, 1);
                this.collider.size = cc.size(55, 55);
                this.collider.offset = cc.v2(-2, 5);
                break;
            case Props.PropType.ALARM:
                this.collisionType = CollisionBase.CollisionType.ALARM;
                CollisionMgr.setPropFrame(spr, 2);
                this.isDynamic = true;
                CollisionMgr.mCollisionMgr.dynamicProps.push(this.node);
                break;
            case Props.PropType.MAGNET:
                this.collisionType = CollisionBase.CollisionType.MAGNET;
                CollisionMgr.setPropFrame(spr, 3);
                this.isDynamic = true;
                CollisionMgr.mCollisionMgr.dynamicProps.push(this.node);
                break;
            case Props.PropType.SIGHT:
                this.collisionType = CollisionBase.CollisionType.SIGHT;
                CollisionMgr.setPropFrame(spr, 4);
                this.isDynamic = true;
                CollisionMgr.mCollisionMgr.dynamicProps.push(this.node);
                break;
            case Props.PropType.SHIELD:
                this.collisionType = CollisionBase.CollisionType.SHIELD;
                CollisionMgr.setPropFrame(spr, 5);
                this.isDynamic = true;
                CollisionMgr.mCollisionMgr.dynamicProps.push(this.node);
                break;
            case Props.PropType.ROTATE:
                this.collisionType = CollisionBase.CollisionType.ROTATE;
                CollisionMgr.setPropFrame(spr, 6);
                this.isDynamic = true;
                CollisionMgr.mCollisionMgr.dynamicProps.push(this.node);
                break;
            case Props.PropType.BOOM:
                this.collisionType = CollisionBase.CollisionType.BOOM;
                this.collider.size = cc.size(40, 40);
                this.collider.offset = cc.v2(-2, 3);
                break;
        }
    }

    shake(delay) {
        this.scheduleOnce(() => {
            this.aniShake.play();
        }, delay)
    }

    reset() {
        this.ndNoBg.active = false;
        this.ndBoom.active = false;
        this.ndBg.active = false;
        this.autoMove = false;
        this.isDynamic = false;
        let collision = this.node.getComponent(cc.BoxCollider);
        collision.enabled = true;
    }

    moveToPirate() {
        this.autoMove = true;
    }

    update(dt) {
        let wPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        if (wPos.x < -200 || wPos.y > 1200) {
            CollisionMgr.removeProp(this.node);
        }
        if (this.autoMove && this.isDynamic) {
            let tWPos = GameCtr.ins.mPirate.node.parent.convertToWorldSpaceAR(GameCtr.ins.mPirate.node.position);
            let tPos = CollisionMgr.mCollisionMgr.islandLayer.convertToNodeSpaceAR(tWPos);
            let distance = cc.pDistance(tPos, this.node.position);
            let vector = cc.v2(tPos.x - this.node.position.x, tPos.y - this.node.position.y);
            let radian = cc.pAngleSigned(vector, cc.v2(1, 0));
            let x = Math.cos(radian) * 10;
            let y = Math.sin(radian) * 10;
            this.node.x += x;
            this.node.y -= y;
        }
    }
}
