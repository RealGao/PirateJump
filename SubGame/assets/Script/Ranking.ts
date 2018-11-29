import RankingCell from "./RankingCell";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Ranking extends cc.Component {

    @property(cc.Node)
    ndContent: cc.Node = null;
    @property(cc.Prefab)
    pfCell: cc.Prefab = null;

    private gradeList = ["王者", "宗师", "大师", "进阶", "入门", "渣渣"];
    private level = 0;


    // LIFE-CYCLE CALLBACKS:

    loadRanking(data) {
        for (let i = 0; i < data.length; i++) {
            let cell = cc.instantiate(this.pfCell);
            this.ndContent.addChild(cell);
            let info = data[i];
            let comp = cell.getComponent(RankingCell);
            comp.setData(i, info, true);
        }
    }

    loadOverRanking(data) {
        this.level = 0;
        this.setTitle();
        for (let i = 0; i < data.length; i++) {
            let cell = cc.instantiate(this.pfCell);
            let info = data[i];
            let comp = cell.getComponent(RankingCell);
            let k = comp.setOverData(i, info);
            if (this.level != k) {
                if (i == data.length - 1) {
                    k = 5;
                }
                while (true) {
                    this.level++;
                    this.setTitle();
                    if (this.level >= k) {
                        break;
                    }
                }
            }
            this.ndContent.addChild(cell);
        }
    }

    setTitle() {
        let cell = cc.instantiate(this.pfCell);
        this.ndContent.addChild(cell);
        let comp = cell.getComponent(RankingCell);
        comp.setTitle(this.gradeList[this.level]);
    }

    clear() {
        this.ndContent.removeAllChildren();
    }

    onLoad() {
    }

    start() {

    }

    // update (dt) {}
}
