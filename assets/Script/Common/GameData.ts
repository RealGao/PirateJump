import GameCtr from "../Controller/GameCtr";
import WXCtr from "../Controller/WXCtr";
import UserManager from "./UserManager";
import HttpCtr from "../Controller/HttpCtr";
import Util from "./Util";


const { ccclass, property } = cc._decorator;

const dataKeyConfig = {
        power:"data_1",                                                             //体力数量
        combo:"data_2",                                                             //连击数量
        doubleJump:"data_3",                                                        //连跳数量
        flyingGold:"data_4",                                                        //飞行的金币 
        omitGold:"data_5",                                                          //穿过的金币
        hitBox:"data_6",                                                            //头铁
        gatherTimer:"data_7",                                                       //时间之子
        reviveTimes:"data_8",                                                       //不死亡灵
        dismantleBomb:"data_9",                                                     //拆弹专家
        unlockRoles:"data_10",                                                      //大团圆
        levelUp:"data_11",                                                          //升级
        captainHitBox:"data_12",                                                    //钩宝箱

        /*道具*/
        prop_speedUp:"data_13",                                                     //加速道具
        prop_revive:"data_14",                                                      //复活道具
        prop_luckyGrass:"data_15",                                                  //幸运草道具
        prop_time:"data_16",                                                        //时间道具

        /*角色等级*/
        roleLevel_captain:"data_17",                                                //船长等级
        roleLevel_sparklet:"data_18",                                               //刀妹等级
        roleLevel_hook:"data_19",                                                   //白胡子等级
        roleLevel_leavened:"data_20",                                               //厨子等级
        roleLevel_crutch:"data_21",                                                 //骷髅等级

        /*地图*/
        map_2:"data_22",                                                            //地图2
        maxFightGold:"data_23",                                                     //最大战斗获得金币
        currentShopIndex:"data_24",                                                 //当前商铺索引（道具 地图 角色  家园）
        currentMap:"data_25",                                                       //当前使用地图
        currentRole:"data_26",                                                      //当前使用角色
        currentHome:"data_27",                                                      //当前家园
    };


@ccclass
export default class GameData {
    private static _gold:number=0;                                      //金币数量
    private static _diamond:number=0;                                   //钻石数量
    private static _power:number=0;                                     //体力数量
    private static _combo:number=0;                                     //连击数量
    private static _doubleJump:number=0;                                //连跳数量
    private static _flyingGold:number=0;                                //飞行的金币 
    private static _omitGold:number=0;                                  //穿过的金币
    private static _hitBox:number=0;                                    //头铁
    private static _gatherTimer:number=0;                               //时间之子
    private static _reviveTimes:number=0;                               //不死亡灵
    private static _dismantleBomb:number=0;                             //拆弹专家
    private static _unlockRoles:number=0;                               //大团圆
    private static _levelUp:number=0;                                   //升级
    private static _captainHitBox:number=0;                             //钩宝箱   
    
    /* 道具 */
    private static _prop_speedUp:number=0;                              //加速道具
    private static _prop_revive:number=0;                               //复活道具
    private static _prop_luckyGrass:number=0;                           //幸运草道具
    private static _prop_time:number=0;                                 //时间道具

    /*角色等级*/
    private static _roleLevel_captain:number=1;                         //船长等级 
    private static _roleLevel_sparklet:number=0;                        //刀妹等级 0级表示未解锁
    private static _roleLevel_hook:number=0;                            //白胡子等级 0级表示未解锁
    private static _roleLevel_leavened:number=0;                        //厨子等级 0级表示未解锁
    private static _roleLevel_crutch:number=0;                          //骷髅等级 0级表示未解锁

    private static _map_2:number=0;                                     //地图2(1:已解锁 0：未解锁)
    private static _maxFightGold:number=0;                              //最大战斗金币
    private static _currentShopIndex:number=0;                          //当前商铺索引（道具 地图 角色  家园）
    private static _currentMap:number=0;                                //当前使用地图
    private static _currentRole:number=0;                               //当前使用角色
    private static _currentHome:number=0;                               //当前家园


