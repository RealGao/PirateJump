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
    @property([cc.SpriteFrame])
    islandFrames: cc.SpriteFrame[] = [];

    public radius = 0;
    // LIFE-CYCLE CALLBACKS: 

    onLoad() {

    }

    start() {

    }

    setType(type) {
        this.type = type;
        if (type == Island.IslandType.Cannon) {
            this.node.rotation = Math.random() * 40;
            this.radius = 65;
        } else {
            let idx = Math.floor(Math.random() * this.islandFrames.length);
            let frame = this.islandFrames[idx];
            this.sprWheel.spriteFrame = frame;
            let collider = this.node.getComponent(cc.CircleCollider);
            collider.radius = this.node.width / 2 - 2;
            this.radius = collider.radius;
        }
    }

    update(dt) {
        if(this.type != Island.IslandType.Cannon) {
            this.node.rotation += 1;
        }
        
        let wPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        if (wPos.x < -200 || wPos.y > 1050 ) {
            CollisionMgr.removeIsland(this.node);
            CollisionMgr.addIsland();
        }
    }
}
