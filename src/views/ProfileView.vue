<template>
  <div class="q-pa-md row items-start q-gutter-md">

    <q-card class="my-card" flat bordered style="width:400px">
      <q-img src="https://images.unsplash.com/photo-1684665742691-ddf2242c1c5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" />

      <q-card-section>
        <q-avatar size="56px" class="q-mb-sm absolute" style="top: 0; right: 30px; transform: translateY(-50%)">
          <img :src="userData.profile != '' && userData.profile != 'null' ? userData.profile : 'https://cdn.quasar.dev/img/boy-avatar.png'" style="border:solid 2px darkred">
        </q-avatar>

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ userData.fullname }}
          </div>
        </div>
        <div class="col-auto text-grey">
          {{ userData.employee_id }}
        </div>

<!--        <q-rating v-model="stars" :max="5" size="32px" />-->
      </q-card-section>

      <q-card-section class="q-pt-none q-gutter-sm">
        <div class="text-subtitle2 row">
          <span class="material-symbols-outlined q-plr-sm q-mr-md"><q-icon name="alternate_email" class="q-mr-xs"/> EM@IL ADDRESS</span>
          <q-space/>
          <span class="text-subtitle2 text-grey">{{ userData.email }}</span>
        </div>
        <q-separator />
        <div class="text-subtitle2 row">
          <span class="material-symbols-outlined q-plr-sm q-mr-md"><q-icon name="today" class="q-mr-xs"/> DATE JOINED</span>
          <q-space/>
          <span class="text-subtitle2 text-grey"> {{ userData.join_date }}</span>
        </div>
        <q-separator />
        <div class="text-subtitle2 row">
          <span class="material-symbols-outlined q-plr-sm q-mr-md"><q-icon name="manage_accounts" class="q-mr-xs"/> ROLE</span>
          <q-space/>
          <span class="text-subtitle2 text-grey">{{ userData.role }}</span>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn size="sm" outline color="negative" icon="manage_accounts" label="Edit Profile" @click="show_profile_dialog"/>
        <q-btn size="sm" outline color="accent" icon="verified_user" label="Change Pass" @click="show_change_pass"/>
      </q-card-actions>

    </q-card>

    <q-dialog v-model="profile_dialog" persistent>
      <q-card style="min-width: 350px;">
        <q-form ref="myForm" @submit="updateProfile" class="q-gutter-md">
          <q-card-section class="bg-red-10 text-white">
            <div class="text-h6">Profile Form</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
                dense
                label="Fullname"
                v-model="user_data.fullname"
                clearable
                autofocus
                lazy-rules
                :rules="[
                (val) => (val !== null && val !== '') || 'Please enter your fullname',
              ]"
            />
            <q-input
                dense
                label="Em@il"
                v-model="user_data.email"
                clearable
                autofocus
                lazy-rules
                :rules="[
                (val) => (val !== null && val !== '') || 'Please enter your email',
              ]"
            />

            <q-file dense v-model="user_data.profile" label="Profile Image" hint="optional" stack-label clearable/>
            <center>
              <q-avatar size="60px" class="q-mt-sm" v-if="base64 != ''">
                <img :src="base64" style="border:solid 2px darkred">
              </q-avatar>
            </center>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
                color="warning"
                rounded
                size="sm"
                label="Cancel"
                v-close-popup
            />
            <q-btn
                color="negative"
                rounded
                size="sm"
                label="Submit"
                type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="change_dialog" persistent>
      <q-card style="min-width: 350px;">
        <q-form ref="myForm" @submit="changePass"  class="q-gutter-md">
          <q-card-section color="dark">
            <div class="text-h6">Password</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
                :type="isPwd ? 'password' : 'text'"
                dense
                label="Current Password"
                v-model="user_data.password"
                clearable
                autofocus
                lazy-rules
                :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter your current password',
              ]"
            />

            <q-input
                :type="isPwd2 ? 'password' : 'text'"
                dense
                label="New Password"
                v-model="user_data.new_password"
                clearable
                autofocus
                lazy-rules
                :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter your new password',
              ]"
            />

            <q-input
                :type="isPwd3 ? 'password' : 'text'"
                dense
                label="Reenter Password"
                v-model="user_data.c_password"
                clearable
                autofocus
                lazy-rules
                :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please re-enter your password',
              ]"
            />

          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
                color="warning"
                rounded
                size="sm"
                label="Cancel"
                v-close-popup
            />
            <q-btn
                color="negative"
                rounded
                size="sm"
                label="Submit"
                type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

