import GameData from "../../Common/GameData";
import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _mask=null;
    _btn_help=null;
    _btn_buy=null;
    _lb_level=null;
    _lb_price=null;
    _icon_role=null;
    _icon_seleted=null;
    _icon_seletedFrame=null;
    _progress=null;
    _progressBar=null;
    _roleInfo=null;
    _roleLevelInfo=null;
    _roleSeletedAniTag=500;

    @property(cc.Prefab)
    pfRoleSeletedAni:cc.Prefab=null;

    @property(cc.Prefab)
    pfNote:cc.Prefab=null;

    init(info){
        this.initInfo(info);
        this.initNode();
    }

    initInfo(info){
        this._roleInfo=info;
        console.log("log----------------this._roleInfo=:",this._roleInfo);
        this._roleLevelInfo=GameData.getRoleLevelInfoByName(this._roleInfo.name);
    }

    initNode(){
        this._mask=this.node.getChildByName("mask");
        this._btn_buy=this.node.getChildByName("btn_buy");
        this._btn_help=this.node.getChildByName("btn_help");
        this._lb_level=this.node.getChildByName("lb_level");
        this._lb_price=this._btn_buy.getChildByName("lb_price");
        this._icon_role=this.node.getChildByName("icon_role");
        this._icon_seleted=this.node.getChildByName("icon_seleted");
        this._icon_seletedFrame=this.node.getChildByName("icon_seletedFrame");
        this._progress=this.node.getChildByName("progress");
        this._progressBar=this.node.getChildByName("bar");


        this._lb_level.setLocalZOrder(12);
        this._progressBar.setLocalZOrder(10);
        this._progress.setLocalZOrder(10);

        this._mask.active=false;
        this._icon_seleted.active=false;
        this._icon_seletedFrame.active=false;

        this.initBtnEvent(this._btn_buy);
        this.initBtnEvent(this._btn_help);
        this.showPrice();
        this.showLevelInfo();
        this.showBtnBuyState();
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

    doBuy(){
        if(this._roleInfo.price_gold>0){
            if(GameData.gold>=this._roleInfo.price_gold){
                AudioManager.getInstance().playSound("audio/buy");
                GameData.currentRole=this._roleInfo.id;
                GameData.gold-=this._roleInfo.price_gold;
                GameCtr.getInstance().getPublic().showGold();
                if(cc.director.getScene().name=="Start"){
                    GameCtr.getInstance().getStart().updateBtnShopState();
                }else if(cc.director.getScene().name=="Game"){
                    GameCtr.ins.mGameOver.updateBtnShopState();
                }
                GameCtr.getInstance().getPublic().upBtnsState();
                GameData.addGoldByName(this._roleInfo.name);
                this.node.parent.parent.getComponent("charactersNode").hideSeletedStates();
                this.node.parent.parent.getComponent("charactersNode").updateRoleBtnState();
                this.showLevelInfo();
                this.setSeletedState(true);
                this._btn_buy.active=false;
                this.node.getComponent(cc.Button).interactable=true;
            }else{
                GameCtr.getInstance().getToast().toast("金币不足")
            }
        }
        
        if(this._roleInfo.price_diamond>0){
            if(GameData.diamond>=this._roleInfo.price_diamond){
                GameData.currentRole=this._roleInfo.id;
                GameData.diamond-=this._roleInfo.price_diamond;
                GameCtr.getInstance().getPublic().showDiamond();
                if(cc.director.getScene().name=="Start"){
                    GameCtr.getInstance().getStart().updateBtnShopState();
                }else if(cc.director.getScene().name=="Game"){
                    GameCtr.ins.mGameOver.updateBtnShopState();
                }
                GameCtr.getInstance().getPublic().upBtnsState();
                GameData.addGoldByName(this._roleInfo.name);
                this.node.parent.parent.getComponent("charactersNode").hideSeletedStates();
                this.node.parent.parent.getComponent("charactersNode").updateRoleBtnState();
                this.showLevelInfo();
                this.setSeletedState(true);
                this._btn_buy.active=false;
                this.node.getComponent(cc.Button).interactable=true;
            }else{
                GameCtr.getInstance().getToast().toast("钻石不足")
            }
        }
    }

    showPrice(){
        if(this._lb_price){
            if(this._roleInfo.price_gold>0){
                this._lb_price.getComponent(cc.Label).string=this._roleInfo.price_gold;
            }
            if(this._roleInfo.price_diamond>0){
                this._lb_price.getComponent(cc.Label).string=this._roleInfo.price_diamond;
            }
        }
    }

    showLevel(bool){
        this._lb_level.active=bool;
        this._progress.active=bool;
        this._progressBar.active=bool;
    }

    showLevelInfo(){
        this._roleLevelInfo=GameData.getRoleLevelInfoByName(this._roleInfo.name);
        console.log("log------------this._roleLevelInfo=:",this._roleLevelInfo);

        if(this._roleLevelInfo._level<0){//未解锁
            this.showLevel(false)
            return;
        }
        /* 已解锁 */
        this.showLevel(true);

        console.log("_lb_level.active=:",this._lb_level.active);
        console.log("this._roleLevelInfo._level=:",this._roleLevelInfo._level);

        this._lb_level.getComponent(cc.Label).string=this._roleLevelInfo._level;
        this._progress.getComponent(cc.ProgressBar).progress=this._roleLevelInfo._currentGold/this._roleLevelInfo._targetGold;
    }

    showDes(){
        if(cc.find("Canvas").getChildByName("note")){
            return;
        }
        let note=cc.instantiate(this.pfNote);
        note.parent=cc.find("Canvas");
        note.getComponent("note").showNote(this._roleInfo.des);
    }

    getLevel(){
        return this._roleLevelInfo._level;
    }

    showBtnBuyState(){
        
        if(GameData.getGoldByName(this._roleInfo.name)>=0){//已解锁
            this._btn_buy.active=false;
            this._mask.active=false;
            this.setLockState(true);
        }else{
            /* 未解锁 */
            this.setLockState(false);
            this._btn_buy.active=true;
            this._mask.active=true;
            if(GameData.gold>=this._roleInfo.price_gold && GameData.diamond>=this._roleInfo.price_diamond){
                this._btn_buy.opacity=255;
                this._btn_buy.getComponent(cc.Button).interactable=true;
            }else{
                this._btn_buy.opacity=150;
                this._btn_buy.getComponent(cc.Button).interactable=false;
            }
        }
    }

    setLockState(lock){
        this._icon_role.getComponent(cc.Button).interactable=lock;
    }

    setSeletedState(bool){
        this._icon_seleted.active=bool;
        this._icon_seletedFrame.active=bool;
        if(bool){
            this.addSeletedAni();
        }else{
            this.removeSeletedAni();
        }
    }


    addSeletedAni(){
        this._icon_role.active=false;
        let roleSeleted=cc.instantiate(this.pfRoleSeletedAni);
        roleSeleted.parent=this.node;
        roleSeleted.tag=this._roleSeletedAniTag;
        roleSeleted.getComponent("roleSeletedAni").init(this._roleInfo.id);
    }

    removeSeletedAni(){
        this._icon_role.active=true;
        while(this.node.getChildByTag(this._roleSeletedAniTag)){
            this.node.removeChildByTag(this._roleSeletedAniTag)
        }  
    }
}