    static roleInfo=[
        {name:"captain",   gold:0,     diamond:0},
        {name:"sparklet",  gold:2000,  diamond:0},
        {name:"hook",      gold:5000,  diamond:0},
        {name:"leavened",   gold:10000, diamond:0},
        {name:"crutch",    gold:15000, diamond:0},
        {name:"captain",   gold:0,     diamond:1000}
    ]


    /*收集金币*/
    static collectGoldCof=[
        {target:10000,bonus:500},
        {target:20000,bonus:1000},
        {target:40000,bonus:2000},
        {target:80000,bonus:3000},
        {target:200000,bonus:5000}
    ]

    /*连击*/
    static ComboCof=[
        {target:1000,bonus:500},
        {target:3000,bonus:1000},
        {target:5000,bonus:2000},
        {target:10000,bonus:3000},
        {target:20000,bonus:5000},
    ]

    /*连跳*/
    static doubleJumpCof=[
        {target:100,bonus:500},
        {target:300,bonus:1000},
        {target:1000,bonus:2000},
        {target:5000,bonus:3000},
        {target:10000,bonus:5000},
    ]

    /*飞行的金币*/
    static flyingGoldCof=[
        {target:40,bonus:500},
        {target:200,bonus:1000},
        {target:500,bonus:2000},
        {target:2000,bonus:3000},
        {target:50000,bonus:5000},
    ]

    /*穿过金币*/
    static omitGoldCof=[
        {target:500,bonus:500},
        {target:2000,bonus:1000},
        {target:5000,bonus:2000},
        {target:10000,bonus:3000},
        {target:20000,bonus:5000},
    ]

    /*头铁*/
    static hitBoxCof=[
        {target:100,bonus:500},
        {target:300,bonus:1000},
        {target:1000,bonus:2000},
        {target:5000,bonus:3000},
        {target:10000,bonus:5000},
    ]

    /*时间之子*/
    static gatherTimerCof=[
        {target:50,bonus:500},
        {target:200,bonus:1000},
        {target:500,bonus:2000},
        {target:2000,bonus:3000},
        {target:5000,bonus:5000},
    ]

    /*不死亡灵*/
    static reviveTimesCof=[
        {target:10,bonus:500},
        {target:50,bonus:1000},
        {target:200,bonus:2000},
        {target:1000,bonus:3000},
        {target:10000,bonus:5000},
    ]

    /*拆弹专家*/
    static dismantleBombCof=[
        {target:1000,bonus:500},
        {target:2000,bonus:1000},
        {target:5000,bonus:2000},
        {target:10000,bonus:3000},
        {target:20000,bonus:5000},
    ]

    /*大团圆*/
    static unlockRolesCof=[
        {target:2,bonus:500},
        {target:3,bonus:1000},
        {target:4,bonus:2000},
        {target:5,bonus:3000},
        {target:6,bonus:5000},
    ]

    /*升级*/
     static levelUpCof=[
        {target:5,bonus:500},
        {target:10,bonus:1000},
        {target:15,bonus:2000},
        {target:20,bonus:3000},
        {target:25,bonus:5000},
    ]

     /*钩宝箱*/
    static captainHitBoxCof=[
        {target:200,bonus:500},
        {target:500,bonus:1000},
        {target:2000,bonus:2000},
        {target:10000,bonus:3000},
        {target:20000,bonus:5000},
    ]

    //设置玩家金币
    static set gold(gold){
        if(gold<0){
            gold=0;
        }
        GameData._gold=gold;
        GameData.setUserData({gold:GameData._gold})
    }
    //获取玩家金币
    static get gold(){
        return GameData._gold;
    }

