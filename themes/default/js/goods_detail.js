/**
 * Created by csyr on 16/1/20.
 */
var attr_id = 0, attr_price = 0;
var add_to_cart = function(callback, goods_data){
    var goods = {};
    // 检查是否有商品规格
    goods.quick = 1;
    if (typeof goods_data == 'undefined') {
        //商品重量
        goods.spec = attr_id ;

        //商品ID 在商品详情页中goods_id会被赋值到页面变量中，所以之前没有先做初始化操作
        goods.goods_id = goods_id;

        //数量
        goods.num = M._get('current_goods_num') || 1;
    }

    if (typeof goods_data != 'undefined') {
        if (typeof(goods_data.attr_price_id) != 'undefined') {
            goods.spec = goods_data.attr_price_id;
        }
        if (typeof(goods_data.goods_id) != 'undefined' && !isNaN(goods_data.goods_id)) {
            goods.goods_id = goods_data.goods_id;
        }
        if (typeof(goods_data.num) != 'undefined' && !isNaN(goods_data.num)) {
            goods.num = goods_data.num;
        }
    }
    var csrfToken = $('meta[name="csrf-token"]').attr("content");
    //父商品ID
    goods.parent = 0;
    $.post('/cart/v1/add',{
        '_csrf':csrfToken,
        goods : JSON.stringify(goods),
        goods_id : goods.goods_id,
        parent_id :0,
        is_cut:0
    },function(d){
        if (typeof callback == 'function') {
            callback(d);
        }
    }, 'json');
}

$(function(){
    var attr_id = 0;

    //设置免费赠送餐具和适合食用人数
    var set_eat_num_tableware = function(attr_id){
        if (typeof (eat_num_tableware) != 'undefined' && eat_num_tableware) {
            var obj = jQuery.parseJSON(eat_num_tableware);
            $.each(obj, function(k, i){
                if (k == attr_id) {
                    $(".eat-num-suitable").text(i.eat_num);
                    $(".free-tableware").text(i.tableware);
                    $(".cake-size").text(i.cake_size);
                    return;
                }
            });
        }
    }

    var goods_price = function(){
        var sel_list = $("#sel_list em");
        if (sel_list.length) {
            sel_list.eq(0).addClass('checked');
            attr_id = sel_list.eq(0).attr('data-id');
            attr_price = sel_list.eq(0).attr('data-price');
            sel_list.on("click", function(){
                attr_id = $(this).attr('data-id');
                //设置显示价格
                attr_price = $(this).attr('data-price');
                $(this).addClass('checked').siblings().removeClass('checked');
                attr_price = parseFloat(attr_price);
                $(".display_price").text(attr_price.toFixed(2));
                //设置显示适合食用人数
                set_eat_num_tableware(attr_id);
                return false;
            });
        }

        attr_price = parseFloat(attr_price);
        $(".display_price").text(attr_price.toFixed(2));
        //设置免费赠送餐具和适合食用人数
        set_eat_num_tableware(attr_id);

        return false;
    }
    goods_price();

    //立即购买
    $("#buy_now").on("click", function(){
        //sale candle
        if(typeof(is_sale_candle) != 'undefined' && is_sale_candle ===1) {
            if($("#candle-sel").val() == '' ) {
                return false;
            }
            var v = $("#candle-sel").val();
            attr_id = v.split(','); //[]
            var data = {
                "attr_price_id":attr_id,
                "num":1,
                "goods_id":goods_id
            };
            add_to_cart(function(d) {
                if (d.code == 0) {
                    window.location.href = checkout || '/checkout';
                }
            }, data);
            return false;
        }
        var goods_num = $("input.num-enter").val();
        var data = {
            'attr_price_id': attr_id || attr_price_id,
            'num':goods_num||1,
            'goods_id':goods_id
        };
        add_to_cart(function(d) {
            if (d.code == 0) {
                window.location.href = typeof(checkout)=='undefined'?'/checkout':checkout;
            }
        }, data);
        return false;
    });
    //添加购物车
    $("#add_to_cart").on("click", function(){
        //sale candle
        if(typeof(is_sale_candle) != 'undefined' && is_sale_candle ===1) {
            if($("#candle-sel").val() == '' ) {
                return false;
            }
            var v = $("#candle-sel").val();
            attr_id = v.split(','); //[]
            var data = {
                "attr_price_id":attr_id,
                "num":1,
                "goods_id":goods_id
            };
            add_to_cart(function(d){
                if (d.code == 0) {
                    alert('添加成功');
                }
            }, data);
            return false;
        }
        //sale cake
        var goods_num = $("input.num-enter").val();
        var data = {
            'attr_price_id': attr_id || attr_price_id,
            'num':goods_num||1,
            'goods_id':goods_id
        };
        add_to_cart(function(d){
            if (d.code == 0) {
                alert('添加成功');
            }
        }, data);
        return false;
    });


    $(".candle-btn").on("click",function(){
        if($(".wap-candle-area").hasClass('hide')) {
            $(".wap-candle-area").removeClass('hide');
        }
        var attr_id = $(this).attr('data-id');
        var key = $(this).attr('numeric');
        add_candle(attr_id,key);
    });

    var get_candle = function() {
        var cs = $("#candle-sel");
        if(cs.val() == 'undefined' || cs.val() == '') {
            return '';
        }
        v = cs.val();
        var arr = v.split(',');
        return arr;
    }


    var add_candle = function(attr_id,key) {
        var cs = $("#candle-sel");
        var v = cs.val();
        v = addCandleSelStr(v,key);
        cs.val(v);
        var script = "<img src='" + candle_url + key + ".jpg'/>";
        $(".wap-candle-sel").append(script);
    };

    $(".wap-candle-sel").on("click",function(){
        var cs = $("#candle-sel");
        if($(this).has('img').length == 0) {
            cs.val('');
        }else{
            var v = cs.val();
            v = delCandleSelStr(v);
            cs.val(v);

            var img = $(this).find('img').last();
            img.remove();
        }
    });

    //'' to 1; 1 to 1,2
    function addCandleSelStr(str,val) {
        if(typeof(str) === 'undefined' || str === '') {
            return val;
        }
        return str + ',' + val;
    }

    //1,2 to 1;1 to ''
    function delCandleSelStr(str) {
        if(typeof(str) === 'undefined' || str === '') {
            return '';
        }
        if(str.lastIndexOf(',') == -1) {
            return '';
        }else{
            var index = str.lastIndexOf(',');
            return str.substring(0,index);
        }
    }
});