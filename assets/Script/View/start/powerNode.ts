import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import EventManager from "../../Common/EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class powerNode extends cc.Component {

    @property(cc.Label)
    lbPower: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        EventManager.on("POWER",this.setPower,this);
    }

    onDestroy() {
        EventManager.off("POWER",this.setPower,this);
    }

    setPower() {
        this.lbPower.string = GameData.power+"/99";
    }

    start () {
        this.lbPower.string = GameData.power+"/99";
    }

    clickAdd() {
        ViewManager.showPowerNotEnough();
    }

    // update (dt) {}
}