    //设置玩家钻石
    static set diamond(diamond){
        if(diamond<0){
            diamond=0
        }
        GameData._diamond=diamond;
        GameData.setUserData({money:GameData._diamond})
    }
    //获取玩家钻石
    static get diamond(){
        return GameData._diamond;
    }

    //设置玩家体力
    static set power(power){
        if(power<0){
            power=0
        }
        GameData._power=power;
        GameData.setUserData({power:GameData._power})
    }

    //获取玩家体力
    static get power(){
        return  GameData._power;
    }

    //设置连击数量
    static set combo(combo){
        if(combo<0){
            combo=0;
        }
        GameData._combo=combo;
        GameData.setUserData({combo:GameData._combo})
    }
    //获取连击数量
    static get combo(){
        return GameData._combo;
    }

    //设置连跳数量
    static set doubleJump(doubleJump){
        if(doubleJump<0){
            doubleJump=0
        }
        GameData._doubleJump=doubleJump;
        GameData.setUserData({doubleJump:GameData._doubleJump})
    }

    //获取连跳数量
    static get doubleJump(){
        return GameData._doubleJump;
    }

    //设置飞行的金币（用磁铁吸收的金币）
    static set flyingGold(flyingGold){
        if(flyingGold<0){
            flyingGold=0;
        }
        GameData._flyingGold=flyingGold;
        GameData.setUserData({flyingGold:GameData._flyingGold})
    }
    //获取飞行的金币（用磁铁吸收的金币）
    static get flyingGold(){
        return GameData._flyingGold;
    }

    //设置遗漏的金币
    static set omitGold(omitGold){
        if(omitGold<0){
            omitGold=0;
        }
        GameData._omitGold=omitGold;
        GameData.setUserData({omitGold:GameData._omitGold})
    }
    //获取遗漏的金币
    static get omitGold(){
        return GameData._omitGold;
    }

    //设置头铁（刀妹撞箱子数量）
    static set hitBox(hitBox){
        if(hitBox<0){
            hitBox=0;
        }
        GameData._hitBox=hitBox;
        GameData.setUserData({omitGold:GameData._hitBox})
    }
    //获取头铁（刀妹撞箱子数量）
    static get hitBox(){
        return GameData._hitBox;
    }

    //设置时间之子（厨子收集时间）
    static set gatherTimer(gatherTimer){
        if(gatherTimer<0){
            gatherTimer=0;
        }
        GameData._gatherTimer=gatherTimer;
        GameData.setUserData({gatherTimer:GameData._gatherTimer})
    }

    //获取时间之子（厨子收集时间）
    static get gatherTimer(){
        return GameData._gatherTimer;
    }

    //设置不死亡灵（不死骷髅复活次数）
    static set reviveTimes(reviveTimes){
        if(reviveTimes<0){
            reviveTimes=0;
        }
        GameData._reviveTimes=reviveTimes;
        GameData.setUserData({reviveTimes:GameData._reviveTimes})
    }

    //获取不死亡灵（不死骷髅复活次数）
    static get reviveTimes(){
        return GameData._reviveTimes;
    }

    //设置拆弹专家（用盾牌拆除炸弹数量）
    static set dismantleBomb(dismantleBomb){
        if(dismantleBomb<0){
            dismantleBomb=0;
        }
        GameData._dismantleBomb=dismantleBomb;
        GameData.setUserData({dismantleBomb:GameData._dismantleBomb})
    }

    //获取拆弹专家（用盾牌拆除炸弹数量）
    static get dismantleBomb(){
        return GameData._dismantleBomb;
    }

    //设置大团圆（解锁角色数量）
    static set unlockRoles(unlockRoles){
        if(unlockRoles<0){
            unlockRoles=0;
        }
        GameData._unlockRoles=unlockRoles;
        GameData.setUserData({unlockRoles:GameData._unlockRoles})
    }

    //获取大团圆（解锁角色数量）
    static get unlockRoles(){
        return GameData._unlockRoles;
    }

