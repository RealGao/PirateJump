import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    pfAchievement:cc.Prefab=null;

    @property(cc.Prefab)
    pfHelp:cc.Prefab=null;

    @property(cc.Label)
    lb_luckyGrass:cc.Label=null;

    @property(cc.Label)
    lb_speedUp:cc.Label=null;

    @property(cc.Label)
    lb_revive:cc.Label=null;

    @property(cc.Label)
    lb_time:cc.Label=null;

    onLoad(){
        this.showPropsCount();
        this.showBtnMusicState();
    }

    onBtnRestart(){
        this.node.destroy();
        GameCtr.ins.mGame.start();
    }

    onBtnReturn(){
        cc.director.loadScene("Start")
    }

    onBtnContinue(){
        this.node.destroy();
        GameCtr.ins.mGame.resume();
    }

    onBtnMusic(){
        GameCtr.musicState=-1*GameCtr.musicState;
        localStorage.setItem("musicState",GameCtr.musicState+'');
        this.showBtnMusicState();
    }

    onBtnAchieve(){
        if(this.node.getChildByName("achievement")){
            return;
        }
        let achievement=cc.instantiate(this.pfAchievement);
        achievement.parent=this.node;
    }

    onBtnHelp(){
        if(this.node.getChildByName("help")){
            return;
        }

        let help=cc.instantiate(this.pfHelp);
        help.parent=this.node;
    }

    showPropsCount(){
        this.lb_luckyGrass.string=GameData.prop_luckyGrass+'';
        this.lb_speedUp.string=GameData.prop_speedUp+'';
        this.lb_revive.string=GameData.prop_revive+'';
        this.lb_time.string=GameData.prop_time+'';
    }

    showBtnMusicState(){
        let mask=this.node.getChildByName("btn_music").getChildByName("mask");
        if(GameCtr.musicState>0){//音乐 音效开启
            mask.active=false;
            AudioManager.getInstance().soundOn = true;
            AudioManager.getInstance().musicOn = true;
        }else{//音乐 音效关闭
            mask.active=true;
            AudioManager.getInstance().soundOn = false;
            AudioManager.getInstance().musicOn = false;
        }

        let music = cc.find("Canvas").getChildByTag(GameCtr.musicTag);
        if (music) {
            music.getComponent("music").updatePlayState();
        }
    }

}
