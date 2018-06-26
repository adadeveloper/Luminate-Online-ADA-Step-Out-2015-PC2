/* google_chart.js
 * Copyright 2008, Convio
 *
 * Provides Convio Utility functionality.
 * 
 * Depends on:
 * convio_config.js,
 * Google Charts
 *
 */
YAHOO.Convio.PC2.GoogleChart = {
    
    chartUrl: 'http://chart.apis.google.com/chart?cht=lc&chco=0077cc&chs=700x200&chf=bg,s,FFFFFF&chxt=x,y',
    
    days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    
    simpleEncoding: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',

    simpleEncode: function(valueArray,maxValue) {
        var chartData = ['s:'];
        for (var i = 0; i < valueArray.length; i++) {
            var currentValue = valueArray[i];
            if (!isNaN(currentValue) && currentValue >= 0) {
                chartData.push(this.simpleEncoding.charAt(Math.round((this.simpleEncoding.length-1) * currentValue / maxValue)));
            }
            else {
              chartData.push('_');
            }
        }
        return chartData.join('');
    },
    
    getDataScaling: function(maxValue) {
        var dsParam = '&chds=0,' + maxValue;
        return dsParam;
    },
    
    fixDay: function(day) {
        if(day == -1) {
            return 6;
        }
        return day;
    },
    
    getLabel: function(maxValue) {
        var date = new Date();
        var day = date.getDay();
        var dayM1 = this.fixDay(day - 1);
        var dayM2 = this.fixDay(dayM1 -1);
        var dayM3 = this.fixDay(dayM2 - 1);
        var dayM4 = this.fixDay(dayM3 -1);
        var dayM5 = this.fixDay(dayM4 -1);
        var dayM6 = this.fixDay(dayM5 -1);
        var labelParam = '&chxl=0:|'  /* X */
            + this.days[dayM6] + '|' + this.days[dayM5] + '|' 
            + this.days[dayM4] + '|' + this.days[dayM3] + '|' 
            + this.days[dayM2] + '|' + this.days[dayM1] + '|' 
            + this.days[day] 
            + '|1:|$0|$'  /* Y */ 
            + maxValue/5 + '|$' + maxValue/5*2 + '|$' 
            + maxValue/5*3 + '|$' + maxValue/5*4 + '|$' 
            + maxValue;
        return labelParam;
    },
    
    getData: function(valueArray, maxValue) {
        var dParam = '&chd=' + this.simpleEncode(valueArray, maxValue);
        return dParam;
    },
    
    getMarker: function() {
        var mParam = '&chm=o,0077cc,0,-1,10,0|B,e8f2fb,0,0,0';
        return mParam;
    },

    buildChart: function(valueArray, maxValue) {
        var url = this.chartUrl + this.getDataScaling(maxValue) + this.getLabel(maxValue) + this.getData(valueArray, maxValue) + this.getMarker();
        return url;
    }
};
