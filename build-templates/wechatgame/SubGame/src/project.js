require=function a(i,l,s){function c(t,e){if(!l[t]){if(!i[t]){var o="function"==typeof require&&require;if(!e&&o)return o(t,!0);if(d)return d(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var r=l[t]={exports:{}};i[t][0].call(r.exports,function(e){return c(i[t][1][e]||e)},r,r.exports,a,i,l,s)}return l[t].exports}for(var d="function"==typeof require&&require,e=0;e<s.length;e++)c(s[e]);return c}({CanvasCtr:[function(e,t,o){"use strict";cc._RF.push(t,"5dd8fAmjN5ItpUb3XWnz0dS","CanvasCtr"),Object.defineProperty(o,"__esModule",{value:!0});var n,r,a=cc._decorator,i=a.ccclass,l=a.property;(r=n||(n={}))[r.Get_SelfData=0]="Get_SelfData",r[r.Get_FriendData=1]="Get_FriendData",r[r.Get_GroupData=2]="Get_GroupData",r[r.Submit_SelfScore=3]="Submit_SelfScore",r[r.Compare_Score=4]="Compare_Score",r[r.Show_WholeRanking=5]="Show_WholeRanking",r[r.Show_OverRanking=6]="Show_OverRanking",r[r.Close_WholeRanking=7]="Close_WholeRanking",r[r.Close_OverRanking=8]="Close_OverRanking",r[r.Show_recorder=9]="Show_recorder",r[r.Close_recorder=10]="Close_recorder";var s=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.ndRank=null,e.ndRecorder=null,e.pfRankItem=null,e.pfRecorder=null,e.mSelfData=null,e.mSelfRank=null,e.ranks=[[],[],[],[]],e}return __extends(e,t),e.prototype.onLoad=function(){this.handleWxMessage()},e.prototype.handleWxMessage=function(){var t=this;null!=window.wx&&window.wx.onMessage(function(e){console.log("log----------onMessage--data=:",e),e.messageType==n.Get_FriendData?t.getFriendData(e.SCORE_KEY1,e.SCORE_KEY2,e.SCORE_KEY3,e.SCORE_KEY4):e.messageType==n.Get_GroupData?t.getGroupData(e.LIST_KEY,e.shareTicket):e.messageType==n.Submit_SelfScore?(console.log("log--------handleWxMessage data=:",e),t.submitScore(e.score1,e.SCORE_KEY1,e.score2,e.SCORE_KEY2,e.score3,e.SCORE_KEY3,e.score4,e.SCORE_KEY4)):e.messageType==n.Compare_Score?t.compareWithScore(e.score):e.messageType==n.Show_WholeRanking?t.showFriendRanking(e.map,e.page):e.messageType==n.Show_OverRanking?t.showOverRanking():e.messageType==n.Get_SelfData?t.getSelfData():e.messageType==n.Close_WholeRanking?t.closeFriendRanking():e.messageType==n.Close_OverRanking?t.closeOverRanking():e.messageType==n.Show_recorder?t.showMapsRecorder():(e.messageType,n.Close_recorder)})},e.prototype.onDestroy=function(){},e.prototype.getSelfData=function(){var o=this;console.log("获取自己信息！！！！！！！！！！！！！"),null!=window.wx&&window.wx.getUserInfo({openIdList:["selfOpenId"],success:function(e){console.log("获取自己信息成功！！！！！！！！！！！！！",e);var t=e.data[0];o.mSelfData=t},fail:function(e){console.log("获取自己信息失败！！！！！！！！！！！！！")}})},e.prototype.getFriendData=function(e,t,o,n){var r=this;console.log("获取好友排行榜数据！！！！！！！！！！！！！"),null!=window.wx&&window.wx.getFriendCloudStorage({keyList:[e,t,o,n],success:function(e){console.log("获取好友排行榜数据成功"),console.log("wx.getFriendCloudStorage success",e);var t=e.data;t.sort(function(e,t){return 0==e.KVDataList.length&&0==t.KVDataList.length?0:0==e.KVDataList.length?1:0==t.KVDataList.length?-1:t.KVDataList[0].value-e.KVDataList[0].value}),r.mFriendRankData=t,r.doData()},fail:function(e){console.log("获取好友排行榜数据失败")}})},e.prototype.getGroupData=function(t,o){var n=this;null!=window.wx&&window.wx.getUserInfo({openIdList:["selfOpenId"],success:function(e){window.wx.getGroupCloudStorage({shareTicket:o,keyList:[t],success:function(e){console.log("wx.getGroupCloudStorage success",e);var t=e.data;t.sort(function(e,t){return 0==e.KVDataList.length&&0==t.KVDataList.length?0:0==e.KVDataList.length?1:0==t.KVDataList.length?-1:t.KVDataList[0].value-e.KVDataList[0].value}),n.mGroupData=t,n.showGroupRanking()},fail:function(e){console.log("wx.getFriendCloudStorage fail",e)}})}})},e.prototype.submitScore=function(t,o,n,r,a,i,l,s){null!=window.wx&&window.wx.getUserCloudStorage({keyList:[o,r,i,s],success:function(e){console.log("提交分数成功",e),window.wx.setUserCloudStorage({KVDataList:[{key:o,value:""+t},{key:r,value:""+n},{key:i,value:""+a},{key:s,value:""+l}],success:function(e){console.log("setUserCloudStorage","success",e)},fail:function(e){console.log("setUserCloudStorage","fail")},complete:function(e){console.log("setUserCloudStorage","ok")}})},fail:function(e){console.log("提交分数失败","fail")},complete:function(e){console.log("提交分数完成","ok")}})},e.prototype.compareWithScore=function(e){},e.prototype.showFriendRanking=function(e,t){void 0===t&&(t=0),console.log("log-----showFriendRanking mapindex page=:",e,t),this.ndRank.active=!0,this.ndRecorder.active=!1,this.ndRank.removeAllChildren();for(var o=6*t,n=o+6>this.ranks[e].length?this.ranks[e].length:o+6,r=o;r<n;r++){console.log("log--------create friendItemIndex=:",r);var a=cc.instantiate(this.pfRankItem);a.parent=this.ndRank,a.x=-11,a.y=280-r%6*91.5,a.getComponent("rankItem").setRank(r+1),a.getComponent("rankItem").setName(this.ranks[e][r].data.nickname),a.getComponent("rankItem").setScore(this.ranks[e][r].data.score),a.getComponent("rankItem").setHeadImg(this.ranks[e][r].data.avatarUrl)}},e.prototype.closeFriendRanking=function(){},e.prototype.showOverRanking=function(){},e.prototype.closeOverRanking=function(){},e.prototype.getSelfRank=function(){var e=0;if(this.mSelfData)for(var t=0;t<this.mFriendRankData.length;t++){var o=this.mFriendRankData[t];o.avatarUrl==this.mSelfData.avatarUrl&&(e=t,this.mSelfData=o)}return e},e.prototype.showGroupRanking=function(){},e.prototype.doData=function(){for(var e=0;e<this.mFriendRankData.length;e++)for(var t=0;t<this.mFriendRankData[e].KVDataList.length;t++)if(this.mFriendRankData[e].KVDataList[t].value&&"null"!=this.mFriendRankData[e].KVDataList[t].value){var o={score:this.mFriendRankData[e].KVDataList[t].value,avatarUrl:this.mFriendRankData[e].avatarUrl,nickname:this.mFriendRankData[e].nickname};this.ranks[t].push({data:o})}for(e=0;e<this.ranks.length;e++)this.ranks[e].sort(function(e,t){return Number(e.data.score)<Number(t.data.score)?1:Number(e.data.score)>Number(t.data.score)?-1:0});console.log("log--------------this.ranks=:",this.ranks)},e.prototype.showMapsRecorder=function(){console.log("log--------------子域 显示地图最高得分记录-------"),this.ndRecorder.active=!0,this.ndRank.active=!1,this.ndRecorder.removeAllChildren();var e=cc.instantiate(this.pfRecorder);e.parent=this.ndRecorder;for(var t=0;t<4;t++){var o=e.getChildByName("lb_recordHolder"+t);1<=this.ranks[t].length&&(console.log("子域 显示地图最高得分记录--",this.ranks[t][0].data.score),o.getComponent(cc.Label).string=this.cutstr(this.ranks[t][0].data.nickname,3)+" :"+this.ranks[t][0].data.score)}},e.prototype.cutstr=function(e,t){var o,n=0,r=new String;o=e.length;for(var a=0;a<o;a++){var i=e.charAt(a);if(n++,4<escape(i).length&&n++,r=r.concat(i),t<n)return r=r.concat(".")}return e},__decorate([l(cc.Node)],e.prototype,"ndRank",void 0),__decorate([l(cc.Node)],e.prototype,"ndRecorder",void 0),__decorate([l(cc.Prefab)],e.prototype,"pfRankItem",void 0),__decorate([l(cc.Prefab)],e.prototype,"pfRecorder",void 0),e=__decorate([i],e)}(cc.Component);o.default=s,cc._RF.pop()},{}],EXCEL_TO_DB:[function(require,module,exports){"use strict";cc._RF.push(module,"7a2783sZgJFXr4Nn8RLEt+q","EXCEL_TO_DB");var EXCEL_TYPE=require("EXCEL_TYPE");module.exports={m_all_vo_:null,m_one_vo_:null,getAll:function getAll(){var currentvo=null;if(currentvo=this.m_all_vo_||this.m_one_vo_,null==currentvo){var files=[];cc.loader._resources.getUuidArray("EXCEL",null,files),-1<files.indexOf("EXCEL/EXCEL_TO_DB_VO")&&(currentvo=eval(" require('EXCEL_TO_DB_VO') "))}return currentvo},getFromFile:function(e){var t=null,o=this.getAll();return 1==cc.js.isString(e)?o&&(t=o[e]):t=o,t},loadAll:function(e){var t=this.getAll();if(null==t)this.__loadAll(e);else{var o=[];cc.loader._resources.getUuidArray("EXCEL",null,o),Object.getOwnPropertyNames(t).length<o.length?this.__loadAll(e):e(t)}},__loadAll:function(n){var r=this;cc.loader.loadResDir("EXCEL",null,function(e,t,o){r.__formatAllFile(t,o);n&&n(r.m_one_vo_)})},loadFromFile:function(e,t){return 1==cc.js.isString(e)?this.__loadFromStringFile(e,t):this.__loadFromArrFile(e,t),null},__loadFromStringFile:function(n,r){var a=this,e=this.getFromFile(n);if(e)return r&&r(e),e;var t="EXCEL/"+n;console.log("__loadFromFile => "+t),cc.loader.loadRes(t,function(e,t){if(e)cc.log(e);else{var o=a.__formatFile(n,t);r&&r(o)}})},__loadFromArrFile:function(e,o){for(var n=this,r=[],t=0;t<e.length;t++){var a=e[t];r.push("EXCEL/"+a)}console.log("__loadFromFile => "+r),cc.loader.loadResArray(r,null,function(e,t){e?cc.log(e):(n.__formatAllFile(t,r),o&&o(n.m_one_vo_))})},__formatFile:function(e,t){t=JSON.parse(t);null==this.m_one_vo_&&(this.m_one_vo_={});for(var o=t[0],n=t[1],r={},a=2;a<t.length;a++){for(var i=t[a],l={},s=i[0],c=0;c<i.length;c++){var d=i[c],u=o[c],p=n[c];l[u]=EXCEL_TYPE.getValue(d,p)}r[s]=l}return this.m_one_vo_[e]=r},__formatAllFile:function(e,t){for(var o=0;o<e.length;o++){var n=e[o],r=t[o];console.log("oneurl= >"+r);var a=r.substring(6);this.__formatFile(a,n)}return this.m_one_vo_}},cc._RF.pop()},{EXCEL_TYPE:"EXCEL_TYPE"}],EXCEL_TYPE:[function(e,t,o){"use strict";cc._RF.push(t,"141679xdu5LrrHebG8bo1j6","EXCEL_TYPE");t.exports={type_data:{int32:"int32",string:"string"},type_formatdata_to:{formatdata_to_javascript_all:0,formatdata_to_db_one:1},type_json_init:{key_row_num:6,type_formatdata_to_:0,EXCEL_SOURCE_Path:null,JSON_SOURCE_Path:null},getValue:function(e,t){return t==this.type_data.int32?Number(e):e.toString()}};cc._RF.pop()},{}],RankingCell:[function(e,t,o){"use strict";cc._RF.push(t,"61afc7jnvBPqLy8NzGSRn2f","RankingCell"),Object.defineProperty(o,"__esModule",{value:!0});var n=cc._decorator,r=n.ccclass,a=n.property,i=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.sprBg=null,e.sprBg0=null,e.sprBg1=null,e.sprMedal=null,e.sprHead=null,e.lbRank=null,e.lbName=null,e.lbScore=null,e.lbGrade=null,e.lbtitle=null,e.medalFrames=[],e.bgFrames=[],e.gradeList=["王\n者","宗\n师","大\n师","进\n阶","入\n门","渣\n渣"],e}return __extends(e,t),e.prototype.setData=function(e,t,o){if(this.createImage(t.avatarUrl),this.lbName.string=this.cutstr(t.nickname,10),this.setMedal(e),o&&this.setBg(e),t.KVDataList){var n=0!=t.KVDataList.length?t.KVDataList[0].value:0;n=this.formatNum(n),this.lbScore.string=n}},e.prototype.setOverData=function(e,t){if(t.KVDataList){this.createImage(t.avatarUrl),this.lbName.string=this.cutstr(t.nickname,10),this.setMedal(e);var o=e%2;this.sprBg.spriteFrame=this.bgFrames[o];var n=0!=t.KVDataList.length?t.KVDataList[0].value:0;return n=this.formatNum(n),this.lbScore.string=n,this.setLbGrade(n)}},e.prototype.setSelfOverData=function(e){if(e.KVDataList){this.createImage(e.avatarUrl),this.lbName.string=this.cutstr(e.nickname,10);var t=0!=e.KVDataList.length?e.KVDataList[0].value:0;this.setLbGrade(t)}},e.prototype.setLbGrade=function(e){var t=this.lbGrade.getComponent(cc.Label);return e<2e3?(t.string=this.gradeList[5],5):2e3<=e&&e<1e4?(t.string=this.gradeList[4],4):1e4<=e&&e<3e4?(t.string=this.gradeList[3],3):3e4<=e&&e<5e4?(t.string=this.gradeList[2],2):5e4<=e&&e<8e4?(t.string=this.gradeList[1],1):1e5<=e?(t.string=this.gradeList[0],0):void 0},e.prototype.setTitle=function(e){this.sprBg.node.active=!1,this.lbtitle.getComponent(cc.Label).string=e},e.prototype.setBg=function(e){this.sprBg.spriteFrame=this.bgFrames[0]},e.prototype.setMedal=function(e){e<3?(this.sprMedal.node.active=!0,this.sprMedal.spriteFrame=this.medalFrames[e],this.lbRank.node.active=!1):(this.lbRank.node.active=!0,this.lbRank.string=""+(e+1),this.sprMedal.node.active=!1),1==(e%=2)?this.sprBg1.active=!0:this.sprBg0.active=!0},e.prototype.createImage=function(e){var o=this;if(null!=window.wx)try{var t=wx.createImage();t.onload=function(){try{var e=new cc.Texture2D;e.initWithElement(t),e.handleLoadedTexture(),o.sprHead.spriteFrame=new cc.SpriteFrame(e)}catch(e){cc.log(e),o.sprHead.node.active=!1}},t.src=e}catch(e){cc.log(e),this.sprHead.node.active=!1}else cc.loader.load({url:e,type:"jpg"},function(e,t){o.sprHead.spriteFrame=new cc.SpriteFrame(t)})},e.prototype.cutstr=function(e,t){var o,n=0,r=new String;o=e.length;for(var a=0;a<o;a++){var i=e.charAt(a);if(n++,4<escape(i).length&&n++,r=r.concat(i),t<n)return r=r.concat("...")}return e},e.prototype.formatNum=function(e){if(console.log("0",e),1e15<=(e=Math.floor(e))){for(var t=this.getDigitOfNum(e);t%3!=0;)t--;console.log("1",t),e=Math.floor(e/Math.pow(10,t-3)),console.log("2",e);var o=t/3-5+65,n=String.fromCharCode(o);console.log("3",o,n),e=this.getString(e)+""+n+n}else 1e12<=e?(e=Math.floor(e/1e9),e=this.getString(e)+"B"):1e9<=e?(e=Math.floor(e/1e6),e=this.getString(e)+"M"):1e6<=e?(e=Math.floor(e/1e3),e=this.getString(e)+"k"):e=this.getString(e);return e},e.prototype.getDigitOfNum=function(e){for(var t=0;0!=e;)e=Math.floor(e/10),t++;return t},e.prototype.getString=function(e){for(var t="",o=e=(e||0).toString();3<o.length;)t=","+o.slice(-3)+t,o=o.slice(0,o.length-3);return o&&(t=o+t),t},__decorate([a(cc.Sprite)],e.prototype,"sprBg",void 0),__decorate([a(cc.Node)],e.prototype,"sprBg0",void 0),__decorate([a(cc.Node)],e.prototype,"sprBg1",void 0),__decorate([a(cc.Sprite)],e.prototype,"sprMedal",void 0),__decorate([a(cc.Sprite)],e.prototype,"sprHead",void 0),__decorate([a(cc.Label)],e.prototype,"lbRank",void 0),__decorate([a(cc.Label)],e.prototype,"lbName",void 0),__decorate([a(cc.Label)],e.prototype,"lbScore",void 0),__decorate([a(cc.Label)],e.prototype,"lbGrade",void 0),__decorate([a(cc.Label)],e.prototype,"lbtitle",void 0),__decorate([a([cc.SpriteFrame])],e.prototype,"medalFrames",void 0),__decorate([a([cc.SpriteFrame])],e.prototype,"bgFrames",void 0),e=__decorate([r],e)}(cc.Component);o.default=i,cc._RF.pop()},{}],Ranking:[function(e,t,o){"use strict";cc._RF.push(t,"f4f54uObghLbJK7HnlIlACQ","Ranking"),Object.defineProperty(o,"__esModule",{value:!0});var a=e("./RankingCell"),n=cc._decorator,r=n.ccclass,i=n.property,l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.ndContent=null,e.pfCell=null,e.gradeList=["王者","宗师","大师","进阶","入门","渣渣"],e.level=0,e}return __extends(e,t),e.prototype.loadRanking=function(e){for(var t=0;t<e.length;t++){var o=cc.instantiate(this.pfCell);this.ndContent.addChild(o);var n=e[t];o.getComponent(a.default).setData(t,n,!0)}},e.prototype.loadOverRanking=function(e){this.level=0,this.setTitle();for(var t=0;t<e.length;t++){var o=cc.instantiate(this.pfCell),n=e[t],r=o.getComponent(a.default).setOverData(t,n);if(this.level!=r)for(t==e.length-1&&(r=5);this.level++,this.setTitle(),!(this.level>=r););this.ndContent.addChild(o)}},e.prototype.setTitle=function(){var e=cc.instantiate(this.pfCell);this.ndContent.addChild(e),e.getComponent(a.default).setTitle(this.gradeList[this.level])},e.prototype.clear=function(){this.ndContent.removeAllChildren()},e.prototype.onLoad=function(){},e.prototype.start=function(){},__decorate([i(cc.Node)],e.prototype,"ndContent",void 0),__decorate([i(cc.Prefab)],e.prototype,"pfCell",void 0),e=__decorate([r],e)}(cc.Component);o.default=l,cc._RF.pop()},{"./RankingCell":"RankingCell"}],rankItem:[function(e,t,o){"use strict";cc._RF.push(t,"ca16cbI6Y9GYK9vh0kx6NqJ","rankItem"),Object.defineProperty(o,"__esModule",{value:!0});var n=cc._decorator,r=n.ccclass,a=(n.property,function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._lb_name=null,e._lb_scroe=null,e._lb_rank=null,e._img_head=null,e}return __extends(e,t),e.prototype.onLoad=function(){this.initNode()},e.prototype.initNode=function(){this._lb_name=this.node.getChildByName("lb_name"),this._lb_rank=this.node.getChildByName("lb_rank"),this._lb_scroe=this.node.getChildByName("lb_score"),this._img_head=this.node.getChildByName("headFrame").getChildByName("head")},e.prototype.setName=function(e){this._lb_name.getComponent(cc.Label).string=e},e.prototype.setRank=function(e){this._lb_rank.getComponent(cc.Label).string=e},e.prototype.setScore=function(e){this._lb_scroe.getComponent(cc.Label).string=e},e.prototype.setHeadImg=function(e){var t=this._img_head.getComponent(cc.Sprite);this.createImage(e,t)},e.prototype.createImage=function(e,o){var t=this;if(null!=window.wx)try{var n=wx.createImage();n.onload=function(){try{var e=new cc.Texture2D;e.initWithElement(n),e.handleLoadedTexture(),o.spriteFrame=new cc.SpriteFrame(e)}catch(e){cc.log(e),t._img_head.active=!1}},n.src=e}catch(e){cc.log(e),this._img_head.active=!1}else cc.loader.load({url:e,type:"jpg"},function(e,t){o.spriteFrame=new cc.SpriteFrame(t)})},e=__decorate([r],e)}(cc.Component));o.default=a,cc._RF.pop()},{}]},{},["EXCEL_TO_DB","EXCEL_TYPE","CanvasCtr","Ranking","RankingCell","rankItem"]);