import GameCtr from "../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Toast extends cc.Component {
    @property(cc.Prefab)
    pfToast:cc.Prefab=null;

    onLoad(){
        GameCtr.getInstance().setToast(this);
    }

    toast(str,callFunc=null,duration=1.5){
        let pfToast=cc.instantiate(this.pfToast);
        pfToast.parent=this.node;
        pfToast.getComponent("Toast1").init(str,callFunc);
    }

    
}
