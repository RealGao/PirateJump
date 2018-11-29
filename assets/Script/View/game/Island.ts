import CollisionBase from "./CollisionBase";
import CollisionMgr from "./CollisionMgr";

const { ccclass, property } = cc._decorator;


@ccclass
export default class Island extends CollisionBase {

    static IslandType = cc.Enum({
        Normal: 0,                                        //普通小岛
        Cannon: 1,                                        //大炮
        Vertical: 2,                                      //垂直下降
    });

    static SpeedType = cc.Enum({
        Slow: 6,
        Normal: 7,
        Fast: 8,
        Flash: 10
    });

    @property({
        type: Island.IslandType
    })
    type = Island.IslandType.Normal;

    @property({
        type: Island.SpeedType
    })
    speed = Island.SpeedType.Normal;

    @property(cc.Sprite)
    sprWheel: cc.Sprite = null;

    public radius = 0;
    public props = [];                              //小岛的所有prop
    public rotateSpeed = 1;
    public isLanded = false;
    private _idx = 0;
    // LIFE-CYCLE CALLBACKS: 

    onLoad() {
        this.setRotateSpeed();
    }

    start() {

    }

    setType(type) {
        this.type = type;
        if (type == Island.IslandType.Cannon) {
            this.node.rotation = Math.random() * 40;
            this.radius = 65;
        } 
    }

    set idx(idx) {
        this._idx = idx;
    }

    get idx() {
        return this._idx;
    }

    setWheel(idx = 0) {
        if (this.type == Island.IslandType.Cannon) return;
        let frame = CollisionMgr.mCollisionMgr.islandFrames[idx];
        if(!this.sprWheel) {
            cc.log("!!!!!!!!!!!!!");
        }
        this.sprWheel.spriteFrame = frame;
        let collider = this.node.getComponent(cc.CircleCollider);
        collider.radius = this.node.width / 2 - 2;
        this.radius = collider.radius;
    }

    setRotateSpeed(speed = 1) {
        this.rotateSpeed = speed * (this.speed / 5);
    }

    update(dt) {
        if (this.type != Island.IslandType.Cannon) {
            this.node.rotation += this.rotateSpeed;
        }

        let wPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        if (wPos.x < -500 || ((wPos.y > 1200 || wPos.y < -200) && this.isLanded)) {
            CollisionMgr.removeIsland(this.node);
        }
    }
}