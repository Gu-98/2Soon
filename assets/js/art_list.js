$(function () {
    initTab()
    initCate()
    //筛选按钮 点击事件
    $('#btnSel').on('click', search);
    // 删除按钮点击事件
    $('.layui-table tbody').on('click', '.btn-del', doDel);
})
// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}
function initTab() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res.data)
            $('.layui-table tbody').html(htmlStr)
            // 生成页码条
            renderPage(res.total)
        }
    })
}


// 定义美化时间的过滤器
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}


// 初始化文章分类的方法
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取分类数据失败！')
            }
            // 调用模板引擎
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 通过 layui 重新渲染表单区域的UI结构
            layui.form.render()
        }
    })
}

// 筛选点击事件 
function search(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTab()
}
// 分页 
function renderPage(total) {
    // console.log(total)
    layui.laypage.render({
        elem: 'pageBar',//页码条容器 元素的id名
        count: total, //数据库符号要求的数据总数
        limit: q.pagesize,//每页显示的数据行数
        curr: q.pagenum,//当前页码
        layout: ['count', 'prev', 'page', 'next', 'skip'],
        limits: [2, 5, 10, 20],
        // 页码被点击时，分页发生切换 触发
        //触发jump 函数的方式有两种
        //1.点击页码 会触发jump
        //2.只要调用了laypage.render() 就会触发jump函数
        jump: function (obj, first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            //obj包含了当前分页的所有参数，比如：
            //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            //console.log(obj.limit); //得到每页显示的条数
            // 当前页码 设置给 全局变量参数对象里的页码属性
            q.pagenum = obj.curr;
            // 当前选中的页容量 设置给全局参数对象
            q.pagesize = obj.limit;
            // 如果不是第一次触发就重新渲染表格 
            if (!first) {
                initTab()
            }
        }

    })
}

// 删除按钮
function doDel() {
    // 删除数据行之前 获取当前页面的删除按钮的个数
    var len = $('.btn-del').length;
    //1.从被点击按钮上获取当前数据的id
    var did = this.dataset.did;
    layui.layer.confirm('你确认删除吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        // 发送id到删除接口 执行删除操作
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + did,
            // 删除成功 重新调用加载列表；删除失败 则显示错误消息
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('删除文章失败！')
                }
                layui.layer.msg('删除文章成功！')
                if (len === 1) {
                    // 如果len的值等于1 删除后则没有数据
                    // 页码值最小必须是1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                }

                initTab()
            }
        })
        layui.layer.close(index);
    });

}