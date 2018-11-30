import GameCtr from "../../Controller/GameCtr";
import CollisionBase from "./CollisionBase";
import CollisionMgr from "./CollisionMgr";
import Island from "./Island";
import Props from "./Props";
import GameData from "../../Common/GameData";
import AudioManager from "../../Common/AudioManager";
import Game from "./Game";
import Util from "../../Common/Util";

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

    static BuffType = cc.Enum({                                    //buff状态
        NONE: 0,
        MAGNET: 100,
        SHIELD: 101,
        MANGET_SHIELD: 102,
    });

    static Velocity = cc.Enum({
        Normal: 400,
        Fast: 500,
        Slow: 300,
    });

    @property({
        type: Pirate.PirateType
    })
    type = Pirate.PirateType.CaptainP;

    @property({
        type: Pirate.Velocity
    })
    vec = Pirate.Velocity.Normal;

    @property({
        type: Pirate.BuffType
    })
    buff = Pirate.BuffType.NONE;

    @property(cc.Sprite)
    sprPirate: cc.Sprite = null;
    @property(cc.Node)
    ndLine: cc.Node = null;
    @property(cc.Node)
    ndShield: cc.Node = null;
    @property(cc.Node)
    ndMagnet: cc.Node = null;
    @property(cc.CircleCollider)
    magnetCollider: cc.CircleCollider = null;
    @property([cc.SpriteFrame])
    frames: cc.SpriteFrame[] = [];

    private gravity = -800;
    private landOnCannon = false;                           //是否降落在大炮上
    private beginJump = false;                              //是否开始跳跃
    private beginShoot = false;                             //是否开始发射
    private isPirateAlive = true;                           //角色是否死亡
    private isInitial = true;                               //是否刚初始
    private jumpTime = 0;                                   //跳跃次数
    private vx = 0;                                         //跳跃初速度X
    private vy = 0;                                         //跳跃初速度Y
    private jumpRotation = 0;                               //跳跃角度
    private moveDt = 0;                                     //role跳跃总时间
    private originPos;                                      //初始位置
    public lastIsland = null;
    private islandLayerOrigin = cc.v2(0, 0);

    private shieldTime = 0;                                 //盾牌时间
    private magnetTime = 0;                                 //磁铁时间
    private sightTime = 0;                                  //瞄准时间
    private shakeChest = false;

    private tmpGold = 0;                                    //每次跳跃临时金币数

    onLoad() {
        GameCtr.getInstance().setPirate(this);
    }

    start() {
        this.originPos = this.node.position;
        this.beginJump = true;
        this.jumpTime = 2;
    }

    setType(type) {
        this.type = type;
        switch (type) {
            case Pirate.PirateType.CaptainP:
                this.sprPirate.spriteFrame = this.frames[0];
                this.vec = Pirate.Velocity.Normal;
                break;
            case Pirate.PirateType.Sparklet:
                this.sprPirate.spriteFrame = this.frames[1];
                this.vec = Pirate.Velocity.Fast;
                break;
            case Pirate.PirateType.Hook:
                this.sprPirate.spriteFrame = this.frames[2];
                this.vec = Pirate.Velocity.Normal;
                break;
            case Pirate.PirateType.Leavened:
                this.sprPirate.spriteFrame = this.frames[3];
                this.vec = Pirate.Velocity.Slow;
                break;
            case Pirate.PirateType.Crutch:
                this.sprPirate.spriteFrame = this.frames[4];
                this.vec = Pirate.Velocity.Normal;
                break;
        }
    }

    jump() {
        if (this.beginShoot || this.landOnCannon) return;
        this.beginJump = true;
        this.ndLine.active = false;
        if (this.jumpTime == 0) {
            this.gravity = -800;
            this.islandLayerOrigin = GameCtr.ins.mGame.ndIslandLayer.position;
            let selfWPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            if (!this.node.parent.parent) {
                cc.log("something wrong!!!!!!!!!!!!");
            }
            let parentWPos = this.node.parent.parent.convertToWorldSpaceAR(this.node.parent.position);
            let vector = cc.v2(selfWPos.x - parentWPos.x, selfWPos.y - parentWPos.y);
            let radian = cc.pAngleSigned(vector, cc.v2(0, 1));
            this.jumpRotation = cc.radiansToDegrees(radian);
            // cc.log("rotation == " + rotation);
            this.vx = Math.sin(radian) * this.vec;
            this.vy = Math.cos(radian) * this.vec;
            this.moveDt = 0;
            this.node.parent = GameCtr.ins.mGame.ndIslandLayer;
            let cPos = this.node.parent.convertToNodeSpaceAR(selfWPos);
            this.node.position = cPos;
            this.node.rotation = this.jumpRotation;
            CollisionMgr.fitIslandLayer(this.vx);
        } else if (this.jumpTime == 1 && this.moveDt > 0.2) {
            this.moveDt = 0;
            if (this.jumpRotation >= 90) {
                this.jumpRotation = 45;
                let radian = cc.degreesToRadians(this.jumpRotation);
                this.vx = Math.sin(radian) * this.vec;
                this.vy = Math.cos(radian) * this.vec;
            }
            GameData.doubleJump++;
        } else {
            return;
        }
        this.originPos = this.node.position;
        this.jumpTime++;
        AudioManager.getInstance().playSound("audio/jump", false);
    }

    onCollisionEnter(other, self) {
        let otherCollision: CollisionBase = other.node.getComponent(CollisionBase);
        let comp: Props = otherCollision.node.getComponent(Props);
        if (!this.beginJump && !this.beginShoot) {
            if (!comp || !comp.autoMove) return;
        }
        if (self == this.magnetCollider) {
            if (this.magnetTime > 0 && comp) {
                comp.moveToPirate();
            }
        } else {
            switch (otherCollision.collisionType) {
                case CollisionBase.CollisionType.ISLAND:
                    this.landOnIsland(other.node);
                    AudioManager.getInstance().playSound("audio/land", false);
                    break;
                case CollisionBase.CollisionType.GOLD:
                    CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.GOLD);
                    CollisionMgr.removeProp(other.node);
                    GameCtr.ins.mGame.addGold();
                    if (this.magnetTime > 0) {
                        GameData.flyingGold++;
                    }
                    this.tmpGold++;
                    AudioManager.getInstance().playSound("audio/gold", false);
                    break;
                case CollisionBase.CollisionType.CHEST:
                    this.shakeChest = true;
                    other.node.runAction(cc.sequence(
                        cc.moveBy(0.025, cc.v2(-5, 0)),
                        cc.moveBy(0.05, cc.v2(10, 0)),
                        cc.moveBy(0.05, cc.v2(-10, 0)),
                        cc.moveBy(0.05, cc.v2(10, 0)),
                        cc.moveBy(0.05, cc.v2(-10, 0)),
                        cc.moveBy(0.025, cc.v2(5, 0)),
                        cc.callFunc(() => {
                            CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.CHEST);
                            CollisionMgr.removeProp(other.node);
                            GameCtr.ins.mGame.addGold(10);
                            this.shakeChest = false;
                        }),
                    ));
                    this.tmpGold += 10;
                    if (GameData.currentRole == 1) {
                        GameData.hitBox++;
                    } else if (GameData.currentRole == 2) {
                        GameData.captainHitBox++;
                    }
                    AudioManager.getInstance().playSound("audio/propChest", false);
                    let collision = other.node.getComponent(cc.BoxCollider);
                    collision.enabled = false;
                    break;
                case CollisionBase.CollisionType.ALARM:
                    CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.ALARM);
                    CollisionMgr.removeProp(other.node);
                    GameCtr.ins.mGame.addTime(10);
                    if (GameData.currentRole == 3) {
                        GameData.gatherTimer++;
                    }
                    AudioManager.getInstance().playSound("audio/propTime", false);
                    GameCtr.ins.mGame.showPropEffect(Game.GoodsType.ALARM);
                    this.tmpGold++;
                    break;
                case CollisionBase.CollisionType.MAGNET:
                    CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.MAGNET);
                    this.showMagnet();
                    CollisionMgr.removeProp(other.node);
                    AudioManager.getInstance().playSound("audio/prop", false);
                    GameCtr.ins.mGame.showPropEffect(CollisionBase.CollisionType.MAGNET);
                    this.tmpGold++;
                    break;
                case CollisionBase.CollisionType.SHIELD:
                    CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.SHIELD);
                    this.showShield();
                    CollisionMgr.removeProp(other.node);
                    AudioManager.getInstance().playSound("audio/prop", false);
                    GameCtr.ins.mGame.showPropEffect(CollisionBase.CollisionType.SHIELD);
                    this.tmpGold++;
                    break;
                case CollisionBase.CollisionType.SIGHT:
                    CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.SIGHT);
                    this.showSight();
                    CollisionMgr.removeProp(other.node);
                    AudioManager.getInstance().playSound("audio/prop", false);
                    GameCtr.ins.mGame.showPropEffect(CollisionBase.CollisionType.SIGHT);
                    this.tmpGold++;
                    break;
                case CollisionBase.CollisionType.ROTATE:
                    CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.ROTATE);
                    CollisionMgr.removeProp(other.node);
                    AudioManager.getInstance().playSound("audio/prop", false);
                    GameCtr.ins.mGame.showPropEffect(CollisionBase.CollisionType.ROTATE);
                    CollisionMgr.rightIsland();
                    this.tmpGold++;
                    break;
                case CollisionBase.CollisionType.BOOM:
                    let isShowTime = true;
                    if (this.shieldTime > 0) isShowTime = false;
                    CollisionMgr.addPropEffect(other.node.position, CollisionBase.CollisionType.BOOM, isShowTime);
                    CollisionMgr.removeProp(other.node);
                    if (this.shieldTime <= 0) {
                        GameCtr.ins.mGame.addTime(-1);
                    } else {
                        GameData.dismantleBomb++;
                    }
                    AudioManager.getInstance().playSound("audio/propBomb", false);
                    break;
            }
            this.removePropOfLastIsland(other.node);
        }
    }

    removePropOfLastIsland(prop) {
        if (!this.lastIsland) return;
        let comp: Island = this.lastIsland.getComponent(Island);
        for (let i = 0; i < comp.props.length; i++) {
            let nd = comp.props[i];
            if (prop == nd) {
                comp.props.splice(i, 1);
            }
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
        this.node.parent = GameCtr.ins.mGame.ndIslandLayer;
        let cPos = this.node.parent.convertToNodeSpaceAR(selfWPos);
        this.node.position = cPos;
        this.originPos = this.node.position;
        this.beginShoot = true;
        this.ndLine.active = false;
    }

    landOnIsland(island) {
        this.beginJump = false;
        this.beginShoot = false;
        this.isInitial = false;

        CollisionMgr.stopFit();
        this.judgeCombo();

        this.tmpGold = 0;
        this.jumpTime = 0;
        this.moveDt = 0;
        let comp: Island = island.getComponent(Island);

        if (GameCtr.ins.mGame.time <= 0 && comp.type != Island.IslandType.Cannon) {
            GameCtr.isGameOver = true;
            GameCtr.gameOver();
            AudioManager.getInstance().playSound("audio/gameOver", false);
        }

        let selfWPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        this.node.parent = island;
        let parentWPos = island.parent.convertToWorldSpaceAR(island.position);
        let vector = cc.v2(selfWPos.x - parentWPos.x, selfWPos.y - parentWPos.y);
        let radian = cc.pAngleSigned(vector, cc.v2(0, 1));
        let rotation = cc.radiansToDegrees(radian);

        let distance = comp.radius + 15;
        let x = island.x + distance * Math.sin(radian);
        let y = island.y + distance * Math.cos(radian);
        selfWPos = island.parent.convertToWorldSpaceAR(cc.v2(x, y));

        let cPos = island.convertToNodeSpaceAR(selfWPos);
        this.node.position = cPos;
        this.node.rotation = rotation - island.rotation;
        if (comp.type == Island.IslandType.Cannon) {
            this.node.rotation = 0;
            this.landOnCannon = true;
        } else {
            this.landOnCannon = false;
            this.ndLine.active = true;
        }

        let tmpPos = GameCtr.ins.mGame.ndIslandLayer.position;
        let offset = cc.pSub(tmpPos, this.islandLayerOrigin);
        if (!this.lastIsland) {
            this.lastIsland = island;
            return;
        } else {
            let lastComp = this.lastIsland.getComponent(Island);
            lastComp.isLanded = true;
            this.lastIsland = island;
            CollisionMgr.moveIslandLayer(offset);
            let num = comp.idx - lastComp.idx;
            for (let i = 0; i < num; i++) {
                CollisionMgr.addIsland();
            }
        }

        if (comp.type == Island.IslandType.Cannon) {
            this.node.position = cc.v2(-6, 0);
            let mask = Util.findChildByName("Root", island);
            mask.zIndex = 100;
            this.node.zIndex = 1;
            AudioManager.getInstance().playSound("audio/cannon", false);
            let ani = island.getChildByName("Root").getComponent(cc.Animation);
            ani.play();
            this.node.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.moveBy(0.2, cc.v2(0, 30)),
                cc.delayTime(0.2),
                cc.moveBy(0.2, cc.v2(0, 10)),
                cc.delayTime(0.2),
                cc.moveBy(0.2, cc.v2(0, 10)),
            ));
            this.scheduleOnce(() => { this.shoot(); }, 1.7);
        }
    }

    judgeCombo() {
        if (this.lastIsland) {
            let lastComp: Island = this.lastIsland.getComponent(Island);
            if (lastComp.props.length == 0) {
                GameCtr.ins.mGame.addCombo(this.tmpGold);
            } else {
                if (GameData.prop_luckyGrass > 0) {
                    GameData.prop_luckyGrass--;
                    GameCtr.ins.mGame.showPropEffect(Game.GoodsType.LUCKY_GRASS);
                } else {
                    GameData.omitGold += lastComp.props.length;
                    GameCtr.ins.mGame.clearCombo();
                }
            }
        }
    }

    movePirate(dt) {
        let lastPos = this.node.position;
        let vx = this.vx;
        let vy = this.vy;
        if (this.beginShoot) {
            vx *= 1.5;
            vy *= 1.5;
        }
        this.node.x = this.originPos.x + vx * this.moveDt;
        this.node.y = this.originPos.y + (vy * this.moveDt + this.gravity * this.moveDt * this.moveDt / 2);
        let cPos = this.node.position;
        let vector = cc.v2(cPos.x - lastPos.x, cPos.y - lastPos.y);
        let radian = cc.pAngleSigned(vector, cc.v2(0, 1));
        let rotation = cc.radiansToDegrees(radian);
        if (!this.isInitial) {
            this.node.rotation = rotation;
        }
        let wPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        if (wPos.y < -520) {
            CollisionMgr.stopFit();
            if (GameData.currentRole == 4) {
                this.revive();
                GameData.reviveTimes++;
            } else if (GameData.prop_revive > 0) {
                this.revive();
                GameData.prop_revive--;
            } else {
                AudioManager.getInstance().playSound("audio/dead", false);
                GameCtr.isGameOver = true;
                this.scheduleOnce(() => { GameCtr.gameOver(); }, 1.5);
            }
        }
    }


    revive() {
        this.isPirateAlive = false;
        this.vx = 0;
        this.vy = 0;
        this.node.rotation = 0;
        this.moveDt = 0;
        this.node.position = cc.v2(this.lastIsland.x, this.lastIsland.y + 150);
        this.originPos = this.node.position;
        let tmpPos = GameCtr.ins.mGame.ndIslandLayer.position;
        let offset = cc.pSub(tmpPos, this.islandLayerOrigin);
        CollisionMgr.moveIslandLayer(offset);
        this.scheduleOnce(() => {
            this.isInitial = true;
            this.isPirateAlive = true;
        }, 0.5);
        AudioManager.getInstance().playSound("audio/revive", false);
        GameCtr.ins.mGame.showPropEffect(Game.GoodsType.REVIVE);
    }

    // 显示瞄准线
    showSight() {
        this.sightTime = 10;
        CollisionMgr.mCollisionMgr.ndGraphic.active = true;
    }

    // 显示盾牌
    showShield() {
        this.shieldTime = 10;
        this.ndShield.active = true;
    }

    // 显示磁铁
    showMagnet() {
        this.magnetTime = 10;
        this.ndMagnet.active = true;
    }

    update(dt) {
        if (GameCtr.isGameOver || GameCtr.isPause) return;
        if ((this.beginJump || this.beginShoot) && !this.shakeChest && this.isPirateAlive) {
            this.moveDt += dt;
            this.movePirate(dt);
        }

        // 盾牌
        if (this.shieldTime > 0) {
            this.shieldTime -= dt;
            if (this.shieldTime >= 2.99 && this.shieldTime < 3.01) {
                this.ndShield.runAction(cc.repeat(cc.sequence(
                    cc.fadeOut(0.5),
                    cc.fadeIn(0.5)
                ), 3));
            }
        } else {
            this.ndShield.active = false;
        }

        // 磁铁
        if (this.magnetTime > 0) {
            this.magnetTime -= dt;
            if (this.magnetTime >= 2.99 && this.magnetTime < 3.01) {
                this.ndMagnet.runAction(cc.repeat(cc.sequence(
                    cc.fadeOut(0.5),
                    cc.fadeIn(0.5)
                ), 3));
            }
        } else {
            this.ndMagnet.active = false;
        }

        // 瞄准线
        if (this.sightTime > 0) {
            this.sightTime -= dt;
        } else {
            CollisionMgr.mCollisionMgr.ndGraphic.active = false;
        }
    }
}
