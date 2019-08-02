<template>
  <div class="sidebar">
    <div  class="hamburger" v-on:click="Toggle">
      <i class="fas fa-bars"></i>
    </div>
    <nav v-bind:class="{active: active}" class="naviagtion">
      <ul>
        <router-link :to="{name: 'app-content'}"><li>Strona Główna</li></router-link>
        <router-link :to="{name: 'profile', params:{email: user.email}}"><li>Profil</li></router-link>
        <router-link :to="{name: 'AddElement'}"><li>Dodaj przepis</li></router-link>
        <router-link :to="{name: 'list-ingredient'}"><li>Lista składnikow</li></router-link>  
        <router-link :to="{name: 'addingredient'}"><li>Dodaj składnik</li></router-link>                           
      </ul>
      <ul>
        <li>Zalogowany jako: <br>{{user.email}}</li>
        <li v-if="user" v-on:click="logout">Wyloguj</li>
        <li>Zgłoś błąd</li>
      </ul>
    </nav>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'sidebar',
  data(){
    return{
      user: firebase.auth().currentUser,
      active: true,
    }
  },
  methods:{
    logout(){
      firebase.auth().signOut()
      .then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    Toggle(){
      this.active =! this.active;
    }
  },
  created(){
    let user = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.user = user
      }else{
        this.user = null
      }
    })
  }
}
</script>
