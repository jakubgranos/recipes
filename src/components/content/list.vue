<template>
  <section class="page-list-ingredient">
    <app-sidebar></app-sidebar>
    <div class="content">
      <div class="page-card-border"></div>
      <div class="alert alert-primary" role="alert">
        <p><b>Uwaga! Poniżej zostaną podane Średnie zapotrzebowanie na dzien dla przeciętnego człowieka</b> <br>Dzienne zapotrzebowanie energetyczne wzrasta podczas intensywnego wysiłku fizycznego oraz podczas wzrostu i rozwoju organizmu, ciąży i okresu karmienia oraz rekonwalescencji.
        Średnie dzienne zapotrzebowanie energetyczne dla osób o umiarkowanej aktywności fizycznej wynosi:</p>
        <span><b>2000 kcal dla kobiety</b></span><br/>
        <span><b>2500 kcal dla mężczyzny.</b></span>        
        <p>Węglowodany <b>ok M/340g K/270g</b></p>
        <p>Białko <b> ok M/60g K/50g</b></p>
        <p>tłuszcz nie wiecej niż <b> M/80g K/70g</b></p>
        <p>Sól nie wiecej niż <b>M/6g K/6g</b></p>
        <p>Cukry nie wiecej niż <b>M/110g K/90g</b></p>                  
        </div>      
      <h1>Lista Składników - skład</h1>
      <div class="page-list-content">
        
        <div class="page-list-card"  v-for="list in listContent" :key="listContent.id">
          <div class="page-list-title">
            <h2 class="title">{{list.name}}</h2>
            <p>{{list.producent}}</p>          
          </div>
          <div class="page-list-box">
            <div class="page-list-progress">
              <p>kalorie{{': ' + list.kcal}}/2500 kcal</p>
              <progress :value="list.kcal" max="3000"></progress>            
            </div>
            <div class="page-list-progress">
              <p>Węglowodany{{': ' + list.carbohydrates}}/150g</p>
              <progress :value="list.carbohydrates" max="150"></progress>            
            </div>
            <div class="page-list-progress">
              <p>tłuszcze{{': ' + list.fat}}/5g</p>
              <progress :value="list.fat" max="5"></progress>            
            </div> 
            <div class="page-list-progress">
              <p>Białko{{': ' + list.protein}}/40g</p>
              <progress :value="list.protein" max="40"></progress>            
            </div>
            <div class="page-list-progress">
              <p>Cukry{{': ' + list.sugar}}/20g</p>
              <progress :value="list.sugar" max="20"></progress>            
            </div>
            <div class="page-list-progress">
              <p>Sól{{': ' + list.salt}}/6g</p>
              <progress :value="list.salt" max="6"></progress>            
            </div>                          
          </div>           
        </div>
      </div>      
    </div>
  </section>
</template>
<script>
import sidebar from '@/components/navbar/sidebar'
import firebase from 'firebase'
import database from '@/firebase/init'
import products from '@/components/action/handleProductsChange'
export default {
  name: 'addingredient',
  components: {
    'app-sidebar': sidebar,
    'app-products': products 
  },
  data(){
    return {
      listContent:[],
    }
  },
  created(){
    database.collection("products")
    .orderBy("name", "asc").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let document = doc.data()
        document.id = doc.id
        this.listContent.push(document)
      });
    })
  }
}

</script>
