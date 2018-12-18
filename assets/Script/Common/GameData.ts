import GameCtr from "../Controller/GameCtr";
import WXCtr from "../Controller/WXCtr";
import UserManager from "./UserManager";
import HttpCtr from "../Controller/HttpCtr";
import Util from "./Util";
import EventManager from "./EventManager";


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
    maxScore: "data2_9",                                                         //最高分纪录

    achieveLevel0: "data2_10",                                                    //成就0等级
    achieveLevel1: "data2_11",                                                    //成就1等级
    achieveLevel2: "data2_12",                                                    //成就2等级
    achieveLevel3: "data2_13",                                                    //成就3等级
    achieveLevel4: "data2_14",                                                    //成就4等级
    achieveLevel5: "data2_15",                                                    //成就5等级
    achieveLevel6: "data2_16",                                                    //成就6等级
    achieveLevel7: "data2_17",                                                    //成就7等级
    achieveLevel8: "data2_18",                                                    //成就8等级
    achieveLevel9: "data2_19",                                                    //成就9等级
    achieveLevel10: "data2_20",                                                   //成就10等级
    achieveLevel11: "data2_21",   
    lotteryTimes:"data2_22",                                                      //开宝箱次数

    lastTime:"data2_2",                                                           //上次退出游戏时间
    guideStep: "data2_23",                                                        //新手引导步骤
};

