
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _roles=[];
    _prices=[];
    _box=null;
    _icon=null;
    _rolesContent=null;

    init(){
        this.initData();
        this.initNode()
    }

    initData(){
        this._prices=[
            {gold:0,diamond:0},
            {gold:2000,diamond:0},
            {gold:5000,diamond:0},
            {gold:10000,diamond:0},
            {gold:15000,diamond:0},
            {gold:0,diamond:1000}
        ]
    }
    
    initNode(){
        this._box=this.node.getChildByName("box");
        this._icon=this.node.getChildByName("icon");
        this._rolesContent=this.node.getChildByName("rolesContent");

        this._box.x=-650;

        for(let i=0;i<5;i++){
            let role=this._rolesContent.getChildByName("role"+i);
            role.getComponent("roleItem").initPrice(this._prices[i].gold);//ps ：临时显示  注意有显示钻石的
            this._roles.push(role);
        }

        this.initRolesListener();
        this.doBoxAppear()
    }

    initRolesListener(){
        for(let i=0;i<this._roles.length;i++){
            this._roles[i].on(cc.Node.EventType.TOUCH_END,(e)=>{
                for(let i=0;i<this._roles.length;i++){
                    if(e.target.getName()==this._roles[i].name){
                        this._roles[i].getComponent("roleItem").setSeletedState(true);
                    }else{
                        this._roles[i].getComponent("roleItem").setSeletedState(false);
                    }
                }
            })
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
}
