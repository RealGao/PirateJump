const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _icon=null;
    _maps=[];


    init(){
       
        this._icon=this.node.getChildByName('icon');
        for(let i=0;i<4;i++){
            let map= this.node.getChildByName("map"+i);
            this._maps.push(map);
        }

        this.initMapsListener();
    }

    initMapsListener(){
        for(let i =0;i<this._maps.length;i++){
            this._maps[i].on(cc.Node.EventType.TOUCH_END,(e)=>{
               for(let i=0;i<this._maps.length;i++){
                    if(e.target.getName()==this._maps[i].name){
                        this._maps[i].getComponent("mapItem").setSeletedState(true);
                    }else{
                        this._maps[i].getComponent("mapItem").setSeletedState(false);
                    }
               }
            })
        }  
    }
    
}
