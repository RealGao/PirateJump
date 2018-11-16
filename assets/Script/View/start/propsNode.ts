import GameData from "../../Common/GameData";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _propsContent=null;
    _props=[];

    init(){
        this.initNode();
    }

    initNode(){
        this._propsContent=this.node.getChildByName("propsContent");
        for(let i=0;i<4;i++){
            console.log("log---------------------propsNode init--------");
            let prop=this._propsContent.getChildByName('prop'+i);
            prop.getComponent("propItem").init(GameData.propsInfo[i]);
            this._props.push(prop);
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
}
