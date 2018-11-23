import GameCtr from "../Controller/GameCtr";
import WXCtr from "../Controller/WXCtr";
import UserManager from "./UserManager";
import HttpCtr from "../Controller/HttpCtr";
import Util from "./Util";


const { ccclass, property } = cc._decorator;

const dataKeyConfig = {
    power: "data_1",                                                             //体力数量
    combo: "data_2",                                                             //连击数量
    doubleJump: "data_3",                                                        //连跳数量
    flyingGold: "data_4",                                                        //飞行的金币 
    omitGold: "data_5",                                                          //穿过的金币
    hitBox: "data_6",                                                            //头铁
    gatherTimer: "data_7",                                                       //时间之子
    reviveTimes: "data_8",                                                       //不死亡灵
    dismantleBomb: "data_9",                                                     //拆弹专家
    unlockRoles: "data_10",                                                      //大团圆
    levelUp: "data_11",                                                          //升级
    captainHitBox: "data_12",                                                    //钩宝箱

    /*道具*/
    prop_speedUp: "data_13",                                                     //加速道具
    prop_revive: "data_14",                                                      //复活道具
    prop_luckyGrass: "data_15",                                                  //幸运草道具
    prop_time: "data_16",                                                        //时间道具

    /*角色赚取金币*/
    gold_captain: "data_17",                                                     //船长赚取金币
    gold_sparklet: "data_18",                                                    //刀妹赚取金币
    gold_hook: "data_19",                                                        //白胡子赚取金币
    gold_leavened: "data_20",                                                    //厨子赚取金币
    gold_crutch: "data_21",                                                      //骷髅赚取金币
    maxFightGold: "data_22",                                                     //最大战斗获得金币
    currentShopIndex: "data_23",                                                 //当前商铺索引（道具 地图 角色  家园）
    currentMap: "data_24",                                                       //当前使用地图
    currentRole: "data_25",                                                      //当前使用角色
    currentHome: "data_26",                                                      //当前家园

    /*地图状态*/
    map0: "data_27",                                                             //地图0
    map1: "data_28",                                                             //地图1
    map2: "data_29",                                                             //地图2
    map3: "data_30",                                                             //地图3

    jewelLevel: "data2_3",                                                       //宝石等级
    jewelCount: "data2_4",                                                       //宝石数量


    homeWorld_prop0: "data2_5",                                                  //家园道具1
    homeWorld_prop1: "data2_6",                                                  //家园道具2
    homeWorld_prop2: "data2_7",                                                  //家园道具3
    homeWorld_prop3: "data2_8",                                                  //家园道具4

    maxScore: "data2_9",                                                        //最高分纪录
};


@ccclass
export default class GameData {
    private static _gold: number = 0;                                      //金币数量
    private static _diamond: number = 0;                                   //钻石数量
    private static _power: number = 0;                                     //体力数量
    private static _combo: number = 0;                                     //连击数量
    private static _doubleJump: number = 0;                                //连跳数量
    private static _flyingGold: number = 0;                                //飞行的金币 
    private static _omitGold: number = 0;                                  //穿过的金币
    private static _hitBox: number = 0;                                    //头铁
    private static _gatherTimer: number = 0;                               //时间之子
    private static _reviveTimes: number = 0;                               //不死亡灵
    private static _dismantleBomb: number = 0;                             //拆弹专家
    private static _unlockRoles: number = 0;                               //大团圆
    private static _levelUp: number = 0;                                   //升级
    private static _captainHitBox: number = 0;                             //钩宝箱   

    /* 道具 */
    private static _prop_speedUp: number = 0;                              //加速道具
    private static _prop_revive: number = 0;                               //复活道具
    private static _prop_luckyGrass: number = 0;                           //幸运草道具
    private static _prop_time: number = 0;                                 //时间道具

    /*角色等级*/
    private static _gold_captain: number = 0;                              //船长赚取金币     0：刚解锁 还未赚取金币
    private static _gold_sparklet: number = -1;                            //刀妹赚取金币    -1：未解锁
    private static _gold_hook: number = -1;                                //白胡子赚取金币  -1：未解锁
    private static _gold_leavened: number = -1;                            //厨子赚取金币    -1：未解锁
    private static _gold_crutch: number = -1;                              //骷髅赚取金币    -1：未解锁


    private static _maxFightGold: number = 0;                              //最大战斗金币
    private static _currentShopIndex: number = 0;                          //当前商铺索引（道具 地图 角色  家园）
    private static _currentMap: number = 0;                                //当前使用地图
    private static _currentRole: number = 0;                               //当前使用角色
    private static _currentHome: number = 0;                               //当前家园