import mixin from '../mixin'
import axios from 'axios'

export default {
  name: "ProfileView",
  mixins:[mixin],
  data(){
    return {
      profile_dialog:false,
      change_dialog:false,
      user_data:{
        id: '',
        fullname:'',
        email:'',
        role:'',
        profile:'',
        password: '',
        new_password: '',
        c_password:''
      },
      base64: this.$q.localStorage.getItem('profile'),
      isPwd: true,
      isPwd2: true,
      isPwd3: true,
    }
  },
  watch: {
    'user_data.profile'(newVal){
      if(newVal){
        this.createBase64Image(newVal);
      } else {
        this.base64 = this.userData.profile;
      }
    },
  },
  mounted(){
    // this.testFunction()
    this.loadUserData()
  },
  methods: {
      updateProfile(){
          console.log('test',this.user_data)
          let form = new FormData()
          form.append('id',this.user_data.id)
          form.append('fullname',this.user_data.fullname)
          form.append('email',this.user_data.email)
          form.append('profile',this.base64)
          axios.post(this.apiUrl+'user/update/profile',form,{
            headers: {
              'Content-Type': 'application/json',
            }
          }).then((res) => {
              console.log('profile Update',res);
              if(res.status == "200"){
                  this.profile_dialog = false
                  this.msgAlert(res.data.message,'positive','task_alt')
                  this.user_data.id = ''
                  this.user_data.fullname = ''
                  this.user_data.email = ''
                  this.user_data.role = ''
                  this.user_data.profile = ''
                  this.user_data.email = ''
                  this.base64 = this.$q.localStorage.getItem('profile')
              }else{
                  this.msgAlert(res.data.message,'negative','error')
              }
          }).catch((err) =>{
              console.log('error',err);
          })
      },

      changePass(){
          let form = new FormData()
          form.append('id',this.user_data.id)
          form.append('password',this.user_data.password)
          form.append('new_password',this.user_data.new_password)
          form.append('c_password',this.user_data.c_password)
          axios.post(this.apiUrl+'user/change-pass',form,{
              header: {'Content-Type': 'application/json'}
          }).then((res) => {
              // console.log('change pass:',res.data)
            if(res.data.status == "200") {
              this.change_dialog = false
              this.msgAlert(res.data.message, 'positive', 'task_alt')
              this.userData.id = ''
              this.userData.password = ''
              this.userData.new_password = ''
              this.userData.c_password = ''
            }else if(res.data.status == '422'){
                let data = res.data.data
                // console.log('change pass',data)
                // console.log(Object.values(data).length)
                if(Object.values(data).length > 0) {
                  let myKey = Object.keys(data)
                  myKey.forEach((item) => {
                    // console.log('msg', data[item])
                    this.msgAlert(data[item].toString(), 'warning', 'error')
                  })
                }
            }else{
              this.msgAlert(res.data.message,'negative','error')
            }
          })
      },
      createBase64Image(FileObject) {
          const reader = new FileReader();reader.onload = (event) => {
            this.base64 = event.target.result;
          }
          reader.readAsDataURL(FileObject);
      },
      loadUserData(){
          this.user_data.fullname = this.userData.fullname
          this.user_data.email = this.userData.email
          this.user_data.role = this.userData.role
      },

      show_profile_dialog(){
        this.profile_dialog = true
        console.log('user data list',this.userData)
        this.user_data.id = this.userData.id
        this.user_data.fullname = this.userData.fullname
        this.user_data.email = this.userData.email
        this.user_data.role = this.userData.role
        // this.user_data.profile = this.userData.profile
      },

      show_change_pass(){
        this.change_dialog = true
        this.user_data.id = this.userData.id
      }
  }
}
</script>

<style scoped>

</style>