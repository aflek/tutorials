<template>
  <div class="test">

    <!--Заголовок выводим через v-html-->
    <div v-html="title"></div>
    <hr />

    <!--Этот блок показываем если showName: true-->
    <div v-if="showName">
      <!--Basic interpolation-->
      <span>{{user.firstName}}</span>
      <!--Вывод через v-text-->
      <span v-text="user.lastName"></span>
    </div>
    <!--Этот блок показываем если showName: false-->
    <div v-else>
      <p>Nobody</p>
    </div>
    <hr />

    <!--Цикл-->
    <div>
      <ul>
        <li v-for="item in items">{{item.title}}</li>
      </ul>
    </div>
    <hr />

    <!--Обновление текста через input-->
    <div>
      <input type="text" v-model="message"><br />
      <div v-text="message"></div>
    </div>
    <hr />

    <!--Событие-->
    <div>
      <button v-on:click="greet('Hello')">Say Greeting</button>
    </div>
    <hr />
    <div>
      <p>Введите текст. Нажимте любую клавишу. В консоле увидете введенные символы.<br />
        Нажмете Enter увидете в консоли сообщение 'You hit enter'
      </p>
      <input  type="text" v-on:keyup="pressKey" v-on:keyup.enter="enterHit">
    </div>
    <hr />
    <!--Вычисляемое свойство-->
    <div>
      <label>First Name:</label><input type="text" v-model="user.firstName">
      <br />
      <label>Last Name:</label><input type="text" v-model="user.lastName">
      <br />
      <h3>{{fullName}}</h3>
    </div>

    <h2>{{msg}}</h2>
  </div>
</template>

<script>

  export default {
    name: 'test',
    props: {
      msg: {
        type: String,
        default: 'Foobar'
      }
    },
    data () {
      return {
        title: '<h1>Hello world</h1>',
        user: {
          firstName: 'John',
          lastName: 'Doe'
        },
        showName: true,
        items: [
          {title: 'Item One'},
          {title: 'Item Two'},
          {title: 'Item Three'}
        ],
        message: 'This is my message'
      }
    },
    methods: {
      greet: function (greeting) {
        alert(greeting)
      },
      pressKey: function (e) {
        console.log(e.target.value)
      },
      enterHit: function () {
        console.log('You hit enter')
      }
    },
    computed: {
      fullName: function () {
        return this.user.firstName + ' ' + this.user.lastName
      }
    }
  }
</script>


<style scoped>

</style>
