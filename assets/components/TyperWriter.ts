// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    text: string = '大家好我是:<color=#694343><size=50><outline color=red width=4><i>IT侠来了</i></outline></size></c>！！';

    @property(cc.RichText)
    richTextNode:cc.RichText = null;

    @property(cc.Node)
    quickNode:cc.Node = null;

    interval:number = 0.1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    _typerArr:string[] =[];
    _tiggerQuick:boolean = false;

    start () {
        this.quickNode.on('click',()=>{

            this._typerArr =[];
            this.richTextNode.string = '';
            this.richTextNode.string = this.text;
            this._tiggerQuick = true;
        });


        this.typing();
    }


    typing() {

        let str = this.text;
        if (!str) {
            return;
        }


        const delimiterCharList = ['✁'];
        const allRegexp = /<.+?\/?>/g;
        const textRegexp = /([^✁])/g;
        // 获取富文本中的标签
        let matchArr = str.match(allRegexp);
        //获取一个文本中没有的替换符号
        let delimiterChar = delimiterCharList.find((item) => str.indexOf(item) === -1);
        //将所有的标签换成替换符号
        let replaceStr = str.replace(allRegexp, delimiterChar);
        //获取富文本中的所有文字
        let textStr = replaceStr.match(textRegexp);

        let tagInfoArr = [];
        let idx = 0;
        //将替换符号的地方换成标签，文字都变成空字符串
        for (let i = 0; i < replaceStr.length; i++) {
            if (replaceStr[i] == delimiterChar) {
                tagInfoArr[i] = matchArr[idx++];
            } else {
                tagInfoArr[i] = '';
            }

        }

        // 生成文本数据 放到一个数组中
        for (let i = 0; i <= textStr.length; i++) {
            let idx = tagInfoArr.findIndex((item) => {
                return item === "";
            });
            if (idx !== -1) {
                tagInfoArr[idx] = textStr[i];
                this._typerArr.unshift(tagInfoArr.join(''))
            }
        }

        let pos = 0;
        let configInterval = this.interval ||0.1;

        let typing = (interval = 0.1) => {
            if (!this._typerArr.length) {

                return;
            }
            //每次那最后一个数据
            const content = this._typerArr.pop();
            pos++;

            cc.Canvas.instance.scheduleOnce(() => {
                // 如果点击了面板那么 则显示所有文本
                if(this._tiggerQuick ){
                    return;
                }
                this.richTextNode.string = content;
                let configInterval =  this.interval || 0.1;
                typing(configInterval);

            }, interval);
        };

        typing(configInterval);
    }

    // update (dt) {}
}
