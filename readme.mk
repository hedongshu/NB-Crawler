# NB-Crawler

此项目用node实现了爬虫的基础功能

## 项目演示

我们试着爬取 豆瓣top250 的数据

>  https://movie.douban.com/top250

调用主函数时输入url参数

```JavaScript
const __main = function () {
    var url = 'https://movie.douban.com/top250'
    for (let i = 0; i < 10; i++) {
        log(`第${i}次: ${url}`)
        loadFormUrl(url)
        url = nextUrl(url)
    }

}
```


命令行中输入 

```
node app.js
```

启动项目

完成~~~

现在你可以在项目路径中看到一个叫doubantop250.txt的文件,这里保存的就是爬去的豆瓣电影的数据啦

![7BC11B65-A58D-4051-803B-95CC1FA37B06](https://ws2.sinaimg.cn/large/006tNc79gy1fow1t7tb73j31kw113tjq.jpg)


