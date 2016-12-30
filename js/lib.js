(function () {
    var UA = window.navigator.userAgent;
    UA = UA.toLowerCase();
    win = $(window);
    window.CANDLE = 61;
    window.NUM_CANDLE = 67;
    window.CAT_CAKE = 68;
    window.FORK = 60;

    if (/ipad|iphone|android/.test(UA)) {
        window.MobileDevice = true;
        window.CLICK = 'tap';
    } else {
        window.CLICK = 'click';
    }

    M = window.M || {};
    var IS_MOBILE = /^1[345678]\d{9}$/;
    M.IS_MOBILE = function (num) {
        return IS_MOBILE.test(num);
    }


    M.inputError = function (id) {
        var el = $('#' + id);
        el.show();
        setTimeout(function () {
            el.hide();
        }, 2000);
    }

    M.mstmpl = function (str, data) {
        if (!data) {
            return false;
        }
        var cache = {};
        var _inner = function (str, data) {
            var fn = !/\W/.test(str) ? cache[str] = cache[str] || this.$_MSTMPL(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
            return data ? fn(data) : fn;
        };

        return _inner(str, data);
    }

    var dialogIndex = 0;
    M.confirm = function (text, onconfirm, oncancel) {
        dialogIndex++;
        var width = win.width() * 0.8;
        if (width > 300) {
            width = 300;
        }
        var html = '<div class="dialog dia-sub-tip" id="dialog_' + dialogIndex + '" style="width:' + width + 'px;position:absolute;z-index:9998;min-height:150px;" >\
				  <div class="dialog-con">\
					<form>\
					<p class="dia-st-tip">' + text + '</p>\
					<input class="btn status1-btn confirm" type="button" value="确定">\
					<input class="btn cancel" type="button" value="取消">\
				  </form>\
				  </div>\
				</div><div class="gray-bg dialog_bg" style="opacity:0.6;z-index: 9997; height:' + win.height() + 'px;"></div>';
        $('body').append(html);
        var dialog = $('#dialog_' + dialogIndex);
        dialog.css({top: ((win.height() - dialog.height()) / 2)});
        dialog.addClass('animated-quick bounceIn');

        dialog.show();
        dialog.find('.confirm').on('click', function () {
            onconfirm && onconfirm();
            dialog.remove();
            $('.dialog_bg').remove();

        });

        dialog.find('.cancel').on('click', function () {
            oncancel && oncancel();
            dialog.remove();
            $('.dialog_bg').remove();

        });
    }

    M.setBG = function(opt){
        var bgObj=document.getElementById("EV_bgModeAlertDiv");
        if (!bgObj){
            var bgDiv = "<div id='EV_bgModeAlertDiv'></div>";
            $("body").append(bgDiv);
            bgObj=document.getElementById("EV_bgModeAlertDiv");
        }
        var bgWidth=document.documentElement.clientWidth || document.body.clientWidth || 0;
        var bgHeight=$(document).height() ||document.documentElement.clientHeight || document.body.clientHeight || 0;

        var zIndex = 999;
        if (opt && typeof opt.zIndex != 'undefined') {
            zIndex = opt.zIndex;
        }

        bgObj.style.position   = "absolute";
        bgObj.style.top        = "0px";
        bgObj.style.left       = "0px";
        bgObj.style.width      = bgWidth + "px";
        bgObj.style.height     = bgHeight + "px";
        bgObj.style.zIndex     = zIndex;
        bgObj.style.background = "#777";
        bgObj.style.filter     = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=60,finishOpacity=60);";
        bgObj.style.opacity    = "0.6";
        bgObj.style.display = 'block';

        if (opt && typeof opt.click == 'function') {
            $("#EV_bgModeAlertDiv").on('click', function(){
                opt.click($(this));
            });
        }
    }

    M.closeBG = function(){
        $("#EV_bgModeAlertDiv").hide();
    }

    M.loading = function () {
        var html = '<div class="loading" id="g_loading" style="box-shadow:0 0 1px #333;border-radius:10px;z-index:9999;position:absolute;top:10px;left:10px;height:100px;width:100px;background-color:#fff"></div>\
				<div class="gray-bg" id="loading_bg" style="opacity:0.6;z-index: 9997; height:' + win.height() + 'px;"></div>';
        if ($('#g_loading').length) {
            $('#g_loading').show();
            $('#loading_bg').show();
        } else {
            $('body').append(html);
        }

        $('#g_loading').css({
            top: (win.height() - 100) / 2,
            left: (win.width() - 100) / 2
        });
    }

    M.loadingEnd = function () {
        $('#g_loading').hide();
        $('#loading_bg').hide();
    }

    var _loader = function(path, local) {
        var src = path;
        if (typeof local != 'undefined' && local) {
            if (/\.\w+\{.*\}/.test(path)) {
                //data = data.replace(/img\//gi,'/css/img/');
                var stylesheet = '<style type="text/css">' + src + '<\/style>';
                document.write(stylesheet);
            } else {
                document.write('<script>'+src+'<\/script>');
            }
            return;
        }

        if (/\.css/.test(path)) {
            document.write('<link rel="stylesheet" type="text/css" href="' + src + '" />');
        } else {
            document.write('<script src="' + src + '"><\/script>');
        }
        return;
    };
    window.Loader = _loader;

})();


M.private_data = {};
M._get = function (key) {
    if (typeof M.private_data[key] == "undefined") {
        return null;
    }
    return M.private_data[key];
}
M._set = function (key, value) {
    key = key.toString();
    M.private_data[key] = value;
}
window.$_GET = (function () {
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if (typeof (u[1]) == "string") {
        u = u[1].split("&");
        var get = {};
        for (var i in u) {
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();