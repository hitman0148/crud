<template >
    <q-layout id="bodyLogin">
    <div class="q-pa-md" >
  
      <q-card class="my-card shadow-24 fixed-center q-pa-md">
        <q-item>
          <q-space></q-space>
            <q-avatar size="100px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          <q-space></q-space>
        </q-item>
        <div class="text-h4 text-weight-bold text-center">hitm@n<span class="text-negative">014</span></div>
        <div class="text-caption text-center">Welcome to Planet Earth!</div>
        <div class="text-caption text-center">{{this.$q.cookies.get('fullname')}}</div>

        <q-card-section>
          <q-form @submit="onSubmit">
            <div class="q-gutter-sm">
              <q-input
                dense outlined
                v-model="employee_id"
                label="Username"
                hint="Enter Employee Number"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type employee number']"
              >
                <template v-slot:append>
                  <q-icon name="person_outline"/>
                </template>
              </q-input>
              <q-input
                :type="isPwd ? 'password' : 'text'"
                dense
                outlined v-model="password"
                label="Password"
                hint="Enter Password"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                autocomplete="off"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <div>
                <q-btn type="submit" color="negative" rounded class="full-width q-mr-sm" glossy v-ripple clickable>Submit</q-btn>
                <!-- <div @click="register" class=" text-center q-mt-md">Dont have account? <span class="text-primary" style="cursor: default">Register</span></div> -->
              </div>
            </div>
          </q-form>
        </q-card-section>
  
      </q-card>
  
    </div>
    </q-layout>
  </template>
  
  <script>
  import { ref } from 'vue'
  import axios from 'axios'
  import mixin from '../mixin'
  // import { Cookies } from 'quasar
  
  export default {
    mixins:[mixin],
    data () {
      return {
        data: [],
        employee_id: '',
        password: '',
        isPwd: ref(true),
      }
    },
    methods: {
      onSubmit(){
          this.$q.loading.show()
          var form = new FormData()
          form.append('employee_id',this.employee_id)
          form.append('password',this.password)
          axios.post(this.apiUrl+'login',form,{
            headers: { "Content-Type":"multipart/form-data"}
          }).then((res) => {
              if(res.data.is_auth == true){
                let row = res.data.data[0]

                // this.$q.localStorage.set('id',row.id)
                // this.$q.localStorage.set('employee_id',row.employee_id)
                // this.$q.localStorage.set('fullname',row.fullname)
                // this.$q.localStorage.set('privilege',row.privilege)
                // this.$q.localStorage.set('profile',row.profile)
                // this.$q.localStorage.set('is_auth',true)
                // this.$q.localStorage.set('is_login',true)
                this.loginData(row)
                this.logActions(res.data.data[0],'Login',res.data.data[0].id)
              }else{
                var datas = {employee_id:this.employee_id,password:this.password}
                this.logActions(datas,'Invalid Login',0)
                this.msgAlert('Invalid Credentails','negative','error')
              }
                this.$q.loading.hide()
          })
      },

    },
    mounted () {
    },
    created () {
      // if (this.$q.localStorage.getItem('is_auth') == true && this.$q.localStorage.getItem('is_login') == true) {
      if (this.$q.cookies.has('is_auth') && this.$q.cookies.has('is_login')) {
        window.location = '#/hris'
      }
    },
    watch:{
      // employee_id(newVal){
      //   console.log('watcher',newVal);
      // }
    }
  }
  </script>
  
  <style scoped>
  
  .my-card {
    width: 100%;
    max-width: 400px;
  }
  
  #bodyLogin{
    background-image: url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80");
    background-repeat: no-repeat;
    background-size: cover;
  }
  </style>
  