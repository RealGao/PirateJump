
const { ccclass, property } = cc._decorator;

@ccclass
export default class RankingCell extends cc.Component {

    @property(cc.Sprite)
    sprBg: cc.Sprite = null;
    @property(cc.Node)
    sprBg0:cc.Node=null;
    @property(cc.Node)
    sprBg1:cc.Node=null;

    @property(cc.Sprite)
    sprMedal: cc.Sprite = null;
    @property(cc.Sprite)
    sprHead: cc.Sprite = null;
    @property(cc.Label)
    lbRank: cc.Label = null;
    @property(cc.Label)
    lbName: cc.Label = null;
    @property(cc.Label)
    lbScore: cc.Label = null;
    @property(cc.Label)
    lbGrade: cc.Label = null;
    @property(cc.Label)
    lbtitle: cc.Label = null;
    @property([cc.SpriteFrame])
    medalFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = [];

    private gradeList = ["王\n者", "宗\n师", "大\n师", "进\n阶", "入\n门", "渣\n渣"];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    setData(rank, data, boolSetBg) {
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        this.setMedal(rank);
        if (boolSetBg) {
            this.setBg(rank);
        }
        if (!data.KVDataList) {
            return;
        }
        let score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        score = this.formatNum(score);
        //if(score.length>6)score = score.substring(0,score.length-3)+"k";
        this.lbScore.string = score;
    }

    setOverData(rank, data) {
        if (!data.KVDataList) {
            return;
        }
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        this.setMedal(rank);

        let idx = rank % 2;
        this.sprBg.spriteFrame = this.bgFrames[idx];

        let score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        score = this.formatNum(score);
        //if(score.length>6)score = score.substring(0,score.length-3)+"k";

        this.lbScore.string = score;

        return this.setLbGrade(score);
    }

    setSelfOverData(data) {
        if (!data.KVDataList) {
            return;
        }
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        let score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.setLbGrade(score);
    }

    setLbGrade(score) {
        let lb = this.lbGrade.getComponent(cc.Label);
        if (score < 2000) {
            lb.string = this.gradeList[5];
            return 5;
        } else if (score >= 2000 && score < 10000) {
            lb.string = this.gradeList[4];
            return 4;
        } else if (score >= 10000 && score < 30000) {
            lb.string = this.gradeList[3];
            return 3;
        } else if (score >= 30000 && score < 50000) {
            lb.string = this.gradeList[2];
            return 2;
        } else if (score >= 50000 && score < 80000) {
            lb.string = this.gradeList[1];
            return 1;
        } else if (score >= 100000) {
            lb.string = this.gradeList[0];
            return 0;
        }
    }

    setTitle(string) {
        this.sprBg.node.active = false;
        this.lbtitle.getComponent(cc.Label).string = string;
    }

    setBg(idx) {
        idx = 0;
        this.sprBg.spriteFrame = this.bgFrames[idx];
    }

    setMedal(idx) {
        if (idx < 3) {
            this.sprMedal.node.active = true;
            this.sprMedal.spriteFrame = this.medalFrames[idx];
            this.lbRank.node.active = false;
        } else {
            this.lbRank.node.active = true;
            this.lbRank.string = ""+(idx + 1);
            this.sprMedal.node.active = false;
        }
        idx = idx % 2;
        if(idx==1) this.sprBg1.active = true;
        else       this.sprBg0.active = true;
    }

    createImage(avatarUrl) {
        if (window.wx != undefined) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.sprHead.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                this.sprHead.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, (err, texture) => {
                this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

    //裁剪字符串，超出指定长度之后显示...(每个中文字符长度为2）
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
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        // //如果给定字符串小于指定长度，则返回源字符串； 
        // if (str_length < len) {
        //     return str;
        // }
        return str;
    }
    formatNum(value) {
        console.log("0",value)
        value = Math.floor(value);
        
        
        if (value >= 1.0e+15) {

            let num = this.getDigitOfNum(value);//获取数字长度
            while(num%3 !=0) num--;//修正至3的倍数
            console.log("1",num)

            value = Math.floor(value / Math.pow(10,num-3));//根据num获得value
            console.log("2",value)

            let ASCII = (num/3 -5) + 65;//修正到正确的ASCII码
            let ASCII_string = String.fromCharCode(ASCII);//转换成字符
            console.log("3",ASCII,ASCII_string)

            value = this.getString(value) + ""+ASCII_string+ASCII_string;//整合
        }else if (value >= 1.0e+12) {//削去9个0
            value = Math.floor(value / 1.0e+9);
            value = this.getString(value) + "B";
        }else if (value >= 1.0e+9) {//削去6个0
            value = Math.floor(value / 1.0e+6);
            value = this.getString(value) + "M";
        }else if (value >= 1.0e+6) {//削去3个0，保证此区间最小值（1000000）保留4位数
            value = Math.floor(value / 1.0e+3);
            value = this.getString(value) + "k";
        }
        else {
            value = this.getString(value);
        }
        return value;
    }
    //获取一个数字的位数
    getDigitOfNum(num) {
        let digit = 0;
        while(num != 0){
            num = Math.floor(num/10);
            digit++;
        }
        return digit;
    }
    getString(num) {
        var num = (num || 0).toString(), result = '';
        let intStr = num;

        while (intStr.length > 3) {
            result = ',' + intStr.slice(-3) + result;
            intStr = intStr.slice(0, intStr.length - 3);
        }
        if (intStr) { result = intStr + result; }
        return result;
    }
    // start () {

    // }

    // update (dt) {}
}
