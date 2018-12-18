/**
 * 游戏URL配置
 * 根据自己的项目配置正确的地址
 */

const { ccclass, property } = cc._decorator;

const appid = "wx339c5b9692a660bb";
const version = "v1";

@ccclass
export default class UrlConfig {
  static rootUrl = "https://api.cqmwg.com/"+appid + "/huanjing/"+ version;              //接口域名地址根目录
  static rootUrl_dynamic=''
  static DOMAINS = "/common/domains";                                               //域名
  static LOGIN = "/login";                                                          //登录
  static BANNER_AD = "/banner/report";                                              //banner广告上报
  static VIDEO_AD = "/video/report";                                                //视频广告上报
  static SYS_INFO = "/wxSysInfo";                                                   //用户终端信息上报
  static ERROR = "/common/onerr";                                                   //错误信息上报
  static RANK_LIST = "/game/{type}/orders";                                         //获取排行榜信息
  static SCORE_SUBMIT = "/game/{type}/score";                                       //游戏分数上报        
  static GAME_CONFIG = "/game/config";                                              //游戏开关等配置信息
}
