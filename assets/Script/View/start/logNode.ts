const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _logItemContent=null;

    @property(cc.Prefab)
    pfLogItem:cc.Prefab=null;

    onLoad(){
        this._logItemContent=this.node.getChildByName("scrollview").getChildByName("view").getChildByName("content");
        this.initLogs()
    }

    initLogs(){
        let itemsCounts=20;
        this._logItemContent.setContentSize(cc.size(350,70*itemsCounts))
        for(let i=0;i<itemsCounts;i++){
            let logItem=cc.instantiate(this.pfLogItem);
            logItem.parent=this._logItemContent;
            logItem.y= -(i*70)-10
        }
    }

}
