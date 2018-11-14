import GameCtr from "../../Controller/GameCtr";
import CollisionBase from "./CollisionBase";
import CollisionMgr from "./CollisionMgr";
import Island from "./Island";

const { ccclass, property } = cc._decorator;

// const gravity = -1000;

@ccclass
export default class Pirate extends CollisionBase {
    static PirateType = cc.Enum({
        CaptainP: 0,                                        //刀男
        Sparklet: 1,                                        //刀妹
        Hook: 2,                                            //船长
        Leavened: 3,                                        //厨子
        Crutch: 4                                           //骷髅
    });

    static Velocity = cc.Enum({
        Normal: 350,
        Fast: 500,
        Slow: 300,
    });

    @property({
        type: Pirate.Velocity
    })
    vec = Pirate.Velocity.Normal;

    @property(cc.Sprite)
    sprPirate: cc.Sprite = null;

    private gravity = -800;
    private beginJump = false;                              //是否开始跳跃
    private beginShoot = false;                             //是否开始发射
    private jumpTime = 0;                                   //跳跃次数
    private vx = 0;
    private vy = 0;
    private moveDt = 0;                                     //role跳跃总时间
    private originPos;
    public lastIsland = null;
    private islandLayerOrigin = cc.v2(0, 0);

    onLoad() {
        GameCtr.getInstance().setPirate(this);
    }

    start() {
        this.originPos = this.node.position;
        this.beginJump = true;
        this.jumpTime = 2;
    }

    jump() {
        if(this.beginShoot) return;
        this.beginJump = true;
        if (this.jumpTime == 0) {
            this.gravity = -800;
            this.islandLayerOrigin = GameCtr.ins.mGame.ndIslandLayer.position;
            let selfWPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            let parentWPos = this.node.parent.parent.convertToWorldSpaceAR(this.node.parent.position);
            let vector = cc.v2(selfWPos.x - parentWPos.x, selfWPos.y - parentWPos.y);
            let radian = cc.pAngleSigned(vector, cc.v2(0, 1));
            let rotation = cc.radiansToDegrees(radian);
            cc.log("rotation == "+rotation);
            this.vx = Math.sin(radian) * this.vec;
            this.vy = Math.cos(radian) * this.vec;
            this.moveDt = 0;
            this.node.parent = GameCtr.ins.mGame.ndIslandLayer;
            let cPos = this.node.parent.convertToNodeSpaceAR(selfWPos);
            this.node.position = cPos;
            this.node.rotation = rotation;
            CollisionMgr.fitIslandLayer(this.vx);
        } else if (this.jumpTime == 1 && this.moveDt > 0.2) {
            this.moveDt = 0;
        } else {
            return;
        }
        this.originPos = this.node.position;
        this.jumpTime++;
    }

    onCollisionEnter(other, self) {
        let otherCollision: CollisionBase = other.node.getComponent(CollisionBase);
        switch (otherCollision.collisionType) {
            case CollisionBase.CollisionType.ISLAND:
                this.landOnIsland(other.node);
                break;

            default:
                break;
        }
    }

    shoot() {
        this.gravity = 0;
        this.moveDt = 0;
        let selfWPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        let rotation = this.node.parent.rotation;
        let radian = cc.degreesToRadians(rotation);
        this.vx = Math.sin(radian) * this.vec;
        this.vy = Math.cos(radian) * this.vec;
        this.node.parent = GameCtr.ins.mGame.ndCanvas;
        let cPos = this.node.parent.convertToNodeSpaceAR(selfWPos);
        this.node.position = cPos;
        this.originPos = this.node.position;
        this.beginShoot = true;
    }

    landOnIsland(island) {
        this.beginJump = false;
        this.beginShoot = false;
        CollisionMgr.stopFit();
        cc.log("this.moveDt == "+this.moveDt);
        this.jumpTime = 0;
        this.moveDt = 0;
        let comp: Island = island.getComponent(Island);
        let selfWPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        this.node.parent = island;
        let parentWPos = island.parent.convertToWorldSpaceAR(island.position);
        let vector = cc.v2(selfWPos.x - parentWPos.x, selfWPos.y - parentWPos.y);
        let radian = cc.pAngleSigned(vector, cc.v2(0, 1));
        let rotation = cc.radiansToDegrees(radian);
        
        let cPos = island.convertToNodeSpaceAR(selfWPos);
        this.node.position = cPos;
        this.node.rotation = rotation - island.rotation;
        if(comp.type == Island.IslandType.Cannon) {
            this.node.rotation = 0;
        }

        let tmpPos = GameCtr.ins.mGame.ndIslandLayer.position;
        let offset = cc.pSub(tmpPos, this.islandLayerOrigin);
        if (!this.lastIsland) {
            this.lastIsland = island;
            return;
        } else {
            this.lastIsland = island;
            CollisionMgr.moveIslandLayer(offset);
        }

        
        if(comp.type == Island.IslandType.Cannon) {
            this.node.position = cc.v2(0,0);
            this.scheduleOnce(()=>{this.shoot();}, 1.0);
        }
    }

    movePirate(dt) {
        let lastPos = this.node.position;
        this.node.x = this.originPos.x + this.vx * this.moveDt;
        this.node.y = this.originPos.y + (this.vy * this.moveDt + this.gravity * this.moveDt * this.moveDt / 2);
        let cPos = this.node.position;
        let vector = cc.v2(cPos.x - lastPos.x, cPos.y - lastPos.y);
        let radian = cc.pAngleSigned(vector, cc.v2(0, 1));
        let rotation = cc.radiansToDegrees(radian);
        this.node.rotation = rotation;
    }

    update(dt) {
        if (this.beginJump || this.beginShoot) {
            this.moveDt += dt;
            this.movePirate(dt);
        }
    }
}