    private static _map0: number = 0;                                      //地图0  -1:未解锁 0:已解锁 1:1星评价 2:2星评价 3:三星评价
    private static _map1: number = -1;                                      //地图1  -1:未解锁 0:已解锁 1:1星评价 2:2星评价 3:三星评价
    private static _map2: number = -1;                                      //地图2  -1:未解锁 0:已解锁 1:1星评价 2:2星评价 3:三星评价
    private static _map3: number = -1;                                      //地图3  -1:未解锁 0:已解锁 1:1星评价 2:2星评价 3:三星评价
    private static _jewelLevel: number = 1;                                 //宝石等级
    private static _jewelCount: number = 0;                                 //宝石数量

    private static _homeWorld_prop0: number = 0;                            //家园道具1
    private static _homeWorld_prop1: number = 0;                            //家园道具2
    private static _homeWorld_prop2: number = 0;                            //家园道具3
    private static _homeWorld_prop3: number = 0;                            //家园道具4

    public static jewelTimeCount = 0;                                      //宝石收集倒计时
    public static powerTime = 0;                                           //体力收集时间

    private static _maxScore: number = 0;                                //最高分纪录


    static rolesInfo = [
        { id: 0, name: "captain", price_gold: 0, price_diamond: 0 },
        { id: 1, name: "sparklet", price_gold: 2000, price_diamond: 0 },
        { id: 2, name: "hook", price_gold: 5000, price_diamond: 0 },
        { id: 3, name: "leavened", price_gold: 10000, price_diamond: 0 },
        { id: 4, name: "crutch", price_gold: 15000, price_diamond: 0 },
        { id: 5, name: "captain", price_gold: 0, price_diamond: 1000 }
    ]

    static mapsInfo = [
        { name: "map0", gold_price: 0, diamond_price: 0, rate: [200, 600, 900] },
        { name: "map1", gold_price: 2000, diamond_price: 0, rate: [800, 1100, 1350] },
        { name: "map2", gold_price: 0, diamond_price: 2000, rate: [700, 1100, 1200] },
        { name: "map3", gold_price: 20000, diamond_price: 0, rate: [-1, -1, -1] }
    ]

    static propsInfo = [
        { name: "luckyGrass", price: 50 },
        { name: "speedUp", price: 100 },
        { name: "revive", price: 200 },
        { name: "time", price: 100 },
    ]

    static homeWorldPropsInfo = [
        { name: "homeWorld_prop0", priceGet: 1000, priceUpLevel: 1000, initialDamage: 1 },
        { name: "homeWorld_prop1", priceGet: 1000, priceUpLevel: 1000, initialDamage: 2 },
        { name: "homeWorld_prop2", priceGet: 1000, priceUpLevel: 1000, initialDamage: 3 },
        { name: "homeWorld_prop3", priceGet: 1000, priceUpLevel: 1000, initialDamage: 4 }
    ]

    /* 家园解锁条件 以宝石等级为依据 */
    static homeLockLevel = [1, 3, 6, 10, 15]


    /*收集金币*/
    static collectGoldCof = [
        { target: 10000, bonus: 500 },
        { target: 20000, bonus: 1000 },
        { target: 40000, bonus: 2000 },
        { target: 80000, bonus: 3000 },
        { target: 200000, bonus: 5000 }
    ]

    /*连击*/
    static ComboCof = [
        { target: 1000, bonus: 500 },
        { target: 3000, bonus: 1000 },
        { target: 5000, bonus: 2000 },
        { target: 10000, bonus: 3000 },
        { target: 20000, bonus: 5000 },
    ]

    /*连跳*/
    static doubleJumpCof = [
        { target: 100, bonus: 500 },
        { target: 300, bonus: 1000 },
        { target: 1000, bonus: 2000 },
        { target: 5000, bonus: 3000 },
        { target: 10000, bonus: 5000 },
    ]

    /*飞行的金币*/
    static flyingGoldCof = [
        { target: 40, bonus: 500 },
        { target: 200, bonus: 1000 },
        { target: 500, bonus: 2000 },
        { target: 2000, bonus: 3000 },
        { target: 50000, bonus: 5000 },
    ]

    /*穿过金币*/
    static omitGoldCof = [
        { target: 500, bonus: 500 },
        { target: 2000, bonus: 1000 },
        { target: 5000, bonus: 2000 },
        { target: 10000, bonus: 3000 },
        { target: 20000, bonus: 5000 },
    ]

    /*头铁*/
    static hitBoxCof = [
        { target: 100, bonus: 500 },
        { target: 300, bonus: 1000 },
        { target: 1000, bonus: 2000 },
        { target: 5000, bonus: 3000 },
        { target: 10000, bonus: 5000 },
    ]

