import NodePoolManager from "../../Common/NodePoolManager";
import GameCtr from "../../Controller/GameCtr";
import Island from "./Island";
import Util from "../../Common/Util";
import Props from "./Props";
import GameData from "../../Common/GameData";
import PropEffect from "./PropEffect";
import CollisionBase from "./CollisionBase";


const { ccclass, property } = cc._decorator;

const routeDistance = 30;
const propDistance = 60;
const bgWidth = 921;
const winWidth = 540;

enum LastPropType {
    CHEST,                                               //宝箱
    MAGNET,                                              //磁铁
    ALARM,                                               //时间
    SIGHT,                                               //路线
    ROTATE,                                              //旋转
    SHIELD,                                              //盾牌
}

@ccclass
export default class CollisionMgr extends cc.Component {
    public static mCollisionMgr: CollisionMgr;

    @property(cc.Node)
    islandLayer: cc.Node = null;
    @property(cc.Node)
    ndBg: cc.Node = null;
    @property(cc.Node)
    ndGraphic: cc.Node = null;
    @property(cc.Node)
    ndPos: cc.Node = null;

    @property(cc.Prefab)
    pfWheelIsland: cc.Prefab = null;
    @property(cc.Prefab)
    pfWheelShadow: cc.Prefab = null;
    @property(cc.Prefab)
    pfCannonIsland: cc.Prefab = null;
    @property(cc.Prefab)
    pfProp: cc.Prefab = null;
    @property(cc.Prefab)
    pfPropEffect: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:

    @property([cc.SpriteFrame])
    propFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    islandFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    shadowFrames: cc.SpriteFrame[] = [];
    private wheelIslandPool;
    private cannonIslandPool;
    private propPool;
    private propEffectPool;

    private fitLayer = false;
    private fitVx = 0;

    public ctx: cc.Graphics;

    public islandArr = [];
    private islandOrigin;
    private jumpPos = null;
    private cannonPos = null;
    private verticalPos = null;
    public dynamicProps = [];

    public islandNum = 0;

    onLoad() {
        CollisionMgr.mCollisionMgr = this;
        CollisionMgr.mCollisionMgr.ctx = CollisionMgr.mCollisionMgr.ndGraphic.getComponent(cc.Graphics);
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
        this.propEffectPool = NodePoolManager.create(this.pfPropEffect);
    }

    // 添加小岛
    static addIsland() {
        let island = CollisionMgr.mCollisionMgr.wheelIslandPool.get();
        let comp: Island = island.getComponent(Island);
        let length = CollisionMgr.mCollisionMgr.islandArr.length;
        if (length == 0) {
            island.position = cc.v2(90, 480);
            comp.setType(Island.IslandType.Normal);
            comp.setWheel();
            CollisionMgr.mCollisionMgr.islandArr.push(island);
            island.parent = GameCtr.ins.mGame.ndIslandLayer;
            comp.idx = CollisionMgr.mCollisionMgr.islandNum;
            CollisionMgr.mCollisionMgr.islandNum++;
            return;
        }

        let lastIsland = CollisionMgr.mCollisionMgr.islandArr[length - 1];
        let lastComp: Island = lastIsland.getComponent(Island);

        let randType = Math.ceil(Math.random() * 20);
        if (randType == 20) {
            if (lastComp.type != Island.IslandType.Vertical) {
                island = CollisionMgr.mCollisionMgr.cannonIslandPool.get();
                comp = island.getComponent(Island);
                comp.setType(Island.IslandType.Cannon);
            } else {
                island = CollisionMgr.mCollisionMgr.wheelIslandPool.get();
                comp = island.getComponent(Island);
                comp.setType(Island.IslandType.Normal);
            }
        } else if (randType <= 18) {
            comp.setType(Island.IslandType.Normal);
        } else if (randType > 18 && randType <= 19) {
            if (lastComp.type != Island.IslandType.Cannon) {
                comp.setType(Island.IslandType.Vertical);
            } else {
                comp.setType(Island.IslandType.Normal);
            }
        }
        comp.idx = CollisionMgr.mCollisionMgr.islandNum;
        CollisionMgr.mCollisionMgr.islandNum++;
        let idx = Math.floor(Math.random() * CollisionMgr.mCollisionMgr.islandFrames.length);
        if(idx == 3 && GameData.currentMap == 0) idx = 4;

        comp.setWheel(idx);
        island.parent = GameCtr.ins.mGame.ndIslandLayer;
        CollisionMgr.mCollisionMgr.setIslandPostion(island);

        let randNum = Math.random() * 100;
        if (randNum <= 5) {
            comp.setRotateSpeed(-1);
        }else {
            comp.setRotateSpeed(1);
        }
    }