const mapsName = ["map1", "map2", "map3", "map4"];


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
    private static _guideStep: number = 0;                                 //新手引导步骤

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
    private static _maxScore: number = 0;                                   //最高分纪录

    private static _level1 = null;                                            //地图1最大得分
    private static _level2 = null;                                            //地图2最大得分
    private static _level3 = null;                                            //地图3最大得分
    private static _level4 = null;                                            //地图4最大得分

    private static _achieveLevel0 = 0;                                        //成就0等级
    private static _achieveLevel1 = 0;                                        //成就1等级
    private static _achieveLevel2 = 0;                                        //成就2等级
    private static _achieveLevel3 = 0;                                        //成就3等级
    private static _achieveLevel4 = 0;                                        //成就4等级
    private static _achieveLevel5 = 0;                                        //成就5等级
    private static _achieveLevel6 = 0;                                        //成就6等级
    private static _achieveLevel7 = 0;                                        //成就7等级
    private static _achieveLevel8 = 0;                                        //成就8等级
    private static _achieveLevel9 = 0;                                        //成就9等级
    private static _achieveLevel10 = 0;                                       //成就10等级
    private static _achieveLevel11 = 0;                                       //成就11等级

    private static _lotteryTimes = 0;                                         //宝箱开箱次数
    private static _lastTime=0;                                               //上次退出游戏时间
    private static _saveTime = 0;

    private static _gameData = {};

    public static jewelTimeCount = 0;                                      //宝石收集倒计时
    public static powerTime = 0;                                           //体力收集时间
    public static achievementsLevelData = [];                                //成就等级数据
    public static maxScoreData = [];                                         //各个地图的最大得分数据
    public static userInfo = null;

    public static mapNodeTag = 10001;
    public static propsNodeTag = 10002;
    public static homeWorldNodeTag = 10003;
    public static charactersNodeTag = 10004;



    static rolesDes = [
        { title: "路飞船长", des: "传说是海盗王和海之女神的孩子，\n天生的海盗\n\n未知原因，无法觉醒天赋" },
        { title: "女帝船长", des: "太平洋东岸的盲女海盗王，出身卑微\n\n偶然吃下神奇的食物，恢复了视力，\n觉醒\n\n[加速]（小岛速度增加1级）" },
        { title: "白胡子", des: "表面是来至偏远海域的老年海盗王,\n实则因妻子意外死亡，隐藏身份的\n传奇海盗王\n\n[幸运]（无限幸运草）" },
        { title: "香克斯", des: "太平洋南岸海盗王，世界实力最强，\n势力最大的海盗王\n\n座右铭：时间就是生命\n\n[加时]（进入游戏增加10秒时间）" },
        { title: "小髅髅", des: "溺死在海中的强大海盗，被海之女神赐\n予不死之身\n\n[不死]（死亡后无限复活）" },
    ]

    static rolesInfo = [
        { id: 0, name: "captain", price_gold: 0, price_diamond: 0, des: GameData.rolesDes[0] },
        { id: 1, name: "sparklet", price_gold: 10000, price_diamond: 0, des: GameData.rolesDes[1] },
        { id: 2, name: "hook", price_gold: 2000, price_diamond: 0, des: GameData.rolesDes[2] },
        { id: 3, name: "leavened", price_gold: 5000, price_diamond: 0, des: GameData.rolesDes[3] },
        { id: 4, name: "crutch", price_gold: 0, price_diamond: 2000, des: GameData.rolesDes[4] }
    ]


    static mapsInfo = [
        { name: "map0", title: "新手图", gold_price: 0, diamond_price: 0, rate: [300, 700, 1000], top: 1200, des: "比较安全的小岛，刚刚开发出来\n\n比较简单，道具较少" },
        { name: "map1", title: "进阶图", gold_price: 1000, diamond_price: 0, rate: [500, 900, 1200], top: 1500, des: "有点危险的岛屿，历史悠久\n\n比较困难，较丰富的内容" },
        { name: "map2", title: "挑战图", gold_price: 0, diamond_price: 500, rate: [400, 800, 1100], top: 1300, des: "危险无处不在的岛屿，来历神秘\n\n非常困难，内容很多" },
        { name: "map3", title: "无限模式", gold_price: 4000, diamond_price: 0, rate: [-1, -1, -1], top: 1200, des: "知道求生模式吗，探险家的乐园\n\n全道具模式，活得比别人久就好" }
    ]

    static propsInfo = [
        { name: "luckyGrass", priceGold: 100, priceDiamond: 0, title: "幸运草", des: "让你变得幸运起来，值得拥有\n\n抵消COMBO断掉的惩罚" },
        { name: "speedUp", priceGold: 100, priceDiamond: 0, title: "加速", des: "召唤强风，让小岛快速转起来\n\n加快小岛旋转速度" },
        { name: "revive", priceGold: 0, priceDiamond: 20, title: "复活", des: "装有蓝色液体的神奇瓶子\n\n死亡后，复活到小岛上\n\n无限模式不生效" },
        { name: "time", priceGold: 100, priceDiamond: 0, title: "加时器", des: "让你向天再借10秒的神器\n\n入场时，增加10秒跳跃时间" },
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
        { title: "收集金币Ⅰ", des: "收集10000枚金币", target: 10000, bonus: 500 },
        { title: "收集金币Ⅱ", des: "收集20000枚金币", target: 20000, bonus: 1000 },
        { title: "收集金币Ⅲ", des: "收集40000枚金币", target: 40000, bonus: 2000 },
        { title: "收集金币Ⅳ", des: "收集80000枚金币", target: 80000, bonus: 3000 },
        { title: "收集金币Ⅴ", des: "收集200000枚金币", target: 200000, bonus: 5000 }
    ]

    /*连击*/
    static ComboCof = [
        { title: "连击Ⅰ", des: "连击1000次", target: 1000, bonus: 500 },
        { title: "连击Ⅱ", des: "连击3000次", target: 3000, bonus: 1000 },
        { title: "连击Ⅲ", des: "连击5000次", target: 5000, bonus: 2000 },
        { title: "连击Ⅳ", des: "连击10000次", target: 10000, bonus: 3000 },
        { title: "连击Ⅴ", des: "连击20000次", target: 20000, bonus: 5000 },
    ]

    /*连跳*/
    static doubleJumpCof = [
        { title: "连跳Ⅰ", des: "连跳100次", target: 100, bonus: 500 },
        { title: "连跳Ⅱ", des: "连跳300次", target: 300, bonus: 1000 },
        { title: "连跳Ⅲ", des: "连跳1000次", target: 1000, bonus: 2000 },
        { title: "连跳Ⅳ", des: "连跳5000次", target: 5000, bonus: 3000 },
        { title: "连跳Ⅴ", des: "连跳10000次", target: 10000, bonus: 5000 },
    ]

    /*飞行的金币*/
    static flyingGoldCof = [
        { title: "飞行的金币Ⅰ", des: "用磁铁吸收40枚金币", target: 40, bonus: 500 },
        { title: "飞行的金币Ⅱ", des: "用磁铁吸收200枚金币", target: 200, bonus: 1000 },
        { title: "飞行的金币Ⅲ", des: "用磁铁吸收500枚金币", target: 500, bonus: 2000 },
        { title: "飞行的金币Ⅳ", des: "用磁铁吸收2000枚金币", target: 2000, bonus: 3000 },
        { title: "飞行的金币Ⅴ", des: "用磁铁吸收50000枚金币", target: 50000, bonus: 5000 },
    ]

    /*穿过金币*/
    static omitGoldCof = [
        { title: "穿过金币Ⅰ", des: "漏了500枚金币", target: 500, bonus: 500 },
        { title: "穿过金币Ⅱ", des: "漏了2000枚金币", target: 2000, bonus: 1000 },
        { title: "穿过金币Ⅲ", des: "漏了5000枚金币", target: 5000, bonus: 2000 },
        { title: "穿过金币Ⅳ", des: "漏了10000枚金币", target: 10000, bonus: 3000 },
        { title: "穿过金币Ⅴ", des: "漏了20000枚金币", target: 20000, bonus: 5000 },
    ]

    /*头铁*/
    static hitBoxCof = [
        { title: "头铁Ⅰ", des: "用女帝船长撞100个箱子", target: 100, bonus: 500 },
        { title: "头铁Ⅱ", des: "用女帝船长撞300个箱子", target: 300, bonus: 1000 },
        { title: "头铁Ⅲ", des: "用女帝船长撞1000个箱子", target: 1000, bonus: 2000 },
        { title: "头铁Ⅳ", des: "用女帝船长撞5000个箱子", target: 5000, bonus: 3000 },
        { title: "头铁Ⅴ", des: "用女帝船长撞10000个箱子", target: 10000, bonus: 5000 },
    ]

    /*时间之子*/
    static gatherTimerCof = [
        { title: "时间之子Ⅰ", des: "用香克斯收集50个时间", target: 50, bonus: 500 },
        { title: "时间之子Ⅱ", des: "用香克斯收集200个时间", target: 200, bonus: 1000 },
        { title: "时间之子Ⅲ", des: "用香克斯收集500个时间", target: 500, bonus: 2000 },
        { title: "时间之子Ⅳ", des: "用香克斯收集2000个时间", target: 2000, bonus: 3000 },
        { title: "时间之子Ⅴ", des: "用香克斯收集5000个时间", target: 5000, bonus: 5000 },
    ]

    /*不死亡灵*/
    static reviveTimesCof = [
        { title: "时间之子Ⅰ", des: "用小骷髅复活10次", target: 10, bonus: 500 },
        { title: "时间之子Ⅱ", des: "用小骷髅复活50次", target: 50, bonus: 1000 },
        { title: "时间之子Ⅲ", des: "用小骷髅复活200次", target: 200, bonus: 2000 },
        { title: "时间之子Ⅳ", des: "用小骷髅复活1000次", target: 1000, bonus: 3000 },
        { title: "时间之子Ⅴ", des: "用小骷髅复活10000次", target: 10000, bonus: 5000 },
    ]

    /*拆弹专家*/
    static dismantleBombCof = [
        { title: "拆弹专家Ⅰ", des: "用盾牌拆除1000个炸弹", target: 1000, bonus: 500 },
        { title: "拆弹专家Ⅱ", des: "用盾牌拆除2000个炸弹", target: 2000, bonus: 1000 },
        { title: "拆弹专家Ⅲ", des: "用盾牌拆除5000个炸弹", target: 5000, bonus: 2000 },
        { title: "拆弹专家Ⅳ", des: "用盾牌拆除10000个炸弹", target: 10000, bonus: 3000 },
        { title: "拆弹专家Ⅴ", des: "用盾牌拆除20000个炸弹", target: 20000, bonus: 5000 },
    ]

    /*大团圆*/
    static lockRolesCof = [
        { title: "大团圆Ⅰ", des: "解锁2个角色", target: 2, bonus: 500 },
        { title: "大团圆Ⅱ", des: "解锁3个角色", target: 3, bonus: 1000 },
        { title: "大团圆Ⅲ", des: "解锁4个角色", target: 4, bonus: 2000 },
        { title: "大团圆Ⅳ", des: "解锁5个角色", target: 5, bonus: 3000 },
        { title: "大团圆Ⅴ", des: "解锁6个角色", target: 6, bonus: 5000 },
    ]

    /*升级*/
    static levelUpCof = [
        { title: "升级Ⅰ", des: "所有角色5级", target: 5, bonus: 500 },
        { title: "升级Ⅱ", des: "所有角色10级", target: 10, bonus: 1000 },
        { title: "升级Ⅲ", des: "所有角色15级", target: 15, bonus: 2000 },
        { title: "升级Ⅳ", des: "所有角色20级", target: 20, bonus: 3000 },
        { title: "升级Ⅴ", des: "所有角色25级", target: 25, bonus: 5000 },
    ]

    /*钩宝箱*/
    static captainHitBoxCof = [
        { title: "钩宝箱Ⅰ", des: "白胡子撞破200箱子", target: 200, bonus: 500 },
        { title: "钩宝箱Ⅱ", des: "白胡子撞破500箱子", target: 500, bonus: 1000 },
        { title: "钩宝箱Ⅲ", des: "白胡子撞破2000箱子", target: 2000, bonus: 2000 },
        { title: "钩宝箱Ⅳ", des: "白胡子撞破10000箱子", target: 10000, bonus: 3000 },
        { title: "钩宝箱Ⅴ", des: "白胡子撞破20000箱子", target: 20000, bonus: 5000 },
    ]

    /*成就表*/
    static achievementsConf = [
        { id: 0, confName: "collectGoldCof", valueName: "collectGolds" },
        { id: 1, confName: "ComboCof", valueName: "combo" },
        { id: 2, confName: "doubleJumpCof", valueName: "doubleJump" },
        { id: 3, confName: "flyingGoldCof", valueName: "flyingGold" },
        { id: 4, confName: "omitGoldCof", valueName: "omitGold" },
        { id: 5, confName: "hitBoxCof", valueName: "hitBox" },
        { id: 6, confName: "gatherTimerCof", valueName: "gatherTimer" },
        { id: 7, confName: "reviveTimesCof", valueName: "reviveTimes" },
        { id: 8, confName: "dismantleBombCof", valueName: "dismantleBomb" },
        { id: 9, confName: "lockRolesCof", valueName: "lockedRoles" },
        { id: 10, confName: "levelUpCof", valueName: "minRoleLevel" },
        { id: 11, confName: "captainHitBoxCof", valueName: "captainHitBox" },
    ]

    //设置玩家金币
    static set gold(gold) {
        if (gold < 0) {
            gold = 0;
        }
        GameData._gold = gold;
        GameData._gameData["gold"] = GameData._gold;
        GameData.setUserData({ gold: GameData._gold })
        EventManager.emit("UPDATE_GOLD");
        GameData.judgeShopBtns();
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
        GameData._gameData["diamond"] = GameData._diamond;
        GameData.setUserData({ money: GameData._diamond })
        EventManager.emit("UPDATE_DIAMOND");
    }

    //获取玩家钻石
    static get diamond() {
        return GameData._diamond;
    }

    //获取新手引导步骤
    static get guideStep() {
        return GameData._guideStep;
    }

    //设置新手引导步骤
    static set guideStep(step) {
        if(step < 0){
            step = 0;
        }
        GameData._guideStep = step;
        GameData._gameData["guideStep"] = GameData._guideStep;
        GameData.setUserData({guideStep: GameData._guideStep});
    }

    //设置玩家体力
    static set power(power) {
        if (power < 0) {
            power = 0
        }
        GameData._power = power;
        GameData._gameData["power"] = GameData._power;
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
        GameData._gameData["combo"] = GameData._combo;
        // GameData.setUserData({ combo: GameData._combo })
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
        GameData._gameData["doubleJump"] = GameData._doubleJump;
        // GameData.setUserData({ doubleJump: GameData._doubleJump })
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
        GameData._gameData["flyingGold"] = GameData._flyingGold;
        // GameData.setUserData({ flyingGold: GameData._flyingGold })
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
        GameData._gameData["omitGold"] = GameData._omitGold;
        // GameData.setUserData({ omitGold: GameData._omitGold })
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
        GameData._gameData["hitBox"] = GameData._hitBox;
        // GameData.setUserData({ hitBox: GameData._hitBox })
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
        GameData._gameData["gatherTimer"] = GameData._gatherTimer;
        // GameData.setUserData({ gatherTimer: GameData._gatherTimer })
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
        GameData._gameData["reviveTimes"] = GameData._reviveTimes;
        // GameData.setUserData({ reviveTimes: GameData._reviveTimes })
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
        GameData._gameData["dismantleBomb"] = GameData._dismantleBomb;
        // GameData.setUserData({ dismantleBomb: GameData._dismantleBomb })
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
        GameData._gameData["unlockRoles"] = GameData._unlockRoles;
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
        GameData._gameData["levelUp"] = GameData._levelUp;
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
        GameData._gameData["captainHitBox"] = GameData._captainHitBox;
        // GameData.setUserData({ captainHitBox: GameData._captainHitBox })
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
        GameData._gameData["prop_speedUp"] = GameData._prop_speedUp;
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
        GameData._gameData["prop_revive"] = GameData._prop_revive;
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
        GameData._gameData["prop_luckyGrass"] = GameData._prop_luckyGrass;
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
        GameData._gameData["prop_time"] = GameData._prop_time;
        GameData.setUserData({ prop_time: GameData._prop_time })
    }
    //获取时间道具数量
    static get prop_time() {
        return GameData._prop_time;
    }

    //设置船长赚取金币
    static set gold_captain(gold_captain) {
        GameData._gold_captain = gold_captain;
        GameData._gameData["gold_captain"] = GameData._gold_captain;
        // GameData.setUserData({ gold_captain: GameData._gold_captain })
    }
    //获取船长赚取金币
    static get gold_captain() {
        return GameData._gold_captain;
    }

    //设置刀妹赚取金币
    static set gold_sparklet(gold_sparklet) {

        GameData._gold_sparklet = gold_sparklet;
        GameData._gameData["gold_sparklet"] = GameData._gold_sparklet;
        // GameData.setUserData({ gold_sparklet: GameData._gold_sparklet })
    }
    //获取刀妹赚取金币
    static get gold_sparklet() {
        return GameData._gold_sparklet;
    }

    //设置白胡子赚取金币
    static set gold_hook(gold_hook) {

        GameData._gold_hook = gold_hook;
        GameData._gameData["gold_hook"] = GameData._gold_hook;
        // GameData.setUserData({ gold_hook: GameData._gold_hook })
    }
    //获取白胡子赚取金币
    static get gold_hook() {
        return GameData._gold_hook;
    }

    //设置厨子赚取金币
    static set gold_leavened(gold_leavened) {
        GameData._gold_leavened = gold_leavened;
        GameData._gameData["gold_leavened"] = GameData._gold_leavened;
        // GameData.setUserData({ gold_leavened: GameData._gold_leavened })
    }
    //获取厨子赚取金币
    static get gold_leavened() {
        return GameData._gold_leavened;
    }

    //设置骷髅赚取金币
    static set gold_crutch(gold_crutch) {

        GameData._gold_crutch = gold_crutch;
        GameData._gameData["gold_crutch"] = GameData._gold_crutch;
        // GameData.setUserData({ gold_crutch: GameData._gold_crutch })
    }
    //获取骷髅赚取金币
    static get gold_crutch() {
        return GameData._gold_crutch;
    }

    //设置地图0状态
    static set map0(state) {
        GameData._map0 = state;
        GameData._gameData["map0"] = GameData._map0;
        GameData.setUserData({ map0: GameData._map0 })
    }

    //获取地图0状态
    static get map0() {
        return GameData._map0;
    }

    //设置地图1状态
    static set map1(state) {
        GameData._map1 = state;
        GameData._gameData["map1"] = GameData._map1;
        GameData.setUserData({ map1: GameData._map1 })
    }

    //获取地图1状态
    static get map1() {
        return GameData._map1;
    }

    //设置地图2状态
    static set map2(state) {
        GameData._map2 = state;
        GameData._gameData["map2"] = GameData._map2;
        GameData.setUserData({ map2: GameData._map2 })
    }
    //获取地图2状态
    static get map2() {
        return GameData._map2;
    }

    //设置地图3解锁状态
    static set map3(state) {
        GameData._map3 = state;
        GameData._gameData["map3"] = GameData._map3;
        GameData.setUserData({ map3: GameData._map3 })
    }
    //获取地图2解锁状态
    static get map3() {
        return GameData._map3;
    }


    //设置当前使用角色
    static set currentRole(currentRole) {

        GameData._currentRole = currentRole;
        GameData._gameData["currentRole"] = GameData._currentRole;
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
        GameData._gameData["maxFightGold"] = GameData._maxFightGold;
        // GameData.setUserData({ maxFightGold: GameData._maxFightGold })
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
        GameData._gameData["currentShopIndex"] = GameData._currentShopIndex;
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
        GameData._gameData["currentMap"] = GameData._currentMap;
        // GameData.setUserData({ currentMap: GameData._currentMap })
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
        GameData._gameData["currentHome"] = GameData._currentHome;
        // GameData.setUserData({ currentHome: GameData._currentHome })
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
        GameData._gameData["jewelLevel"] = GameData._jewelLevel;
        // GameData.setUserData({ jewelLevel: GameData._jewelLevel })
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
        GameData._gameData["jewelCount"] = GameData._jewelCount;
        // GameData.setUserData({ jewelCount: GameData._jewelCount })
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
        GameData._gameData["homeWorld_prop0"] = GameData._homeWorld_prop0;
        // GameData.setUserData({ homeWorld_prop0: GameData._homeWorld_prop0 })
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
        GameData._gameData["homeWorld_prop1"] = GameData._homeWorld_prop1;
        // GameData.setUserData({ homeWorld_prop1: GameData._homeWorld_prop1 })
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
        GameData._gameData["homeWorld_prop2"] = GameData._homeWorld_prop2;
        // GameData.setUserData({ homeWorld_prop2: GameData._homeWorld_prop2 })
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
        GameData._gameData["homeWorld_prop3"] = GameData._homeWorld_prop3;
        // GameData.setUserData({ homeWorld_prop3: GameData._homeWorld_prop3 })
    }
    //获取家园道具4（炸弹）等级
    static get homeWorld_prop3() {
        return GameData._homeWorld_prop3;
    }

    //设置最高分纪录
    static set maxScore(score) {
        if (score < 0) score = 0;
        GameData._maxScore = score;
        GameData._gameData["maxScore"] = GameData._maxScore;
        // GameData.setUserData({ maxScore: GameData._maxScore });
    }

    // 获取最高分纪录
    static get maxScore() {
        return GameData._maxScore;
    }

    //设置地图1最高得分
    static set level1(score) {
        if (!score) { return }

        if (score < 0) {
            score = 0;
        }
        GameData._level1 = score;
        GameData._gameData["level1"] = GameData._level1;
        // GameData.setUserData({ level1: GameData._level1 });
    }

    //获取地图1最高得分
    static get level1() {
        return GameData._level1;
    }

    //设置地图2排行数据
    static set level2(score) {
        if (!score) { return }
        if (score < 0) {
            score = 0;
        }
        GameData._level2 = score;
        GameData._gameData["level2"] = GameData._level2;
        GameData.setUserData({ level2: GameData._level2 });
    }

    //获取地图2最高得分
    static get level2() {
        return GameData._level2;
    }

    //设置地图3排行数据
    static set level3(score) {
        if (!score) { return }
        if (score < 0) {
            score = 0;
        }
        GameData._level3 = score;
        GameData._gameData["level3"] = GameData._level3;
        GameData.setUserData({ level3: GameData._level3 });
    }

    //获取地图3最高得分
    static get level3() {
        return GameData._level3;
    }

    //设置地图4最高得分
    static set level4(score) {
        if (!score) { return }
        if (score < 0) {
            score = 0;
        }
        GameData._level4 = score;
        GameData._gameData["level4"] = GameData._level4;
        GameData.setUserData({ level4: GameData._level4 });
    }
    //获取地图4最高得分
    static get level4() {
        return GameData._level4;
    }

    //设置成就0等级
    static set achieveLevel0(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel0 = level;
        GameData._gameData["achieveLevel0"] = GameData._achieveLevel0;
        GameData.setUserData({ achieveLevel0: GameData._achieveLevel0 });
    }
    //获取成就0等级
    static get achieveLevel0() {
        return GameData._achieveLevel0;
    }

    //设置成就1等级
    static set achieveLevel1(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel1 = level;
        GameData._gameData["achieveLevel1"] = GameData._achieveLevel1;
        GameData.setUserData({ achieveLevel1: GameData._achieveLevel1 });
    }
    //获取成就1等级
    static get achieveLevel1() {
        return GameData._achieveLevel1;
    }

    //设置成就2等级
    static set achieveLevel2(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel2 = level;
        GameData._gameData["achieveLevel2"] = GameData._achieveLevel2;
        GameData.setUserData({ achieveLevel2: GameData._achieveLevel2 });
    }
    //获取成就2等级
    static get achieveLevel2() {
        return GameData._achieveLevel2;
    }

    //设置成就3等级
    static set achieveLevel3(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel3 = level;
        GameData._gameData["achieveLevel3"] = GameData._achieveLevel3;
        GameData.setUserData({ achieveLevel3: GameData._achieveLevel3 });
    }
    //获取成就3等级
    static get achieveLevel3() {
        return GameData._achieveLevel3;
    }


    //设置成就4等级
    static set achieveLevel4(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel4 = level;
        GameData._gameData["achieveLevel4"] = GameData._achieveLevel4;
        GameData.setUserData({ achieveLevel4: GameData._achieveLevel4 });
    }
    //获取成就4等级
    static get achieveLevel4() {
        return GameData._achieveLevel4;
    }

    //设置成就5等级
    static set achieveLevel5(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel5 = level;
        GameData._gameData["achieveLevel5"] = GameData._achieveLevel5;
        GameData.setUserData({ achieveLevel5: GameData._achieveLevel5 });
    }
    //获取成就5等级
    static get achieveLevel5() {
        return GameData._achieveLevel5;
    }

    //设置成就6等级
    static set achieveLevel6(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel6 = level;
        GameData._gameData["achieveLevel6"] = GameData._achieveLevel6;
        GameData.setUserData({ achieveLevel6: GameData._achieveLevel6 });
    }
    //获取成就6等级
    static get achieveLevel6() {
        return GameData._achieveLevel6;
    }

    //设置成就7等级
    static set achieveLevel7(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel7 = level;
        GameData._gameData["achieveLevel7"] = GameData._achieveLevel7;
        GameData.setUserData({ achieveLevel7: GameData._achieveLevel7 });
    }
    //获取成就7等级
    static get achieveLevel7() {
        return GameData._achieveLevel7;
    }

    //设置成就8等级
    static set achieveLevel8(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel8 = level;
        GameData._gameData["achieveLevel8"] = GameData._achieveLevel8;
        GameData.setUserData({ achieveLevel8: GameData._achieveLevel8 });
    }
    //获取成就8等级
    static get achieveLevel8() {
        return GameData._achieveLevel8;
    }

    //设置成就9等级
    static set achieveLevel9(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel9 = level;
        GameData._gameData["achieveLevel9"] = GameData._achieveLevel9;
        GameData.setUserData({ achieveLevel9: GameData._achieveLevel9 });
    }
    //获取成就9等级
    static get achieveLevel9() {
        return GameData._achieveLevel9;
    }

    //设置成就10等级
    static set achieveLevel10(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel10 = level;
        GameData._gameData["achieveLevel10"] = GameData._achieveLevel10;
        GameData.setUserData({ achieveLevel10: GameData._achieveLevel10 });
    }
    //获取成就10等级
    static get achieveLevel10() {
        return GameData._achieveLevel10;
    }

    //设置成就11等级
    static set achieveLevel11(level) {
        if (level < 0) {
            level = 0;
        }
        GameData._achieveLevel11 = level;
        GameData._gameData["achieveLevel11"] = GameData._achieveLevel11;
        // GameData.setUserData({ achieveLevel11: GameData._achieveLevel11 });
    }
    //获取成就10等级
    static get achieveLevel11() {
        return GameData._achieveLevel11;
    }

    // 设置宝箱抽奖次数
    static set lotteryTimes(lotteryTimes) {
        if (lotteryTimes < 0) {
            GameData._lotteryTimes = 0;
        }
        GameData._lotteryTimes = lotteryTimes;
        GameData._gameData["lotteryTimes"] = GameData._lotteryTimes;
        GameData.setUserData({ lotteryTimes: GameData._lotteryTimes });
    }

    // 获取宝箱抽奖次数
    static get lotteryTimes() {
        return GameData._lotteryTimes;
    }

    // 设置上次游戏退出时间
    static set lastTime(lastTime) {
        if (lastTime < 0) {
            lastTime = 0;
        }
        GameData._lastTime = lastTime;
        GameData._gameData["lastTime"] = GameData._lastTime;
        GameData.setUserData({ lastTime: GameData._lastTime });
    }

    // 获取上次游戏退出时间
    static get lastTime() {
        return GameData._lastTime;
    }

    // 上次保存数据的时间
    static set saveTime(time) {
        if(time < 0){
            time = 0;
        }
        GameData._saveTime = time;
        GameData._gameData["saveTime"] = GameData._saveTime;
    }

    static get saveTime() {
        return GameData._saveTime;
    }

    //获取收集到的金币
    static get collectGolds() {
        let collectGolds = 0;
        collectGolds = GameData.gold_captain >= 0 ? collectGolds + GameData.gold_captain : collectGolds;
        collectGolds = GameData.gold_sparklet >= 0 ? collectGolds + GameData.gold_sparklet : collectGolds;
        collectGolds = GameData.gold_hook >= 0 ? collectGolds + GameData.gold_hook : collectGolds;
        collectGolds = GameData.gold_leavened >= 0 ? collectGolds + GameData.gold_leavened : collectGolds;
        collectGolds = GameData.gold_crutch >= 0 ? collectGolds + GameData.gold_crutch : collectGolds;

        return collectGolds;
    }

    //获取解锁角色数量
    static get lockedRoles() {
        let lockedRolesCount = 0;
        lockedRolesCount = GameData.gold_captain >= 0 ? lockedRolesCount + 1 : lockedRolesCount;
        lockedRolesCount = GameData.gold_sparklet >= 0 ? lockedRolesCount + 1 : lockedRolesCount;
        lockedRolesCount = GameData.gold_hook >= 0 ? lockedRolesCount + 1 : lockedRolesCount;
        lockedRolesCount = GameData.gold_leavened >= 0 ? lockedRolesCount + 1 : lockedRolesCount;
        lockedRolesCount = GameData.gold_crutch >= 0 ? lockedRolesCount + 1 : lockedRolesCount;
        console.log("log-------------lockedRolesCount=:", lockedRolesCount);
        return lockedRolesCount;
    }

    //获取解锁角色最小等级
    static get minRoleLevel() {
        let levelArr = [];
        let level_captain = GameData.getLevelInfo(GameData.gold_captain);
        let level_sparklet = GameData.getLevelInfo(GameData.gold_sparklet);
        let level_hook = GameData.getLevelInfo(GameData.gold_hook);
        let level_leavened = GameData.getLevelInfo(GameData.gold_leavened);
        let level_crutch = GameData.getLevelInfo(GameData.gold_crutch);

        levelArr.push(level_captain._level);
        levelArr.push(level_sparklet._level);
        levelArr.push(level_hook._level);
        levelArr.push(level_leavened._level);
        levelArr.push(level_crutch._level);
        levelArr.sort();
        return levelArr[0];
    }


    //获取本地所有游戏数据
    static getAllLocalGameData() {
        console.log("获取本地数据！！！！！！！！！！！！");
        GameData.gold = WXCtr.getStorageData("gold", 0);
        GameData.diamond = WXCtr.getStorageData("money", 0);
        GameData.power = WXCtr.getStorageData("power", 99);
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

        GameData.maxScore = WXCtr.getStorageData("maxScore", 0);

        GameData.level1 = WXCtr.getStorageData("level1", null);
        GameData.level2 = WXCtr.getStorageData("level2", null);
        GameData.level3 = WXCtr.getStorageData("level3", null);
        GameData.level4 = WXCtr.getStorageData("level4", null);

        GameData.achieveLevel0 = WXCtr.getStorageData("achieveLevel0", 0);
        GameData.achieveLevel1 = WXCtr.getStorageData("achieveLevel1", 0);
        GameData.achieveLevel2 = WXCtr.getStorageData("achieveLevel2", 0);
        GameData.achieveLevel3 = WXCtr.getStorageData("achieveLevel3", 0);
        GameData.achieveLevel4 = WXCtr.getStorageData("achieveLevel4", 0);
        GameData.achieveLevel5 = WXCtr.getStorageData("achieveLevel5", 0);
        GameData.achieveLevel6 = WXCtr.getStorageData("achieveLevel6", 0);
        GameData.achieveLevel7 = WXCtr.getStorageData("achieveLevel7", 0);
        GameData.achieveLevel8 = WXCtr.getStorageData("achieveLevel8", 0);
        GameData.achieveLevel9 = WXCtr.getStorageData("achieveLevel9", 0);
        GameData.achieveLevel10 = WXCtr.getStorageData("achieveLevel10", 0);
        GameData.achieveLevel11 = WXCtr.getStorageData("achieveLevel11", 0);

        GameData.guideStep = WXCtr.getStorageData("guideStep", 0)
        GameData.lastTime = WXCtr.getStorageData("lastTime", 0);
        GameData.lotteryTimes = WXCtr.getStorageData("lotteryTimes", 0);
        GameData.caculateLotteryTimes()

        GameCtr.getInstance().getStart().startGame();
    }

    static getOnlineGameData(data) {
        console.log("log-------getOnlineGameData=:", data);
        GameData.gold = data.gold === "" ? 0 : data.gold;
        GameData.diamond = data.money === "NaN" ? 0 : data.money;

        GameData.power = data.data_1 === "" ? 99 : data.data_1;
        GameData.combo = data.data_2 === "" ? 0 : data.data_2;
        GameData.doubleJump = data.data_3 === "" ? 0 : data.data_3;
        GameData.flyingGold = data.data_4 === "" ? 0 : data.data_4;
        GameData.omitGold = data.data_5 === "" ? 0 : data.data_5;
        GameData.hitBox = data.data_6 === "" ? 0 : data.data_6;
        GameData.gatherTimer = data.data_7 === "" ? 0 : data.data_7;
        GameData.reviveTimes = data.data_8 === "" ? 0 : data.data_8;
        GameData.dismantleBomb = data.data_9 === "" ? 0 : data.data_9;
        GameData.unlockRoles = data.data_10 === "" ? 0 : data.data_10;
        GameData.levelUp = data.data_11 === "" ? 0 : data.data_11;
        GameData.captainHitBox = data.data_12 === "" ? 0 : data.data_12;

        GameData.prop_speedUp = data.data_13 === "" ? 0 : data.data_13;
        GameData.prop_revive = data.data_14 === "" ? 0 : data.data_14;
        GameData.prop_luckyGrass = data.data_15 === "" ? 0 : data.data_15;
        GameData.prop_time = data.data_16 === "" ? 0 : data.data_16;

        GameData.gold_captain = data.data_17 === "" ? 0 : data.data_17;
        GameData.gold_sparklet = data.data_18 === "" ? -1 : data.data_18;
        GameData.gold_hook = data.data_19 === "" ? -1 : data.data_19;
        GameData.gold_leavened = data.data_20 === "" ? -1 : data.data_20;
        GameData.gold_crutch = data.data_21 === "" ? -1 : data.data_21;
        GameData.maxFightGold = data.data_22 === "" ? 0 : data.data_22;
        GameData.currentShopIndex = data.data_23 === "" ? 0 : data.data_23;
        GameData.currentMap = data.data_24 === "" ? 0 : data.data_24;
        GameData.currentRole = data.data_25 === "" ? 0 : data.data_25;
        GameData.currentHome = data.data_26 === "" ? 0 : data.data_26;

        GameData.map0 = data.data_27 === "" ? 0 : data.data_27;
        GameData.map1 = data.data_28 === "" ? -1 : data.data_28;

        GameData.map2 = data.data_29 === "" ? -1 : data.data_29;
        GameData.map3 = data.data_30 === "" ? -1 : data.data_30;

        GameData.jewelLevel = data.data2_3 === "" ? 1 : data.data2_3;
        GameData.jewelCount = data.data2_4 === "" ? 0 : data.data2_4;

        GameData.homeWorld_prop0 = data.data2_5 === "" ? 0 : data.data2_5;
        GameData.homeWorld_prop1 = data.data2_6 === "" ? 0 : data.data2_6;
        GameData.homeWorld_prop2 = data.data2_7 === "" ? 0 : data.data2_7;
        GameData.homeWorld_prop3 = data.data2_8 === "" ? 0 : data.data2_8;

        GameData.maxScore = data.data2_9 === "" ? 0 : data.data2_9;

        GameData.level1 = data.level1 === "" ? 0 : data.level1;
        GameData.level2 = data.level2 === "" ? 0 : data.level2;
        GameData.level3 = data.level3 === "" ? 0 : data.level3;
        GameData.level4 = data.level4 === "" ? 0 : data.level4;


        GameData.achieveLevel0 = data.data2_10 === "" ? 0 : data.data2_10;
        GameData.achieveLevel1 = data.data2_11 === "" ? 0 : data.data2_11;
        GameData.achieveLevel2 = data.data2_12 === "" ? 0 : data.data2_12;
        GameData.achieveLevel3 = data.data2_13 === "" ? 0 : data.data2_13;
        GameData.achieveLevel4 = data.data2_14 === "" ? 0 : data.data2_14;
        GameData.achieveLevel5 = data.data2_15 === "" ? 0 : data.data2_15;
        GameData.achieveLevel6 = data.data2_16 === "" ? 0 : data.data2_16;
        GameData.achieveLevel7 = data.data2_17 === "" ? 0 : data.data2_17;
        GameData.achieveLevel8 = data.data2_18 === "" ? 0 : data.data2_18;
        GameData.achieveLevel9 = data.data2_19 === "" ? 0 : data.data2_19;
        GameData.achieveLevel10 = data.data2_20 === "" ? 0 : data.data2_20;
        GameData.achieveLevel11 = data.data2_21 === "" ? 0 : data.data2_21;

        GameData.lotteryTimes = data.data2_22 === "" ? -1 : data.data2_22;

        GameData.lastTime=data.data2_2;
        GameData.caculateLotteryTimes()

        //GameData.setUserData({ lastTime: data.data2_2 });
        // HttpCtr.submitUserData({});
        GameCtr.getInstance().getStart().startGame()
    }

    //保存个人信息
    static setUserData(data) {
        data["saveTime"] = new Date().getTime();
        GameData.saveTime = new Date().getTime();
        for (let key in data) {
            WXCtr.setStorageData(key, data[key]);
            if (dataKeyConfig[key]) {
                data[dataKeyConfig[key]] = data[key];
            }
        }
        console.log("log--------setUserData=:", data);
        // HttpCtr.submitUserData(data);
    }

    static submitGameData() {
        GameData.setUserData(GameData._gameData);
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

    static getRoleGoldByIndex(index){
        switch (index) {
            case 0:
                return GameData.gold_captain;
            case 1:
                return GameData.gold_sparklet;
            case 2:
                return GameData.gold_hook;
            case 3:
                return GameData.gold_leavened;
            case 4:
                return GameData.gold_crutch;
            case 5:
                break;
        }
    }

    static addGoldOfRole(num) {
        switch (GameData.currentRole) {
            case 0:
                GameData.gold_captain += num;;
                break;
            case 1:
                GameData.gold_sparklet += num;;
                break;
            case 2:
                GameData.gold_hook += num;;
                break;
            case 3:
                GameData.gold_leavened += num;;
                break;
            case 4:
                GameData.gold_crutch += num;;
                break;
            case 5:
                break;
        }
    }

    static getMaxScore() {
        let score = 0;
        switch (GameData.currentMap) {
            case 0:
                score = GameData.level1;
                break;
            case 1:
                score = GameData.level2;
                break;
            case 2:
                score = GameData.level3;
                break;
            case 3:
                score = GameData.level4;
                break;
        }
        return score;
    }

    static getMap(mapName) {
        let key = mapName;
        return GameData[key];
    }

    static setMap(mapName, state) {
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

    static judgeShopBtns() {
        GameData.canBuyCharactors();
        GameData.canBuyMaps();
        GameData.canBuyProps();
    }

    static canBuyProps() {
        if (GameData.prop_luckyGrass == 10 && GameData.prop_revive == 10 && GameData.prop_speedUp == 10 && GameData.prop_time == 10) {
            /*所有道具都已买满 */
            return false;
        }
        for (let i = 0; i < GameData.propsInfo.length; i++) {
            if (((GameData.diamond >= GameData.propsInfo[i].priceDiamond && GameData.propsInfo[i].priceDiamond > 0) || (GameData.gold >= GameData.propsInfo[i].priceGold && GameData.propsInfo[i].priceGold > 0)) && GameData.getPropByIndex(i)<10) {
                EventManager.emit("REFRESH_BTN", "prop");
                return true;
            }
        }
        return false;
    }

    static getPropByIndex(index){
        switch (index){
            case 0:
                return GameData.prop_luckyGrass;
            case 1:
                return GameData.prop_speedUp;
            case 2:
                return GameData.prop_revive;
            case 3:
                return GameData.prop_time;
        }
    }

    static canBuyMaps() {
        if (GameData.map0 >= 0 && GameData.map1 >= 0 && GameData.map2 >= 0 && GameData.map3 >= 0) {
            /*所有地图已解锁*/
            return false;
        }
        for (let i =1 ; i < GameData.mapsInfo.length; i++) {
            let key="map"+i;
            console.log("log------GameData[key]=:",GameData[key])
            if(GameData[key]>=0){
                continue;
            }
            
            if ((GameData.gold >= GameData.mapsInfo[i].gold_price && GameData.mapsInfo[i].gold_price > 0) ||( GameData.diamond >= GameData.mapsInfo[i].diamond_price && GameData.mapsInfo[i].diamond_price > 0)) {
                console.log("log------i=:",i);
                EventManager.emit("REFRESH_BTN", "map");
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
            if(GameData.getRoleGoldByIndex(i)>=0){
                continue;
            }

            if((GameData.rolesInfo[i].price_gold > 0 && GameData.gold >= GameData.rolesInfo[i].price_gold) || (GameData.diamond >= GameData.rolesInfo[i].price_diamond && GameData.rolesInfo[i].price_diamond > 0)) {
                EventManager.emit("REFRESH_BTN", "role");
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

    static canGetAchieve() {
        for (let i = 0; i < this.achievementsConf.length; i++) {
            let key = "achieveLevel" + i;
            if (GameData[key] > 4) continue
            console.log(" GameData.achievementsConf[i].confName GameData[key]", GameData.achievementsConf[i].confName, GameData[key]);
            console.log("log--------canGetAchieve value target=:", GameData[this.achievementsConf[i].valueName], GameData[GameData.achievementsConf[i].confName][GameData[key]].target)
            if(GameData[this.achievementsConf[i].valueName]>=GameData[GameData.achievementsConf[i].confName][GameData[key]].target){
                return true;
            }
        }
        return false;
    }

    static getBonusDiamonds() {
        let timeInterval = Math.floor((new Date().getTime() - WXCtr.getStorageData("lastTime")) / 1000);
        console.log("log--------离线时间=", timeInterval / 3600 + "小时");
        let date = new Date();
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let totalSeconds = hour * 3600 + min * 60 + sec;
        let bonusDiamond = 0;
        if (timeInterval >= totalSeconds) {
            timeInterval -= totalSeconds;
            bonusDiamond += GameData.getDayJewelOutPut();
            let dayCount = Math.floor(timeInterval / (24 * 3600));
            bonusDiamond += dayCount * GameData.getDayJewelOutPut();
        }
        return bonusDiamond;
    }


    static getAchievementsLevelData() {
        let achieveLevelArr = [];
        for (let i = 0; i < GameData.achievementsConf.length; i++) {
            let achieveLevel = GameData.getAchieveLevel(GameData.achievementsConf[i].valueName, GameData.achievementsConf[i].confName);
            achieveLevelArr.push(achieveLevel);
        }
        return achieveLevelArr;
    }

    static getAchieveLevel(valueName, confName) {
        for (let i = 0; i < GameData[confName].length; i++) {
            if (GameData[valueName] < GameData[confName][i].target) {
                return i;
            }
        }

        return GameData[confName].length - 1
    }


    static submitScore(score) {
        console.log("log--------currentMap=", GameData.currentMap);
        let key = "level" + (GameData.currentMap + 1);
        if (!GameData[key]) {
            GameData[key] = score;
            WXCtr.submitScoreToWx(GameData.level1, GameData.level2, GameData.level3, GameData.level4);
        } else {
            GameData[key]= GameData[key]>=score?GameData[key]:score;
            WXCtr.submitScoreToWx(GameData.level1, GameData.level2, GameData.level3, GameData.level4);
        }
        HttpCtr.submitScore(mapsName[GameData.currentMap], score);
    }

    static caculateLotteryTimes(){
        console.log("log-------------GameData.lotteryTimes=",GameData.lotteryTimes);
        if(!GameData.lotteryTimes||GameData.lotteryTimes<0){
            GameData.lotteryTimes=10;
            return;
        }
        let timeIterval=Math.floor((new Date().getTime()-GameData.saveTime)/1000);
        let date=new Date();

        let hour=date.getHours();
        let min=date.getMinutes();
        let sec=date.getSeconds();
        
        console.log("log-------------timeIterval  currentTime=:",timeIterval,hour*3600+min*60+sec)
        if(timeIterval>hour*3600+min*60+sec){
            timeIterval-=hour*3600+min*60+sec;
            GameData.lotteryTimes+=3;
            
            let cycle=Math.floor(timeIterval/(3600*24));
            GameData.lotteryTimes+=3*cycle
            GameData.lotteryTimes=GameData.lotteryTimes>10?10:GameData.lotteryTimes;
        }
    }
}