    /*时间之子*/
    static gatherTimerCof = [
        { target: 50, bonus: 500 },
        { target: 200, bonus: 1000 },
        { target: 500, bonus: 2000 },
        { target: 2000, bonus: 3000 },
        { target: 5000, bonus: 5000 },
    ]

    /*不死亡灵*/
    static reviveTimesCof = [
        { target: 10, bonus: 500 },
        { target: 50, bonus: 1000 },
        { target: 200, bonus: 2000 },
        { target: 1000, bonus: 3000 },
        { target: 10000, bonus: 5000 },
    ]

    /*拆弹专家*/
    static dismantleBombCof = [
        { target: 1000, bonus: 500 },
        { target: 2000, bonus: 1000 },
        { target: 5000, bonus: 2000 },
        { target: 10000, bonus: 3000 },
        { target: 20000, bonus: 5000 },
    ]

    /*大团圆*/
    static unlockRolesCof = [
        { target: 2, bonus: 500 },
        { target: 3, bonus: 1000 },
        { target: 4, bonus: 2000 },
        { target: 5, bonus: 3000 },
        { target: 6, bonus: 5000 },
    ]

    /*升级*/
    static levelUpCof = [
        { target: 5, bonus: 500 },
        { target: 10, bonus: 1000 },
        { target: 15, bonus: 2000 },
        { target: 20, bonus: 3000 },
        { target: 25, bonus: 5000 },
    ]

    /*钩宝箱*/
    static captainHitBoxCof = [
        { target: 200, bonus: 500 },
        { target: 500, bonus: 1000 },
        { target: 2000, bonus: 2000 },
        { target: 10000, bonus: 3000 },
        { target: 20000, bonus: 5000 },
    ]

    //设置玩家金币
    static set gold(gold) {
        if (gold < 0) {
            gold = 0;
        }
        GameData._gold = gold;
        GameData.setUserData({ gold: GameData._gold })
    }
    //获取玩家金币
    static get gold() {
        return GameData._gold;
    }

    //设置玩家钻石
    static set diamond(diamond) {
        if (diamond < 0) {
            diamond = 0
        }
        GameData._diamond = diamond;
        GameData.setUserData({ money: GameData._diamond })
    }
    //获取玩家钻石
    static get diamond() {
        return GameData._diamond;
    }

    //设置玩家体力
    static set power(power) {
        if (power < 0) {
            power = 0
        }
        GameData._power = power;
        GameData.setUserData({ power: GameData._power })
    }

    //获取玩家体力
    static get power() {
        return GameData._power;
    }

    //设置连击数量
    static set combo(combo) {
        if (combo < 0) {
            combo = 0;
        }
        GameData._combo = combo;
        GameData.setUserData({ combo: GameData._combo })
    }
    //获取连击数量
    static get combo() {
        return GameData._combo;
    }

    //设置连跳数量
    static set doubleJump(doubleJump) {
        if (doubleJump < 0) {
            doubleJump = 0
        }
        GameData._doubleJump = doubleJump;
        GameData.setUserData({ doubleJump: GameData._doubleJump })
    }

    //获取连跳数量
    static get doubleJump() {
        return GameData._doubleJump;
    }

    //设置飞行的金币（用磁铁吸收的金币）
    static set flyingGold(flyingGold) {
        if (flyingGold < 0) {
            flyingGold = 0;
        }
        GameData._flyingGold = flyingGold;
        GameData.setUserData({ flyingGold: GameData._flyingGold })
    }
    //获取飞行的金币（用磁铁吸收的金币）
    static get flyingGold() {
        return GameData._flyingGold;
    }

    //设置遗漏的金币
    static set omitGold(omitGold) {
        if (omitGold < 0) {
            omitGold = 0;
        }
        GameData._omitGold = omitGold;
        GameData.setUserData({ omitGold: GameData._omitGold })
    }
    //获取遗漏的金币
    static get omitGold() {
        return GameData._omitGold;
    }

    //设置头铁（刀妹撞箱子数量）
    static set hitBox(hitBox) {
        if (hitBox < 0) {
            hitBox = 0;
        }
        GameData._hitBox = hitBox;
        GameData.setUserData({ omitGold: GameData._hitBox })
    }
    //获取头铁（刀妹撞箱子数量）
    static get hitBox() {
        return GameData._hitBox;
    }

    //设置时间之子（厨子收集时间）
    static set gatherTimer(gatherTimer) {
        if (gatherTimer < 0) {
            gatherTimer = 0;
        }
        GameData._gatherTimer = gatherTimer;
        GameData.setUserData({ gatherTimer: GameData._gatherTimer })
    }

