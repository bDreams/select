/*
 * @Author: bDreams
 * @Date:   2016-06-24 16:20:51
 * @Last Modified by:   bDreams
 * @Last Modified time: 2016-07-01 08:59:47
 */

'use strict';
(function(win, doc, $, undefined) {

    function Select(config) {
        this._init(config);
    };
    Select.prototype = {
        // 初始化配置信息
        _init: function(config) {
            this.config = config;
            this.$container = $(this.config.el);
            this.callback = config.callback;
            this.title = config.title || '请选择：';
            this.initShow = parseInt(config.initShow) || 0;
            this._renderDOM();
        },
        // 渲染DOM结构
        _renderDOM: function() {
            var tempArr = [];
            tempArr.push('<div class="select"><span>' + this.title + '</span>');
            tempArr.push('<ul class="select-list hidden"><li class="select-list-item">' + this.title + '</li>')
            for (var i = 0, len = this.config.data.length; i < len; i++) {
                tempArr.push('<li class="select-list-item"');
                // 赋值自定义属性
                for (var key in this.config.data[i]) {
                    tempArr.push('data-' + key + '="' + this.config.data[i][key] + '"');
                }
                tempArr.push('>' + this.config.data[i].name + '</li>');

            };
            tempArr.push('</ul></div>');
            this.$container.append(tempArr.join(''));
            this._initShow();
            this._bindDOM();
        },
        // 初始化时显示第几项数据
        _initShow: function() {
            var $select = this.$container.find('.select');
            var $listItem = $select.find('.select-list-item');
            var data = $listItem.eq(this.initShow).data();

            for (var k in data) {
                $select.attr('data-' + k, data[k]);
            }
            $select.find('span').text(data.name);
        },
        // 绑定事件
        _bindDOM: function() {
            var $select = this.$container.find('.select');
            var $list = $select.find('.select-list');
            var $listItem = $select.find('.select-list-item');
            var _this = this;
            $select.find('span').on('click', function() {
                $list.removeClass('hidden');
            });
            $select.on('mouseleave', function() {
                $list.addClass('hidden');
            });

            // 在点击每一个列表项进行切换的时候，会将每一个列表项上所有的自定义属性赋值给最外层的盒子,以及文本
            // 选择第一项'请选择：'时，最外层盒子上的自定义属性的值将会被清空
            $listItem.on('click', function() {
                // 点击之后替换内容  -- 肯定会做的操作
                $select.find('span').text($(this).text());
                $list.addClass('hidden');

                var data = $(this).data();
                $.isEmptyObject(data) ? resetData() : setData(data);
                // 作为回调函数的参数
                var obj = {};
                obj.index = $(this).index();
                obj.elem = $(this).get(0);
                obj.parentElem = $(this).parents('.select').get(0);
                if (_this.callback && typeof _this.callback === 'function') {
                    _this.callback(obj);
                };
            });
            /**
             * 给最外层的盒子设置自定义属性
             * @param {object} data 自定义属性数据
             */
            function setData(data) {
                for (var k in data) {
                    $select.attr('data-' + k, data[k]);
                };
            };
            // 清空最外层上的所有自定义属性
            function resetData() {
                for (var k in $select.data()) {
                    $select.removeAttr('data-' + k);
                }
            };
        }

    };

    // var data = [{
    //     name: '屌丝一号', // 每一个列表项的文本内容
    //     id: '0001', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    //     value: 'GHHGFH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
    // }, {
    //     name: '屌丝二号', // 每一个列表项的文本内容
    //     id: '0002', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    //     value: 'ggHGFH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
    // }, {
    //     name: '屌丝三号', // 每一个列表项的文本内容
    //     id: '0003', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    //     value: 'yyyiiH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
    // }, {
    //     name: '屌丝四号', // 每一个列表项的文本内容
    //     id: '0004', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    //     value: 'G7788FH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
    // }];
    // 在点击每一个列表项进行切换的时候，会将每一个列表项上所有的自定义属性赋值给最外层的盒子,以及文本
    // 选择第一项'请选择：'时，最外层盒子上的自定义属性的值将会被清空
    // new Select({
    //     el: '.box', // 必需  容器
    //     data: data, // 必需  选择列表数据 arr
    //     initShow: 0, // 可选 | 默认为0 加载的时候显示第几项数据  类型: 1 | '1';
    //     // callback: cb // 可选 每次选择列表项之后执行的回调函数
    //     callback: function(obj) {
    //         console.log(obj);
    //     }
    // });
    /**
     * 列表项每次点击执行的回调函数
     * @param  {object}   obj 返回点击的一些属性 
     *         ojb = {
     *            index: 当前点击的列表的索引
     *            elem: 当前点击的列表的DOM对象 ★ 不是jq对象
     *            parentElem: 最外层的父级元素 -- .select
     *         }
     * @return {Function}     [description]
     */
    // function cb(obj) {
    //     console.log($(obj.elem).data());
    // };

    win.select = function(config) {
        new Select(config);
    };
})(window, document, jQuery);

// 使用

var data = [{
    name: '屌丝一号', // 每一个列表项的文本内容
    id: '0001', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    value: 'GHHGFH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
}, {
    name: '屌丝二号', // 每一个列表项的文本内容
    id: '0002', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    value: 'ggHGFH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
}, {
    name: '屌丝三号', // 每一个列表项的文本内容
    id: '0003', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    value: 'yyyiiH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
}, {
    name: '屌丝四号', // 每一个列表项的文本内容
    id: '0004', // 自定义属性 将被转换成data-id的形式赋值给每一个列表项
    value: 'G7788FH' //自定义属性 将被转换成data-id的形式赋值给每一个列表项
}];

select({
    el: '.box',
    data: data,
    initShow: 3,
    callback: function(obj) {
        console.log(obj);
    }
});
