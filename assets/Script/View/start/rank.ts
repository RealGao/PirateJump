import HttpCtr from "../../Controller/HttpCtr";
import WXCtr from "../../Controller/WXCtr";
import GameData from "../../Common/GameData";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;

enum Model{
    newPlayer,//新手
    advanced, //进阶
    challenge,//挑战
    unlimited,//无限模式
}

const mapsName = ["map1", "map2", "map3", "map4"]; 

@ccclass
export default class NewClass extends cc.Component {
    _btn_rankWorld=null;
    _btn_rankFriend=null;
    _btn_switchRank=null;
    _btn_pageDown=null;
    _btn_pageUp=null;
    _btn_fight=null;
    _btn_return=null;

    _word_world00=null;
    _word_world01=null;
    _word_friend00=null;
    _word_friend01=null;
    _modelSprite=null;

    _rankWorldNode=null;
    _rankFriendNode=null;
    _rankFriendSprite=null;

    _currentModel=0;
    _currentPage=0;
    _currentRankList=[]

    _tex: cc.Texture2D = null;

    @property(cc.SpriteFrame)
    modelSpriteFrames:cc.SpriteFrame[]=[];

    @property(cc.Prefab)
    pfRankItem:cc.Prefab=null;

    onLoad(){
        this.initNode();
        this.showWorldRank();
        this.requestRank();
    }