    //获取时间之子（厨子收集时间）
    static get gatherTimer() {
        return GameData._gatherTimer;
    }

    //设置不死亡灵（不死骷髅复活次数）
    static set reviveTimes(reviveTimes) {
        if (reviveTimes < 0) {
            reviveTimes = 0;
        }
        GameData._reviveTimes = reviveTimes;
        GameData.setUserData({ reviveTimes: GameData._reviveTimes })
    }

    //获取不死亡灵（不死骷髅复活次数）
    static get reviveTimes() {
        return GameData._reviveTimes;
    }

    //设置拆弹专家（用盾牌拆除炸弹数量）
    static set dismantleBomb(dismantleBomb) {
        if (dismantleBomb < 0) {
            dismantleBomb = 0;
        }
        GameData._dismantleBomb = dismantleBomb;
        GameData.setUserData({ dismantleBomb: GameData._dismantleBomb })
    }

    //获取拆弹专家（用盾牌拆除炸弹数量）
    static get dismantleBomb() {
        return GameData._dismantleBomb;
    }

    //设置大团圆（解锁角色数量）
    static set unlockRoles(unlockRoles) {
        if (unlockRoles < 0) {
            unlockRoles = 0;
        }
        GameData._unlockRoles = unlockRoles;
        GameData.setUserData({ unlockRoles: GameData._unlockRoles })
    }

    //获取大团圆（解锁角色数量）
    static get unlockRoles() {
        return GameData._unlockRoles;
    }

    //设置升级（所有角色级级数）
    static set levelUp(levelUp) {
        if (levelUp < 0) {
            levelUp = 0;
        }
        GameData._levelUp = levelUp;
        GameData.setUserData({ levelUp: GameData._levelUp })
    }

    //获取升级（所有角色级级数）
    static get levelUp() {
        return GameData._levelUp;
    }

    //设置钩宝箱（船长撞破箱子数量）
    static set captainHitBox(captainHitBox) {
        if (captainHitBox < 0) {
            captainHitBox = 0;
        }
        GameData._captainHitBox = captainHitBox;
        GameData.setUserData({ captainHitBox: GameData._captainHitBox })
    }
    //获取钩宝箱（船长撞破箱子数量）
    static get captainHitBox() {
        return GameData._captainHitBox;
    }


    //设置加速道具数量
    static set prop_speedUp(prop_speedUp) {
        if (prop_speedUp < 0) {
            prop_speedUp = 0;
        }
        GameData._prop_speedUp = prop_speedUp;
        GameData.setUserData({ prop_speedUp: GameData._prop_speedUp })
    }
    //获取加速道具数量
    static get prop_speedUp() {
        return GameData._prop_speedUp;
    }


    //设置复活道具数量
    static set prop_revive(prop_revive) {
        if (prop_revive < 0) {
            prop_revive = 0;
        }
        GameData._prop_revive = prop_revive;
        GameData.setUserData({ prop_revive: GameData._prop_revive })
    }
    //获取复活道具数量
    static get prop_revive() {
        return GameData._prop_revive;
    }


    //设置幸运草道具数量
    static set prop_luckyGrass(prop_luckyGrass) {
        if (prop_luckyGrass < 0) {
            prop_luckyGrass = 0;
        }
        GameData._prop_luckyGrass = prop_luckyGrass;
        GameData.setUserData({ prop_luckyGrass: GameData._prop_luckyGrass })
    }
    //获取幸运草道具数量
    static get prop_luckyGrass() {
        return GameData._prop_luckyGrass;
    }


    //设置时间道具数量
    static set prop_time(prop_time) {
        if (prop_time < 0) {
            prop_time = 0;
        }
        GameData._prop_time = prop_time;
        GameData.setUserData({ prop_time: GameData._prop_time })
    }
    //获取时间道具数量
    static get prop_time() {
        return GameData._prop_time;
    }

    //设置船长赚取金币
    static set gold_captain(gold_captain) {
        GameData._gold_captain = gold_captain;
        GameData.setUserData({ gold_captain: GameData._gold_captain })
    }
    //获取船长赚取金币
    static get gold_captain() {
        return GameData._gold_captain;
    }

    //设置刀妹赚取金币
    static set gold_sparklet(gold_sparklet) {

        GameData._gold_sparklet = gold_sparklet;
        GameData.setUserData({ gold_sparklet: GameData._gold_sparklet })
    }
    //获取刀妹赚取金币
    static get gold_sparklet() {
        return GameData._gold_sparklet;
    }

