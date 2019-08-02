<template>
  <section class="page-recipes">
    <app-sidebar></app-sidebar>    
    <article class="container-fluid">
      <div class="single-recipes-img">
        <img v-bind:src="recipes.img" alt="">
      </div>
      <div class="row">
        <div class="page-recipe-components col-lg-6">
          <div class="page-recipe-title">
            <h1> Przepis na {{this.$route.params.slug}}</h1>
              <p><i class="far fa-clock"></i>{{recipes.time + ' ' + 'min'}}</p>
              <p><i class="fas fa-thermometer-quarter"></i>{{recipes.levels}}</p>                  
              <p>Opis: {{recipes.description}}</p>
              <p>Kaloryczność tego dania wynosi: {{recipes.kcal}} kcal</p>
            </div>
            <ul>
              <li v-for="comp in recipes.components" class="components-list"><input type="checkbox">
                <span>{{comp.type}}</span>
                <span>{{comp.name + ' '}} </span>
                <span>{{comp.producent + ' ' + ' -'}} </span>
                <span>{{comp.kcal + ' ' + 'kcal'}} </span>                           
              </li>
            </ul> 
          </div>            
        <div class="page-recipe-steps col-lg-6">
          <ol>
            <li v-for="step in recipes.steps" >{{step}}</li>
          </ol>
        </div>          
      </div>     
    </article>
  </section>
</template>
<script>
import sidebar from '@/components/navbar/sidebar'
import database from '@/firebase/init'
import firebase from 'firebase'
export default {
  name: 'userView',
  components:{
    'app-sidebar': sidebar
  },
  data(){
    return{
      recipes: [],
      user: firebase.auth().currentUser
    }
  },
  created(){
    let ref =  database.collection('users').doc(this.user.email).collection('recipes').where('slug','==', this.$route.params.slug)
    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.recipes = doc.data()
        this.recipes.id = doc.id
      console.log(doc.data())
      })
    })
  }
}
</script>
