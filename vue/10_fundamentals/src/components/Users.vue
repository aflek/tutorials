<template>
  <div class="users">
    <h1>Users</h1>
    <form v-on:submit="addUser">
      <input type="text" v-model="newUser.name" placeholder="Enter Name">
      <br />
      <input type="text" v-model="newUser.email" placeholder="Enter Email">
      <br />
      <input type="submit" value="Submit">
    </form>
    <ul>
      <li v-for="user in users">
        <input type="checkbox"  class="toggle" v-model="user.contacted">
        <span :class="{contacted: user.contacted}">
          {{user.name}}: {{user.email}}
          <button v-on:click="deleteUser(user)">x</button>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'users',
    data () {
      return {
        newUser: {},
        users: [
          {
            name: 'John Doe',
            email: 'jdoe@gmail.com',
            contacted: false
          },
          {
            name: 'Steve Smith',
            email: 'ssmith@gmail.com',
            contacted: false
          },
          {
            name: 'Tom White',
            email: 'twhite@gmail.com',
            contacted: false
          }
        ]
      }
    },
    methods: {
      addUser: function (e) {
        this.users.push({
          name: this.newUser.name,
          email: this.newUser.email,
          contacted: false
        })
        e.preventDefault()
      },
      deleteUser: function (user) {
        this.users.splice(this.users.indexOf(user), 1)
      }
    }
  }
</script>


<style scoped>
  .contacted{
    text-decoration: line-through;
  }
</style>
