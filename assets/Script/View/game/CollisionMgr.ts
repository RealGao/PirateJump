import NodePoolManager from "../../Common/NodePoolManager";
import GameCtr from "../../Controller/GameCtr";
import Island from "./Island";
import Util from "../../Common/Util";


const { ccclass, property } = cc._decorator;

const routeDistance = 30;
const propDistance = 40;

@ccclass
export default class CollisionMgr extends cc.Component {
    public static mCollisionMgr: CollisionMgr;

    // static IslandType = cc.Enum({
    //     Normal: 0,                                        //普通小岛
    //     Cannon: 1,                                        //大炮
    //     Vertical: 2,                                      //垂直下降
    // });

    @property(cc.Node)
    islandLayer: cc.Node = null;
    @property(cc.Node)
    ndPos: cc.Node = null;

    @property(cc.Prefab)
    pfWheelIsland: cc.Prefab = null;
    @property(cc.Prefab)
    pfCannonIsland: cc.Prefab = null;
    @property(cc.Prefab)
    pfProp: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:
    private wheelIslandPool;
    private cannonIslandPool;
    private propPool;

    private fitLayer = false;
    private fitVx = 0;

    public ctx;

    public islandArr = [];
    private islandOrigin;
    private jumpPos = null;
    private cannonPos = null;
    private verticalPos = null;

    onLoad() {
        CollisionMgr.mCollisionMgr = this;
        CollisionMgr.mCollisionMgr.ctx = CollisionMgr.mCollisionMgr.islandLayer.getComponent(cc.Graphics);
        this.initPools();
    }

    start() {
        CollisionMgr.mCollisionMgr.islandOrigin = CollisionMgr.mCollisionMgr.islandLayer.convertToWorldSpaceAR(cc.v2(90, 0));
        let nd = Util.findChildByName("jumpPos", CollisionMgr.mCollisionMgr.ndPos);
        CollisionMgr.mCollisionMgr.jumpPos = CollisionMgr.mCollisionMgr.ndPos.convertToWorldSpaceAR(nd.position);
        nd = Util.findChildByName("cannonPos", CollisionMgr.mCollisionMgr.ndPos);
        CollisionMgr.mCollisionMgr.cannonPos = CollisionMgr.mCollisionMgr.ndPos.convertToWorldSpaceAR(nd.position);
        nd = Util.findChildByName("verticalPos", CollisionMgr.mCollisionMgr.ndPos);
        CollisionMgr.mCollisionMgr.verticalPos = CollisionMgr.mCollisionMgr.ndPos.convertToWorldSpaceAR(nd.position);
    }

    initPools() {
        this.wheelIslandPool = NodePoolManager.create(this.pfWheelIsland);
        this.cannonIslandPool = NodePoolManager.create(this.pfCannonIsland);
        this.propPool = NodePoolManager.create(this.pfProp);
    }

    // 添加小岛
    static addIsland() {
        let island = CollisionMgr.mCollisionMgr.wheelIslandPool.get();
        let comp: Island = island.getComponent(Island);

        let length = CollisionMgr.mCollisionMgr.islandArr.length;
        if (length == 0) {
            island.position = cc.v2(90, 480);
            comp.setType(Island.IslandType.Normal)
            CollisionMgr.mCollisionMgr.islandArr.push(island);
            island.parent = GameCtr.ins.mGame.ndIslandLayer;
            return;
        }

        let randType = Math.ceil(Math.random() * 20);
        if (randType == 19) {
            island = CollisionMgr.mCollisionMgr.cannonIslandPool.get();
            comp = island.getComponent(Island);
            comp.setType(Island.IslandType.Cannon);
        } else if (randType <= 18) {
            comp.setType(Island.IslandType.Normal);
        } else if (randType == 20) {
            comp.setType(Island.IslandType.Vertical);
        }
        island.parent = GameCtr.ins.mGame.ndIslandLayer;
        CollisionMgr.mCollisionMgr.setIslandPostion(island);
    }