    //设置白胡子赚取金币
    static set gold_hook(gold_hook) {

        GameData._gold_hook = gold_hook;
        GameData.setUserData({ gold_hook: GameData._gold_hook })
    }
    //获取白胡子赚取金币
    static get gold_hook() {
        return GameData._gold_hook;
    }

    //设置厨子赚取金币
    static set gold_leavened(gold_leavened) {
        GameData._gold_leavened = gold_leavened;
        GameData.setUserData({ gold_leavened: GameData._gold_leavened })
    }
    //获取厨子赚取金币
    static get gold_leavened() {
        return GameData._gold_leavened;
    }

    //设置骷髅赚取金币
    static set gold_crutch(gold_crutch) {

        GameData._gold_crutch = gold_crutch;
        GameData.setUserData({ gold_crutch: GameData._gold_crutch })
    }
    //获取骷髅赚取金币
    static get gold_crutch() {
        return GameData._gold_crutch;
    }

    //设置地图0状态
    static set map0(state) {
        GameData._map0 = state;
        GameData.setUserData({ map0: GameData._map0 })
    }

    //获取地图0状态
    static get map0() {
        return GameData._map0;
    }

    //设置地图1状态
    static set map1(state) {
        GameData._map1 = state;
        GameData.setUserData({ map1: GameData._map1 })
    }

    //获取地图1状态
    static get map1() {
        return GameData._map1;
    }

    //设置地图2状态
    static set map2(state) {
        GameData._map2 = state;
        GameData.setUserData({ map2: GameData._map2 })
    }
    //获取地图2状态
    static get map2() {
        return GameData._map2;
    }

    //设置地图3解锁状态
    static set map3(state) {
        GameData._map3 = state;
        GameData.setUserData({ map3: GameData._map3 })
    }
    //获取地图2解锁状态
    static get map3() {
        return GameData._map3;
    }


    //设置当前使用角色
    static set currentRole(currentRole) {

        GameData._currentRole = currentRole;
        GameData.setUserData({ currentRole: GameData._currentRole })
    }
    //获取当前使用角色
    static get currentRole() {
        return GameData._currentRole;
    }


    //设置当前使用角色
    static set maxFightGold(maxFightGold) {
        if (maxFightGold < 0) {
            maxFightGold = 0;
        }
        GameData._maxFightGold = maxFightGold;
        GameData.setUserData({ maxFightGold: GameData._maxFightGold })
    }
    //获取当前使用角色
    static get maxFightGold() {
        return GameData._maxFightGold;
    }


    //设置当前商铺索引
    static set currentShopIndex(currentShopIndex) {
        if (currentShopIndex < 0) {
            currentShopIndex = 0;
        }
        GameData._currentShopIndex = currentShopIndex;
        GameData.setUserData({ currentShopIndex: GameData._currentShopIndex })
    }
    //获取当前商铺索引
    static get currentShopIndex() {
        return GameData._currentShopIndex;
    }

    //设置当前商铺索引
    static set currentMap(currentMap) {
        if (currentMap < 0) {
            currentMap = 0;
        }
        GameData._currentMap = currentMap;
        GameData.setUserData({ currentMap: GameData._currentMap })
    }
    //获取当前商铺索引
    static get currentMap() {
        return GameData._currentMap;
    }

    //设置当前家园
    static set currentHome(currentHome) {
        if (currentHome < 0) {
            currentHome = 0;
        }
        GameData._currentHome = currentHome;
        GameData.setUserData({ currentHome: GameData._currentHome })
    }
    //获取当前家园
    static get currentHome() {
        return GameData._currentHome;
    }


    //设置宝石等级
    static set jewelLevel(jewelLevel) {
        if (jewelLevel < 0) {
            jewelLevel = 0;
        }
        GameData._jewelLevel = jewelLevel;
        GameData.setUserData({ jewelLevel: GameData._jewelLevel })
    }
    //获取宝石等级
    static get jewelLevel() {
        return GameData._jewelLevel;
    }

    //设置宝石数量
    static set jewelCount(jewelCount) {
        if (jewelCount < 0) {
            jewelCount = 0;
        }
        GameData._jewelCount = jewelCount;
        GameData.setUserData({ jewelCount: GameData._jewelCount })
    }
    //获取宝石等级
    static get jewelCount() {
        return GameData._jewelCount;
    }

    //设置家园道具1（炸弹）等级
    static set homeWorld_prop0(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._homeWorld_prop0 = level;
        GameData.setUserData({ homeWorld_prop0: GameData._homeWorld_prop0 })
    }
    //获取家园道具1（炸弹）等级
    static get homeWorld_prop0() {
        return GameData._homeWorld_prop0;
    }

