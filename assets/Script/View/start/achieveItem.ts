import GameData from "../../Common/GameData";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _achieveConf=null;
    _progress=null;
    _value=null;
    
    onLoad(){
        this.initNode();
    }

    initNode(){
        this._progress=this.node.getChildByName('progress') 
    }

    init(achieveConf){
        console.log("log--------achieveConf=:",achieveConf);
        this._value=GameData[achieveConf.valueName];
        this._achieveConf=GameData[achieveConf.confName]; 
    }

    getAchievelevel(){
        for(let i=0;i<this._achieveConf.length;i++){
            if(this._value<this._achieveConf[i].target){
                return i;
            }
        }

        return this._achieveConf.length-1
    }

    getDes(){
        let level=this.getAchievelevel();
        let des={title:this._achieveConf[level].title,des:this._achieveConf[level].des,bonus:this._achieveConf[level].bonus}
        return des;
    }

    showProgress(){
        let level=this.getAchievelevel();
        let valueTemp=this._value>=this._achieveConf[level].target?this._achieveConf[level].target:this._value;
        console.log("log----------valueTemp=:",valueTemp);
        this._progress.getComponent(cc.ProgressBar).progress=valueTemp/this._achieveConf[level].target;
    }

}
