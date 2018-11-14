import GameCtr from "../../Controller/GameCtr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _btn_close=null;
    _lb_bonus=null;
    _lb_title=null;
    _lb_des=null;
    _contentNode=null;
    _achieveConfig=null;

    @property(cc.Prefab)
    achieveItem:cc.Prefab=null;

    onLoad(){
        this.initData()
        this.initNode();
        this.initAchievements();
    }

    initData(){
        this._achieveConfig=[
            {id:0,  title:"战利品",     description:"收集40000金币",       bonus:5000, goal:40000},
            {id:1,  title:"跳跃之王",   description:"COMBO跳跃3000次",     bonus:2000, goal:3000},
            {id:2,  title:"头铁",       description:"刀妹打破100次宝箱",   bonus:500,   goal:100},
            {id:3,  title:"计时器",     description:"厨子收集50个加时器",   bonus:1000, goal:50},
            {id:4,  title:"不朽",       description:"骷髅复活5次",         bonus:1000, goal:200},
            {id:5,  title:"海盗的箱子", description:"船长打破200个宝箱",    bonus:500,  goal:200},
            {id:6,  title:"遗漏专家",   description:"漏掉500金币",         bonus:2000, goal:500},
            {id:7,  title:"特技演员",   description:"成功双跳50次",        bonus:2000, goal:50},
            {id:8,  title:"快到碗里来", description:"用磁铁吸收40枚金币",   bonus:500,  goal:40},
            {id:9,  title:"拆弹专家",   description:"用盾牌抵消1800枚炸弹", bonus:2000, goal:1800},
            {id:10, title:"无敌",       description:"所有角色都15级",      bonus:10000, goal:5},
            {id:11, title:"转生通道",   description:"用盾牌抵消1800枚炸弹", bonus:5000, goal:1800}
        ]
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._lb_bonus=this.node.getChildByName("lb_bonus");
        this._lb_title=this.node.getChildByName("lb_title");
        this._lb_des=this.node.getChildByName("lb_des");
        this._contentNode=this.node.getChildByName("contentNode");

        this.initBtnEvent(this._btn_close);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.getInstance().getStart().setMaskVisit(false);
            }
        })
    }

    initAchievements(){
        for(let i=0;i<this._achieveConfig.length;i++){
            let achieve =cc.instantiate(this.achieveItem);
            achieve.parent=this.node;
            console.log("log-------initAchievements----");
            //achieve.getComponent("achieveItem").init(this._achieveConfig[i].goal,i);
        }
    }

    setTitle(){
        this._lb_title.getComponent(cc.Label).string="";
    }

    setDes(){
        this._lb_des.getComponent(cc.Label).string="";
    }

    setBonus(){
        this._lb_bonus.getComponent(cc.Label).string="";
    }
}
