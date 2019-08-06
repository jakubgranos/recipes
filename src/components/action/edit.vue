<template>
  <section class="page-action">
    <app-sidebar></app-sidebar>        
    <div class="container-fluid">     
      <div class="row">
        <div class="col-lg-6 col-sm-12 moblie-gray">
          <form v-on:submit.prevent="submitRecipe" class="page-action-form">
            <div class="page-card-field">
              <label for="title">Tytuł przepisu</label><br>
              <input type="text" name="title" v-model="recipes.title">
            </div>
            <div class="page-card-field">
              <label for="description">Opis:</label><br>
              <textarea name="description" placeholder="Opis przepisu..." v-model="recipes.description"></textarea>
            </div>
            <div class="page-card-field card-button">
              <label for="steps" class="steps">Kroki przygotowania:</label><br>
              <textarea name="steps" v-on:keydown.tab.prevent="addSteps" v-model="newSteps" placeholder="Obierz ziemniaki...">etap tworzenia...</textarea>
              <button v-on:click.prevent="addSteps">Dodaj krok</button>
            </div>            
            <div class="page-card-field card-button">
              <label for="list">Wybierz składnik z listy:</label>
              <form @submit.prevent="addElement">
                <label for='amount'>Wpisz ilosć gram:</label>
                <input type="number" v-model="amount">
                  <app-products v-bind:newElement="newElement" v-on:changeValue="updateValue($event)"></app-products>
                <div class="amount_type">
                  <label>Wpisz typ:</label>
                </div>                            
                <button >dodaj składnik</button>
              </form>
            </div>
            <div class="page-card-field difficulties">
              <div class="levles">
                <label for="levels">Trudność</label><br>
                <select name="levels" v-model="recipes.levels" required>
                  <option value="Bardzo łatwy">Bardzo łatwy</option>
                  <option value="łatwy">łatwy</option>
                  <option value="Średni">Średni</option>
                  <option value="Trudny">Trudny</option>
                </select>
              </div>
              <div class="time">
                <label for="time">Czas wykonania:</label><br>
                <input type="number" name="time" min="1" max="999" v-model="recipes.time" > 
              </div>                         
            </div>                                    
            <div class="page-card-field">
              <button>Dodaj przepis</button>
            </div>
            <p v-if="feedback" class="feedback">{{feedback}}</p>                        
          </form>
        </div>
          <div class="col-lg-6 col-sm-12 recipes-box">
            <div class="page-card-image">
              <div class="action-image">
                <label for="recipes-img"  class="action-image-button" v-if="recipes.title">
                  <i class="fas fa-image"></i>
                  <p>kliknij aby wybrać zdjecie</p>
                </label>
                <input type="file" accept="image/png, .jpeg, .jpg," name="img[]" id="recipes-img" @change="fileSelect">                
              </div>
              <img v-bind:src="recipes.img" id="img" v-bind:alt="title" class="imgSelected">
            </div>             
            <div class="page-card-title">
              <h3>Tytuł: {{recipes.title}}</h3>
            </div>
            <div class="page-card-about">
              <div class="page-card-content">
                <p><i class="far fa-clock"></i>Czas wykonania: {{recipes.time + ' ' + 'min'}}</p>
                <p><i class="fas fa-thermometer-quarter"></i> Stopien trudności: {{recipes.levels}}</p>
              </div>
              <div class="page-card-content">
                <h3>Opis</h3>
                <p>{{recipes.description}}</p>
              </div>
              <div class="page-card-content">
                <h3>Kroki przugotowania:</h3>
                <ol>
                  <li v-for="(myStep, index) in recipes.steps" :key="index">{{myStep}}
                  <i class="fas fa-trash" v-on:click="deleteStep(myStep)"></i></li>
                </ol>                
              </div>
              <div class="page-card-content">
                <h3>Składniki</h3>
                <ol class="components-list">
                  <li v-for="(comp, index) in recipes.components" :key="index">
                    <span>{{comp.amount + 'g ' + '- '}}{{comp.name + ', ' + comp.producent + ', ' + 'kalorie: ' + comp.kcal}}
                    <i class="fas fa-trash" v-on:click="deleteElement(comp)"></i>
                    </span>
                    <span>Weglowodany: {{comp.carbohydrates}} g</span>
                    <span>tłuszcze: {{comp.fat}} g</span>
                    <span>Białko: {{comp.protein}} g</span>
                    <span>Sól: {{comp.salt}} g</span>
                    <span>Cukry: {{comp.sugar}} g</span>                    
                  </li>
                  <span>Suma kalori w daniu: <b>{{calc}} kcal</b></span>
                </ol>                
              </div>
            </div>
          </div>
      </div>
    </div>

  </section>
