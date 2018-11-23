import GameData from "../../Common/GameData";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _propsContent=null;
    _props=[];
    _homeWorldProps=[];

    onLoad(){
        this.initNode();
        this.doAction();
    }

    initNode(){
        this._propsContent=this.node.getChildByName("propsContent");
        /*普通道具*/
        for(let i=0;i<4;i++){
            let prop=this._propsContent.getChildByName('prop'+i);
            prop.getComponent("propItem").init(GameData.propsInfo[i]);
            this._props.push(prop);
        }

        /*家园道具*/
        for(let i=0;i<4;i++){
            let homeWorldProp=this._propsContent.getChildByName("homeWorldprop"+i);
            homeWorldProp.getComponent("homeWorldPropItem").init(GameData.homeWorldPropsInfo[i]);
            this._homeWorldProps.push(homeWorldProp);
        }
    }

    doAction(){
        this.doIconAction();
        let ani=this._propsContent.getComponent(cc.Animation);
        ani.play();
    }

    doIconAction(){
        let icon=this.node.getChildByName("icon");
        icon.runAction(cc.sequence(
            cc.scaleTo(0.1,1.2),
            cc.scaleTo(0.2,0.9),
            cc.scaleTo(0.2,1.0),
        ))
    }

    updateHomeWorldPropsBtnsState(){
        for(let i=0;i<this._homeWorldProps.length;i++){
            this._homeWorldProps[i].getComponent("homeWorldPropItem").initLockState();
        }
    }
}
