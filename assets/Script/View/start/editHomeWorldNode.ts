import GameData from "../../Common/GameData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _mask=null;
    _homes=[];

    start(){
        for(let i=0;i<5;i++){
            let home=this.node.getChildByName("home"+i);
            this._homes.push(home);
            if(GameData.jewelLevel>=GameData.homeLockLevel[i]){
                home.getComponent("home").setlockState(true);
            }else{
                home.getComponent("home").setlockState(false);
            }

            if(GameData.currentHome==i){
                home.getComponent("home").setSeletedState(true);
            }else{
                home.getComponent("home").setSeletedState(false);
            }
        }
    }

    hide(){
        this.node.active=false;
    }

    hideSeletedFrames(){
        for(let i=0;i<this._homes.length;i++){
            this._homes[i].getComponent("home").setSeletedState(false);
        }
    }

}
