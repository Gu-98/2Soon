// 打开新增窗口的id
var addWindowId = null;
$(function () {
    initArtCateList()

    // 为添加类别的按钮添加点击事件
    $('#btnAddCate').on('click', function () {
        addWindowId = layui.layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })


    // 为新增表达添加提交事件
    $('body').on('submit', '#formAdd', function (e) {
        e.preventDefault()
        addArtCate()
    })

    // 为动态生成的数据行里的修改按钮 代理点击事件
    $('.layui-table tbody').on('click', '.btn-edit', function (e) {
        // showEdit()
        var oldData = {
            Id: this.dataset.id,
            name: $(this).parent().prev('td').prev('td').text().trim(),
            alias: $(this).parent().prev('td').text().trim()
        };
        showEdit(oldData) 
    })


// 为编辑 面板的表单提交事件 绑定方法
    $('body').on('submit', '#formEdit',function (e) {
        e.preventDefault()
        editArt()
    })


    // 为动态生成的 删除按钮 点击事件
    $('.layui-table tbody').on('click', '.btn-del', function (e) {
        // var cateId=$(this).dataset.did
        delArt(this.dataset.did)
    })

})

// 获取文章分类列表
function initArtCateList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status === 0) {
                var htmlStr = template('tpl-table', res.data)
                $('tbody').html(htmlStr)
            }
        }
    })
}

// 新增分类方法
function addArtCate() {
    $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $('#formAdd').serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('新增分类失败！')
            }
            initArtCateList()
            layui.layer.msg('新增分类成功！')
            // 根据索引，关闭对应的弹出层
            layui.layer.close(addWindowId)
        }
    })

}


// 显示编辑窗口
function showEdit(oldData) {
    addWindowId = layui.layer.open({
        type: 1,
        area: ['500px', '300px'],
        title: '修改文章分类',
        content: $('#dialog-edit').html(),
    });
            layui.form.val('form_Edit', oldData)
        
    }
  

// 修改分类
function editArt() {
    var dataStr = $('#formEdit').serialize()
    
    $.ajax({
          method: 'POST',
          url: '/my/article/updatecate',
          data: dataStr,
          success: function(res) {
            if (res.status !== 0) {
              return layui.layer.msg('更新分类数据失败！')
            }
            layui.layer.msg('更新分类数据成功！')
            layui.layer.close(addWindowId)
            initArtCateList()
          }
    })
    }

function delArt(cateId) {
    layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + cateId,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除分类失败！')
              }
              layer.msg('删除分类成功！')
              layer.close(index)
              initArtCateList()
            }
          })
    })
    }