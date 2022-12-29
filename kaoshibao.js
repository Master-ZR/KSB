`
{
    "obj": {
        "title": "str",
        "danxuan": "[array]",
        "duoxuan": "[array]",
        "xuanze": "[array]",
        "panduan": "[array]"
    }
}
`
class AIO {
    next() {
        this.ProblemSeq = this.getActiveProblemSeq()
        this.ProblemSeq += 1
        console.log(this.ProblemSeq)
        console.log(this.probleItems)
        if (this.ProblemSeq < this.probleItems) {
            document.getElementsByClassName("problem-list clearfix")[0].getElementsByTagName("span")[this.ProblemSeq].click()
        }
    }
    getTitle() {
        return document.getElementsByClassName("breadcrumb")[0].getElementsByTagName('span')[1].innerText
    }
    getProblemType() {
        while (true) {
            if (document.getElementsByClassName("topic-type")[0].innerText) {
                return document.getElementsByClassName("topic-type")[0].innerText
            }
        }

    }
    getProblemSeq() {
        return Number(document.getElementsByClassName(" problem-list clearfix")[0].getElementsByClassName("active")[0].innerText)
    }
    getProblemItems() {
        return Number(document.getElementsByClassName(" problem-list clearfix")[0].getElementsByTagName("span").length)
    }
    getActiveProblemSeq() {
        var num = 0
        num = Number(document.getElementsByClassName(" problem-list clearfix")[0].getElementsByClassName("active")[0].innerText)
        if (num) {
            num -= 1
        }
        return num
    }
    _router() {
        var type = this.getProblemType()
        switch (type) {
            case "多选题":
                this.xuan_Ze()
                break;
            case "单选题":
                this.xuan_Ze()
                break;
            case "判断题":
                this.pan_Daun()
                break;
            case "填空题":
                this.tian_Kong()
                break;
            case "简答题":
                this.jian_Da()
                break;
            default:
                break;
        }
    }
    getOptions() {
        let options = {
            answer: [],
            options: [],
            description: "",
        }
        var optionsBlock = document.getElementsByClassName(" select-left pull-left options-w")[0].getElementsByClassName("option")
        for (const key in optionsBlock) {
            if (Object.hasOwnProperty.call(optionsBlock, key)) {
                const element = optionsBlock[key];
                var str = element.innerText.replace(/\n/g, ".")
                options.options.push(str)
                options.description = document.getElementsByClassName("answer-box-detail")[0].getElementsByTagName("p")[0].innerText.slice(0, -8)
                if (element.classList.length > 1) {
                    options.answer.push(str)
                }
            }
        }
        return options
    }
    getName() {
        return `${this.ProblemSeq + 1}_${document.getElementsByClassName("qusetion-box")[0].innerText.replace(/\n/g, "")}`

    }
    xuan_Ze() {
        var type = this.getProblemType()
        let temp = {
            title: "",
            answer: [],
            options: [],
            description: "",
        }
        temp.title = this.getName()
        var options = this.getOptions()
        temp.answer = options.answer
        temp.options = options.options
        temp.description = options.description
        // var options = $(".select-left.pull-left.options-w").getElementsByClassName("option")
        // for (const key in options) {
        //     if (Object.hasOwnProperty.call(options, key)) {
        //         const element = options[key];
        //         var str = element.innerText.replace(/\n/g, ".")
        //         temp.option.push(str)
        //         temp.description = $(".answer-box-detail").getElementsByTagName("p")[0].innerText.slice(0, -8)
        //         if (element.classList.length > 1) {
        //             temp.answer.push(str)
        //         }
        //     }
        // }
        switch (type) {
            case "多选题":
                this.Problem.duoXuan.push(temp)
                temp = null
                break;
            case "单选题":
                this.Problem.danXuan.push(temp)
                temp = null
                break;
            default:
                break;
        }
    }
    pan_Daun() {
        let temp = {
            title: "",
            answer: '',
        }
        temp.title = this.getName()
        var options = this.getOptions()
        temp.answer = options.answer
        temp.options = options.options
        temp.description = options.description
        this.Problem.panDuan.push(temp)
        temp = null
    }
    tian_Kong() {
        let temp = {
            title: "",
            answer: []
        }
        temp.title = this.getName()
        temp.answer = document.getElementsByClassName("answer-box")[0].getElementsByTagName("span")[0].innerText
        this.Problem.tianKong.push(temp)
        temp = null
    }
    jian_Da() {
        let temp = {
            title: '',
            img: '',
            answer: [],
        }
        temp.title = this.getName()
        if (document.getElementsByClassName("qusetion-box")[0].getElementsByTagName("img").length) {
            temp.img = document.getElementsByClassName("qusetion-box")[0].getElementsByTagName("img")[0].src
        }
        if (document.getElementsByClassName("answer-box")[0].getElementsByTagName("img").length) {
            temp.answer.push(document.getElementsByClassName("answer-box")[0].getElementsByTagName("img")[0].src)
        } else {
            var answerNode = document.getElementsByClassName("mt20")[0].getElementsByTagName("span")[0].innerText.split('\n')

            for (const key in answerNode) {
                if (Object.hasOwnProperty.call(answerNode, key) && answerNode[key] != "") {
                    const element = answerNode[key];
                    temp.answer.push(element)
                }
            }
        }
        this.Problem.jianDa.push(temp)
        temp = null
    }
    start() {
        this.init()
        this._router()
        this.next()
    }
    createStr() {
        var str = ''
        for (let i in kaoshibao.Problem) {
            var element = kaoshibao.Problem[i]
            console.log(element)
            switch (i) {
                case "danXuan":
                    this.obj2Str(element)
                    break;

                case "duoXuan":
                    this.obj2Str(element)
                    break;

                case "panDuan":
                    this.obj2Str(element)
                    break;

                case "tianKong":
                    for (const key in element) {
                        const opt = element[key];
                        this.text += `\n${opt.title}\n正确答案：${opt.answer}\n`
                    }
                    break;
                case "jianDa":
                    let temp = ''
                    for (const key in element) {
                        const opt = element[key];
                        var answer = element.answer
                        var answerStr = ""
                        for (const n in opt.answer) {
                            const element2 = opt.answer[n];
                            answerStr += element2 + '\n'
                        }
                        this.text += `\n${opt.title}\n图片链接：${opt.img}\n正确答案：\n${answerStr}\n`
                    }

                    break;
                default:
                    break;
            }
        }
    }
    obj2Str(array) {
        var temp = ''
        for (const key in array) {
            const element = array[key];
            if (element != "") {
                console.log(element)
                temp += "\n" + element.title + "\n"
                temp += element.options.join("\n") + "\n"
                temp += `正确答案：\n${element.answer.join("\n")}\n`
                temp += element.description + "\n"
            }
        }
        this.text += temp
    }
    downloadTEXT() {
        var blob = new Blob([this.text], { type: "text/plain" })
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob)
        a.download = `${this.title}.txt`;
        document.body.appendChild(a);
        a.click();
    }
    constructor() {
        this.title = this.getTitle();
        this.ProblemSeq = this.getActiveProblemSeq()
        this.probleItems = this.getProblemItems()
        this.Problem = {
            danXuan: [],
            duoXuan: [],
            panDuan: [],
            tianKong: [],
            jianDa: [],
        }
        this.text = ''
    }
    downloadJson() {
        var blob = new Blob([JSON.stringify(this.Problem)], { type: "application/json" })
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob)
        a.download = `${this.title}.json`;
        document.body.appendChild(a);
        a.click();
    }
    init() {
        this.ProblemSeq = 0
        document.getElementsByClassName("problem-list clearfix")[0].getElementsByTagName("span")[0].click()
    }
}
var kaoshibao = new AIO()
kaoshibao.init()
function main() {
    console.log(kaoshibao)
    kaoshibao._router()
    kaoshibao.next()
}

var observer = new MutationObserver(Updated)
var resolveNode = document.getElementsByClassName("topic-top")[0].getElementsByTagName("span")
var resolve = resolveNode[resolveNode.length - 1]
var options = {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
    attributeOldValue: true
};
observer.observe(resolve, options)

function Updated(mutationsList, observer) {
    console.log(mutationsList)
    console.log(observer)
    console.log(Number(resolve.innerText.split("/")[0]))

    // for (let index = 0; index < kaoshibao.probleItems; index++) {

    if (Number(resolve.innerText.split("/")[0]) == kaoshibao.ProblemSeq + 1) {
        kaoshibao._router()
        kaoshibao.next()
    }

    var p = kaoshibao.Problem
    var num = p.danXuan.length + p.duoXuan.length + p.panDuan.length + p.tianKong.length + p.jianDa.length
    console.log(
        num, kaoshibao.probleItems
    )
    if (num == kaoshibao.probleItems) {
        kaoshibao.createStr()
        kaoshibao.downloadTEXT()
        kaoshibao.downloadJson()
    }
}
kaoshibao.start()
// kaoshibao.downloadJson()
// kaoshibao.downloadTEXT()

