import PromptDialog from "./PromptDialog";
import WXCtr from "../../Controller/WXCtr";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AuthPop extends PromptDialog {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        WXCtr.createUserInfoBtn();
        WXCtr.onUserInfoBtnTap((res)=>{
            if(res){
                this.dismiss();
                GameCtr.getInstance().getStart().showRank();
            }
        });
    }

    dismiss() {
        WXCtr.userInfoBtn.destroy();
        super.dismiss();
    }

    // update (dt) {}
}
