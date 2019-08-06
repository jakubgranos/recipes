<template>
  <section class="auth login" v-bind:class="{display: display}">
    <div class="container auth-wrapper">
      <form v-on:submit.prevent="Login" class="auth-form">
        <h2>Zaloguj się</h2>
        <div class="page-card-field">
          <label for="email">Email:</label>
          <input type="email" name="email" v-model="email">        
        </div>
        <div class="page-card-field">
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="password">
        </div>
        <p class="feedback" v-if="feedback">{{feedback}}</p>
        <div class="auth-action">
          <button>Login</button>
          <div class="singup-link">
            <p><router-link :to="{name:'singup'}">Rejestracja</router-link></p>
          </div>        
        </div>
      </form>
      <div class="card">
        <div class="card-body">
          <h1 class="card-title">Kulinaria.pl - Odkrywaj nowe smaki razem ze znajomymi!</h1>
          <p class="card-text"><br>
            <ul>
              <li>Zapisuj swoje przepisy Online</li>
              <li>Dziel się ze znajomymi</li>
              <li>Szybka i Prosta w obsłudze </li>
            </ul>
          </p>
        </div>
      </div>
    </div>  
  </section>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'login',
  data(){
    return {
      email: null,
      password: null,
      feedback: null,
      display: false
    }
  },
  methods: {
    Login(){
      if(this.email && this.password){
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(cred => {
          this.$router.push({
            name: 'app-content'
          })
          this.feedback = null
        }).catch(err =>{
          this.feedback = err.message
        })

      }else{
        this.feedback = 'wypełnij wszystkie pola!'

      }
    },

  }
}
</script>
