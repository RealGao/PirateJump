import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import PromptDialog from "../view/PromptDialog";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends PromptDialog {
    _bg=null;
    _btn_close=null;
    _lb_bonus=null;
    _lb_title=null;
    _lb_des=null;
    _contentNode=null;
    _icon_seleted=null;
    _achieveConfig=null;
    _achieveArr=[];

    onLoad(){
        this.initNode();
        this.initAchievements();
        this.openAction();
    }

    start(){
        this.showAchieve(0);
    }

    initNode(){
        this._bg=this.node.getChildByName("bg");
        this._btn_close=this._bg.getChildByName("btn_close");
        this._lb_bonus=this._bg.getChildByName("lb_bonus");
        this._lb_title=this._bg.getChildByName("lb_title");
        this._lb_des=this._bg.getChildByName("lb_des");
        this._contentNode=this._bg.getChildByName("contentNode");
        this._icon_seleted=this._contentNode.getChildByName("icon_seleted");
        this.initBtnEvent(this._btn_close);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                // this.node.destroy();
                super.dismiss();
            }
        })
    }


    initAchievements(){
        for(let i=0;i<GameData.achievementsConf.length;i++){
            let achieveItem=this._contentNode.getChildByName("achieveItem"+i);
            achieveItem.getComponent("achieveItem").init(GameData.achievementsConf[i],i);
            this._achieveArr.push(achieveItem);
        }
        
        for(let i=0;i<this._achieveArr.length;i++){
            let icon=this._achieveArr[i].getChildByName("bg");
            icon.on(cc.Node.EventType.TOUCH_END,(e)=>{
                for(let i=0;i<this._achieveArr.length;i++){
                    if(e.target.parent.name==this._achieveArr[i].name){
                        this._achieveArr[i].getComponent("achieveItem").judgeUpLevel();
                        this.showAchieve(i);
                    }
                }
            })
        }
    }

    showAchieve(index){
        let des=this._achieveArr[index].getComponent("achieveItem").getDes();
        this.showAchieveDes(des);
        this._icon_seleted.x=this._achieveArr[index].x;
        this._icon_seleted.y=this._achieveArr[index].y;
        this._achieveArr[index].getComponent("achieveItem").showProgress();
    }

    showAchieveDes(des){
        this._lb_title.getComponent(cc.Label).string=des.title
        this._lb_des.getComponent(cc.Label).string=des.des;
        this._lb_bonus.getComponent(cc.Label).string=des.bonus
    }

    openAction(){
        this._bg.scale=0.2;
        this._bg.stopAllActions();
        this._bg.runAction(cc.sequence(
            cc.scaleTo(0.1,1.1),
            cc.scaleTo(0.05,1.0),
        ))
    }
}
