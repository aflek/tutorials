Vue.component('datepicker', {
  template: '<div class="datepicker-wrap">'

  + '<div class="datepicker" :style="{width:width+\'px\'}">'
  + '  <input :value="value" readonly :disabled="disabled" :class="{focus:show}" @click="click" @mousedown="$event.preventDefault()"/>'
  + '  <a v-if="clearable&&value" @click.stop="clear"></a>'
  + '  <i @click="click"></i>'
  + '  <div class="datepicker-popup" :class="{\'datepicker-popup-left\':left}" v-if="show" transition="datepicker-popup" tabindex="-1" @blur="show = false" @mousedown="$event.preventDefault()" @keyup.up="changeMonth(-1,1)" @keyup.down="changeMonth(1,1)" @keyup.left="changeYear(-1,1)" @keyup.right="changeYear(1,1)" ref="popup">'
  //+ '     <div class="calendar-top" v-if="range">'
  //+ '        <template v-for="item in ranges">'
  //+ '           <i v-if="$index"></i><a v-text="item.name" @click="selectRange(item)"></a>'
  //+ '        </template>'
  //+ '     </div>'//calendar-top
  + '     <div :class="{\'calendar-range\':range}">'
  + '       <template v-for="no in count">'//Цикл для вывода нескольких календарей
  + '         <div class="calendar">'
  + '           <div class="calendar-header">'
  + '             <a class="calendar-prev-year" :title="prevYearTitle" @click="changeYear(-1,no)">«</a>'
  + '             <a class="calendar-prev-month" :title="prevMonthTitle" @click="changeMonth(-1,no)">‹</a>'
  + '             <a class="calendar-year-select" :title="selectYearTitle" @click="showYear(no)">{{strYear(no)}}</a>'
  + '             <a class="calendar-month-select" :title="selectMonthTitle" @click="showMonth(no)">{{strMonth(no)}}</a>'
  + '             <a class="calendar-next-month" :title="nextMonthTitle" @click="changeMonth(1,no)">›</a>'
  + '             <a class="calendar-next-year" :title="nextYearTitle" @click="changeYear(1,no)">»</a>'
  + '           </div>'//calendar-header
  + '           <table cellspacing="0" cellpadding="0">'
  + '              <tr><th v-for="day in days" v-text="day"></th></tr>'
  + '              <tr v-if="getDateArray(no)" v-for="i in 6">'
//<td v-for="j in 7" v-text="this[\'date\'+(no+1)][i * 7 + j].text" :title="this[\'date\'+(no+1)][i * 7 + j].title" :class="this[\'date\'+(no+1)][i * 7 + j].status" @click="select(this[\'date\'+(no+1)][i * 7 + j], no+1)"></td>'
  + '                 <td v-for="j in 7" v-text="getDateArrayElementText(no,i,j)" :title="getDateArrayElementTitle(no,i,j)" :class="getDateArrayElementStatus(no,i,j)" @click="select(no,i,j)"></td>'
  + '              </tr>'
  + '           </table>'
//TODO вывод панеле выбора года и месяца
//  + '           <div class="calendar-year-panel" transition="calendar-panel" v-if="this[\'showYear\'+(no+1)]">'
//  + '           <div class="calendar-year-panel" transition="calendar-panel" v-if="isShowYear(no)">'
//  + '              <a class="calendar-year-panel-prev" @click="changeYearRange(no+1,-1)"></a>'
//  + '              <a class="calendar-year-panel-year" v-for="item in this[\'years\'+(no+1)]" :class="item.status" @click="selectYear(item,no+1)">{{item.year+(en?"":"年")}}</a><a class="calendar-year-panel-next" @click="changeYearRange(no+1,1)"></a>'
//  + '           </div>'
//  + '           <div class="calendar-month-panel" transition="calendar-panel" v-if="this[\'showMonth\'+(no+1)]"><a v-for="item in this[\'months\'+(no+1)]" class="calendar-month-panel-month" :class="item.status" @click="selectMonth(item,no+1)">{{months[item.month-1].substr(0,3)}}</a>'
//  + '            </div>'
  + '          </div>'//calendar
  + '          <div class="calendar-separator" v-if="range&&no===1"><span>{{toTitle}}</span>'
  + '          </div>'
  + '        </template">'
  + '     </div>'//calendar-range
  + '     <div class="calendar-bottom" v-if="range"><a class="calendar-btn ok" @click="ok">{{okTitle}}</a>'
  + '     </div>'
  + '  </div>'//datepicker-popup
  + '</div>'//datepicker
  + '</div>',//datepicker-wrap
  props: {
    //Язык
    lang: {
      type: String,
      default: 'en'
    },
    //Если нужно два календаря
    range: {
      type: Boolean,
      default: false
    },
    //Ширина всего контейнера datapicker
    width: {
      default: 214
    },
    time: {
      type: String,
      default: ''
    },
    //По умолчанию календар доступен для выбора
    disabled: {
      type: Boolean,
      default: false
    },
    //Наличие кнопки с крестиком, для очистки поля ввода
    clearable: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: Number
    },
    endTime: {
      type: Number
    },
    maxRange: {
//TODO
    },
    clearable: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    onConfirm: Function
  },
  data: function(){
    return {
      show: false,
      showYear1: false,
      showYear2: false,
      showMonth1: false,
      showMonth2: false,
      left: false,
      ranges: [],
      years1: [],
      years2: [],
      months1: [],
      months2: [],
      date1: null,
      date2: null,

      time1: this.parse(this.startTime, false) || this.parse(this.time, false),
      time2: this.parse(this.endTime, true),
      now1: this.parse(new Date(), false),
      now2: this.parse(new Date(), true),
      count: this.range ? 2 : 1 //кол-во календарей
    };

  },//data
  computed: {
    days: function() {
      var arrDays = []
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          arrDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
          break;
        case 'cn':
          arrDays = ['一', '二', '三', '四', '五', '六', '日'];
          break;
        default:
          arrDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
      };
      return arrDays;
    },
    months: function() {
      var arrMonths = [];
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          arrMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
          break;
        case 'cn':
          arrMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
          break;
        default:
          arrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      };
      return arrMonths;
    },
    prevYearTitle: function() {
      var title = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          title = 'предыдущий год';
          break;
        case 'cn':
          title = '上一年';
          break;
        default:
          title = 'last year';
      };
      return title;
    },
    prevMonthTitle: function() {
      var title = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          title = 'предыдущий месяц';
          break;
        case 'cn':
          title = '上个月';
          break;
        default:
          title = 'last month';
      };
      return title;
    },
    selectYearTitle: function() {
      var title = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          title = 'выбрать год';
          break;
        case 'cn':
          title = '选择年份';
          break;
        default:
          title = 'select year';
      };
      return title;
    },
    selectMonthTitle: function() {
      var title = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          title = 'выбрать месяц';
          break;
        case 'cn':
          title = '选择月份';
          break;
        default:
          title = 'select month';
      };
      return title;
    },
    nextMonthTitle: function() {
      var title = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          title = 'следующий месяц';
          break;
        case 'cn':
          title = '下个月'
          break;
        default:
          title = 'next month';
      };
      return title;
    },
    nextYearTitle: function() {
      var title = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          title = 'следующий год';
          break;
        case 'cn':
          title = '下一年'
          break;
        default:
          title = 'next year';
      };
      return title;
    },
    value: function() {
      if (this.range) {
        if (this.startTime && this.endTime) {
          return this.stringify(this.parse(this.startTime, false)) + ' ~ ' + this.stringify(this.parse(this.endTime, false));
        } else {
          return '';
        }
      } else {
        return this.stringify(this.parse(this.time, false));
      }
    },
    toTitle: function() {
      strTmp = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          strTmp = 'По';
          break;
        case 'cn':
          strTmp = '至';
          break;
        default:
          strTmp = 'To';
      };
      return strTmp;
    },
    okTitle: function() {
      strTmp = '';
      var lang_code = this.lang;
      switch(lang_code) {
        case 'ru':
          strTmp = 'Выбрать';
          break;
        case 'cn':
          strTmp = '确定';
          break;
        default:
          strTmp = 'OK';
      };
      return strTmp;
    }
  },//computed
  watch: {
    show: function(val) {
//TODO
    },
    now1: function() {
      this.updateAll();
    },
    now2: function() {
      this.updateAll();
    }
  },
  methods: {
    isShowYear: function(no) {
      //console.log('isShowYear: ' + this['showYear'+no]);
      return this['showYear'+no];
    },
    //Получение набора массива дат для каленадря
    //date1 или date2 в зависимости от "no" в аргументе функции
    getDateArray: function(no){
      return this['date'+no];
    },
    //Получит значение из массива
    //date1 или date2 в зависимости от "no" в аргументе функции
    getDateArrayElementText: function(no,i,j) {
      var strDate = this['date'+no];
      var pozition = (i-1) * 7 + (j-1);//в версии 1.0 цикл "i in 6" означал от 0 до 6, в 2.0. от 1 до 6
      return strDate[pozition].text;
    },
    getDateArrayElementTitle: function(no,i,j) {
      var strDate = this['date'+no];
      var pozition = (i-1) * 7 + (j-1);
      return strDate[pozition].title;
    },
    getDateArrayElementStatus: function(no,i,j) {
      var strDate = this['date'+no];
      var pozition = (i-1) * 7 + (j-1);
      return strDate[pozition].status;
    },
    //Месяц для вывода в заголовок календаря
    strMonth: function(no) {
      //return months[this['now'+(no+1)].getMonth()];
      return this.months[this['now'+no].getMonth()];
    },
    //Год для вывода в заголовок календаря
    strYear: function(no) {
      return this['now'+no].getFullYear();
    },
    //На вход передаем строку time в формате '2017-03-20'
    //На выходе получаем объект типа Date.
    //Если isLast = false, то время будет у объекта на начало суток: 00:00:00
    //Если isLast = true, то время будет у объекта на конец суток: 23.59.59
    parse: function(time, isLast) {
      if (time) {
        var tmpTime = new Date(time);
        if (isLast === undefined) {
          return tmpTime;
        } else if (isLast) {
            return new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate(), 23, 59, 59, 999);
        } else {
            return new Date (tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate());
        }
      }
      return null;
    },
    initRanges: function() {
      var time = new Date(),
          ranges = [];
      ranges.push({
        name: 'today',
        start: this.parse(time, false),
        end: this.parse(time, true)
      });
      time.setDate(time.getDate() - 1);
      ranges.push({
        name: 'yesterday',
        start: this.parse(time, false),
        end: this.parse(time, true)
      });
      time = new Date();
      time.setDate(time.getDate() - 6);
          ranges.push({
          name: 'week_before',
          start: this.parse(time, false),
          end: this.parse(new Date(), true)
      });
      time = new Date();
      time.setMonth(time.getMonth() + 1, 0);
      ranges.push({
          name: 'this_month',
          start: new Date(time.getFullYear(), time.getMonth(), 1),
          end: this.parse(time, true)
      });
      time = new Date();
      time.setMonth(time.getMonth(), 0);
      ranges.push({
          name: 'month_before',
          start: new Date(time.getFullYear(), time.getMonth(), 1),
          end: this.parse(time, true)
      });
      time = new Date();
      time.setDate(time.getDate() - 29);
          ranges.push({
          name: 'last_month',
          start: this.parse(time, false),
          end: this.parse(new Date(), true)
      });
      time = new Date();
      time.setDate(time.getDate() - 365);
      ranges.push({
          name: 'year_before',
          start: this.parse(time, false),
          end: this.parse(new Date(), true)
      });
      //console.log(ranges[0]);
      this.ranges = ranges;

    },
    updateAll: function() {
      this.update(new Date(this.now1), 1);
      this.range && this.update(new Date(this.now2), 2);
    },
    click: function() {
      var self = this;
      self.time1 = self.parse(self.startTime) || self.parse(self.time);
      self.now1 = self.parse(self.startTime) || new Date();
      //Если нужно более одного календаря
      if (self.range) {
        self.initRanges();
        self.time2 = self.parse(self.endTime);
        self.now2  = self.parse(self.endTime) || new Date();
      }
      var rect = this.$el.getBoundingClientRect(),
          right = document.documentElement.clientWidth - rect.left;
      (right < (self.range ? 441 : 214) && right < rect.left) ? (self.left = true) : (self.left = false);
      self.show = !self.show;

    },//click
    //Обработка клика на дату в календаре - выбор даты
    select: function(no,i,j){
      var self = this;
      self.hidePanel();
      //TODO -- вынести этот блок в отдельную функцию, повторов много в коде  см.выше методы getDateArray....
      var strDate = this['date'+no];
      var pozition = (i-1) * 7 + (j-1);
      item = strDate[pozition]//--
      //Если дата серая, т.е. должна быть недоступна для выбора
      if (item.status.indexOf('calendar-disabled') !== -1) {
        return;
      }
      self['now' + no] = new Date(item.time);
      //console.log('now' + no + ' = ' +self['now' + no]);
      self['time' + no] = new Date(item.time);
      //console.log('time' + no + ' = ' +self['time' + no]);
      //console.log(self.range)
      if (!self.range) {
        //console.log('self.time:' + self.time);
        //console.log('item.time:' + item.time);
//TODO debug

        self.time = self.getOutTime(item.time);
        self.show = false;
      } else if (!self.confirm) {
        //console.log('!!!');
        self[no === 1 ? 'startTime' : 'endTime'] = self.getOutTime(item.time);
      }
    },
    //Нажатие на кнопку Ок после выбора диаппазона дат
    ok: function() {
      var self = this;
      self.show = false;
      if (self.range && self.confirm) {
        self.startTime = self.getOutTime(self.time1);
        self.endTime = self.getOutTime(self.time2);
        self.onConfirm && self.onConfirm(self.startTime, self.endTime);
      }
    },
    selectRange: function(item) {
      var self = this;
      self.now1 = new Date(item.start);
      self.now2 = new Date(item.end);
      self.time1 = new Date(item.start);
      self.time2 = new Date(item.end);
      self.startTime = self.getOutTime(item.start);
      self.endTime = self.getOutTime(item.end);
      self.hidePanel();
    },

    getOutTime: function(time) {
//TODO debug for select method

      var type = this.time ? typeof(this.time) : typeof(this.startTime);
      //console.log(type);
      if (type === 'number') {
        return time.getTime();
      } else if (type === 'object') {
        return new Date(time);
      } else {
        //console.log(this.stringify(time));
        return this.stringify(time);
      }
    },
    //Делаем массив для календаря
    update: function(time, no) {
      var i, tmpTime, curFirstDay, lastDay, curDay, day, arr = [];
      time.setDate(0);//устанавливаем дату последнего деня предыдущего месяца
      curFirstDay = time.getDay();//День недели в виде числа 0-Воскресенье 1-Понедельник и т.д.
      lastDay = time.getDate();
      //Календарь начинается с понедельника, т.е. день недели=1.
      //Делаем в цикле обратный отсчет до понедельника включительно
      //Пишем дни предыдущего месяца в пассив
      for (i = curFirstDay; i > 0; i--) {
        day = lastDay - i + 1;
        tmpTime = new Date(time.getFullYear(), time.getMonth(), day);
        tmpTime = this.parse(tmpTime, no === 2);
//console.log(i + ' - ' + tmpTime + ' - ' + this.stringify(tmpTime));
        arr.push({
          status: this.getTimeStatus(tmpTime, no),
          title: this.stringify(tmpTime),
          text: day,
          time: tmpTime
        });
      }
      //Здесь пишем в массив даты текущего месяцы
      time.setMonth(time.getMonth() + 2, 0);
      curDay = time.getDate();
      time.setDate(1);
      for (i = 1; i <= curDay; i++) {
        tmpTime = new Date(time.getFullYear(), time.getMonth(), i);
        tmpTime = this.parse(tmpTime, no === 2);
//console.log(i + ' - ' + tmpTime + ' - ' + this.stringify(tmpTime));
        arr.push({
            status: this.getTimeStatus(tmpTime, no),
            title: this.stringify(tmpTime),
            text: i,
            time: tmpTime
        });
      }
      //матрица из 6 недель x 7 дней = 42
      //выше она уже заполнена частично днями из предыдущего месяца + текущего
      //Дополняем ее до конца - до 42 двух шт.
      for (i = 1; arr.length < 42; i++) {
        tmpTime = new Date(time.getFullYear(), time.getMonth() + 1, i);
        tmpTime = this.parse(tmpTime, no === 2);
//console.log(i + ' - ' + tmpTime + ' - ' + this.stringify(tmpTime));
        arr.push({
            status: this.getTimeStatus(tmpTime, no) || 'calendar-nextmonth',
            title: this.stringify(tmpTime),
            text: i,
            time: tmpTime
        });
      }
      this['date' + no] = arr;
    },
    getTimeStatus: function(time, no, format) {
      var status = '',curTime = new Date(),
          selTime = this['time' + no],
          tmpTimeVal = this.stringify(time, format || 'yyyy-MM-dd'),
          curTimeVal = this.stringify(curTime, format || 'yyyy-MM-dd'), //текущее значение
          selTimeVal = this.stringify(selTime, format || 'yyyy-MM-dd');
      if (tmpTimeVal === selTimeVal) {
        status = 'calendar-selected';
      } else if (tmpTimeVal === curTimeVal) {
        status = 'calendar-today';
      }
      if (this.time1 && this.time2 && time >= this.time1 && time <= this.time2) {
          status += ' mz-calendar-inrange';
      }
      if (no == 1 && this.time2) {
        var minTime = new Date(this.time2);
        if (this.maxRange) {
          minTime.setDate(minTime.getDate() - this.maxRange);
          if (format === 'yyyy') {
            minTime = new Date(minTime.getFullYear(), 0, 1);
          }
          if (format === 'yyyy-MM') {
            minTime = new Date(minTime.getFullYear(), 0, 1);
          }
          if (time < minTime || time > this.time2) {
            status += ' calendar-disabled';
          }
        } else if (time > this.time2) {
          status += ' calendar-disabled';
        }
        if (time > this.time2) {
          status += ' calendar-disabled';
        }
      }
      if (no == 2 && this.time1) {
        var maxTime = new Date(this.time1);
        if (this.maxRange) {
          maxTime.setDate(maxTime.getDate() + this.maxRange);
          if (format === 'yyyy') {
            maxTime = new Date(maxTime.getFullYear(), 11, 1);
          }
          if (format === 'yyyy-MM') {
            maxTime = new Date(maxTime.getFullYear(), maxTime.getMonth() + 1, 1);
          }
          if (time > maxTime || time < this.time1) {
            status += ' calendar-disabled';
          }
        } else if (time < this.time1) {
          status += ' calendar-disabled';
        }
      }

      return status;
    },//getTimeStatus
    stringify: function(time, format) {
      if (!time) {
        return '';
      }
      format = format || this.format;
      var year = time.getFullYear(), //год
          month = time.getMonth() + 1, //месяц
          day = time.getDate(), //день
          hours24 = time.getHours(), //часы
          hours = hours24 % 12 === 0 ? 12 : hours24 % 12,
          minutes = time.getMinutes(), //минуты
          seconds = time.getSeconds(), //секунды
          milliseconds = time.getMilliseconds(); //милисекунды
      var map = {
          yyyy: year,
          MM: ('0' + month).slice(-2),
          M: month,
          dd: ('0' + day).slice(-2),
          d: day,
          HH: ('0' + hours24).slice(-2),
          H: hours24,
          hh: ('0' + hours).slice(-2),
          h: hours,
          mm: ('0' + minutes).slice(-2),
          m: minutes,
          ss: ('0' + seconds).slice(-2),
          s: seconds,
          S: milliseconds
      };
      return format.replace(/y+|M+|d+|H+|h+|m+|s+|S+/g, function(str) {
          return map[str];
      });
    },//stringify
    //Делаем массив годов для выбор года при клике на год в заголовке
    showYear: function(no) {
      var name = 'showYear' + no;
      this.hidePanel(name);
      this[name] = !this[name];
      var time = new Date(this['now' + no] || new Date()),
          num = Math.floor(time.getFullYear() % 10),
          arr = [];
      time.setDate(1);
      time.setFullYear(time.getFullYear() - num);
      //Формируем массив из 10 значений
      while (arr.length < 10) {
        no === 2 && time.setMonth(time.getMonth() + 1, 0);
        arr.push({
          year: time.getFullYear(),
          status: this.getTimeStatus(time, no, 'yyyy'),
        });
        time.setDate(1);
        time.setFullYear(time.getFullYear() + 1);
      }
      this['years' + no] = arr;

    },//showYear
    //Делаем массив месяцев для выбор года при клике на год в заголовке
    showMonth: function(no) {
      var name = 'showMonth' + no;
          this.hidePanel(name);
      this[name] = !this[name];
      var time = new Date(this['now' + no] || new Date()),
          arr = [];
      while (arr.length < 12) {
        time.setDate(1);
        time.setMonth(arr.length);
        no === 2 && time.setMonth(time.getMonth() + 1, 0);
        arr.push({
            month: arr.length + 1,
            status: this.getTimeStatus(time, no, 'yyyy-MM'),
        });
      }
      this['months' + no] = arr;
    },
    changeYearRange: function(no, flag) {
      var arr = this['years' + no],
          time = new Date(this['time' + no] || new Date());
      for (var i in arr) {
          var item = arr[i],
          year = item.year + 10 * flag;
          time.setDate(1);
          time.setFullYear(year);
          no === 2 && time.setMonth(time.getMonth() + 1, 0);
          item.year = year;
          item.status = this.getTimeStatus(time, no);
      }
    },
    //Сдвигаем год в now1 или now2 на величину flag
    changeYear: function(flag, no) {
      //"no" передаем либо 1 либо 2,
      var now = this['now' + no];//получаем значение now1 или now2
      //console.log('now' + no + ': ' + this['now' + no]);
      now.setDate(1);//присваиваем now дату = 1-е число текщего месяца
      now.setFullYear(now.getFullYear() + flag);//смещаем дату по годам на величину flag
      no === 2 && now.setMonth(now.getMonth() + 1, 0);//если now2, то смещаем ее на конец месяца, за счет параметра 0
      this['now' + no] = new Date(now);//в поле now1/now2 пишем новую дату
      //console.log('now' + no + ': ' + this['now' + no]);
      this.hidePanel();
    },
    //Сдвигаем месяц в now1 или now2 на величину flag
    changeMonth: function(flag, no) {
      var now = this['now' + no];
      now.setDate(1);
      now.setMonth(now.getMonth() + flag);
      no === 2 && now.setMonth(now.getMonth() + 1, 0);
      this['now' + no] = new Date(now);
      this.hidePanel();
    },
    selectYear: function(item, no) {
      if (item.status.indexOf('calendar-disabled') !== -1) {
        return;
      }
      var now = this['now' + no];
      now.setFullYear(item.year);
      this['now' + no] = new Date(now);
      this.hidePanel();
    },
    selectMonth: function(item, no) {
      if (item.status.indexOf('calendar-disabled') !== -1) {
        return;
      }
      var now = this['now' + no];
      now.setMonth(item.month - 1);
      this['now' + no] = new Date(now);
      this.hidePanel();
    },
    //Управение скрытием панелей
    hidePanel: function(name) {
      ['showYear1', 'showYear2', 'showMonth1', 'showMonth2'].map(function(item) {
         if (item !== name) {
         this[item] = false;
         }
      }.bind(this));
    },
    clear: function() {
      var self = this;
//TODO - выдает предупреждение при клике на иконке с крестиком
      //self.time1 = self.time2 = self.startTime = self.endTime = self.time = null;
      self.now1 = new Date();
      self.now2 = new Date();
    },//clear

  }//methods
});
