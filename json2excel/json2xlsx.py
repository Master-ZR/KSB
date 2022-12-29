import xlwings as xw
import json
import requests

jsonDir = "./H13-821_V2.0-HCIP-Cloud_Service_Solutions_Architect.json"
outputDir = "D:/Users/MasterZR/Downloads/错题/test.xlsx"
with open(jsonDir, "r", encoding="utf-8") as f:
    rawData = json.loads(f.read())


def header():
    temp = ['题干（必填）', '题型 （必填）', '选项 A', '选项 B', '选项 C', '选项 D', '选项 E',
            '选项 F', '选项 G', '选项 H', '正确答案 （必填）', '解析', '章节', '难度']
    column = 65
    raw = 1
    for i in range(14):
        shtRange = chr(column+i)+str(raw)
        print(f'{shtRange}={temp[i]}')
        sht = book.sheets["题库"]
        sht.range(shtRange).value = temp[i]


def download():
    for i in rawData["jianDa"]:
        for j in i:
            item = "".join(i[j])
            if (item.find("http") == 0):
                name = f"{i['title']}_{j}.png"
                r = requests.get(item)
                with open(f"./img/{name}", "wb") as f:
                    f.write(r.content)
            print(i[j])


def json2excel(itemsType, itemsList):
    print(itemsType)
    if itemsType == "danXuan":
        itemsTypeCN = "单选题"
        # sht = book.sheets["单选题"]

    elif itemsType == "duoXuan":
        itemsTypeCN = "多选题"
        # sht = book.sheets["多选题"]

    elif itemsType == "panDuan":
        itemsTypeCN = "判断题"
        # sht = book.sheets["判断题"]

    elif itemsType == "tianKong":
        itemsTypeCN = "填空题"
        # sht = book.sheets["填空题"]

    elif itemsType == "jianDa":
        itemsTypeCN = "简答题"
        # sht = book.sheets["简答题"]
    sht = book.sheets["题库"]

    print(itemsTypeCN)
    length = len(itemsList)
    global num
    for seq in range(length):
        column = 65
        row = str(num+2)
        num += 1
        title = itemsList[seq]["title"]
        sht.range(chr(column)+row).value = title.split("_")[1]
        column += 1
        sht.range(chr(column)+row).value = itemsTypeCN
        if itemsType == "tianKong":
            column += 1
            sht.range(chr(column)+row).value = itemsList[seq]["answer"]
        elif itemsType == "jianDa":
            column += 1
            sht.range(chr(column)+row).value = itemsList[seq]["img"]
            for i in range(7):
                column += 1
                sht.range(chr(column)+row).value = ''
            column += 1
            sht.range(
                chr(column)+row).value = " ".join(itemsList[seq]["answer"])
        else:
            options = itemsList[seq]["options"]
            for i in range(8):
                column += 1
                if i < len(options):
                    temp = ''
                    opt = options[i].split(".")
                    for j in range(len(opt)):
                        if j != 0:
                            temp += opt[j]
                    sht.range(
                        chr(column)+row).value = temp
                else:
                    sht.range(chr(column)+row).value = ""
            column += 1
            answers = ""
            for answer in itemsList[seq]["answer"]:
                temp = answer.replace('.', ' ')
                answers += temp.split()[0]
            sht.range(chr(column)+row).value = answers


def main():
    header()
    for itemsType in rawData:
        # itemsType = "tianKong"
        itemsList = rawData[itemsType]
        json2excel(itemsType, itemsList)
    book.save(outputDir)
    book.close()
    app.kill()
    exit()


length = 0
name = ''

test = []


num = 0

app = xw.App(visible=True, add_book=False)
app.display_alerts = True  # 关闭提示信息
app.screen_updating = True  # 关闭显示更新

# 创建一个工作薄
book = app.books.add()
# 工作薄中创建一个sheet表
# book.sheets.add("单选题")
# book.sheets.add("多选题")
# book.sheets.add("判断题")
# book.sheets.add("填空题")
# book.sheets.add("简答题")
book.sheets.add("题库")

# 向表格的A1单元格写入“Hello Python”

main()
