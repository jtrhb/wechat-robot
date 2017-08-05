var message = require('../lib/message');

module.exports = {
    '/天气/': function(msgContent, casperIns){
        var local = msgContent.replace(/ |天气/,'');
        var resource = 'http://wthrcdn.etouch.cn/weather_mini?city=' + encodeURIComponent(local);

        //在页面使用ajax请求
        var data = casperIns.evaluate(function (resource) {
            $.get(resource, function (data) {window.to_casper_weather = data;})
        }, resource);

        casperIns.waitFor(function checkWeather() {
            return casperIns.evaluate(function () {
                return window.to_casper_weather
            })
        }, function () {
            var weather = JSON.parse(casperIns.evaluate(function () {
                var weather = window.to_casper_weather;
                window.to_casper_weather = null;
                return weather;
            }))
            casperIns.evaluate(function () {
                return window.to_casper_weather=null
            })
            if(weather.status==1000){
                message.send(casperIns, 'local天气：\n\r' + formatWeather(weather)) 
            }else{
                message.send(casperIns, '未查找到相关天气信息。请尝试输入格式如"广州天气"。') 
            }
            
        }, function () {
            console.log('请求天气超时...')
        }, 10000)
    },

    '/火车票/': function(msgContent, casperIns){
        message.send(casperIns, '此指令正在开发...'); 
    },

    '/彩票/': function(msgContent, casperIns){
        message.send(casperIns, '此指令正在开发...');
    }
}



function formatWeather(weather){
    // console.log(JSON.stringify(weather));
    // var weather = typeof(weather) == 'Object'? weather: JSON.parse(weather);
    weather = weather.data;
    var str = '';
    for(var i in weather.forecast[0]){
        if(i == 'data'){
            str += weather.forecast[0][i] + "\n\r";
        }else{
            str += weather.forecast[0][i] + '  '
        }
    }

    str+='\n\r';

    for(var i in weather.forecast[1]){
        if(i == 'data'){
            str += weather.forecast[1][i] + "\n\r";
        }else{
            str += weather.forecast[1][i] + '  '
        }
    }

    if(weather.ganmao){
        str+='\n\r\n\r[玫瑰]' + weather.ganmao + '[玫瑰]';
    }
    return str;
}