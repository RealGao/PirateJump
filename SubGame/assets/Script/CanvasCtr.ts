import Ranking from "./Ranking";
import RankingCell from "./RankingCell";


const { ccclass, property } = cc._decorator;

enum Message_Type {
    Get_SelfData,                       //获取自己信息
    Get_FriendData,                     //获取好友排行榜数据
    Get_GroupData,                      //获取群排名
    Submit_SelfScore,                   //提交自己得分
    Compare_Score,                      //比较自己与好友得分
    Show_WholeRanking,                  //显示完整排行榜   
    Show_OverRanking,                   //显示结束排行榜
    Close_WholeRanking,                 //关闭好友排行
    Close_OverRanking,                  //关闭结束排行
    Show_recorder,                      //显示地图记录
    Close_recorder,                     //关闭地图记录

};

@ccclass
export default class CanvasCtr extends cc.Component {

    @property(cc.Node)
    ndRank: cc.Node = null;

    @property(cc.Node)
    ndRecorder:cc.Node =null;

    @property(cc.Prefab)
    pfRankItem:cc.Prefab=null;

    @property(cc.Prefab)
    pfRecorder:cc.Prefab=null;

    @property(cc.Node)
    ndBeyond: cc.Node = null;

    private mCanvas: cc.Canvas;
    private mFriendRankData;
    private mGroupData;
    private mSelfData = null;
    private mSelfRank = null;

    private ranks=[[],[],[],[]];
   

    onLoad() {
        this.handleWxMessage();
    }

    handleWxMessage() {
        if (window.wx != undefined) {
            window.wx.onMessage(data => {
                console.log("log----------onMessage--data=:",data);

                if (data.messageType == Message_Type.Get_FriendData) {              //获取好友排行榜数据
                    this.getFriendData(data.SCORE_KEY1, data.SCORE_KEY2,data.SCORE_KEY3,data.SCORE_KEY4);
                } else if (data.messageType == Message_Type.Get_GroupData) {        //获取群排名
                    this.getGroupData(data.LIST_KEY, data.shareTicket)
                } else if (data.messageType == Message_Type.Submit_SelfScore) {     //提交得分
                    console.log("log--------handleWxMessage data=:",data);
                    this.submitScore(data.score1, data.SCORE_KEY1, data.score2, data.SCORE_KEY2,data.score3, data.SCORE_KEY3,data.score4, data.SCORE_KEY4);
                } else if (data.messageType == Message_Type.Compare_Score) {        //比较自己与好友得分
                    this.compareWithScore(data.score);
                } else if (data.messageType == Message_Type.Show_WholeRanking) {     //显示完整排行榜
                    this.showFriendRanking(data.map,data.page);
                } else if (data.messageType == Message_Type.Show_OverRanking) {      //显示结束排行榜
                    this.showOverRanking();
                } else if (data.messageType == Message_Type.Get_SelfData) {          //获取自己信息
                    this.getSelfData();
                } else if (data.messageType == Message_Type.Close_WholeRanking) {    //关闭完整排行
                    this.closeFriendRanking();
                } else if (data.messageType == Message_Type.Close_OverRanking) {      //关闭结束排行
                    this.closeOverRanking();
                } else if(data.messageType == Message_Type.Show_recorder){            //显示地图最高记录
                    this.showMapsRecorder();
                } else if(data.messageType == Message_Type.Close_recorder){           //关闭地图最高记录
                    this.closeMapsRecorder();
                }
            });
        } else {

        }
    }

    onDestroy() {

    }