    // 设置小岛位置
    private setIslandPostion(island) {
        let length = CollisionMgr.mCollisionMgr.islandArr.length;
        let comp: Island = island.getComponent(Island);
        let lastIsland = CollisionMgr.mCollisionMgr.islandArr[length - 1];
        let lastComp: Island = lastIsland.getComponent(Island);
        let rotation = 25;
        let time = 1;
        let addNum = 0;
        let gravity = -800;
        let radius = 0;
        let originX = 0;
        let originY = 0;
        if (lastComp.type == Island.IslandType.Vertical) {
            rotation = 180;
            time = Math.random() * 2 / 10 + 0.5;
        } else if (lastComp.type == Island.IslandType.Cannon) {
            gravity = 0;
            rotation = lastIsland.rotation;
            time = Math.random() * 2 / 10 + 0.7;
        }
        else {
            let rNum = Math.random() * 10;
            if (rNum < 2) {
                rotation = Math.random() * 10 + 35;
                time = Math.random() * 2 / 10 + 0.7;
                addNum = 60;
            } else if (rNum >= 2 && rNum < 8) {
                rotation = Math.random() * 5 + 25;
                time = Math.random() * 4 / 10 + 1.3;
            } else if (rNum >= 8 && rNum < 9) {
                rotation = Math.random() * 40 + 90;
                time = Math.random() * 1 / 10 + 0.6;
            }
            if (comp.type == Island.IslandType.Cannon) {
                rotation = Math.random() * 40 + 90;
                time = Math.random() * 1 / 10 + 0.6;
            }
            radius = lastComp.radius + 25;
        }
        let radian = cc.degreesToRadians(rotation);
        let vec = GameCtr.ins.mPirate.vec;
        let vx = Math.sin(radian) * vec;
        originX = Math.sin(radian) * radius;
        let vy = Math.cos(radian) * vec;
        originY = Math.cos(radian) * radius;
        let offsetX = vx * time;
        let offsetY = vy * time + gravity * time * time / 2;
        island.x = lastIsland.x + originX + offsetX + addNum;
        island.y = lastIsland.y + originY + offsetY;
        CollisionMgr.mCollisionMgr.islandArr.push(island);
        CollisionMgr.drawLine(cc.pAdd(lastIsland.position, cc.v2(originX, originY)), time, cc.v2(vx, vy), gravity);
    }

    // 路径描点
    static drawLine(origin, time, vec, gravity) {
        let dt = 0;


        let lastPos = origin;
        while (dt < time) {
            let x = vec.x * dt + origin.x;
            let y = vec.y * dt + gravity * dt * dt / 2 + origin.y;
            let pos = cc.v2(x, y);
            let distance = cc.pDistance(lastPos, pos);
            if (distance > routeDistance) {
                CollisionMgr.mCollisionMgr.ctx.circle(x, y, 5);
                CollisionMgr.mCollisionMgr.ctx.fill();
                CollisionMgr.mCollisionMgr.getNextPos(origin, pos, vec, gravity, dt + 0.01, time);
            } else {
                CollisionMgr.mCollisionMgr.getNextPos(origin, lastPos, vec, gravity, dt + 0.005, time);
            }
        }

        CollisionMgr.mCollisionMgr.getNextPos(origin, cc.v2(x, y), vec, gravity, dt, time);
    }

    getNextPos(origin, lastPos, vec, gravity, dt, time) {
        if (dt >= time) return;
        let x = vec.x * dt + origin.x;
        let y = vec.y * dt + gravity * dt * dt / 2 + origin.y;
        let pos = cc.v2(x, y);
        let distance = cc.pDistance(lastPos, pos);
        if (distance > routeDistance) {
            CollisionMgr.mCollisionMgr.ctx.circle(x, y, 5);
            CollisionMgr.mCollisionMgr.ctx.fill();
            CollisionMgr.mCollisionMgr.getNextPos(origin, pos, vec, gravity, dt + 0.01, time);
        } else {
            CollisionMgr.mCollisionMgr.getNextPos(origin, lastPos, vec, gravity, dt + 0.005, time);
        }
    }

