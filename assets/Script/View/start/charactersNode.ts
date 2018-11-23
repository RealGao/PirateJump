import GameData from "../../Common/GameData";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _roles=[];
    _rolesName=[];
    _box=null;
    _icon=null;
    _rolesContent=null;

    onLoad(){
        GameCtr.getInstance().getStart().showBgSprite(1);
        this.initNode();
        this.doAction();
    }
    
    initNode(){
        this._box=this.node.getChildByName("box");
        this._icon=this.node.getChildByName("icon");
        this._rolesContent=this.node.getChildByName("rolesContent");

        this._box.x=-650;

        for(let i=0;i<5;i++){
            let role=this._rolesContent.getChildByName("role"+i);
            role.getComponent("roleItem").init(GameData.rolesInfo[i]);//ps ：临时显示  注意有显示钻石的
            this._roles.push(role);

            if(GameData.currentRole==i){
                role.getComponent("roleItem").setSeletedState(true);      
            }else{
                role.getComponent("roleItem").setSeletedState(false);      
            }
        }

        this.initRolesListener();
        this.doBoxAppear()
    }

    updateRoleBtnState(){
        for(let i=0;i<this._roles.length;i++){
            this._roles[i].getComponent("roleItem").showBtnBuyState();       
        }
    }

    initRolesListener(){
        for(let i=0;i<this._roles.length;i++){
            let role=this._roles[i].getChildByName("icon_role");
            role.on(cc.Node.EventType.TOUCH_END,(e)=>{
                for(let i=0;i<this._roles.length;i++){
                    if(e.target.parent.name==this._roles[i].name){
                        if(this._roles[i].getComponent("roleItem").getLevel()<0){
                            /* 未解锁 */
                            return;
                        }
                        console.log("GameData.currentRole=:",GameData.currentRole);
                        if(GameData.currentRole!=i){
                            this.hideSeletedStates();
                            this._roles[i].getComponent("roleItem").setSeletedState(true);
                            GameData.currentRole=i;
                        }
                    }
                }
            })
        }
    }

    hideSeletedStates(){
        for(let i=0;i<this._roles.length;i++){
            this._roles[i].getComponent("roleItem").setSeletedState(false);
        }
    }

    doBoxAppear(){
        console.log("log-------doBoxAppear---------");
        this._box.x=-350;
        this._box.runAction(cc.moveBy(30,cc.p(600,0)))
        this.schedule(()=>{
            this._box.stopAllActions();
            this._box.x=-350;
            this._box.runAction(cc.moveBy(30,cc.p(600,0)))
        },2*60)
    }

    doAction(){
        let icon=this.node.getChildByName("icon");
        icon.runAction(cc.sequence(
            cc.scaleTo(0.1,1.2),
            cc.scaleTo(0.2,0.9),
            cc.scaleTo(0.2,1.0),
        ))
    }
}
