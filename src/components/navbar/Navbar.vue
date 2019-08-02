<template>
  <header class="header">
    <div class="container">
      <nav>
        <div class="header-logo">
        </div>
        <div class="header-login">
          <ul>

            <li v-if="user" v-on:click="logout">Logout</li>
          </ul>
        </div>
        <div class="header-add">
          <!--
            <router-link v-bind:to="{name:'AddElement'}"><i class="fas fa-plus"></i></router-link>
          -->       
        </div>
      </nav>      
    </div>
  </header>

</template>

<script>
import sidebar from '@/components/navbar/sidebar'
import firebase from  'firebase'
export default {
  name: 'Navbar',
  data(){
    return {
      user: null,
    }
  },
  methods:{
    logout(){
      firebase.auth().signOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
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