    initNode(){
        this._tex= new cc.Texture2D();
        WXCtr.initSharedCanvas();
        this._modelSprite=this.node.getChildByName("modelSprite");

        this._btn_rankWorld=this.node.getChildByName("btn_rankWorld");
        this._btn_rankFriend=this.node.getChildByName("btn_rankFriend");
        this._btn_switchRank=this.node.getChildByName("btn_switchRank");
        this._btn_pageDown=this.node.getChildByName("btn_pageDown");
        this._btn_pageUp=this.node.getChildByName("btn_pageUp");
        this._btn_fight=this.node.getChildByName("btn_fight");
        this._btn_return=this.node.getChildByName("btn_return");

        this._rankWorldNode=this.node.getChildByName("rankWorldNode");
        this._rankFriendNode=this.node.getChildByName("rankFriendNode");
        this._rankFriendSprite=this._rankFriendNode.getComponent(cc.Sprite);

        this._word_world00=this._btn_rankWorld.getChildByName("word_world00");
        this._word_world01=this._btn_rankWorld.getChildByName("word_world01");
        this._word_friend00=this._btn_rankFriend.getChildByName("word_friend00");
        this._word_friend01=this._btn_rankFriend.getChildByName("word_friend01");

        this._rankWorldNode.active=false;
        this._rankFriendNode.active=false;

        this.initBtnEvent(this._btn_rankWorld);
        this.initBtnEvent(this._btn_rankFriend);
        this.initBtnEvent(this._btn_switchRank);
        this.initBtnEvent(this._btn_pageDown);
        this.initBtnEvent(this._btn_pageUp);
        this.initBtnEvent(this._btn_fight);
        this.initBtnEvent(this._btn_return);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_rankWorld"){
                this.showWorldRank();
            }else if(e.target.getName()=="btn_rankFriend"){
                this.showFriendRank();
            }else if(e.target.getName()=="btn_switchRank"){
                this.switchRankModel();
            }else if(e.target.getName()=="btn_rankWorld"){

            }else if(e.target.getName()=="btn_pageDown"){
                console.log("this._currentPage == ", this._currentPage + "  this._currentRankList.length == ", this._currentRankList.length);
                
                if(this._rankWorldNode.active){
                    if((this._currentPage+1)*6>this._currentRankList.length){
                        return;
                    }
                    this._currentPage++;
                    this.showRank();
                }

                if(this._rankFriendNode.active){
                    console.log("显示好友榜下一页")
                    this._currentPage++;
                    WXCtr.showFriendRanking(this._currentModel,this._currentPage);
                }
                
            }else if(e.target.getName()=="btn_pageUp"){
                console.log("this._currentPage == ", this._currentPage);
                if(this._currentPage<=0){
                    return;
                }
                this._currentPage--;
                if(this._rankWorldNode.active){
                    
                    this.showRank();
                }
                if(this._rankFriendNode.active){
                    console.log("显示好友榜上一页")
                    WXCtr.showFriendRanking(this._currentModel,this._currentPage);
                }
            }else if(e.target.getName()=="btn_fight"){
                this.node.destroy();
                if(GameData.power>=5){
                    cc.director.loadScene("Game");
                }else{
                    GameCtr.getInstance().getToast().toast("体力值不足");
                }
            }else if(e.target.getName()=="btn_return"){
                WXCtr.hideBannerAd();
                this.node.destroy();
            }
        })
    }


    showWorldRank(){
        this._currentPage=0;
        this._btn_rankWorld.getComponent(cc.Button).interactable=true;
        this._btn_rankFriend.getComponent(cc.Button).interactable=false;

        this._word_world00.active=true;
        this._word_world01.active=false;
        this._word_friend00.active=false;
        this._word_friend01.active=true;

        this._rankWorldNode.active=true;
        this._rankFriendNode.active=false;
        
    }

    showFriendRank(){
        this._currentPage=0;
        this._btn_rankWorld.getComponent(cc.Button).interactable=false;
        this._btn_rankFriend.getComponent(cc.Button).interactable=true;

        this._word_world00.active=false;
        this._word_world01.active=true;
        this._word_friend00.active=true;
        this._word_friend01.active=false;

        this._rankWorldNode.active=false;
        this._rankFriendNode.active=true;
        WXCtr.showFriendRanking(this._currentModel,this._currentPage);
    }

    switchRankModel(){
        this._currentPage=0;
        this._currentModel++;
        this._currentModel=this._currentModel>3?0:this._currentModel;
        this._modelSprite.getComponent(cc.Sprite).spriteFrame=this.modelSpriteFrames[this._currentModel];
        if(this._rankWorldNode.active){
            this.requestRank();
        }else if(this._rankFriendNode.active){
            WXCtr.showFriendRanking(this._currentModel);
        }
    }


    showRankList(res){ 
        this._currentRankList.splice(0,this._currentRankList.length);
        for(let i in res.data){
            this._currentRankList.push(res.data[i]);
        }
        console.log("log-----------showRankList=:",this._currentRankList);
        this._currentPage=0;
        this.showRank();
    }

    showRank(){
        this._rankWorldNode.removeAllChildren();
        let startIndex=this._currentPage*6;
        let endIndex=startIndex+6>this._currentRankList.length?this._currentRankList.length:startIndex+6;
        for(let i=startIndex;i<endIndex;i++){
            let rankItem=cc.instantiate(this.pfRankItem);
            rankItem.parent=this._rankWorldNode;
            rankItem.x=-11;
            rankItem.y=280-91.5*(i%6);
            rankItem.getComponent("rankItem").setModel(this._currentModel);
            rankItem.getComponent("rankItem").setName(this._currentRankList[i].nick);
            rankItem.getComponent("rankItem").setRank(this._currentRankList[i].top);
            rankItem.getComponent("rankItem").setScore(this._currentRankList[i].value);
            rankItem.getComponent("rankItem").setHeadImg(this._currentRankList[i].Icon)
        }
    }


    requestRank(){
        let protocal="level"+(this._currentModel+1)
        HttpCtr.getWorldRankingList((res)=>{	
            this.showRankList(res);	             
        },protocal);	         
    }

    update() {
        this._updateSubDomainCanvas();
    }

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined && this._tex != null && this._rankFriendNode.active && this._rankFriendSprite ) {
            //console.log("log---------刷新子域的纹理");
            console.log("window.sharedCanvas.width == ", window.sharedCanvas.width);
            this._tex.initWithElement(window.sharedCanvas);
            this._tex.handleLoadedTexture();
            this._rankFriendSprite.spriteFrame = new cc.SpriteFrame(this._tex);
        }
    }

    onDestroy() {
        this._tex.releaseTexture();
        if (WXCtr.userInfoBtn && WXCtr.userInfoBtn.destroy) {
            WXCtr.userInfoBtn.destroy();
        }
    }
}
