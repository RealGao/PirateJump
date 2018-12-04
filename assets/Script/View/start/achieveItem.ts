import GameData from "../../Common/GameData";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _achieveConf=null;
    _progress=null;
    _value=null;
    _achieveIndex=null;
    _bg=null;
    _tip=null;

    @property(cc.Prefab)
    pfToast:cc.Prefab=null;
    
    onLoad(){
        this.initNode();
    }

    start(){
        this.showProgress();
    }

    initNode(){
        this._bg=this.node.getChildByName("bg");
        this._tip=this.node.getChildByName("tip");
        this._progress=this.node.getChildByName('progress');
        this._tip.active=false; 
    }

    init(achieveConf,index){
        console.log("log--------achieveConf=:",achieveConf);
        this._value=GameData[achieveConf.valueName];
        this._achieveIndex=index;
        this._achieveConf=GameData[achieveConf.confName]; 
    }



    getDes(){
        let key="achieveLevel"+this._achieveIndex;
        let level =GameData[key]>4?4:GameData[key];
        console.log("getDes=:level",GameData[key]);
        let des={title:this._achieveConf[level].title,des:this._achieveConf[level].des,bonus:this._achieveConf[level].bonus}
        return des;
    }

    showProgress(){
        let key="achieveLevel"+this._achieveIndex;
        let level =GameData[key]>4?4:GameData[key];
        let valueTemp=this._value>=this._achieveConf[level].target?this._achieveConf[level].target:this._value;
        this._progress.getComponent(cc.ProgressBar).progress=valueTemp/this._achieveConf[level].target; 
       
        if(this._value>=this._achieveConf[level].target){
            this._tip.active=true;
            this._bg.getComponent(cc.Button).interactable=true;
        }else {
            this._bg.getComponent(cc.Button).interactable=false;
            this._tip.active=false;
        }

        if(GameData[key]>4){
            this._bg.getComponent(cc.Button).interactable=true;
            this._tip.active=false;
        }
    }

    judgeUpLevel(){
        let key="achieveLevel"+this._achieveIndex;
        if(GameData[key]>4){return}

        if(this._value>=this._achieveConf[GameData[key]].target){
            GameData[key]++;
            this.showToast();
            if(GameData[key]>4){
                this._bg.getComponent(cc.Button).interactable=true;
                this._tip.active=false;
            }
            if(cc.director.getScene().name=="Start"){
                GameCtr.getInstance().getStart().updateBtnAchieveState();
            }else{
                GameCtr.ins.mGameOver.updateBtnAchieveState();
            }
        }
    }

    showToast(){
        let des=this.getDes();
        let toast=cc.instantiate(this.pfToast);
        toast.parent=cc.find("Canvas");
        toast.setLocalZOrder(50);
        let callFunc=()=>{
            GameData.gold+=des.bonus;
            GameCtr.getInstance().getPublic().showGold();
        }
        toast.getComponent("Toast1").init("获得成就奖励"+des.bonus+"金币",callFunc);
    }

}