    getSelfData() {
        console.log("获取自己信息！！！！！！！！！！！！！");
        if (window.wx != undefined) {
            window.wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log("获取自己信息成功！！！！！！！！！！！！！", userRes);
                    let userData = userRes.data[0];
                    this.mSelfData = userData;
                },
                fail: (res) => {
                    console.log("获取自己信息失败！！！！！！！！！！！！！");
                }
            });
        }
    }

    getFriendData(SCORE_KEY1, SCORE_KEY2,SCORE_KEY3,SCORE_KEY4) {
        console.log("获取好友排行榜数据！！！！！！！！！！！！！");
        if (window.wx != undefined) {
            window.wx.getFriendCloudStorage({
                keyList: [SCORE_KEY1, SCORE_KEY2,SCORE_KEY3,SCORE_KEY4],
                success: (res) => {
                    console.log("获取好友排行榜数据成功");
                    console.log("wx.getFriendCloudStorage success", res);
                    let data = res.data;
                    data.sort((a, b) => {
                        if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                            return 0;
                        }
                        if (a.KVDataList.length == 0) {
                            return 1;
                        }
                        if (b.KVDataList.length == 0) {
                            return -1;
                        }
                        return b.KVDataList[0].value - a.KVDataList[0].value;
                    });
                    this.mFriendRankData = data;
                    this.doData();
                },
                fail: res => {
                    console.log("获取好友排行榜数据失败");
                },
            });
        }
    }

    getGroupData(LIST_KEY, shareTicket) {
        if (window.wx != undefined) {
            window.wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    window.wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [LIST_KEY],
                        success: (res) => {
                            console.log("wx.getGroupCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            this.mGroupData = data;
                            this.showGroupRanking();
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                }
            });
        }
    }

    submitScore(score1, SCORE_KEY1, score2, SCORE_KEY2,score3, SCORE_KEY3,score4, SCORE_KEY4) {
        if (window.wx != undefined) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [SCORE_KEY1,SCORE_KEY2,SCORE_KEY3,SCORE_KEY4],
                success: (getres) => {
                    console.log('提交分数成功', getres)
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [
                            {
                                key: SCORE_KEY1,
                                value: "" + score1
                            },

                            {
                                key: SCORE_KEY2,
                                value: "" +score2 
                            },

                            {
                                key: SCORE_KEY3,
                                value: "" + score3
                            },

                            {
                                key: SCORE_KEY4,
                                value: "" + score4
                            },
                        ],
                        success: (res) => {
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('提交分数失败', 'fail')
                },
                complete: (res) => {
                    console.log('提交分数完成', 'ok')
                    // this.getFriendData("Rank_Data");
                }
            });
        } else {
            //cc.log("提交得分:" + LIST_KEY + " : " + score)
        }
    }

    compareWithScore(selfScore) {
        for(let i=this.mFriendRankData.length-1; i>=0; i--){
            let data = this.mFriendRankData[i];
            if(data.score > selfScore) {
                let spr = this.ndBeyond.getChildByName("sprFriend").getComponent(cc.Sprite);
                this.createImage(data.avatarUrl, spr, spr.node);
                this.ndRank.active = false;
                this.ndRecorder.active = false;
                this.ndBeyond.active = true;
                return;
            }
        }
    }

    showFriendRanking(mapIndex,page=0) {
        console.log("log-----showFriendRanking mapindex page=:",mapIndex,page);
        this.ndRank.active=true;
        this.ndRecorder.active=false;
        this.ndBeyond.active = false;

        this.ndRank.removeAllChildren();
        let startIndex=page*6;
        let endIndex=startIndex+6>this.ranks[mapIndex].length?this.ranks[mapIndex].length:startIndex+6;
        for(let i=startIndex;i<endIndex;i++){
            console.log("log--------create friendItemIndex=:",i);
            let rankItem=cc.instantiate(this.pfRankItem);
            rankItem.parent=this.ndRank;
            rankItem.x=-11;
            rankItem.y=280-91.5*(i%6);
            rankItem.getComponent("rankItem").setModel(mapIndex);
            rankItem.getComponent("rankItem").setRank(i+1);
            rankItem.getComponent("rankItem").setName(this.ranks[mapIndex][i].data.nickname);
            rankItem.getComponent("rankItem").setScore(this.ranks[mapIndex][i].data.score);
            rankItem.getComponent("rankItem").setHeadImg(this.ranks[mapIndex][i].data.avatarUrl)
        }
    }

    closeFriendRanking() {
        //this.scrRanking.clear();
    }

    showOverRanking() {
        // if (!this.mFriendRankData) {
        //     console.log("没有好友排行榜信息，请先获取好友排行榜信息");
        //     return;
        // }
        // console.log("this.mFriendRankData =========", this.mFriendRankData);
        // this.ndOverRanking.active = true;
        // this.EndScrRanking.node.active = true;
        // this.ndFriend.active = false;
        // this.scrRanking.node.active = false;

        // let selfRanking = this.ndOverSelf.getComponent(RankingCell);
        // selfRanking.setSelfOverData(this.mSelfData);

        // this.EndScrRanking.loadOverRanking(this.mFriendRankData);
    }

    closeOverRanking() {
        //this.EndScrRanking.clear();
    }

    getSelfRank() {
        let rank = 0;
        if (this.mSelfData) {
            for (let i = 0; i < this.mFriendRankData.length; i++) {
                let data = this.mFriendRankData[i];
                if (data.avatarUrl == this.mSelfData.avatarUrl) {
                    rank = i;
                    this.mSelfData = data;
                }
            }
        }
        return rank;
    }


    showGroupRanking() {
        // if (!this.mGroupData) {
        //     console.log("没有群好友排行榜信息，请先获取");
        //     return;
        // }
        // console.log("this.mGroupData =========", this.mFriendRankData);
        // this.closeOverRanking();
        // this.EndScrRanking.loadOverRanking(this.mGroupData);
    }

    doData(){
        for(let i=0;i<this.ranks.length;i++){
            this.ranks[i].splice(0,this.ranks[i].length);
        }
        
        for(let i=0;i<this.mFriendRankData.length;i++){
            for(let j=0;j<this.mFriendRankData[i].KVDataList.length;j++){
                if(this.mFriendRankData[i].KVDataList[j].value && this.mFriendRankData[i].KVDataList[j].value!="null"){
                    let data={
                        score:this.mFriendRankData[i].KVDataList[j].value,
                        avatarUrl:this.mFriendRankData[i].avatarUrl,
                        nickname:this.mFriendRankData[i].nickname,
                    }
                    this.ranks[j].push({data})
                }
            }
        }

        for(let i=0;i<this.ranks.length;i++){
            this.ranks[i].sort((a,b)=>{

                if(Number(a.data.score)<Number(b.data.score)){
                    return 1
                }else if (Number(a.data.score)>Number(b.data.score)) {
                    return -1;
                } else {
                    return 0;
                }
            })
        }

        console.log("log--------------this.ranks=:",this.ranks)
    }

    showMapsRecorder(){
        console.log("log--------------子域 显示地图最高得分记录-------");
        this.ndRecorder.active=true;
        this.ndRank.active=false;
        this.ndBeyond.active = false;
        this.ndRecorder.removeAllChildren();
        let recoreder=cc.instantiate(this.pfRecorder);
        recoreder.parent=this.ndRecorder;

        for(let i=0;i<4;i++){
            let lb_score=recoreder.getChildByName("lb_score"+i);
            let headFrame=recoreder.getChildByName("headFram"+i);
            let imgHead=headFrame.getChildByName("head");
            if(this.ranks[i].length>=1){
                console.log("子域 显示地图最高得分记录--",this.ranks[i][0].data.score);
                lb_score.getComponent(cc.Label).string=this.ranks[i][0].data.score;
                let imgHeadSp=imgHead.getComponent(cc.Sprite);
                this.createImage(this.ranks[i][0].data.avatarUrl,imgHeadSp,imgHead);
            }else{
                lb_score.active=false;
                headFrame.active=false;
            }
        }
    }

    closeMapsRecorder(){
        this.ndRecorder.active=false;
    }

    cutstr(str, len) {
        let str_length = 0;
        let str_len = 0;
        let str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            let a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4 
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length > len) {
                str_cut = str_cut.concat(".");
                return str_cut;
            }
        }
        // //如果给定字符串小于指定长度，则返回源字符串； 
        // if (str_length < len) {
        //     return str;
        // }
        return str;
    }

    createImage(avatarUrl,sp,spNode) {
        if (window.wx != undefined) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        sp.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        spNode.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                spNode.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, (err, texture) => {
                sp.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

    // start () {

    // }

    // update (dt) {}
}
