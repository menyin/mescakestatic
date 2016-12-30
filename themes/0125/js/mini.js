/**
 * Created by csyr on 16/1/29.
 */

$(function(){
    var current_num = 1;
    $(".buy-btn-area .num-enter").val(current_num);

    //数量减少
    $(".buy-btn-area .minus-ico").on('click', function(){
        if ($(this).parent().attr('buy_num')) {
            current_num = $(this).parent().attr('buy_num');
            current_num = parseInt(current_num);
        }
        else {
            current_num = 1;
        }

        current_num--;
        if (current_num<=1) {
            current_num = 1;
        }

        M._set("current_goods_num", current_num);
        $(this).parent().find(".num-enter:first").val(current_num);
        //set current container number
        $(this).parent().attr('buy_num', current_num);
        return false;
    });
    //数量增加
    $(".buy-btn-area .plus-ico").on('click', function(){
        if ($(this).parent().attr('buy_num')) {
            current_num = $(this).parent().attr('buy_num');
            current_num = parseInt(current_num);
        }
        else {
            current_num = 1;
        }
        current_num++;
        M._set("current_goods_num", current_num);
        $(this).parent().find(".num-enter").val(current_num);
        //set current container number
        $(this).parent().attr('buy_num', current_num);
        return false;
    });
});

