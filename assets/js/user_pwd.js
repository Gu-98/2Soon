$(function () {
    //layui表验证时机：表单的dom对象的onsubmit事件遍历 表单中的表单控件
    
    //添加layui的自定义校验规则
    //形参数据：被验证的表单控件的value值
    //返回值：验证通过 不返回任何东西；验证不通过 返回提示消息
    layui.form.verify({
        rePwd: function (confrimpwd) {
            var newPwdStr = $('[name=newPwd]').val().trim();
            if (newPwdStr !== confrimpwd) {
               return '两次密码不一致！'
           } 
    }
})
  //表单提交事件
    //1.触发 layui的验证规则  
     //如果验证消息有返回错误消息 则阻止2的执行反之，没有返回错误消息 就继续2的执行
    
    //2.继续执行下面的函数
    $('#formChangePwd').on('submit', function (e) {
        e.preventDefault();
        changePwd();
    })
})

function changePwd() {
    var strData = $('#formChangePwd').serialize()
    console.log(strData);
    
    $.ajax({
        url: '/my/updatepwd',
        data: strData,
        method: 'post',
        success: function (res) {
            if (res.status !== 0) {
                layui.layer.msg(res.message)
            } else {
                // 如果修改成功 则要求重新登录输入密码
                layui.layer.msg(res.message, function () {
                    localStorage.removeItem('token')
                    // 因为在iframe中，则需要在上一个window上跳转
                    window.parent.location.href = '/login.html'
                }
                )
            }
        }
    })
}