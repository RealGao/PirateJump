import GameData from "../../Common/GameData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _icon=null;
    _maps=[];


    init(){
       
        this._icon=this.node.getChildByName('icon');
        for(let i=0;i<4;i++){
            let map= this.node.getChildByName("map"+i);
            map.getComponent("mapItem").init();
            this._maps.push(map);

            console.log("GameData.currentMap=:",GameData.currentMap);
            if(GameData.currentMap==i){
                map.getComponent("mapItem").setSeletedState(true);
            }
        }

        this.initMapsListener();
    }

    initMapsListener(){
        for(let i =0;i<this._maps.length;i++){
            this._maps[i].on(cc.Node.EventType.TOUCH_END,(e)=>{
               for(let i=0;i<this._maps.length;i++){
                    if(e.target.getName()==this._maps[i].name){
                        this._maps[i].getComponent("mapItem").setSeletedState(true);
                        GameData.currentMap=i;
                    }else{
                        this._maps[i].getComponent("mapItem").setSeletedState(false);
                    }
               }
            })
        }  
    }
    
}
