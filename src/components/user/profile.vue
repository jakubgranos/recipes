<template>
  <section class="page-profile">
    <app-sidebar></app-sidebar>
    <div class="profile">
      <div class="page-card-border"></div>        
      <div class="container-fluid">
        <div class="search">
          <input type="text" name="search" v-model="search"  placeholder="Szukaj na stronie...">
          <p class="feedback" v-if="feedback">{{feedback}}</p>
        </div>        
        <div class="row">
          <div class="col-lg-4 col-sm-12 page-card-box" v-for="recipe in filteredRecipe" v-bind:key="recipe.id">
            <router-link :to="{name: 'userView', params:{slug: recipe.slug}}">
            <div class="page-card-image">
              <img v-bind:src="recipe.img" id="img" v-bind:alt="recipe.title">
            </div>            
            <div class="page-card-title">
              <h3>{{recipe.title}}</h3>
            </div>
            <div class="page-card-about">
              <p><i class="far fa-clock"></i>{{recipe.time + ' ' + 'min'}}</p>
              <p><i class="fas fa-thermometer-quarter"></i>{{recipe.levels}}</p>
              <p>Opis:{{recipe.description}}</p>
            </div>              
            </router-link>
            <div class="profile-action">
              <i class="fas fa-trash" v-on:click="deleteElement(recipe.id)"></i>
              <router-link :to="{name: 'edit', params:{slug: recipe.slug}}"><i class="fas fa-pencil-alt"></i></router-link>            
              <i class="fas fa-share-alt"
              v-on:click="share(recipe.img, recipe.id, recipe.title, recipe.slug, recipe.description, recipe.levels, recipe.time, recipe.components, recipe.steps)"></i>
            </div>
          </div>
        </div>       
      </div>
    </div>  
  </section>
</template>
<script>
import database from '@/firebase/init'
import sidebar from '@/components/navbar/sidebar'
import firebase from 'firebase'
import moment from 'moment'
import { setTimeout, setInterval } from 'timers';
export default {
  name: 'profile',
  props: ['email'],
  components:{
    'app-sidebar': sidebar
  },
  data () {
    return {
      recipes: [],
      user: firebase.auth().currentUser,
      shareAll: [],
      feedback: null,
      search: '',
      timestamp: [],
      recipesAlt: null
    }
  },
  methods:{
    deleteElement(id){
      database.collection('users').doc(this.user.email).collection('recipes').doc(id).delete()
      .then(() =>{
        this.recipes = this.recipes.filter(recipe => {
          return recipe.id != id
        })
      })
    },
    share(img, id, title, slug, description, levels, time, components, steps){
      database.collection('users').doc(this.user.email).collection('recipes').doc(id).get()
      .then(() =>{
      database.collection('recipes').add({
        title: title,
        slug: slug,
        email: this.user.email,
        description: description,
        levels: levels,
        time: time,
        components:components,
        steps: steps,
        img: img       
      })
      }).catch(err => {
        this.feedback = 'Server napodkal problem :/'
      })
      this.feedback ="Pomyślnie dodano na stronę główną"
    },
  },
  beforeCreate(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.user = user
      }else{
        this.user = null
      }
    })
    
  },
  created(){ 
    let ref = database.collection('users').doc(this.user.email).collection('recipes').orderBy('timestamp', 'asc')
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type == 'added'){
          let doc = change.doc
          let docs = doc.data()
          docs.id = doc.id
          this.recipes.push(docs)
        }
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

