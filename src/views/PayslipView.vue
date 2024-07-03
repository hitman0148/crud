<template>
  <div class="q-pa-md">
    <q-table
      dense
      dark
      flat
      class="text-weight-thin text-grey"
      ref="tableRef"
      title="Payslip"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      color="negative"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
      separator="cell"
    >

      <template v-slot:loading>
        <q-inner-loading showing>
          <q-spinner-gears size="50px" color="negative" />
        </q-inner-loading>
      </template>

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
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="id" :props="props" style="text-align:left">
            {{ props.row.fullname }}
          </q-td>
          <q-td key="id" :props="props">
            <q-badge color="purple">
              {{ props.row.employee_id }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.department }}
          </q-td>
          <q-td key="id" :props="props">
            <q-badge color="primary" v-if="props.row.contact_number != ''">
              {{ props.row.contact_number }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props">
            <q-badge
              :color="props.row.is_deleted == 1 ? 'negative' : 'positive'"
              style="cursor: pointer;"
              @click="changeStatus(props.row)"
            >
              {{ props.row.is_deleted == 1 ? "inactive" : "active" }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props">
            <q-badge color="accent"
                     v-if="this.$q.cookies.get('employee_id') == 'SGCC220301'
                     || this.$q.cookies.get('employee_id') == 'SGCC181293'
                     || this.$q.cookies.get('employee_id') == 'SGSUN15219'">
              {{ props.row.payslip_password }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props" class="q-gutter-sm">
            <q-btn
              :disable="props.row.is_deleted == 1"
              round
              color="primary"
              size="5px"
              glossy
              icon="edit"
              @click="onEdit(props.row)"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn
              :disable="props.row.is_deleted == 1"
              round
              color="negative"
              size="5px"
              glossy
              icon="autorenew"
              @click="resetPassPromt(props.row)"
            >
              <q-tooltip>Reset Password</q-tooltip>
            </q-btn>
            <q-btn
              v-if="this.$q.cookies.get('privilege') == 1"
              round
              color="warning"
              size="5px"
              glossy
              icon="folder_zip"
              @click="payslipList(props.row)"
            >
              <q-tooltip>Extract Payslip</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editPrompt" persistent>
      <q-card style="min-width: 350px;">
        <q-form ref="myForm" @submit="updateData" class="q-gutter-md">
          <q-card-section color="dark">
            <div class="text-h6">Mobile Number</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div>Prev Number: {{ oldNumber }}</div>
            <q-input
              dense
              v-model="form.mobile"
              clearable
              autofocus
              @keyup.enter="updateData"
              mask="#### - #####"
              hint="Mask: (+639) #### - #####"
              lazy-rules
              prefix="(+639) "
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter your number',
                (val) =>
                  (val !== null && val.length == 12) ||
                  'Please enter a valid mobile number',
              ]"
            />

            <!-- <q-radio v-model="form.status" val="0" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" label="Active" />
          <q-radio v-model="form.status" val="1" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" label="Inactive" /> -->
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

    <q-dialog v-model="payslipDialog" persistent transition-show="scale" transition-hide="scale">
        <PayslipComponentVue :userData="userData" :payslipTable="payslipTable"/>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import PayslipComponentVue from '../components/PayslipComponent.vue';
import mixin from '../mixin'

const columns = [
  { name: "id", align: "center", label: "ID", field: "id" },
  {
    name: "fullname",
    required: true,
    label: "FULLNAME",
    align: "left",
    field: "fullname",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "employee_id",
    label: "EMPLOYEE ID",
    field: "employee_id",
    align: "center",
  },
  {
    name: "department",
    label: "DEPARTMENT",
    field: "department",
    align: "center",
  },
  {
    name: "contact_number",
    label: "CONTACT NUMBER",
    field: "contact_number",
    align: "center",
  },
  { name: "is_deleted", label: "STATUS", field: "is_deleted", align: "center" },
  {
    name: "payslip_password",
    label: "PAY PASS",
    field: "payslip_password",
    align: "center",
  },
  { name: "action", label: "ACTION", field: "action", align: "center" },
];

export default {
  mixins:[mixin],
  components:{
    PayslipComponentVue
  },
  setup() {
    return {};
  },
  data() {
    return {
      filter: "",
      loading: false,
      columns,
      rows: [],
      offset: 0,
      limit: 15,
      selected: [],
      pagination: {
        sortBy: "desc",
        descending: false,
        rowsPerPage: 15,
        page: 1,
        rowsNumber: 10,
      },

      //form data
      oldNumber: "",
      form: {
        id: "",
        mobile: "",
        // status: '0'
      },
      userData:{
        id:'',
        fullname:'',
        employee_id:''
      },
      payslipTable:[],

      //dialog
      editPrompt: false,
      payslipDialog: false,
    };
  },
  methods: {

    changeStatus(rowData) {
      // console.log("test data", rowData);
      this.$q
        .dialog({
          title: "Employee Status",
          message: "Change employee status",
          options: {
            type: "radio",
            model: rowData.is_deleted,
            // inline: true,
            items: [
              { label: "Active", value: 0, color: "positive" },
              { label: "Inactive", value: 1, color: "negative" },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          var form = new FormData()
          form.append("id", rowData.id);
          form.append("key_val", data);
          form.append("key", "is_deleted");
          axios.post("https://payslipapi.sgccserver02.com/crud/update-data", form, {
              headers: { "Content-Type": "multipart/form-data" },
            }).then((res) => {
              var msg = res.status == 200 ? "Data updated successfully" : "Error";
              var type = res.status == 200 ? "positive" : "negative";
              this.message(msg, type);
              this.onRequest({
                pagination: this.pagination,
                filter: this.filter,
              });
              // this.logActions({"id":rowData.id,"employee_id":rowData.employee_id,"is_active":data},'Reset Password Payslip',this.$q.localStorage.getItem('id'))
              this.logActions({"id":rowData.id,"employee_id":rowData.employee_id,"is_active":data},'Reset Password Payslip',this.$q.cookies.get('id'))
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    onEdit(data) {
      this.editPrompt = true;
      this.oldNumber = data.contact_number;
      this.form.id = data.id;
      // this.form.status = data.is_deleted.toString()
      // console.log("edit test:", data);
    },

    message(msg, type) {
      this.$q.notify({
        message: msg,
        type: type,
      });
    },

    resetPassPromt(res) {
      this.$q
        .dialog({
          title: "Alert",
          message:
            'Are you sure you want to reset the password of this user?\nClick OK to continue, password: "sterling"',
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          var form = new FormData();
          form.append("id", res.id);
          axios
            .post(
              "https://payslipapi.sgccserver02.com/crud/reset-pass",
              form,
              { headers: { "Content-Type": "multipart/form-data" } }
            )
            .then((res) => {
              var msg = res.status == 200 ? "Password reset" : "Error";
              var type = res.status == 200 ? "positive" : "negative";
              this.message(msg, type);
              // this.logActions(res,'Reset Password Payslip',this.$q.localStorage.getItem('id'))
              this.logActions(res,'Reset Password Payslip',this.$q.cookies.get('id'))
            });
        });
    },

    async updateData() {
      var form = new FormData();
      // var mobile = this.form.mobile.split(' - ').join('').split('(').join('').split(') ').join('')
      var mobile = "+639" + this.form.mobile.split(" - ").join("");
      form.append("id", this.form.id);
      form.append("key_val", mobile);
      form.append("key", "contact_number");
      await axios
        .post("https://payslipapi.sgccserver02.com/crud/update-data", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          var msg = res.status == 200 ? "Data updated successfully" : "Error";
          var type = res.status == 200 ? "positive" : "negative";

          this.logActions({id:this.form.id, mobile: "+639" + this.form.mobile.split(" - ").join("")},'Update Mobile Payslip',this.$q.localStorage.getItem('id'))
          this.message(msg, type);
          this.$refs.myForm.resetValidation();
          this.editPrompt = false;
          this.form.id = "";
          this.form.mobile = "";
          
          this.onRequest({
            pagination: this.pagination,
            filter: this.filter,
          });
        });
    },

    //============star server side table=========
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      // const filter = props.filter;
      this.loading = true;

      var cleanText = props.filter == undefined ? '' : props.filter.trim();

      setTimeout(() => {
        // update rowsCount with appropriate value
        this.getRowsNumberCount(cleanText);
        const fetchCount =
          rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
        const startRow = (page - 1) * rowsPerPage;
        this.fetchFromServer(startRow, fetchCount, cleanText);

        // don't forget to update local pagination object
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;

        // ...and turn of loading indicator
        this.loading = false;
      }, 1000);
    },

    fetchFromServer(offset, limit, filter) {
        axios.post("https://payslipapi.sgccserver02.com/crud/list",{
          start: offset,
          countPerPage: limit,
          filter: filter,
        },{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).then((res) => {
        this.rows = res.data.data;
      });
    },

    getRowsNumberCount(filter) {
      axios
        .post(
          "https://payslipapi.sgccserver02.com/crud/count",
          {
            filter: filter,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          this.pagination.rowsNumber = res.data.data;
        });
    },

    //==================end of serverside table ==============================

    payslipList(data){
      this.payslipDialog = true
      this.userData = data
      // console.log('payslip:',data.employee_id)
      var form = new FormData()
      form.append('employee_id',data.employee_id)
      axios.post('https://payslipapi.sgccserver02.com/crud/payslip-list',form,{
        headers:{
          "Content-Type" : "multipart/form-data"
        }
      }).then((res) => {
          this.payslipTable = res.data.data
      })
    }
  },
  mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
    });


    if(this.$q.cookies.get('is_auth') != 'true'){
      window.location = '#/'
      this.logoutData()
    }
  },
};
</script>

<style scoped>
  tr:hover{
    background-color: grey;
    color: black;
  }
</style>