    //设置家园道具2（炸弹）等级
    static set homeWorld_prop1(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._homeWorld_prop1 = level;
        GameData.setUserData({ homeWorld_prop1: GameData._homeWorld_prop1 })
    }
    //获取家园道具2（炸弹）等级
    static get homeWorld_prop1() {
        return GameData._homeWorld_prop0;
    }

    //设置家园道具3（炸弹）等级
    static set homeWorld_prop2(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._homeWorld_prop2 = level;
        GameData.setUserData({ homeWorld_prop2: GameData._homeWorld_prop2 })
    }
    //获取家园道具3（炸弹）等级
    static get homeWorld_prop2() {
        return GameData._homeWorld_prop2;
    }


    //设置家园道具4（炸弹）等级
    static set homeWorld_prop3(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._homeWorld_prop3 = level;
        GameData.setUserData({ homeWorld_prop3: GameData._homeWorld_prop3 })
    }
    //获取家园道具4（炸弹）等级
    static get homeWorld_prop3() {
        return GameData._homeWorld_prop3;
    }

    //设置最高分纪录
    static set maxScore(score) {
        if (score < 0) score = 0;
        GameData._maxScore = score;
        GameData.setUserData({ maxScore: GameData._maxScore });
    }

    // 获取最高分纪录
    static get maxScore() {
        return GameData._maxScore;
    }


    //获取本地所有游戏数据
    static getAllLocalGameData() {
        console.log("获取本地数据！！！！！！！！！！！！");
        GameData.gold = WXCtr.getStorageData("gold", 3000);
        GameData.diamond = WXCtr.getStorageData("diamonds", 2000);

        GameData.power = WXCtr.getStorageData("power");
        GameData.combo = WXCtr.getStorageData("combo");
        GameData.doubleJump = WXCtr.getStorageData("doubleJump");
        GameData.flyingGold = WXCtr.getStorageData("flyingGold");
        GameData.omitGold = WXCtr.getStorageData("omitGold");
        GameData.hitBox = WXCtr.getStorageData("hitBox");
        GameData.gatherTimer = WXCtr.getStorageData("gatherTimer");
        GameData.reviveTimes = WXCtr.getStorageData("reviveTimes");
        GameData.dismantleBomb = WXCtr.getStorageData("dismantleBomb");
        GameData.unlockRoles = WXCtr.getStorageData("unlockRoles");
        GameData.levelUp = WXCtr.getStorageData("levelUp");
        GameData.captainHitBox = WXCtr.getStorageData("captainHitBox");

        GameData.prop_speedUp = WXCtr.getStorageData("prop_speedUp");
        GameData.prop_revive = WXCtr.getStorageData("prop_revive");
        GameData.prop_luckyGrass = WXCtr.getStorageData("prop_luckyGrass");
        GameData.prop_time = WXCtr.getStorageData("prop_time");


        GameData.gold_captain = WXCtr.getStorageData("gold_captain", 0);
        GameData.gold_sparklet = WXCtr.getStorageData("gold_sparklet", -1);
        GameData.gold_hook = WXCtr.getStorageData("gold_hook", -1);
        GameData.gold_leavened = WXCtr.getStorageData("gold_leavened", -1);
        GameData.gold_crutch = WXCtr.getStorageData("gold_crutch", -1);

        GameData.maxFightGold = WXCtr.getStorageData("maxFightGold");
        GameData.currentShopIndex = WXCtr.getStorageData("currentShopIndex");

        GameData.currentMap = WXCtr.getStorageData("currentMap");
        GameData.currentRole = WXCtr.getStorageData("currentRole");
        GameData.currentHome = WXCtr.getStorageData("currentHome");


        GameData.map0 = WXCtr.getStorageData("map0", 0);
        GameData.map1 = WXCtr.getStorageData("map1", -1);
        GameData.map2 = WXCtr.getStorageData("map2", -1);
        GameData.map3 = WXCtr.getStorageData("map3", -1);

        GameData.jewelLevel = WXCtr.getStorageData("jewelLevel", 1);
        GameData.jewelCount = WXCtr.getStorageData("jewelCount", 0);

        GameData.homeWorld_prop0 = WXCtr.getStorageData("homeWorld_prop0", 0);
        GameData.homeWorld_prop1 = WXCtr.getStorageData("homeWorld_prop1", 0);
        GameData.homeWorld_prop2 = WXCtr.getStorageData("homeWorld_prop2", 0);
        GameData.homeWorld_prop3 = WXCtr.getStorageData("homeWorld_prop3", 0);

        GameCtr.getInstance().getStart().startGame();
    }