    // 获取生成小岛的随机参数
    static getIslandRank(difficulty = -1) {
        let data = {
            rotation: 0,
            time: 0,
            addNum: 0
        };
        if (difficulty < 0) {
            difficulty = GameData.currentMap;
        }
        switch (difficulty) {
            case 0:
                {
                    let rNum = Math.random() * 10;
                    if (rNum < 2) {
                        data.rotation = 35;
                        data.time = Math.random() * 1 / 10 + 0.7;
                        data.addNum = 60;
                    } else if (rNum >= 2 && rNum < 8) {
                        data.rotation = Math.random() * 30 + 50;
                        data.time = Math.random() * 1 / 10 + 0.6;
                    } else {
                        data.rotation = Math.random() * 40 + 90;
                        data.time = Math.random() * 1 / 10 + 0.6;
                    }
                }
                break;
            case 1:
                {
                    let rNum = Math.random() * 10;
                    if (rNum < 2) {
                        data.rotation = 35;
                        data.time = Math.random() * 1 / 10 + 0.7;
                        data.addNum = 60;
                    } else if (rNum >= 2 && rNum < 7) {
                        data.rotation = Math.random() * 30 + 60;
                        data.time = Math.random() * 1 / 10 + 0.6;
                    } else if (rNum >= 7 && rNum < 8) {
                        data.rotation = Math.random() * 5 + 25;
                        data.time = Math.random() * 2 / 10 + 1.3;
                    } else {
                        data.rotation = Math.random() * 40 + 90;
                        data.time = Math.random() * 1 / 10 + 0.6;
                    }
                }
                break;
            case 2:
                {
                    let rNum = Math.random() * 10;
                    if (rNum < 2) {
                        data.rotation = 35;
                        data.time = Math.random() * 1 / 10 + 0.7;
                        data.addNum = 60;
                    } else if (rNum >= 2 && rNum < 6) {
                        data.rotation = Math.random() * 30 + 60;
                        data.time = Math.random() * 1 / 10 + 0.6;
                    } else if (rNum >= 6 && rNum < 8) {
                        data.rotation = Math.random() * 5 + 25;
                        data.time = Math.random() * 4 / 10 + 1.3;
                    } else {
                        data.rotation = Math.random() * 40 + 90;
                        data.time = Math.random() * 1 / 10 + 0.6;
                    }
                }
                break;
            case 3:
                {
                    if (CollisionMgr.mCollisionMgr.islandNum <= 20) {
                        data = CollisionMgr.getIslandRank(0);
                    } else if (CollisionMgr.mCollisionMgr.islandNum > 20 && CollisionMgr.mCollisionMgr.islandNum <= 40) {
                        data = CollisionMgr.getIslandRank(1);
                    } else if (CollisionMgr.mCollisionMgr.islandNum > 40 && CollisionMgr.mCollisionMgr.islandNum <= 60) {
                        data = CollisionMgr.getIslandRank(2);
                    } else {
                        let rNum = Math.random() * 10;
                        if (rNum < 1) {
                            data.rotation = 35;
                            data.time = Math.random() * 1 / 10 + 0.7;
                            data.addNum = 60;
                        } else if (rNum >= 1 && rNum < 3) {
                            data.rotation = Math.random() * 30 + 60;
                            data.time = Math.random() * 1 / 10 + 0.6;
                        } else if (rNum >= 3 && rNum > 9) {
                            data.rotation = Math.random() * 5 + 25;
                            data.time = Math.random() * 4 / 10 + 1.3;
                        } else {
                            data.rotation = Math.random() * 40 + 90;
                            data.time = Math.random() * 1 / 10 + 0.6;
                        }
                    }
                }
                break;
        }
        return data;
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
        let data = CollisionMgr.getIslandRank();
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
            time = Math.random() * 2 / 10 + 0.8;
        }
        else {
            rotation = data.rotation;
            time = data.time;
            addNum = data.addNum > 0 ? comp.radius : 0;
            if (comp.type == Island.IslandType.Cannon) {
                rotation = Math.random() * 40 + 90;
                time = Math.random() * 1 / 10 + 0.7;
            }
        }
        radius = lastComp.radius + 25;
        let radian = cc.degreesToRadians(rotation);
        let vec = GameCtr.ins.mPirate.vec;
        let vx = Math.sin(radian) * vec;
        originX = Math.sin(radian) * radius;
        let vy = Math.cos(radian) * vec;
        originY = Math.cos(radian) * radius;
        let offsetX = vx * time;
        let offsetY = vy * time + gravity * time * time / 2;
        let cY = vy + gravity * time;
        let finalRotation;
        if (cY == 0) {
            finalRotation = 90;
        } else if (cY > 0) {
            finalRotation = cc.radiansToDegrees(Math.atan(vx / cY));
        } else if (cY < 0) {
            cY = Math.abs(cY);
            finalRotation = 180 - cc.radiansToDegrees(Math.atan(vx / cY));
        }
        let finalRadian = cc.degreesToRadians(finalRotation);
        let addX = comp.radius * Math.sin(finalRadian);
        let addY = comp.radius * Math.cos(finalRadian);

