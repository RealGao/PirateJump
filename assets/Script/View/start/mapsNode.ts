import GameData from "../../Common/GameData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _icon=null;
    _maps=[];
    onLoad(){
        this.initNode();
        this.initMapsListener();
        this.doAction();
    }

    initNode(){
        this._icon=this.node.getChildByName('icon');
        for(let i=0;i<4;i++){
            let map= this.node.getChildByName("mapContent").getChildByName("map"+i);
            map.getComponent("mapItem").init(GameData.mapsInfo[i]);
            this._maps.push(map);
            if(GameData.currentMap==i){
                map.getComponent("mapItem").setSeletedState(true);
            }
        }
    }

    initMapsListener(){
        for(let i =0;i<this._maps.length;i++){
            this._maps[i].on(cc.Node.EventType.TOUCH_END,(e)=>{
               for(let i=0;i<this._maps.length;i++){
                    
                    if(e.target.getName()==this._maps[i].name){
                        if(this._maps[i].getComponent("mapItem").getState()<0){
                            /* 未解锁 */
                            return;
                        }
                        
                        this.hideSeletedStates();
                        this._maps[i].getComponent("mapItem").setSeletedState(true);
                        GameData.currentMap=i;
                    }
               }
            })
        }  
    }


    hideSeletedStates(){
        for(let i=0;i<this._maps.length;i++){
            this._maps[i].getComponent("mapItem").setSeletedState(false);
        }
    }

    doAction(){
        let ani=this.node.getChildByName("mapContent").getComponent(cc.Animation);
        ani.play();
        this.doIconAction();
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