    //设置升级（所有角色级级数）
    static set levelUp(levelUp){
        if(levelUp<0){
            levelUp=0;
        }
        GameData._levelUp=levelUp;
        GameData.setUserData({levelUp:GameData._levelUp})
    }

    //获取升级（所有角色级级数）
    static get levelUp(){
        return GameData._levelUp;
    }

    //设置钩宝箱（船长撞破箱子数量）
    static set captainHitBox(captainHitBox){
        if(captainHitBox<0){
            captainHitBox=0;
        }
        GameData._captainHitBox=captainHitBox;
        GameData.setUserData({captainHitBox:GameData._captainHitBox})
    }
    //获取钩宝箱（船长撞破箱子数量）
    static get captainHitBox(){
        return GameData._captainHitBox;
    }


    //设置加速道具数量
    static set prop_speedUp(prop_speedUp){
        if(prop_speedUp<0){
            prop_speedUp=0;
        }
        GameData._prop_speedUp=prop_speedUp;
        GameData.setUserData({prop_speedUp:GameData._prop_speedUp})
    }
    //获取加速道具数量
    static get prop_speedUp(){
        return GameData._prop_speedUp;
    }


    //设置复活道具数量
    static set prop_revive(prop_revive){
        if(prop_revive<0){
            prop_revive=0;
        }
        GameData._prop_revive=prop_revive;
        GameData.setUserData({prop_revive:GameData._prop_revive})
    }
    //获取复活道具数量
    static get prop_revive(){
        return GameData._prop_revive;
    }


    //设置幸运草道具数量
    static set prop_luckyGrass(prop_luckyGrass){
        if(prop_luckyGrass<0){
            prop_luckyGrass=0;
        }
        GameData._prop_luckyGrass=prop_luckyGrass;
        GameData.setUserData({prop_luckyGrass:GameData._prop_luckyGrass})
    }
    //获取幸运草道具数量
    static get prop_luckyGrass(){
        return GameData._prop_luckyGrass;
    }


    //设置时间道具数量
    static set prop_time(prop_time){
        if(prop_time<0){
            prop_time=0;
        }
        GameData._prop_time=prop_time;
        GameData.setUserData({prop_time:GameData._prop_time})
    }
    //获取时间道具数量
    static get prop_time(){
        return GameData._prop_time;
    }

    //设置船长等级
    static set roleLevel_captain(roleLevel_captain){
        if(roleLevel_captain<0){
            roleLevel_captain=0;
        }
        GameData._roleLevel_captain=roleLevel_captain;
        GameData.setUserData({roleLevel_captain:GameData._roleLevel_captain})
    }
    //获取船长等级
    static get roleLevel_captain(){
        return GameData._roleLevel_captain;
    }

    //设置刀妹等级
    static set roleLevel_sparklet(roleLevel_sparklet){
        if(roleLevel_sparklet<0){
            roleLevel_sparklet=0;
        }
        GameData._roleLevel_sparklet=roleLevel_sparklet;
        GameData.setUserData({roleLevel_sparklet:GameData._roleLevel_sparklet})
    }
    //获取刀妹等级
    static get roleLevel_sparklet(){
        return GameData._roleLevel_sparklet;
    }

    //设置白胡子等级
    static set roleLevel_hook(roleLevel_hook){
        if(roleLevel_hook<0){
            roleLevel_hook=0;
        }
        GameData._roleLevel_hook=roleLevel_hook;
        GameData.setUserData({roleLevel_hook:GameData._roleLevel_hook})
    }
    //获取白胡子等级
    static get roleLevel_hook(){
        return GameData._roleLevel_hook;
    }

    //设置厨子等级
    static set roleLevel_leavened(roleLevel_leavened){
        if(roleLevel_leavened<0){
            roleLevel_leavened=0;
        }
        GameData._roleLevel_leavened=roleLevel_leavened;
        GameData.setUserData({roleLevel_leavened:GameData._roleLevel_leavened})
    }
    //获取厨子等级
    static get roleLevel_leavened(){
        return GameData._roleLevel_leavened;
    }


