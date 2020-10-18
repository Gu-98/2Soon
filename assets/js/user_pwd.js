$(function () {
    $('#btnSubmit').on('click', function () {
        changePwd()
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