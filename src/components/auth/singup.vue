<template>
  <div class="auth singup">
    <div class="container auth-wrapper">
    <form v-on:submit.prevent="singup" class="auth-form">
      <h1>Zarejestruj się</h1>
      <div class="page-card-field">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model="email">        
      </div>     
      <div class="page-card-field">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model="password">
      </div>
      <p class="auth-feedback" v-if="feedback">{{feedback}}</p>
      <div class="action">
        <button>Singup</button>
          <div class="singup-link">
            <p><router-link :to="{name:'login'}">Logowanie</router-link></p>
          </div>                 
      </div>
    </form>
      <div class="card">
        <div class="card-body">
          <h2 class="card-title">Kulinaria.pl - Odkrywaj nowe smaki razem ze znajomymi!</h2>
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
  </div>
</template>
<script>
import database from '@/firebase/init'
import firebase from 'firebase'
export default {
  name: 'singup',
  data(){
    return {
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    singup(){
      if(this.email && this.password){
        let ref = database.collection('users').doc(this.email)
        ref.get().then(doc =>{
          if(doc.exists){
            this.feedback = 'ten email ma już swoje konto'
          }else{
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then( cred => {
              ref.set({
                email: this.email,
                password: this.password,
              })
            })
            .then(() => {
              this.$router.push({
                name:'app-content',
              })
            })
            .catch(err => {
              this.feedback = err.message
            })
          }
        })

      }else{
        this.feedback = 'prosze uzupelnić wszystkie pola!'
      }
    }
  }
}
</script>