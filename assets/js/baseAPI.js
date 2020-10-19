// ajaxPrefilter 作用：可以用来在jq之前修改 请求参数
// a.为jq的异步请求 新增一个回调函数 每次jq异步请求之前会调用这个回调函数
$.ajaxPrefilter(function (opt) {
    // opt.url=根地址+'接口地址'
    opt.url = 'http://ajax.frontend.itheima.net' + opt.url;
    // b.自动将localstorage中的token 读取 并加入到请求报文中 一起发生给服务器
    //c.统一为有权限的接口，设置headers请求头
    // 判断当前的url是否包含/my/ 如果包含 则发送token
    if (opt.url.indexOf('/my/') > -1) {
        opt.headers = {
            //请求头 配置对象
            Authorization: localStorage.getItem('token') || '',
        }
    }
    // 统一处理服务端返回的未登录 错误
    opt.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份验证失败！') {
            // 1.提示用户没有权限
            alert('对不起,您的登录失效,请重新登录')
            // 2.删除可能伪造的token
            localStorage.removeItem('token')
            // 3.页面跳转到登录
            window.top.location.href = '/login.html'
        }
    }
})