<template>
  <section class="page-adingredient">
    <app-sidebar></app-sidebar>
    <div class="content">
      <div class="page-card-border"></div>
      <div class="alert alert-info">
        <strong>Info!</strong> Dodaj nowy składnik do listy składników, aby sprawdzić kaloryczność twoich ulubionych dań!
      </div>
      <div class="col-lg-11 col-sm-12 page-addingredient-form">
        <form v-on:submit.prevent="addingredient">
          <div class="page-card-field title">
            <label for="Name">Nazwa produktu:</label>
            <input type="text" name="Name" v-model="name" required>
            <label for="producent">Producent:</label>
            <input type="text" name="Name" v-model="producent" required>            
          </div>
          <div class="page-card-field page-addingredient-action">
            <label for="100"> Na 100</label>
            <select name="unit" v-model="unit" required>
              <option value="ml">ml</option>          
              <option value="g">g</option>
            </select>
          </div>
          <div class="page-card-field page-addingredient-action">
            <label for="kcal">Wartosc Energetyczna</label>
            <input type="number"  pattern="[0-9]+([\.,][0-9]+)?" step="0.01" name="kcal" v-model="kcal" required>
            <label for="kcal">kcal</label>
          </div>          
          <div class="page-card-field page-addingredient-action">
            <label for="carbohydrates">Weglowodany:</label>
            <input type="number" pattern="[0-9]+([\.,][0-9]+)?"   step="0.01" min="0" max="9999" name="carbohydrates" v-model="carbohydrates" required>
            <label for="kcal">g</label>
          </div>
          <div class="page-card-field page-addingredient-action">
            <label for="fats">tłuszcze:</label>
            <input type="number" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" min="0" max="9999" name="fats" v-model="fat" required> 
            <label for="kcal">g</label>
          </div>           
          <div class="page-card-field page-addingredient-action">
            <label for="sugar">Cukry:</label>
            <input type="number" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" min="0" max="9999" name="sugar" v-model="sugar" required>
            <label for="kcal">g</label>
          </div>
          <div class="page-card-field page-addingredient-action">
            <label for="protein">Białka:</label>
            <input type="number" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" min="0" max="9999" name="protein" v-model="protein" required>
            <label for="kcal">g</label>
          </div>
          <div class="page-card-field page-addingredient-action">
            <label for="salt">Sól</label>
            <input type="number" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" min="0" max="9999" name="salt" v-model="salt" required>
            <label for="kcal">g</label>
          </div>                                               
          <div class="page-card-field">
            <button>dodaj skladnik</button>
          </div>
            <p v-if="feedback" class="feedback">{{feedback}}</p>               
        </form>        
      </div>
    </div>
  </section>
</template>
<script>
import sidebar from '@/components/navbar/sidebar'
import firebase from 'firebase'
import database from '@/firebase/init'
export default {
  name: 'addingredient',
  components: {
    'app-sidebar': sidebar 
  },
  data(){
    return {
      producent: null,
      name: null,
      changeValue: null,
      ingredientValue: null,
      unit: "g",
      kcal: null,
      gram: null,
      feedback: null,
      carbohydrates: null,
      fat: null,
      sugar: null,
      protein: null,
      salt: null,

    }
  },
  methods: {
    addingredient(){
      if(this.name.length && this.producent.length >= 3){
        let ref = database.collection('products').doc(this.name +' '+ this.producent)
        ref.set({
          name: this.name,
          producent: this.producent,
          unit: this.unit,
          kcal: Number(this.kcal),
          carbohydrates: Number(this.carbohydrates),
          fat: Number(this.fat),
          sugar: Number(this.sugar),
          protein: Number(this.protein),
          salt: Number(this.salt)
        }).then( () => {
          this.feedback = "Udało się dodać składnik! Sprawdź listę składników"
        })
      }else{
        this.feedback = "prosze uzupełnic wszystkie pola"
      }
    },
  },
}
</script>
