/**
 * 游戏界面
 * 游戏逻辑自己实现
 */

import GameCtr from "../../Controller/GameCtr";
import NodePoolManager from "../../Common/NodePoolManager";
import ViewManager from "../../Common/ViewManager";
import GameData from "../../Common/GameData";
import HttpCtr from "../../Controller/HttpCtr";
import Util from "../../Common/Util";
import WXCtr from "../../Controller/WXCtr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    ndGame: cc.Node = null;
    

    onLoad() {
        GameCtr.getInstance().setGame(this);
        WXCtr.onShow(() => {
            WXCtr.isOnHide = false;
            this.scheduleOnce(() => {
                this.showOffLineProfitPop();
            }, 2.5);
        });
    }

    onDestroy() {
        WXCtr.offShow();
    }

    start() {
        
    }



    /**
     * 显示离线收益弹窗
     */
    showOffLineProfitPop() {
        console.log("离线收益！！！！！！");
        
    }

    /**
     * 更多游戏
     */
    showMoreGame() {
        if (GameCtr.otherData) {
            WXCtr.gotoOther(GameCtr.otherData);
            HttpCtr.clickStatistics(GameCtr.StatisticType.MORE_GAME, GameCtr.otherData.appid);                               //更多游戏点击统计
        }
    }

    openCustomService() {
        HttpCtr.clickStatistics(GameCtr.StatisticType.GIFT);                                    //关注礼包点击统计
        WXCtr.customService();
    }


    /**
     * 排行榜
     */
    showRanking() {
        if (WXCtr.authed) {
            // let nd = cc.instantiate(this.pfRanking);
            // ViewManager.show({
            //     node: nd,
            //     maskOpacity: 200,
            // });
            HttpCtr.clickStatistics(GameCtr.StatisticType.RANKING);                               //排行榜点击统计
        } else {
            ViewManager.showAuthPop();
        }
    }

}
