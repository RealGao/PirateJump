import GameCtr from "../Controller/GameCtr";



const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    updatePlayState(){
        let audioSource=this.node.getComponent(cc.AudioSource);
        if(GameCtr.musicState>0){
            audioSource.play();
        }else{
            audioSource.pause();
        }
    }
}