    // 增加炸弹
    static addBoom() {

    }

    // 增加道具
    static addProp() {

    }

    static removeIsland(island) {
        let comp: Island = island.getComponent(Island);
        if (comp.type == Island.IslandType.Cannon) {
            CollisionMgr.mCollisionMgr.cannonIslandPool.put(island);
        } else {
            CollisionMgr.mCollisionMgr.wheelIslandPool.put(island);
        }

        for (let i = 0; i < CollisionMgr.mCollisionMgr.islandArr.length; i++) {
            let item = CollisionMgr.mCollisionMgr.islandArr[i];
            if (item == island) {
                CollisionMgr.mCollisionMgr.islandArr.splice(i, 1);
            }
        }
    }

    static getIslandIdx(island) {
        for (let i = 0; i < CollisionMgr.mCollisionMgr.islandArr.length; i++) {
            let item = CollisionMgr.mCollisionMgr.islandArr[i];
            if (item == island) {
                return i;
            }
        }
    }

    static fitIslandLayer(vx) {
        CollisionMgr.mCollisionMgr.fitLayer = true;
        CollisionMgr.mCollisionMgr.fitVx = vx;
    }

    static stopFit() {
        CollisionMgr.mCollisionMgr.fitLayer = false;
        CollisionMgr.mCollisionMgr.fitVx = 0;
    }

    static moveIslandLayer(offset) {
        let island = GameCtr.ins.mPirate.lastIsland;
        let idx = CollisionMgr.getIslandIdx(island);
        let scale = 1;
        cc.log("idx == ", idx);

        let lastIsland = CollisionMgr.mCollisionMgr.islandArr[idx - 1];
        let nextIsland = CollisionMgr.mCollisionMgr.islandArr[idx + 1];
        if (!lastIsland || !nextIsland) {
            cc.log("wrong idx!!!!!!");
        }
        let lastScale = CollisionMgr.mCollisionMgr.islandLayer.scale;
        let radius = island.getComponent(Island).radius + nextIsland.getComponent(Island).radius;
        let distanceX = nextIsland.position.x - island.position.x;
        let distanceY = island.position.y - nextIsland.position.y;
        // if (distanceX > 10) {
        //     scale = GameCtr.ins.mGame.ndCanvas.width / (distanceX + radius + 50);
        // } else {
        //     scale = GameCtr.ins.mGame.ndCanvas.height / (distanceY + radius + 100);
        // }
        // if (scale < 0) {
        //     cc.log("scale wrong!!!!!!!!!!!");
        // }
        // cc.log("distanceX == " + distanceX + " scale == " + scale);
        // CollisionMgr.mCollisionMgr.islandLayer.runAction(cc.scaleTo(0.5, scale));
        let comp: Island = island.getComponent(Island);
        let oPos;
        if (comp.type == Island.IslandType.Cannon) {
            oPos = CollisionMgr.mCollisionMgr.cannonPos;
        }
        else if (comp.type == Island.IslandType.Normal) {
            oPos = CollisionMgr.mCollisionMgr.jumpPos;
        } else if (comp.type == Island.IslandType.Vertical) {
            oPos = CollisionMgr.mCollisionMgr.verticalPos;
        }
        let wPos = CollisionMgr.mCollisionMgr.islandLayer.convertToWorldSpaceAR(island.position);

        let offsetX = oPos.x - wPos.x;
        // cc.log("offsetX == " + offsetX);
        let offsetY = oPos.y - wPos.y;
        // cc.log("offsetY == " + offsetY);
        let offScale = scale / lastScale;
        // cc.log("offScale == " + offScale);
        CollisionMgr.mCollisionMgr.islandLayer.runAction(cc.moveBy(0.5, cc.v2(offsetX * offScale, offsetY * offScale)));
    }

    update(dt) {
        if (CollisionMgr.mCollisionMgr.fitLayer) {
            CollisionMgr.mCollisionMgr.islandLayer.x -= CollisionMgr.mCollisionMgr.fitVx * dt / 2;
        }
    }
}
