//全局变量 登录页面的两个超链接
var $btnLogin, $btnReg

//dom树准备完毕 为登录页面准备点击事件
$(function () {
    $btnLogin = $('.login-box');
    $btnReg = $('.reg-box');
    //点击去注册账号的链接
    $('#link_reg').on('click', function () {
        //登录框隐藏
        $btnLogin.hide();
        //注册框显示
        $btnReg.show();
    });
    $('#link_login').on('click', function () {
        //登录框显示
        $btnLogin.show();
        //注册框隐藏
        $btnReg.hide();
    });


    //通过form.verify()函数自定义校验规则
    layui.form.verify({
        //自定义校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //重复密码确认
        repwd: function (value) {
            //通过形参拿到确认密码框里面的内容
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //取消表单的默认提交行为
        e.preventDefault();
        //获取注册信息
        let data = {
            username: $('.reg-box [name=username]').val().trim(),
            password: $('.reg-box [name=password]').val().trim(),
        };
        //发送注册信息
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                layui.layer.msg(res.message)
            } else {
                layui.layer.msg(res.message, function () {
                    //触发点击事件 切换 显示窗口
                    $('#link_login').click();
                    //清空注册表单的内容  jquery没有reset方法，故调用dom的reset方法
                    $('#form_reg')[0].reset();
                });

                //将用户名和密码 设置给 登录窗口的输入框
                $('.login-box [name=username]').val(data.username);
                $('.login-box [name=password]').val(data.password)
            }
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
          url: '/api/login',
          method: 'POST',
          // 快速获取表单中的数据
          data: $(this).serialize(),
          success: function(res) {
            if (res.status !== 0) {
              return layui.layer.msg('登录失败！')
            }
            layui.layer.msg('登录成功！')
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', res.token)
            // 跳转到后台主页
            location.href = '/index.html'
          }
        })
    })

})
