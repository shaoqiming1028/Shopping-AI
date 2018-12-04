var last;
var numspan = -1;
function trimStr(str) { return str.replace(/(^\s*)|(\s*$)/g, ""); }

var input = $('#sb_form_q');
var text = "";
$('#sb_form_go').click(function () {
    text = $('#sb_form_q').val();
    $('#as').css('display', 'none');
    $.get('/search?key=' + text, function (result) {
        return;
    })
});

// $("input").blur(function(){
//     $('#as').css('display','none');
// })
$("input").focus(function () {
    $('#as').css('display', 'block');
})

$("input").blur(function () {
    $('#as').css('display', 'none');
})

input.keyup(function (e) {
    last = event.timeStamp
    let which = e.which
    if (which != 39 && which != 40 && which != 37 && which != 38 && which != 13) {
        //     text = input.val().trim()
        // if (text == '') {
        //     $('#as').css('display','none');
        //     return;
        // }
        setTimeout((function () {

            if (last - e.timeStamp == 0) {

                text = trimStr(input.val());
                if (text == '') {
                    $('#as').css('display', 'none');
                    $('#sa_ul').html('');
                    return;
                }
                $.get('/search1?key=' + text, function (result) {
                    if (result.length == 0) {
                        return;
                    } else {
                        $('#as').css('display', 'block');
                        var html = "";
                        for (var i = 0; i < result.length; i++) {
                            html += "<li class='suggest'> <a href='/search?key=" + result[i].productName + "'>" + result[i].productName + "</a></li>";
                        }
                        $('#sa_ul').html(html);
                        // highlightByClass(input.val(),"suggest");
                        eventEmitter(result.length, text);
                    }
                })
            }
        }), 500);
    }
});

function active(i) {
    $('#sa_ul').children().eq(i).css({
        "background-color": "rgba(0,0,0,0.2)"
    });
}

function defaut(i) {
    $('#sa_ul').children().eq(i).css({
        "background-color": "rgba(255,255,255,0.3)"
    });
}

function eventEmitter(len, text) {
    var length = len;
    input.keydown(function (event) {
        // 回车提交
        if (event.which == 13) {
            $('#as').css('display', 'none');
        }
        // 下
        // if (event.which == 40) {
        //     if (numspan == length){
        //         numspan = 0;
        //     // input.val(text);
        //         for (var i = 0; i < length; i++) {
        //             if (numspan == i) {
        //                 active(i);
        //             }else {
        //                 defaut(i);
        //             }
        //         }}else{
        //             numspan++;
        //             for (var i = 0; i < length; i++) {
        //             if (numspan == i) {
        //                 active(i);
        //             }else {
        //                 defaut(i);
        //             }
        //         }   

        //     }
        //     input.val($('#sa_ul').children().eq(numspan).text());
        // }
        // // 上
        // if (event.which == 38) {
        //     if (numspan == -1){
        //         numspan = length -1;
        //         // input.val(text);
        //     for (var i = 0; i < length; i++) {
        //         if (numspan == i) {
        //             active(i);
        //         }else {
        //             defaut(i);
        //         }
        //     }}else{
        //         numspan--;
        //         for (var i = 0; i < length; i++) {
        //         if (numspan == i) {
        //             active(i);
        //         }else {
        //             defaut(i);
        //         }}
        //     }

        //     input.val($('#sa_ul').children().eq(numspan).text());
        // };
    });
    $('#sa_ul').children().mouseover(function () {
        numspan = $(this).index();
        for (var i = 0; i < length; i++) {
            if (numspan == i) {
                active(i);
            } else {
                defaut(i);
            }
        }
        input.val($('#sa_ul').children().eq(numspan).text());
    });

    // $('#sa_ul').children().click(function() {
    //     numspan = $(this).index();
    //     input.val($('#sa_ul').children().eq(numspan).text());
    //     // input.val($('#sa_ul').children().eq(numspan).html());

    // });
}


            //搜索框中关键字的highlight
    // function highlightByClass(keywords,className){
    //     var array = keywords.split(" "); //分割

    //     var targetContent=document.getElementsByClassName(className);
    //     for ( var t = 0; t < targetContent.length; t++) {
    //         for ( var i = 0; i < array.length; i++) {
    //             //创建表达式，匹配替换
    //             var reg = new RegExp(array[i].replace(/,/, "|"), "gi");
    //             //替换重新写入
    //             targetContent[t].innerHTML = targetContent[t].innerHTML.replace(reg,"<strong>"++"</strong>");

    //             console.log(targetContent[t].innerHTML);
    //         }
    //     }

    // }


