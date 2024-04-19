<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script>
  export default{
      setup () {
        return {
          test: ''
        }
      },
      // methods: {
      //   setData(){
      //     // console.log('test 123')
      //     this.$q.localStorage.set('ruben','ruben p.')
      //     // window.location = '#/hris'
      //   }
      // },
      // mounted(){
      //   this.setData()
      // }
  }
</script>