$(function () {
    getUserInfo()
 //点击退出  删除token并跳转登录页面
    $('#btnOut').on('click', function () {
        layui.layer.confirm('您确认退出吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1.删除token
            localStorage.removeItem('token');
            // 2.跳转页面
            location.href='/login.html'
            // 3.关闭当前弹出层
            layui.layer.close(index);
          });
})





})
//异步获取用户完整信息的方法
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        /* headers: {
            Authorization: localStorage.getItem('token') || '',
        }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 显示用户名
    var name = user.nickname || user.username
    $('.welcome').html('欢迎，' + name)
    // 显示用户头像
    if (user.user_pic !== null) {
        //图片头像 设置图片路径 并显示
        $('.userinfo img').attr('src', user.user_pic).show()
        //隐藏文字头像
        $('.text-avatar').hide()
    } else {
        // 文本头像
        // 提取名字的首字符，并转成大写
        var firstChar = name[0].toUpperCase()
        // 将首字母设置给标签 并显示
        $('.userinfo .text-avatar').html(firstChar).show()
        $('.userinfo img').hide()
    }
}