import GameData from "../../Common/GameData";
import PopupView from "../view/PopupView";
import WXCtr from "../../Controller/WXCtr";
import GameCtr from "../../Controller/GameCtr";
import ViewManager from "../../Common/ViewManager";

const { ccclass, property } = cc._decorator;

let itemNums = 30;

@ccclass
export default class MallPop extends cc.Component {

    onLoad() {

    }

    onDestroy() {
    }

    start() {

    }

    buy(event, data) {
        
    }

    close() {
        if (!this.node.parent) {
            return;
        }
        let popupView = this.node.parent.getComponent(PopupView);
        if (!!popupView) {
            popupView.dismiss();
        } else {
            this.node.destroy();
        }
    }

    // update (dt) {}
}
