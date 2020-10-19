$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮添加点击事件
    $('#btnChooseImg').on('click', function () {
        $('#file').click()
    })

    //为文件选择框添加change事件
    //触发时机：1.文件选择框 选择的文件发送改变
    //2.由选中文件到没选中文件(取消)触发
    $('#file').on('change', function (e) {
        //获取用户选择的图片
        var filelist = e.target.files;
        if (filelist.length === 0) {
            //如果没选择图片 则弹出
            return layui.layer.msg('请选择图片！')
        }
        //1.拿到用户选择的文件
        var file = e.target.files[0]
        //2.根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        //3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image.cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    //为确定按钮添加点击事件
    $('#btnSure').on('click', function () {
        //1.拿到用户选择的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //2.调用接口 上传至服务器
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败！')
                }
                layui.layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})