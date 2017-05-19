/*
* spa.js
* Модуль корневого пространства имен
*/
/*Создание пространства имен spa*/
var spa = (function () {
  var initModule = function ( $container ) {
    spa.shell.initModule( $container );
  };
  return {initModule: initModule};
}());
