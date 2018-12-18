import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class powerNode extends cc.Component {

    @property(cc.Label)
    lbPower: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.lbPower.string = GameData.power+"/99";
    }

    clickAdd() {
        ViewManager.showPowerNotEnough();
    }

    // update (dt) {}
}