        island.x = lastIsland.x + originX + offsetX + addX;
        island.y = lastIsland.y + originY + offsetY + addY;
        CollisionMgr.mCollisionMgr.islandArr.push(island);
        CollisionMgr.drawRoute(cc.pAdd(lastIsland.position, cc.v2(originX, originY)), time, cc.v2(vx, vy), gravity);
        CollisionMgr.getPropPos(cc.pAdd(lastIsland.position, cc.v2(originX, originY)), time, cc.v2(vx, vy), gravity, lastComp, comp)
    }

    // 路径描点
    static drawRoute(origin, time, vec, gravity) {
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
                lastPos = pos;
                dt += 0.01;
            } else {
                dt += 0.005;
            }
        }
    }

    // 获取道具位置
    private static getPropPos(origin, time, vec, gravity, lastIsland: Island, island: Island) {
        let dt = 0;
        let lastPos = origin;
        let posArr = [];
        while (dt < time) {
            let x = vec.x * dt + origin.x;
            let y = vec.y * dt + gravity * dt * dt / 2 + origin.y;
            let pos = cc.v2(x, y);
            if (cc.pDistance(pos, island.node.position) <= propDistance + island.radius) {
                break;
            }
            let distance = cc.pDistance(lastPos, pos);
            if (distance > propDistance) {
                let rotation = 0;
                let cY = vec.y + gravity * dt;
                if (cY == 0) {
                    rotation = 90;
                } else if (cY > 0) {
                    rotation = cc.radiansToDegrees(Math.atan(vec.x / cY));
                } else if (cY < 0) {
                    cY = Math.abs(cY);
                    rotation = 180 - cc.radiansToDegrees(Math.atan(vec.x / cY));
                }
                let obj = { pos: pos, rotation: rotation, time: dt };
                posArr.push(obj);
                lastPos = pos;
                dt += 0.01;
            } else {
                dt += 0.005;
            }
        }
        CollisionMgr.addProp(posArr, lastIsland);
        if (lastIsland.type != Island.IslandType.Vertical && lastIsland.type != Island.IslandType.Cannon) {
            CollisionMgr.addBoom(origin, posArr, vec, gravity);
        }
    }

    // 获取竖直炸弹的中间点
    static getTopPos(origin, posArr, vec, gravity) {
        let x = (posArr[posArr.length - 1].pos.x - origin.x) / 2;
        let dt = x / vec.x;
        let y = origin.y + vec.y * dt + gravity * dt * dt / 2;
        return cc.v2(origin.x + x, y);
    }

    // 获取两侧炸弹的坐标点
    static getSidePos(posArr) {
        let distance = 60;
        for (let i = 0; i < posArr.length; i++) {
            let info = posArr[i];
            let pos = info.pos;
            let rotation = info.rotation;
            let radian = cc.degreesToRadians(rotation);
            let outX = pos.x - Math.cos(radian) * distance;
            let outY = pos.y + Math.sin(radian) * distance;
            let inX = pos.x + Math.cos(radian) * distance;
            let inY = pos.y - Math.sin(radian) * distance;
            let boom = CollisionMgr.mCollisionMgr.propPool.get();
            CollisionMgr.mCollisionMgr.islandLayer.addChild(boom);
            let comp: Props = boom.getComponent(Props);
            comp.setType(Props.PropType.BOOM);
            boom.rotation = Math.random() * 360;
            if (i % 2 == 0) {
                boom.position = cc.v2(outX, outY);
            } else {
                boom.position = cc.v2(inX, inY);
            }

        }
    }

    // 增加炸弹
    static addBoom(origin, posArr, vec, gravity) {
        if (CollisionMgr.mCollisionMgr.islandNum <= 5) return;                       //前五关不出炸弹
        let tmpRand = Math.random() * 100;
        let boomRand = GameData.currentMap < 3 ? 10 : 20;

        if (tmpRand > boomRand) return;                                                    //炸弹概率10%
        let rand = Math.random() * 10;
        let boomNum = 0;
        if (rand < 2) {
            boomNum = 8;
            let referPos = CollisionMgr.getTopPos(origin, posArr, vec, gravity);
            let power = Math.ceil(Math.random() * 2);
            let x = referPos.x + Math.pow(-1, power) * Math.random() * 5 + 10;
            let topY = referPos.y + 420;
            for (let i = 1; i <= boomNum; i++) {
                let boom = CollisionMgr.mCollisionMgr.propPool.get();
                CollisionMgr.mCollisionMgr.islandLayer.addChild(boom);
                let comp: Props = boom.getComponent(Props);
                comp.setType(Props.PropType.BOOM);
                boom.rotation = Math.random() * 360;
                let y = topY - i * 120;
                boom.position = cc.v2(x, y);
            }
        } else if (rand >= 2) {
            CollisionMgr.getSidePos(posArr);
        }
    }

    // 获取道具位置概率
    static getPropRank(difficulty = -1) {
        if (difficulty < 0) difficulty = GameData.currentMap;
        let data = { frontRand: 0, middleRand: 0, tailRand: 0 };
        switch (difficulty) {
            case 0:
                data.frontRand = 99;
                data.middleRand = 100;
                break;
            case 1:
                data.frontRand = 50;
                data.middleRand = 80;
                data.tailRand = 100;
                break;
            case 2:
                data.frontRand = 10;
                data.middleRand = 70;
                data.tailRand = 100;
                break;
            case 3:
                if (CollisionMgr.mCollisionMgr.islandNum <= 20) {
                    data = CollisionMgr.getPropRank(0);
                } else if (CollisionMgr.mCollisionMgr.islandNum > 20 && CollisionMgr.mCollisionMgr.islandNum <= 40) {
                    data = CollisionMgr.getPropRank(1);
                } else if (CollisionMgr.mCollisionMgr.islandNum > 40 && CollisionMgr.mCollisionMgr.islandNum <= 60) {
                    data = CollisionMgr.getPropRank(2);
                } else {
                    data.frontRand = 5;
                    data.middleRand = 25;
                    data.tailRand = 100;
                }
                break;
        }
        return data;

    }

    // 增加道具
    static addProp(posArr, lastIsland) {
        if (posArr.length == 0) {
            return;
        }
        let data = CollisionMgr.getPropRank();
        let posRand = Math.random() * 100;
        let startIdx = 1;
        let endIdx = null;
        let max = 0;
        if (posArr.length <= 3) {
            max = 1;
        } else {
            if (posRand < data.frontRand) {
                startIdx = Math.floor(Math.random() * 2);
                max = posArr.length - (startIdx + 1);
                max = max > 6 ? 6 : max;
            } else if (posRand >= data.frontRand && posRand < data.middleRand) {
                if (posArr.length > 4) {
                    startIdx = Math.floor(Math.random() * 2) + 2;
                    max = posArr.length - (startIdx + 1);
                    max = max > 6 ? 6 : max;
                } else {
                    startIdx = 2;
                    max = posArr.length - (startIdx + 1);
                }
            } else {
                endIdx = posArr.length - Math.ceil(Math.random() * 2);
                max = max = posArr.length - (endIdx + 1);
                max = max > 6 ? 6 : max;
            }
        }

        let propNum = Math.ceil(Math.random() * (max - 1)) + 1;
        if (endIdx) {
            startIdx = endIdx - propNum;
        }
        if (startIdx + propNum >= posArr.length) {
            startIdx--;
        }

        CollisionMgr.addGold(posArr, propNum, startIdx, lastIsland);

        let rand = Math.random() * 100;
        let alarmRand = Math.random() * 8 + 2;
        let lastProp = CollisionMgr.mCollisionMgr.propPool.get();
        if (!posArr[propNum + startIdx]) {
            cc.log("!!!!!!!!!!!!!!!!");
            return;
        }
        let comp: Props = lastProp.getComponent(Props);
        CollisionMgr.mCollisionMgr.islandLayer.addChild(lastProp);
        lastProp.position = posArr[propNum + startIdx].pos;
        lastProp.rotation = posArr[propNum + startIdx].rotation;
        lastIsland.props.push(lastProp);
        if (rand < 6) {
            comp.setType(Props.PropType.SHIELD);
        } else if (rand >= 6 && rand < 12) {
            comp.setType(Props.PropType.MAGNET);
        } else if (rand >= 12 && rand < 18) {
            comp.setType(Props.PropType.SIGHT);
        } else if (rand >= 18 && rand < 24) {
            comp.setType(Props.PropType.ROTATE);
        } else if (rand >= 24 && rand < 30) {
            comp.setType(Props.PropType.CHEST);
        } else if (rand >= 30 && rand < 30 + alarmRand) {
            comp.setType(Props.PropType.ALARM);
        } else {
            comp.setType(Props.PropType.GOLD);
        }
        comp.shake(posArr[propNum].time);
    }

    // 增加金币
    static addGold(posArr, propNum, startIdx, lastIsland) {
        if(posArr.length == 0) {
            cc.log("!!!!!!!!!!")
        }
        for (let i = startIdx; i < propNum + startIdx; i++) {
            let info = posArr[i];
            if (!info) {
                cc.log("idx wrong!!!!!!");
            }
            let gold = CollisionMgr.mCollisionMgr.propPool.get();
            let comp: Props = gold.getComponent(Props);
            CollisionMgr.mCollisionMgr.islandLayer.addChild(gold);
            gold.position = info.pos;
            gold.rotation = info.rotation;
            comp.setType(Props.PropType.GOLD);
            comp.shake(info.time);
            lastIsland.props.push(gold);
        }
    }

    static addPropEffect(pos, type, isShowTime = false) {
        let nd = CollisionMgr.mCollisionMgr.propEffectPool.get();
        nd.parent = CollisionMgr.mCollisionMgr.islandLayer;
        nd.position = pos;
        let propEffect: PropEffect = nd.getComponent(PropEffect);
        switch (type) {
            case CollisionBase.CollisionType.GOLD:
                propEffect.showGoldEffect();
                break;
            case CollisionBase.CollisionType.CHEST:
                propEffect.showChestEffect();
                break;
            case CollisionBase.CollisionType.BOOM:
                propEffect.showBombEffect();
                if(isShowTime) propEffect.showTimeEffect();
                CollisionMgr.mCollisionMgr.islandLayer.runAction(cc.sequence(
                    cc.moveBy(0.06, cc.v2(0, 3)),
                    cc.moveBy(0.12, cc.v2(0, -6)),
                    cc.moveBy(0.06, cc.v2(0, 3)),
                ));
                break;
            default:
                propEffect.showCommonEffect();
                break;
        }

        setTimeout(() => { CollisionMgr.mCollisionMgr.propEffectPool.put(nd) }, 2000);
    }

    // 设置道具皮肤
    static setPropFrame(spr: cc.Sprite, idx) {
        let frame = CollisionMgr.mCollisionMgr.propFrames[idx];
        spr.spriteFrame = frame;
    }

    // 让5个小岛正向旋转
    static rightIsland() {
        let idx = CollisionMgr.getIslandIdx(GameCtr.ins.mPirate.lastIsland);
        for (let i = 1; i <= 5; i++) {
            let island = CollisionMgr.mCollisionMgr.islandArr[idx + i];
            if (island) {
                let comp: Island = island.getComponent(Island);
                comp.setRotateSpeed(1);
            }
        }
    }

    // 移除小岛
    static removeIsland(idx) {
        let tmpArr = [];

        for(let i = 0; i<CollisionMgr.mCollisionMgr.islandArr.length; i++) {
            let nd = CollisionMgr.mCollisionMgr.islandArr[i];
            let comp: Island = nd.getComponent(Island);
            cc.log("comp.idx == ", comp.idx);
            if(comp.idx < idx-1) {
                if (comp.type == Island.IslandType.Cannon) {
                    CollisionMgr.mCollisionMgr.cannonIslandPool.put(nd);
                } else {
                    CollisionMgr.mCollisionMgr.wheelIslandPool.put(nd);
                }
                comp.isLanded = false;
                comp.props = [];
                comp.idx = 0;

                CollisionMgr.mCollisionMgr.islandArr.splice(i, 1);
            }
        }
    }

    // 移除道具
    static removeProp(prop) {
        let comp: Props = prop.getComponent(Props);
        if (comp.type != Props.PropType.CHEST && comp.type != Props.PropType.BOOM) {
            CollisionMgr.removeDynamic(prop);
        }
        comp.reset();
        CollisionMgr.mCollisionMgr.propPool.put(prop);
    }

    // 移除动态道具
    static removeDynamic(prop) {
        for (let i = 0; i < CollisionMgr.mCollisionMgr.dynamicProps.length; i++) {
            let nd = CollisionMgr.mCollisionMgr.dynamicProps[i];
            if (prop == nd) {
                CollisionMgr.mCollisionMgr.dynamicProps.splice(i, 1);
            }
        }
    }

    static getIslandIdx(island) {
        let tComp: Island = island.getComponent(Island);
        for (let i = 0; i < CollisionMgr.mCollisionMgr.islandArr.length; i++) {
            let item = CollisionMgr.mCollisionMgr.islandArr[i];
            let comp: Island = item.getComponent(Island);
            if (comp.idx == tComp.idx) {
                return i;
            }
        }
    }

    static fitIslandLayer(vx) {
        if (GameCtr.isGameOver) return;
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

        let lastIsland = CollisionMgr.mCollisionMgr.islandArr[idx - 1];
        let nextIsland = CollisionMgr.mCollisionMgr.islandArr[idx + 1];
        if (!lastIsland || !nextIsland) {
            cc.log("wrong idx!!!!!!");
        }
        let lastScale = CollisionMgr.mCollisionMgr.islandLayer.scale;
        // let radius = island.getComponent(Island).radius + nextIsland.getComponent(Island).radius;
        // let distanceX = nextIsland.position.x - island.position.x;
        // let distanceY = island.position.y - nextIsland.position.y;
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
        if (GameCtr.isGameOver || GameCtr.isPause) return;
        if (CollisionMgr.mCollisionMgr.fitLayer && CollisionMgr.mCollisionMgr.fitVx > 0) {
            CollisionMgr.mCollisionMgr.islandLayer.x -= CollisionMgr.mCollisionMgr.fitVx * dt / 2;
            for (let i = 0; i < CollisionMgr.mCollisionMgr.ndBg.childrenCount; i++) {
                let nd = CollisionMgr.mCollisionMgr.ndBg.children[i];
                nd.x -= CollisionMgr.mCollisionMgr.fitVx * dt/3;
                if (nd.x <= -(bgWidth + winWidth)) {
                    nd.x += bgWidth*2;
                }
            }
        }
    }
}
