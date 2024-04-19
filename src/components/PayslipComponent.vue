<template>
    <q-card class="text-negative" style="width: 700px; max-width: 80vw;">

        <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ userData.fullname }}</q-item-label>
          <q-item-label caption>
            {{ userData.employee_id }}
          </q-item-label>
        </q-item-section>
        
      </q-item>
      

    <q-card-section class="q-pt-none">
        <q-table
            dark
            title="Payroll Extraction List"
            :rows="payslipTable"
            :columns="columns"
            row-key="name"
            :filter="filter"
        >
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
              dark
            >
              <template v-slot:append>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
          </template>

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-dark bg-grey"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
                <q-td key="id" :props="props">{{ props.row.id }}</q-td>
                <q-td key="id" :props="props">{{ props.row.payroll_period_from }}</q-td>
                <q-td key="id" :props="props">{{ props.row.payroll_period_to }}</q-td>
                
                <q-td key="id" :props="props" class="q-gutter-sm">
                  <q-btn
                      round
                      glossy
                      color="primary"
                      size="xs"
                      icon="download"
                      @click="downloadPayslip(props.row)"
                    >
                      <q-tooltip>Download</q-tooltip>
                  </q-btn>
                </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-dark">
        <q-btn rounded label="Close" size="sm" color="negative" v-close-popup/>
      </q-card-actions>
    </q-card>
</template>

<script>
// import axios from 'axios'
import mixin from '../mixin'

const columns = [
  {
    name: "id",
    align: "center",
    label: "ID",
    field: "id",
    sortable: true,
  },
  { name: "payroll_period_from",align: "center", label: "Payroll Period From", field: "payroll_period_from", sortable: true },
  { name: "payroll_period_to",align: "center", label: "Payroll Period To", field: "payroll_period_to", sortable: true },
  { name: "action",align: "center", label: "Action" },

];
export default {
  mixins:[mixin],
  props: {
    userData: Object,
    payslipTable: Array
  },
  emits:['showDialog','getLeave'],
  data() {
    return {
      // data: [],
      filter: "",
      columns,
    };
  },
  methods:{
    downloadPayslip(data){
        this.$q.loading.show({message:'Downloading..'})
        setTimeout(() => {
          this.$q.loading.hide()
          let jsonData = {...this.userData,...data}
          this.logActions(jsonData,'Download Payslip',this.userData.id)
          window.open('https://payslip-api.sgccserver02.com/payslip/payslipdownload?payslip_id='+data.id)
        }, 2000)
       
        // axios({
        //   url:'https://payslip-api.sgccserver02.com/payslip/payslipdownload?payslip_id='+id,
        //   method: 'GET',
        //   responseType: 'blob'
        // }).then((res) => {
        //     console.log(res)
        //     var fileURL = window.URL.createObjectURL(new Blob([res.data]));
        //     var fileLink = document.createElement('a');
        //     fileLink.href = fileURL;
        //     fileLink.setAttribute('download', 'file.pdf');
        //     document.body.appendChild(fileLink);
        //     fileLink.click();
        // })
    }
  }
};
</script>
