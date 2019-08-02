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
                <select v-model="listValue">
                  <option  :value="list" v-for="list in newElement">{{list.name +' '+ list.producent}}</option>
                </select>
                <div class="amount_type">
                  <label>Wpisz typ:</label>
                  <div class="action">
                    <input type="text"  placeholder="łyżka..." v-model="type" required>                   
                  </div>
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
              <img v-bind:src="image" id="img" v-bind:alt="title" class="imgSelected">
            </div>
            <div class="alert alert-danger" role="alert" v-if="waringAlert">
              <p>błąd 404 pliku nie znaleziono - Proszę kliknąć przycisk <button v-on:click="clickme"> napraw</button> aby załadować zdjęcie ponownie</p>
            </div>
            <div class="alert alert-warning" role="alert" v-if="helpAlert">
              <p>W ramach jakichkolwiek problemów z odczytaniem zdjęcia, Proszę kliknać przycisk<button v-on:click="clickme"> napraw</button></p>
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
                <ol>
                  <li v-for="(comp, index) in recipes.components" :key="index">{{comp.type + ' ' + '- '}}{{comp.name + ', ' + comp.producent + ', ' + 'kalorie: ' + comp.kcal}}
                    <span>Weglowodany: {{comp.carbohydrates}} g</span>
                    <span>tłuszcze: {{comp.fat}} g</span>
                    <span>Białko: {{comp.protein}} g</span>
                    <span>Sól: {{comp.salt}} g</span>
                    <span>Cukry: {{comp.sugar}} g</span>                    
                    <i class="fas fa-trash" v-on:click="deleteElement(comp)"></i>
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

export default {
  name: 'addEmenet',
  components:{
    'app-sidebar': sidebar
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
      type: null,
      image: [],
      waringAlert: null,
      helpAlert: null
   }
  },
  methods: {
    fileSelect(event){
      let file  = event.target.files[0];
      let storage = firebase.storage();
      let pathRef = storage.ref(this.user.email +'/' + this.title);
      let linkRef = storage.refFromURL('gs://recipes-d7c43.appspot.com');
      pathRef.put(file)
      setTimeout(() => {
      this.helpAlert = "alert"
      linkRef.child(this.user.email +'/' + this.title).getDownloadURL().then((url) => {
        img.src = url
        this.image = url
      }).catch((error) => {
       console.log(error.message)
       this.waringAlert = error.message
      });        
      }, 2000);
    },
    clickme(){
      this.waringAlert = null
      this.helpAlert = null
      let storage = firebase.storage();
      let pathRef = storage.ref(this.user.email +'/' + this.title);
      let linkRef = storage.refFromURL('gs://recipes-d7c43.appspot.com');      
      linkRef.child(this.user.email +'/' + this.title).getDownloadURL().then(function(url) {
        img.src = url
        this.image = url        
      }).catch(function(error) {
        
      });
    },
    addElement(){
      if(this.newElement){  
        this.recipes.components.push(this.listValue)
        this.listValue.type = this.type
        let myMath = this.recipes.components.map(item => item.kcal)
        this.calc = Math.floor(myMath.reduce((a, b) => a + b, 0) * this.amount / 100)
      }else {
        this.feedback = "Musisz uzupełnić wszystkie pola"
      }
    },    
    submitRecipe(){
      if(this.recipes.title){
        this.recipes.title = this.recipes.title.toLowerCase()
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
    let user  = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.user = user
      }else{
        this.user = null
      }
    })
    let ref = database.collection("products")
    ref.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
          this.newElement.push({
            name: doc.data().name,
            producent: doc.data().producent,
            kcal: doc.data().kcal,
            carbohydrates:doc.data().carbohydrates,
            fat: doc.data().fat,
            protein: doc.data().protein,
            salt: doc.data().salt,
            sugar: doc.data().sugar,
          })
      });
    })
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