    //设置骷髅等级
    static set roleLevel_crutch(roleLevel_crutch){
        if(roleLevel_crutch<0){
            roleLevel_crutch=0;
        }
        GameData._roleLevel_crutch=roleLevel_crutch;
        GameData.setUserData({roleLevel_crutch:GameData._roleLevel_crutch})
    }
    //获取骷髅等级
    static get roleLevel_crutch(){
        return GameData._roleLevel_crutch;
    }


    //设置地图2解锁状态
    static set map_2(lock){
       
        GameData._map_2=lock;
        GameData.setUserData({map_2:GameData._map_2})
    }
    //获取地图2解锁状态
    static get map_2(){
        return GameData._map_2;
    }


    //设置当前使用角色
    static set currentRole(currentRole){
       
        GameData._currentRole=currentRole;
        GameData.setUserData({currentRole:GameData._currentRole})
    }
    //获取当前使用角色
    static get currentRole(){
        return GameData._currentRole;
    }


    //设置当前使用角色
    static set maxFightGold(maxFightGold){
        if(maxFightGold<0){
            maxFightGold=0;
        }
        GameData._maxFightGold=maxFightGold;
        GameData.setUserData({maxFightGold:GameData._maxFightGold})
    }
    //获取当前使用角色
    static get maxFightGold(){
        return GameData._maxFightGold;
    }


    //设置当前商铺索引
    static set currentShopIndex(currentShopIndex){
        if(currentShopIndex<0){
            currentShopIndex=0;
        }
        GameData._currentShopIndex=currentShopIndex;
        GameData.setUserData({currentShopIndex:GameData._currentShopIndex})
    }
    //获取当前商铺索引
    static get currentShopIndex(){
        return GameData._currentShopIndex;
    }

    //设置当前商铺索引
    static set currentMap(currentMap){
        if(currentMap<0){
            currentMap=0;
        }
        GameData._currentMap=currentMap;
        GameData.setUserData({currentMap:GameData._currentMap})
    }
    //获取当前商铺索引
    static get currentMap(){
        return GameData._currentMap;
    }

     //设置当前家园
     static set currentHome(currentHome){
        if(currentHome<0){
            currentHome=0;
        }
        GameData._currentHome=currentHome;
        GameData.setUserData({currentHome:GameData._currentHome})
    }
    //获取当前家园
    static get currentHome(){
        return GameData._currentHome;
    }

    //获取本地所有游戏数据
    static getAllLocalGameData() {
        console.log("获取本地数据！！！！！！！！！！！！");
        GameData.gold = WXCtr.getStorageData("gold",9000);
        GameData.diamond = WXCtr.getStorageData("diamonds",2000);

        console.log("log gameAllLocalGameData------GameData.gold=:",GameData.gold);
        console.log("log gameAllLocalGameData------GameData.diamond=:",GameData.diamond);


        GameData.power=WXCtr.getStorageData("power");
        GameData.combo=WXCtr.getStorageData("combo");
        GameData.doubleJump=WXCtr.getStorageData("doubleJump");
        GameData.flyingGold=WXCtr.getStorageData("flyingGold");
        GameData.omitGold=WXCtr.getStorageData("omitGold");
        GameData.hitBox=WXCtr.getStorageData("hitBox");
        GameData.gatherTimer=WXCtr.getStorageData("gatherTimer");
        GameData.reviveTimes=WXCtr.getStorageData("reviveTimes");
        GameData.dismantleBomb=WXCtr.getStorageData("dismantleBomb");
        GameData.unlockRoles=WXCtr.getStorageData("unlockRoles");
        GameData.levelUp=WXCtr.getStorageData("levelUp");
        GameData.captainHitBox=WXCtr.getStorageData("captainHitBox");

        GameData.prop_speedUp=WXCtr.getStorageData("prop_speedUp");
        GameData.prop_revive=WXCtr.getStorageData("prop_revive");
        GameData.prop_luckyGrass=WXCtr.getStorageData("prop_luckyGrass");
        GameData.prop_time=WXCtr.getStorageData("prop_time");


        GameData.roleLevel_captain=WXCtr.getStorageData("roleLevel_captain",1);
        GameData.roleLevel_sparklet=WXCtr.getStorageData("roleLevel_sparklet");
        GameData.roleLevel_hook=WXCtr.getStorageData("roleLevel_hook");
        GameData.roleLevel_leavened=WXCtr.getStorageData("roleLevel_leavened");
        GameData.roleLevel_crutch=WXCtr.getStorageData("roleLevel_crutch");
        GameData.map_2=WXCtr.getStorageData("map_2");
       
        GameData.maxFightGold=WXCtr.getStorageData("maxFightGold");
        GameData.currentShopIndex=WXCtr.getStorageData("currentShopIndex");

        GameData.currentMap=WXCtr.getStorageData("currentMap");
        GameData.currentRole=WXCtr.getStorageData("currentRole");
        GameData.currentHome=WXCtr.getStorageData("currentHome");
    }