</template>
<script>
import database from '@/firebase/init'
import firebase from 'firebase'
import slugify from 'slugify'
import sidebar from '@/components/navbar/sidebar'
import { constants } from 'fs';
import { setInterval } from 'timers';
import products from '@/components/action/handleProductsChange'
export default {
  name: 'edit',
  components:{
    'app-sidebar': sidebar,
    'app-products': products
  },
  data() {
    return {
      user:firebase.auth().currentUser,
      time: 0,
      title: null,
      slug: null,
      levels: null,
      feedback: null,
      newSteps: null,
      description: null,
      steps: [],
      recipes: [],
      timestamp: null,
      selectedFile: null,
      listContent: [],
      newElement: [],
      components: [],
      listValue: [],
      calc: null,
      amount: null,
      numberOfType: [],
      image: [],
   }
  },
  methods: {
    updateValue: function(updatedValue){
      this.listValue = updatedValue
    },
    fileSelect ({ target: { files: {0: file} } }) {
      const storageRef = firebase.storage().ref();
      const uploadFile = storageRef.child(`${this.user.email}/${file.name}`).put(file);
      uploadFile.then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => this.image = url )
      },error => {
        console.error(error);
      })
    },
    addElement(){
      if(this.newElement){  
        this.listValue.amount = Number(this.amount)
        this.recipes.components.push(this.listValue)
        let myMath = this.recipes.components.map(item => item.kcal)
        this.calc = Math.floor(myMath.reduce((a, b) => a + b, 0) * this.amount / 100)
      }else {
        this.feedback = "Musisz uzupełnić wszystkie pola"
      }
    },   
    submitRecipe(){
      if(this.recipes.title){
        this.feedback = null
        this.recipes.slug = slugify(this.recipes.title, {
          replacement: '-',
          remove:/[*+~.()'"!:@]/g,
          lower: true
        })
      if(this.recipes.components.length > 2){
        database.collection('users').doc(this.user.email).collection('recipes').doc(this.recipes.id).update({
            title: this.recipes.title,
            slug: this.recipes.slug,
            components: this.recipes.components,
            time: this.recipes.time,
            steps: this.recipes.steps,
            levels: this.recipes.levels,
            description: this.recipes.description,
            timestamp: new Date(),
            kcal: this.calc, 
            img: this.image
          }).then(()=>{
            this.feedback = 'Pomyślnie dodano do twojego profilu'
          }).catch(err =>{
            this.feedback = err
          })
        }else{
          this.feedback = "muszą być minimum 3 składniki oraz 3 kroki"
        }
      }else{
        this.feedback = 'Musisz uzupełnić wszystkie pola'
        console.log(this.recipes)
      }
    },
    deleteElement(comp){
      this.recipes.components = this.recipes.components.filter(component =>{
        return component != comp
      })
      let myMath = this.recipes.components.map(item => item.kcal)
      this.calc = Math.floor(Math.abs(myMath.reduce((a, b) => a - b, 0) * this.amount / 100))
    },   
    addSteps(){
      if(this.newSteps){
        this.recipes.steps.push(this.newSteps)
        this.newSteps = null
        this.feedback = null
      }else{
        this.feedback ="musisz uzupełnic wszystkie pola"
      }
    },
    deleteStep(myStep){
      this.recipes.steps = this.recipes.steps.filter(step =>{
        return step != myStep
      })
    },
  
  },
  created(){
    let refMain =  database.collection('users').doc(this.user.email).collection('recipes').where('slug','==', this.$route.params.slug)
    refMain.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.recipes = doc.data()
        this.recipes.id = doc.id
      })
    })  
  }
}
</script>

