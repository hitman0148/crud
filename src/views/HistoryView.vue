<template>
  <div class=" q-py-md bg-grey-9 text-white">
        <q-timeline dark color="secondary" layout="comfortable">
          <q-timeline-entry heading>User Activity Logs</q-timeline-entry>

          <q-timeline-entry
            v-for="log in logs"
            :key="log"
            :title="log.user_data.length > 0 ? log.user_data[0].fullname : ''"
            :subtitle="dateFormat(log.date_created)"
            :avatar="'https://cdn.quasar.dev/img/boy-avatar.png'"
          >
            <div>
              Action: {{ log.user_action }}
            </div>
            <p>Ip Address: {{ log.ip_add }}</p>
            <p>{{date2(log.date_created)}}</p>
          </q-timeline-entry>

        </q-timeline>

  </div>
</template>

<script>
// :avatar="'https://cdn.quasar.dev/img/boy-avatar.png'"
import axios from 'axios'
import mixin from '../mixin'
import moment from 'moment'

export default{
  mixins:[mixin],
  data(){
    return {
        logs: []
    }
  },
  methods: {
    dateFormat(dt){
      var dateTime = moment(dt).format('llll')
      // var dateTime = moment(dt).startOf('hour').fromNow()
      // console.log('ruben:',dt)
      return dateTime
    },
    date2(dt){
      var dateTime = moment(dt).fromNow()
      return dateTime
    },
    async allLogs (){
      await axios.get(this.apiUrl+'logs/show').then((res) =>{
          console.log('all logs',res)
          this.logs = res.data
          // console.log('history:',res.data)
      })
    }
  },
  created(){
    this.allLogs()

    if(this.$q.cookies.get('is_auth') != 'true'){
      window.location = '#/'
      this.logoutData()
    }
  }
}
</script>