    static getOnlineGameData(data) {
        console.log("log-------getOnlineGameData=:", data);
        GameData.gold = data.gold;
        GameData.diamond = data.money == "NaN" ? 0 : data.money;
        GameData.power = data.data_1;
        GameData.combo = data.data_2;
        GameData.doubleJump = data.data_3;
        GameData.flyingGold = data.data_4;
        GameData.omitGold = data.data_5;
        GameData.hitBox = data.data_6
        GameData.gatherTimer = data.data_7;
        GameData.reviveTimes = data.data_8;
        GameData.dismantleBomb = data.data_9;
        GameData.unlockRoles = data.data_10;
        GameData.levelUp = data.data_11;
        GameData.captainHitBox = data.data_12;

        GameData.prop_speedUp = data.data_13;
        GameData.prop_revive = data.data_14;
        GameData.prop_luckyGrass = data.data_15;
        GameData.prop_time = data.data_16;

        GameData.gold_captain = data.data_17;
        GameData.gold_sparklet = data.data_18;
        GameData.gold_hook = data.data_19;
        GameData.gold_leavened = data.data_20;
        GameData.gold_crutch = data.data_21;
        GameData.maxFightGold = data.data_22;
        GameData.currentShopIndex = data.data_23;
        GameData.currentMap = data.data_24;
        GameData.currentRole = data.data_25;
        GameData.currentHome = data.data_26;

        GameData.map0 = data.data_27;
        GameData.map1 = data.data_28;
        GameData.map2 = data.data_29;
        GameData.map3 = data.data_30;

        GameData.jewelLevel = data.data2_3;
        GameData.jewelCount = data.data2_4;

        GameData.homeWorld_prop0 = data.data2_5;
        GameData.homeWorld_prop1 = data.data2_6;
        GameData.homeWorld_prop2 = data.data2_7;
        GameData.homeWorld_prop3 = data.data2_8;

        GameData.setUserData({ lastTime: data.data2_2 });
        HttpCtr.submitUserData({});
        GameCtr.getInstance().getStart().startGame()
    }



    //保存个人信息
    static setUserData(data) {
        data["saveTime"] = new Date().getTime();
        for (let key in data) {
            WXCtr.setStorageData(key, data[key]);
            if (dataKeyConfig[key]) {
                data[dataKeyConfig[key]] = data[key];
            }
        }
        console.log("log--------setUserData=:", data);
        HttpCtr.submitUserData(data);
    }


    static submitGameData() {
        HttpCtr.submitUserData({
            gold: GameData._gold,
            money: GameData._diamond,
        });
        let city = "未知";
        if (UserManager.user.city) city = UserManager.user.city;
        WXCtr.submitScoreToWx(GameData.maxFightGold, city);
    }


    static getRoleLevelInfoByName(roleName) {
        let key = "gold_" + roleName;
        return GameData.getLevelInfo(GameData[key]);
    }

    static addGoldByName(roleName) {
        let key = "gold_" + roleName;
        GameData[key] += 1;
    }

    static getGoldByName(roleName) {
        let key = "gold_" + roleName;
        return GameData[key];
    }


    static getLevelTarget(level) {
        if (level == 0) {
            return 500;
        } else {
            return Math.floor(Math.pow((1 + 0.5 * (1 - (level + 1) / ((level + 1) + 10))), level) * 500 + 500)
        }
    }

    static getLevelInfo(gold, level = 0) {
        if (gold < 0) {
            /*未解锁*/
            return { _level: -1, _targetGold: -1, _currentGold: -1 };
        }

        /*已解锁*/
        let goldTemp = gold;
        while (goldTemp >= GameData.getLevelTarget(level)) {
            goldTemp -= GameData.getLevelTarget(level)
            level++;
        }
        return { _level: level, _targetGold: GameData.getLevelTarget(level), _currentGold: goldTemp };
    }

    // 获取当前角色等级
    static getCurrentRoleLevel() {
        let gold = 0;
        switch (GameData.currentRole) {
            case 0:
                gold = GameData.gold_captain;
                break;
            case 1:
                gold = GameData.gold_sparklet;
                break;
            case 2:
                gold = GameData.gold_hook;
                break;
            case 3:
                gold = GameData.gold_leavened;
                break;
            case 4:
                gold = GameData.gold_crutch;
                break;
            case 5:

                break;
        }
        let data = GameData.getLevelInfo(gold);
        return data;
    }

