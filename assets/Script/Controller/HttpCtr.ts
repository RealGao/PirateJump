import Http from "../Common/Http";
import UserManager from "../Common/UserManager";
import WXCtr from "./WXCtr";
import GameCtr from "./GameCtr";
import ViewManager from "../Common/ViewManager";
import Util from "../Common/Util";
import GameData from "../Common/GameData";

/**
 * 所有Http请求统一控制
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class HttpCtr {

    public static StatisticType = cc.Enum({                         //统计类型
        SPEED: 1,                                                   //加速分享
        INVITE: 2,                                                  //邀请
        MORE_GAME: 3,                                               //更多游戏
        UFO: 4,                                                     //UFO
        GIFT: 5,                                                    //关注礼包
        MALL: 6,                                                    //商城
        RANKING: 7,                                                 //排行榜
        FAST_BUY: 8,                                                //快捷购买
        SHARE_GOLD: 9,                                              //金币不足分享
        OFF_LINE_SHARE: 10,                                         //离线分享收益
        OFF_LINE_VEDIO: 11,                                         //离线视频收益
        BANNER_SLIDER: 12,                                          //今日新游统计
    });

    private static loginRequestTimes = 0;                                  //登录请求次数

    //登录游戏
    static login(code, userData) {
        console.log("登陆服务器, code = ", code);
        this.loginRequestTimes++;
        let data = {code: code};
        if(userData) {
            data["signature"] = userData.signature;
            data["rawData"] = userData.rawData;
            data["encryptedData"] = userData.encryptedData;
            data["iv"] = userData.iv;
            data["user"] = userData;
        }
        Http.send({
            url: Http.UrlConfig.LOGIN,
            success: (resp) => {
                console.log("登陆服务器成功", resp);
                if (resp.code == Http.Code.OK) {
                    if (resp.data) {
                        UserManager.user = resp.user;
                        UserManager.user_id = resp.data.open_id;
                        console.log("UserManager.user_id == ", UserManager.user_id);
                        WXCtr.setVideoAd();
                        // HttpCtr.getGameConfig();
                    } else {

                    }
                }
            },
            error: () => {

            },
            data: data
        });

    }

    // 提交分数
    static submitScore(map, score) {
        let url = "/game/" + map + "/score";
        Http.send({
            url: url,
            success: (resp) => {

            },
            data: {
                open_id: UserManager.user_id,
                types: map,
                score: score
            }
        });
    }

    // 获取排行榜信息
    static getWorldRankingList(map, callback = null) {
        let url = "/game/" + map + "/orders";
        Http.send({
            url: url,
            success: (resp) => {
                console.log("登陆服务器成功", resp);
                if (resp.code == Http.Code.OK) {
                    if (callback) {
                        callback(resp);
                    }
                }
            },
            error: () => {

            },
            data: {
                open_id: UserManager.user_id,
                types: map,
                count: 30
            }
        });
    }

    // video视频广告上报
    static videoAdReport(kind) {
        Http.send({
            url: Http.UrlConfig.VIDEO_AD,
            success:()=>{},
            data:{
                open_id: UserManager.user_id,
                kind: kind
            }
        });
    }

    // banner广告上报
    static bannerAdReport(kind) {
        Http.send({
            url: Http.UrlConfig.BANNER_AD,
            success:()=>{},
            data:{
                open_id: UserManager.user_id,
                kind: kind
            }
        });
    }

    // 获取游戏开关配置
    static getGameConfig() {
        Http.send({
            url: Http.UrlConfig.GAME_CONFIG,
            success: (resp)=>{
                if (resp.code == Http.Code.OK) {
                    GameCtr.reviewSwitch = resp.audit_switch == 1 ? true : false;
                }
            },
            data:{

            }
        });
    }

    // update (dt) {}
}
