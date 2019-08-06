<template>
  <section class="page-content">
    <app-sidebar></app-sidebar>
    <div class="content">
      <div class="page-card-border"></div>
      <div class="container-fluid">
        <div class="search">
          <input type="text" name="search" v-model="search" placeholder="Szukaj na stronie...">
        </div>
        <div class="row">
          <div class="col-lg-4 col-sm-12 page-card-box" v-for="recipe in filteredRecipe" :key="recipe.id">
            <router-link :to="{name: 'recipes', params:{slug: recipe.slug}}">
            <div class="page-card-image ">
              <img v-bind:src="recipe.img" v-bind:alt="recipe.title">
            </div>
            <div class="page-card-title">
              <h3>{{recipe.title}}</h3>
              <p>Autor: {{recipe.email}}</p>
            </div>
            <div class="page-card-about">
              <p><i class="far fa-clock"></i>{{recipe.time + ' ' + 'min'}}</p>
              <p><i class="fas fa-thermometer-quarter"></i> {{recipe.levels}}</p>
              <p>Opis: {{recipe.description}}</p>
            </div>
            </router-link>
          </div>
        </div>
      </div>      
    </div>
  </section>    
</template>
<script>
import database from '@/firebase/init'
import firebase from 'firebase'
import sidebar from '@/components/navbar/sidebar'
export default {
  name: 'app-content',
  components:{
    'app-sidebar': sidebar
  },
  data () {
    return {
      recipes: [],
      user: firebase.auth().currentUser,      
      username: null,
      search: ''
    }
  },
  created(){
    database.collection('recipes').orderBy("title", "asc").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let recipe = doc.data()
        recipe.id = doc.id
        recipe.img = doc.data().img
        this.recipes.push(recipe)
      });
    })
  },
  computed: {
    filteredRecipe: function(){
      return this.recipes.filter((recipe) =>{
        return recipe.title.toLowerCase().match(this.search.toLowerCase())
      })
    }
  }
}
</script>