    static addGoldOfRole(num) {
        switch (GameData.currentRole) {
            case 0:
                GameData.gold_captain+=num;;
                break;
            case 1:
                GameData.gold_sparklet+=num;;
                break;
            case 2:
                GameData.gold_hook+=num;;
                break;
            case 3:
                GameData.gold_leavened+=num;;
                break;
            case 4:
                GameData.gold_crutch+=num;;
                break;
            case 5:

                break;
        }
    }

    static getMapStateByName(mapName) {
        let key = mapName;
        return GameData[key];
    }

    static setMapStateByName(mapName, state) {
        let key = mapName;
        GameData[key] = state;
    }

    static getJewelLevelUpPrice() {
        if (GameData.jewelLevel == 1) {
            return 1000
        } else {
            let level = 0;
            let price = 1000;
            while (level < GameData.jewelLevel) {
                price = Math.round(price * 1.3);
                level++;
            }
            return price;
        }
    }

    static getJewelRate() {
        if (GameData.jewelLevel <= 0) {
            return -1
        } else if (GameData.jewelLevel == 1) {
            return 1
        } else {
            return Math.pow((1 + (1 - GameData.jewelLevel / (GameData.jewelLevel + 20)) * 0.3), GameData.jewelLevel);
        }
    }

    static getJewelProductionCycle() {
        if (GameData.jewelLevel <= 0) {
            return -1;
        } else {
            let cycle = 60 * GameData.jewelLevel;
            cycle = cycle >= 300 ? 300 : cycle;
            return cycle;
        }
    }

    static getJewelOutPut() {
        if (GameData.jewelLevel <= 0) {
            return -1;
        } else {
            return Math.round(GameData.getJewelProductionCycle() / 60 * GameData.getJewelRate());
        }
    }

    static getDayJewelOutPut() {
        return 24 / (GameData.getJewelProductionCycle() / 60) * GameData.getJewelOutPut();
    }


    static getProp(propName) {
        let key = "prop_" + propName;
        return GameData[key];
    }

    static addProp(propName) {
        let key = "prop_" + propName;
        GameData[key] += 1;
    }

    static subProp(propName) {
        let key = "prop_" + propName;
        GameData[key] -= 1;
    }


    static getHomeWorldPropLevel(name) {
        console.log("log--------------homeWorldProp=:", GameData[name])
        return GameData[name];
    }

    static homeWorldPropLevelUp(name) {
        GameData[name] += 1
    }

    static canBuyProps() {
        if (GameData.prop_luckyGrass == 10 && GameData.prop_revive == 10 && GameData.prop_speedUp == 10 && GameData.prop_time == 10) {
            /*所有道具都已买满 */
            return false;
        }

        for (let i = 0; i < GameData.propsInfo.length; i++) {
            if (GameData.gold >= GameData.propsInfo[i].price) {
                return true;
            }
        }
        return false;
    }

    static canBuyMaps() {
        if (GameData.map0 >= 0 && GameData.map1 >= 0 && GameData.map2 >= 0 && GameData.map3 >= 0) {
            /*所有地图已解锁*/
            return false;
        }

        for (let i = 1; i < GameData.mapsInfo.length; i++) {
            if (GameData.gold >= GameData.mapsInfo[i].gold_price && GameData.diamond >= GameData.mapsInfo[i].diamond_price) {
                return true
            }
        }
        return false;
    }

    static canBuyCharactors() {
        if (GameData.gold_captain >= 0 && GameData.gold_crutch >= 0 && GameData.gold_hook >= 0 && GameData.gold_leavened >= 0 && GameData.gold_sparklet >= 0) {
            /* 所有玩家已解锁 */
            return false;
        }

        for (let i = 1; i < GameData.rolesInfo.length; i++) {
            if (GameData.gold >= GameData.rolesInfo[i].price_gold && GameData.diamond >= GameData.rolesInfo[i].price_diamond) {
                return true;
            }
        }
        return false;
    }


    static canShopping() {
        if (!GameData.canBuyProps() && !GameData.canBuyMaps() && !GameData.canBuyCharactors()) {
            return false;
        }
        return true;
    }

    static getBonusDiamonds() {
        let timeInterval = Math.floor((new Date().getTime() - WXCtr.getStorageData("lastTime")) / 1000);
        console.log("log--------离线时间=",timeInterval/3600+"小时");
        let date = new Date();
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let totalSeconds = hour * 3600 + min * 60 + sec;
        let bonusDiamond = 0;
        if (timeInterval >=totalSeconds ) {
            timeInterval -= totalSeconds;
            bonusDiamond += GameData.getDayJewelOutPut();
            let dayCount = Math.floor(timeInterval / (24 * 3600));
            bonusDiamond += dayCount * GameData.getDayJewelOutPut();
        }
        return bonusDiamond;
    }

}
