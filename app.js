/*
    加载模块
    request 用于下载网页
    cheerio 用于解析网页数据
*/
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')


const log = function () {
    console.log.apply(console, arguments)
}

var movies = function () {
    // 电影名字
    this.name = ''
    // 排名
    this.rank = 0
    // 主演
    this.actor = []
    // 评分
    this.garde = 0
    // 引言
    this.quote = ''
    // 链接
    this.link = ''
}
var getActor = function (str) {
    // 获取主演
    var index = str.indexOf('主演') + 4
    return str.slice(index)
}

var appendData = function (m) {
    var path = 'doubanTop250.txt'
    data = `\n${JSON.stringify(m,null,4)}`
    fs.appendFile(path, data, (err) => {
        if (err) {
            throw err
        };
        console.log('The data was appended to file!');
    });
}
var getMovieData = function (divList) {
    var movie = new movies()
    var e = cheerio.load(divList)
    movie.name = e('.hd .title').text()
    movie.rank = e('.pic em').text()
    movie.actor = getActor(e('.bd>p').text())
    movie.garde = e('.bd>.star>.rating_num').text()
    movie.quote = e('.bd>.quote>.inq').text()
    // 元素的属性用 .attr('属性名') 确定
    movie.link = e('.hd a').attr('href')
    return movie
}
var nextUrl = function (url) {
    if (url.indexOf('start') === -1) {
        var url = url + '?start=00&filter='
    }
    if (url.length == 48) {
        var start = parseInt(url.slice(-10, -8))
    } else if (url.length == 49) {
        var start = parseInt(url.slice(-11, -8))
    }
    start += 25
    var query = url.slice(0, 31)
    var nextUrl = `${query}?start=${start}&filter=`
    return nextUrl
}
var loadFormUrl = function (url) {
    var path = 'movie' + url.slice(31) + '.html'
    // 判断页面是否存在
    fs.readFile(path, (err, data) => {
        // 不存在就去下载
        if (err) {
            log('url', url)
            request(url, function (err, response, body) {
                // 回调函数的三个参数分别是  错误, 响应, 响应数据
                // 检查请求是否成功, statusCode 200 是成功的代码
                if (!err && response.statusCode == 200) {
                    // 保存读取的页面
                    fs.writeFile(path, body, (err) => {
                        if (err) throw err
                        console.log('The file has been saved!')
                    })
                }
            })
        } else if (!err) {
            //存在就直接读取本地文件
            // cheerio.load 用字符串作为参数返回一个可以查询的特殊对象
            const e = cheerio.load(data)
            divList = e('.grid_view .item')
            for (let i = 0; i < divList.length; i++) {
                var element = divList[i]
                var movieDiv = e(element).html()
                var m = getMovieData(movieDiv)
                appendData(m)
                if (i == 24) {
                    log(m)
                }
            }
        }


    })
}

const __main = function () {
    var url = 'https://movie.douban.com/top250'
    for (let i = 0; i < 10; i++) {
        log(`第${i}次: ${url}`)
        loadFormUrl(url)
        url = nextUrl(url)
    }

}

__main()




