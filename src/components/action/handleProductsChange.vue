<template>
  <div>      
    <select v-model="newValue" v-on:click="changeValue">
      <option  :value="list" v-for="list in newElement">{{list.name +' '+ list.producent}}</option>
    </select> 
  </div>  
</template>
<script>
import database from '@/firebase/init'
import firebase from 'firebase'
export default {
  name: 'products',
  props:['newElement'],
  data(){
    return {
      newValue: [],
      listValue: []
    }
  },
  methods: {
    changeValue: function(){
      this.$emit('changeValue', this.newValue)
    }
  },
  created(){
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
  },
  updated(){
    this.$emit('update:listValue', )  
  }
}
</script>
