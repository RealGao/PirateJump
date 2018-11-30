import GameData from "../../Common/GameData";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _icon=null;
    _maps=[];
    _tex: cc.Texture2D = null;

    @property(cc.Sprite)
    recorderSprite:cc.Sprite=null;

    @property(cc.Prefab)
    pfPublicNode:cc.Prefab=null;

    onLoad(){
        WXCtr.initSharedCanvas();
        this.initNode();
        this.initPublicNode();
        this.initMapsListener();
        this.doAction();
        WXCtr.showMapsRecorder();
       
    }

    initNode(){
        this._tex= new cc.Texture2D();
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

    initPublicNode(){
        let publicNode=cc.instantiate(this.pfPublicNode);
        publicNode.parent=this.node;
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

    update() {
        this._updateSubDomainCanvas();
    }

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined && this._tex != null ) {
            //console.log("log---------刷新子域的纹理");
            this._tex.initWithElement(window.sharedCanvas);
            this._tex.handleLoadedTexture();
            this.recorderSprite.spriteFrame = new cc.SpriteFrame(this._tex);
        }
    }
}