    static getOnlineGameData(data) {
        GameData.gold = data.gold;
        GameData.diamond = data.money == "NaN" ? 0 : data.money;

        GameData.power=data.data_1;
        GameData.combo=data.data_2;
        GameData.doubleJump=data.data_3;
        GameData.flyingGold=data.data_4;
        GameData.omitGold=data.data_5;
        GameData.hitBox=data.data_6
        GameData.gatherTimer=data.data_7;
        GameData.reviveTimes=data.data_8;
        GameData.dismantleBomb=data.data_9;
        GameData.unlockRoles=data.data_10;
        GameData.levelUp=data.data_11;
        GameData.captainHitBox=data.data_12;

        GameData.prop_speedUp=data.data_13;
        GameData.prop_revive=data.data_14;
        GameData.prop_luckyGrass=data.data_15;
        GameData.prop_time=data.data_16;

        GameData.roleLevel_captain=data.data_17;
        GameData.roleLevel_sparklet=data.data_18;
        GameData.roleLevel_hook=data.data_19;
        GameData.roleLevel_leavened=data.data_20;
        GameData.roleLevel_crutch=data.data_21;
        GameData.map_2=data.data_22;
        GameData.maxFightGold=data.data_23;
        GameData.currentShopIndex=data.data_24;

        GameData.currentMap=data.data_25;
        GameData.currentRole=data.data_26;
        GameData.currentHome=data.data_27;



        GameData.setUserData({ lastTime: data.data_30 });
        HttpCtr.submitUserData({});
        //GameCtr.ins.mGame.gameStart();
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


    static getRoleLevelByName(roleName){
        if(roleName=="captain"){
            return GameData.roleLevel_captain;
        }else if(roleName=="sparklet"){
            return GameData.roleLevel_sparklet;
        }else if(roleName=="hook"){
            return GameData.roleLevel_hook;
        }else if(roleName=="leavened"){
            return GameData.roleLevel_leavened;
        }else if(roleName=="crutch"){
            return GameData.roleLevel_crutch;
        }
    }

    static doUpRoleLevelByName(roleName){
        
        if(roleName=="captain"){
            GameData.roleLevel_captain+=1;
        }else if(roleName=="sparklet"){
            GameData.roleLevel_sparklet+=1;
        }else if(roleName=="hook"){
            GameData.roleLevel_hook+=1;
        }else if(roleName=="leavened"){
            GameData.roleLevel_leavened+=1;
            console.log("log----------GameData.roleLevel_leavened=:",GameData.roleLevel_leavened);
        }else if(roleName=="crutch"){
            GameData.roleLevel_crutch+=1;
        }
    }

}
