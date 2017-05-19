spa.shell = (function () {
  //--------- НАЧАЛО ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ--
  var
    //В configMap помещаем статические конфигурационные параметры
    configMap = {
      main_html: String()
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo"></div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-chat"></div>'
        + '<div class="spa-shell-modal"></div>',
      chat_extend_time:     1000, //скорость анимации при разворачивании
      chat_retract_time:    300, //скорость анимации при сворачивании
      chat_extend_height:   450,//высота чата в развернутом виде
      chat_retract_height:  15,//высота чата в свернутом виде
      chat_extended_title:  'Щелкните, чтобы свернуть',
      chat_retracted_title: 'Щелкните, чтобы раскрыть'
    },
    //В stateMap помещаем динамическую информацию доступную внутри модуля
    stateMap = {
      $container: null,
      is_chat_retracted : true//этот ключ используется в в методе toggleChat.
    },
    //Кэшируем коллекции jQuery в объекте jqueryMap
    jqueryMap = {},
    //Список имен функций в области видимости модуля
    setJqueryMap, toggleChat, onClickChat, initModule;
  //--------- КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ---------
  //----------------- НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ -------------------
  //Эти функции не взаимодействуют с элементами страницы.


  //------------------ КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ -------------------

  //-------------------- НАЧАЛО МЕТОДОВ DOM ----------------------
  //Эти функции создают элементы на странице и манипулируют ими
  //1. Функция setJqueryMap служит для кэширования коллекций jQuery. Она должна
  //присутствовать практически во всех написанных нами оболочках и функциональных
  //модулях. Кэш jqueryMap позволяет существенно уменьшить количество проходов
  //jQuery по документу и повысить производительность.
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = {
      $container : $container,
      $chat: $container.find( '.spa-shell-chat' )
    };
  };
  //2. Функция toggleChat
  //Назначение : свернуть или раскрыть окно чата
  // Аргументы :
  // * do_extend – если true, раскрыть окно; если false – свернуть
  // * callback – необязательная функция, которая вызывается в конце анимации
  // Параметры :
  // * chat_extend_time, chat_retract_time
  // * chat_extend_height, chat_retract_height
  // Состояние : устанавливает stateMap.is_chat_retracted
  // * true – анимация окна чата начата
  // * false – анимация окна чата не начата
  toggleChat = function ( do_extend, callback) {
    var
      px_chat_ht = jqueryMap.$chat.height();
      is_open = px_chat_ht === configMap.chat_extend_height,
      is_closed = px_chat_ht === configMap.chat_retract_height,
      is_sliding = ! is_open && ! is_closed;

      //не начинаем операцию если окно чата находится в процессе анимации
      if ( is_sliding ) { return false; }

      //Раскрытие окна чата
      if ( do_extend ) {
        jqueryMap.$chat.animate(
          { height : configMap.chat_extend_height },
          configMap.chat_extend_time,
          //необязательная функция обратного вызова, которая вызывается по завершении анимации окна чата
          function () {
            jqueryMap.$chat.attr(
              'title', configMap.chat_extended_title
            );
            stateMap.is_chat_retracted = false;
            if ( callback ){ callback( jqueryMap.$chat ); }
          }
        );
        return true;
      };

      //Сворачивание окна чата
      jqueryMap.$chat.animate(
        { height : configMap.chat_retract_height },
        configMap.chat_retract_time,
        function () {
          jqueryMap.$chat.attr(
            'title', configMap.chat_retracted_title
          );
          stateMap.is_chat_retracted = true;
          if ( callback ){ callback( jqueryMap.$chat ); }
        }
      );
      return true;

  };
  //--------------------- КОНЕЦ МЕТОДОВ DOM ----------------------

  //---------------- НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ -----------------
  onClickChat = function ( event ) {
    toggleChat( stateMap.is_chat_retracted );
    return false;
  }
  //----------------- КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ -----------------

  //------------------- НАЧАЛО ОТКРЫТЫХ МЕТОДОВ ------------------
  //initModule используется для инициализации модуля.
  initModule = function ( $container ) {
    //загрузить HTML и кэшировать коллекции jQuery
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();

    // инициализировать окно чата и привязать обработчик щелчка
    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
        .attr( 'title', configMap.chat_retracted_title )
        .click( onClickChat );
    //тестировать переключение
    //setTimeout( function () {toggleChat( true ); }, 3000 );
    //setTimeout( function () {toggleChat( false );}, 8000 );
  };
  return { initModule : initModule };
  //----------------- КОНЕЦ ОТКРЫТЫХ МЕТОДОВ ---------------------
}());
