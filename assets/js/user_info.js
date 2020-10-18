$(function () {
    //添加layui 自定义验证规则
    layui.form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须1-6个字符之间'
            }
        }
    })
    //发布异步请求 获取用户信息
    initUserInfo()

    // 重置功能
    $('#btnReset').on('click', function () {
        initUserInfo()
    })

    //提交修改功能  普通按钮不会提交表单 所以点击后不用阻止默认行为
    $('#btnSubmit').on('click', function () {
        modifyUserInfo()
    })
})


// 初始化用户基本信息
function initUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // console.log(res);
            layui.form.val('formUserInfo', res.data)

        }
    })
}
// 提交用户信息
function modifyUserInfo() {
    //获取表单数据
    var dataStr = $('#formModify').serialize()
    //提交异步请求
    // 提交异步请求之前 都会先执行baseAPI里面过滤器的方法
    $.ajax({
        method: 'post',
        url: '/my/userinfo',
        data: dataStr,
        success: function (res) {
            if (res.status !== 0) {
                // console.log(res);
                return layui.layer.msg('更新用户信息失败！')
            } else {
                layui.layer.msg('更新用户信息成功！')
                window.parent.getUserInfo()
            }

        }
    })
}