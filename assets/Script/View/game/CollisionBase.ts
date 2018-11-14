
const {ccclass, property} = cc._decorator;

@ccclass
export default class CollisionBase extends cc.Component {

    static CollisionType = cc.Enum({
        NONE: 0,
        PIRATE: 1,                                              //海盗
        GOLD: 2,                                                //金币
        BOOM: 3,                                                //炸弹
        CHEST: 4,                                               //宝箱
        MAGNET: 5,                                              //磁铁
        ALARM: 6,                                               //磁铁
        SIGHT: 7,                                               //磁铁
        ROTATE: 8,                                              //旋转
        SHIELD: 9,                                              //盾牌
        ISLAND: 10                                              //小岛
    });

    @property({
        type: CollisionBase.CollisionType
    })
    collisionType = CollisionBase.CollisionType.NONE;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
