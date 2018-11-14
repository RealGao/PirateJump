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

            if(i>=3){
                home.getComponent("home").setlockState(false);
            }else{
                home.getComponent("home").setlockState(true);
            }

            if(GameData.currentHome==i){
                home.getComponent("home").setSeletedState(true);
            }else{
                home.getComponent("home").setSeletedState(false);
            }
        }

        //this.initMaskEvent();
    }

    // initMaskEvent(){
    //     this._mask=this.node.getChildByName("mask");
    //     this._mask.on(cc.Node.EventType.TOUCH_END,(e)=>{
    //         this.hide(); 
    //     })
    // }


    hide(){
        this.node.active=false;
    }

    hideSeletedFrames(){
        for(let i=0;i<this._homes.length;i++){
            this._homes[i].getComponent("home").setSeletedState(false);
        }
    }

}
