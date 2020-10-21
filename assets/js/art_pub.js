var pubState = '草稿';
$(function () {
    initCate()
    // 初始化富文本编辑器
    initEditor()



    // 点击选择封面 
    $('#btnChoose').on('click', function () {
        $('#coverfile').click() //模拟选择框默认选中
    })
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverfile').on('change', changeFiles)


    // 为表单添加提交事件
    $('#formAdd').on('submit', submitData)



    // 不管点击的是提交还是存为草稿 都触发表单提交事件
    // 为两个提交按钮添加点击事件 用来修改发布状态值
    $('#btnFB').on('click', function (e) {
        pubState = '已发布';
    })
    $('#btnCG').on('click', function (e) {
        pubState = '草稿';
    })

})
// 定义加载文章分类的方法
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('初始化文章分类失败！')
            }
            // 调用模板引擎，渲染分类的下拉菜单
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)//属性选择器
            // 一定要记得调用 layui.form.render() 方法
            layui.form.render()
        }
    })
}

// 1. 初始化图片裁剪器
var $image = $('#image')
// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}
// 3. 初始化裁剪区域
$image.cropper(options);

function changeFiles(e) {
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
        return layui.layer.msg('请选择图片')
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image.cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
}


function submitData(e) {
    e.preventDefault()
    // 获取表单数据
    var fd = new FormData(this)
    // 为fd添加文章的发布状态
    fd.append('state', pubState)
    
    fd.forEach(function (v, k) {
        console.log(k,'=',v);
    })

    // 4. 将封面裁剪过后的图片，输出为一个文件对象
  $image
  .cropper('getCroppedCanvas', {
    // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {
    // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    // 5. 将文件对象，存储到 fd 中
    fd.append('cover_img', blob)
    // 6. 发起 ajax 数据请求
    publishArticle(fd)
  })

}


// 定义一个发布文章的方法
function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layui.layer.msg('发布文章失败！')
        }
        layui.layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        window.location.href = '/article/art_list.html'
      }
    })
}


