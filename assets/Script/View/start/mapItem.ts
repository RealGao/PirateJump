import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
import GrayEffect from "../../Common/GrayEffect";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _icon_seleted=null;
    _lb_recordHolder=null;
    _starsNode=null;
    _btn_buy=null;
    _btn_help=null;
    _lb_price=null;
    _iconGold=null;
    _iconDiamond=null;
    _mask=null;
    _index=null;
    _title=null;

    _info=null;

    @property(cc.Prefab)
    pfNote:cc.Prefab=null;

    init(info,index){
        this._info=info;
        this._index=index;
        // this._price.gold_price=info.gold_price;
        // this._price.diamond_price=info.diamond_price;
        // this._name=info.name;

        console.log("log-------------this._info=:",info);
        this.initNode();
        this.showPrice();
        this.showMapState();
        this.showBtnBuyState();
    }

    initNode(){
        this._mask=this.node.getChildByName("mask");
        this._title=this.node.getChildByName("title");
        this._btn_buy=this.node.getChildByName("btn_buy");
        this._btn_help=this.node.getChildByName("btn_help");
        this._lb_price=this._btn_buy.getChildByName("lb_price");
        this._iconGold=this._btn_buy.getChildByName("icon_gold");
        this._iconDiamond=this._btn_buy.getChildByName("icon_diamond");

        this._icon_seleted=this.node.getChildByName('icon_seleted');
        this._lb_recordHolder=this.node.getChildByName("champion_frame").getChildByName("lb_recordHolder");
    
        this._starsNode=this.node.getChildByName("starsNode");
        for(let i=0;i<this._starsNode.children.length;i++){
            this._starsNode.children[i].active=false;
        }

        this._mask.active=false;
        this._btn_buy.active=false;
        this._lb_price.active=false;
        this._iconGold.active=false;
        this._iconDiamond.active=false;
        this._icon_seleted.active=false;
       
        this.initBtnEvent(this._btn_buy);
        this.initBtnEvent(this._btn_help);
    }

    
    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_buy"){
                this.doBuy();
            }else if(e.target.getName()=="btn_help"){
                this.showDes();
            }
        })
    }

    showRecordHolder(recordHolder){
        this._lb_recordHolder.getComponent(cc.Label).string=recordHolder.name;
    }

    showPrice(){
        if(this._info.gold_price<=0 && this._info.diamond_price<=0){
            return;
        }
        this._btn_buy.active=true;
        this._lb_price.active=true;
        if(this._info.gold_price>0){
            this._iconGold.active=true;
            this._lb_price.getComponent(cc.Label).string=this._info.gold_price;
        }
        if(this._info.diamond_price>0){
            this._iconDiamond.active=true;
            this._lb_price.getComponent(cc.Label).string=this._info.diamond_price;
        }
    }

    doBuy(){
        if(this._info.gold_price>0){
            if(GameData.gold>=this._info.gold_price){
                if(GameData.currentRole==4 &&this._index==3){
                    GameCtr.getInstance().getToast().toast("当前角色下，无法购买该地图");
                    return;
                }
                AudioManager.getInstance().playSound("audio/buy");
                GameData.gold-=this._info.gold_price;
                // GameCtr.getInstance().getPublic().showGold();
                if(cc.director.getScene().name=="Start"){
                    GameCtr.getInstance().getStart().updateBtnShopState();
                }else if(cc.director.getScene().name=="Game"){
                    // GameCtr.ins.mGameOver.updateBtnShopState();
                }
                this._btn_buy.active=false;
                this.setLockState(true);
                GameData.setMap(this._info.name,0);
                GameCtr.getInstance().getShop().upBtnsState();
            }else{
                GameCtr.getInstance().getToast().toast("金币不足");
            }
        }

        if(this._info.diamond_price>0){
            AudioManager.getInstance().playSound("audio/buy");
            if(GameData.diamond>=this._info.diamond_price){
                if(GameData.currentRole==4 &&this._index==3){
                    GameCtr.getInstance().getToast().toast("当前角色下，无法购买该地图");
                    return;
                }
                GameData.diamond-=this._info.diamond_price;
                // GameCtr.getInstance().getPublic().showDiamond();
                if(cc.director.getScene().name=="Start"){
                    GameCtr.getInstance().getStart().updateBtnShopState();
                }else if(cc.director.getScene().name=="Game"){
                    // GameCtr.ins.mGameOver.updateBtnShopState();
                }
               
                this._btn_buy.active=false;
                this.setLockState(true);
                GameData.setMap(this._info.name,0);
                GameCtr.getInstance().getShop().upBtnsState();
            }else{
                GameCtr.getInstance().getToast().toast("钻石不足");
            }
        }
    }

    setLockState(lock){
        this.node.getComponent(cc.Button).interactable=lock;
        this._title.getComponent(cc.Button).interactable=lock;
    }

    setSeletedState(bool){
        this._icon_seleted.active=bool;
    }


    showMapState(){
        if(GameData.getMap(this._info.name)<0){
            /* 未解锁 */
            this.setLockState(false);
        }else{
            /* 已解锁 */
            this.setLockState(true);
            this.showStars();
        }
    }

    showBtnBuyState(){
        if(GameData.getMap(this._info.name)>=0){
            /* 已解锁 */
            this._btn_buy.active=false;
        }else {
            /* 未解锁 */
            this._btn_buy.active=true;
            let grayEffect: GrayEffect = this._btn_buy.getComponent(GrayEffect);
            // if(GameData.gold>this._info.gold_price && GameData.diamond>=this._info.diamond_price){
            //     /* 满足解锁条件 */
            //     // this._btn_buy.opacity=255;
            //     // grayEffect.resetShader();
            //     this._mask.active=false;
            // }else{
            //     /* 不满足解锁条件 */
            //     // this._btn_buy.opacity=150;
            //     // grayEffect.grayShader();
            //     this._mask.active=true;
            // }
        }
    }

    showStars(){
        let key="level"+(this._index+1);
        let Score=GameData[key];
        console.log('log-------------mapScore=:',Score);
        if(Score){
            for(let i=0;i<this._info.rate.length;i++){
                if(Score>=this._info.rate[i] && this._info.rate[i]>=0){
                    let star=this._starsNode.getChildByName("star"+i);
                    star.active=true;
                }
            }
        }
        
    }

    showDes(){
        // if(cc.find("Canvas").getChildByName("note")){
        //     return;
        // }
        // let note=cc.instantiate(this.pfNote);
        // note.parent=cc.find("Canvas");
        // note.setLocalZOrder(50);
        // note.getComponent("note").showNote(this._info)
        ViewManager.showCommonNote(this._info);
    }

    getState(){
        return GameData.getMap(this._info.name);
    }
}
