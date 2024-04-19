<template>
  <div class="q-pa-md">
    <q-table
      dense
      dark
      flat
      class="text-weight-thin text-grey"
      ref="tableRef"
      title="HRIS User List"
      :rows="rows"
      :columns="columns"
      :row-key="rows.id"
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
            <q-icon size="xs" name="search" />
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
            {{ props.row.firstname }}
          </q-td>
          <q-td key="id" :props="props" style="text-align:left">
            {{ props.row.lastname }}
          </q-td>
          <q-td key="id" :props="props" style="text-align:left">
            {{ props.row.email }}
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
            <q-badge v-if="props.row.mobile_number != null" color="primary">
              {{ props.row.mobile_number }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props">
            <q-badge
              :color="
                props.row.is_active == 'active'
                  ? 'positive'
                  : 'negative'
              "
              style="cursor: pointer;"
              @click="changeStatus(props.row)"
            >
              {{ props.row.is_active }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props" class="q-gutter-sm">
            <q-btn
              :disable="props.row.is_active != 'active'"
              round
              glossy
              color="positive"
              size="5px"
              icon="edit"
              @click="editDialog(props.row)"
            >
              <q-tooltip>Edit Mobile Number</q-tooltip>
            </q-btn>
            <q-btn
              :disable="props.row.is_active != 'active'"
              round
              glossy
              color="negative"
              size="5px"
              icon="autorenew"
              @click="resetDialog(props.row)"
            >
              <q-tooltip>Reset Password</q-tooltip>
            </q-btn>

            <q-btn
              v-if="this.$q.cookies.get('privilege') == 1"
              :disable="props.row.is_active != 'active'"
              round
              glossy
              color="warning"
              size="5px"
              icon="event"
              @click="getLeaveData(props.row)">
                <q-tooltip>Edit Leave</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px;">
        <q-form ref="myForm" @submit="updateNumber" class="q-gutter-md">
          <q-card-section color="dark">
            <div class="text-h6">Mobile Number</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div>Prev Number: {{ oldNumber }}</div>
            <q-input
              dense
              v-model="form.mobile"
              autofocus
              @keyup.enter="updateNumber"
              mask="#### - ### - ####"
              hint="Mask: 09## - ### - ####"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter your number',
                (val) =>
                  (val !== null && val.length == 17) ||
                  'Please enter your 11 digit number',
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
    

    <!-- leave second dialog -->
    <q-dialog v-model="leaveDialog" dark persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
            <q-avatar icon="event" color="primary" size="sm" text-color="white" class="q-mr-sm" />
            <span class="text-h6">Leave Data</span>
            </q-card-section>

            <q-card-section class="q-pt-none">
            <q-input dense v-model="leave.id" autofocus  label="ID" readonly/>
            <q-select dense v-model="leave.type" autofocus  label="Leave Type" :options="leave_type" emit-value map-options/>
            <q-input dense v-model="leave.date_start" :rules="['date']" label="Date Start">
                <template v-slot:append>
                <q-icon size="xs" name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <!-- <q-date v-model="leave.date_start" mask="YYYY-MM-DD" :options="optionsStartDate"> -->
                    <q-date v-model="leave.date_start" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                    </q-date>
                    </q-popup-proxy>
                </q-icon>
                </template>
            </q-input>
            <q-input dense v-model="leave.date_end" mask="date" :rules="['date']" label="Date End">
                <template v-slot:append>
                <q-icon size="xs" name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale" >
                    <q-date v-model="leave.date_end" mask="YYYY-MM-DD" :options="optionsEndDate">
                        <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                    </q-date>
                    </q-popup-proxy>
                </q-icon>
                </template>
            </q-input>
            <q-input dense v-model="leave.date_return"  :rules="['date']" label="Date Return">
                <template v-slot:append>
                <q-icon size="xs" name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale" >
                    <q-date v-model="leave.date_return" mask="YYYY-MM-DD" :options="optionsReturn">
                        <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                    </q-date>
                    </q-popup-proxy>
                </q-icon>
                </template>
            </q-input>
            <q-input dense v-model="leave.reliever" autofocus  label="Reliever" readonly/>
            <q-input dense v-model="leave.covered" autofocus  label="Leave Covered" readonly/>
            <!-- <q-input dense v-model="leave.date_return" autofocus  label="Date of Return"/> -->
            
            <q-input dense v-model="leave.reason" autofocus  label="Reason"/>
<!--            <q-input dense v-model="leave.status" autofocus  label="Status" readonly/>-->
              <q-select dense v-model="leave.status" autofocus label="Status" :options="leave_opt">

              </q-select>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
            <q-btn rounded color="negative" size="sm" label="Cancel" v-close-popup />
            <q-btn rounded color="warning" size="sm" label="Submit" @click="updateLeave"/>
            </q-card-actions>
        </q-card>
    </q-dialog>


    <!-- leave third dialog -->
    <q-dialog v-model="leaveSingleDialog" dark persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-avatar icon="event" color="primary" size="sm" text-color="white" class="q-mr-sm" />
          <span class="text-h6">Leave Data</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="leave.id" autofocus  label="ID" readonly/>
          <q-select dense v-model="leave.type" autofocus  label="Leave Type" :options="leave_type" emit-value map-options/>
          <q-input dense v-model="leave.date_start" :rules="['date']" label="Leave Date">
            <template v-slot:append>
              <q-icon size="xs" name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <!-- <q-date v-model="leave.date_start" mask="YYYY-MM-DD" :options="optionsStartDate"> -->
                  <q-date v-model="leave.date_start" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input dense v-model="leave.reliever" autofocus  label="Reliever" readonly/>
          <q-input dense v-model="leave.covered" autofocus  label="Leave Covered" readonly/>
          <q-input dense v-model="leave.reason" autofocus  label="Reason"/>
          <q-select dense v-model="leave.status" autofocus label="Status" :options="leave_opt">

          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn rounded color="negative" size="sm" label="Cancel" v-close-popup />
          <q-btn rounded color="warning" size="sm" label="Submit" @click="updateSingleFile"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="tableDialog" persistent transition-show="scale" transition-hide="scale">
      <LeaveComp
          v-bind="leaveDialogData"
          :leaveTable="leaveTable"
          :leaveTableSingle="leaveTableSingle"
          v-on:show-dialog="showTableDialog"
          v-on:single-dialog="showSingleDialog"
          :test="test"
          style="width:1000px;"/>
    </q-dialog>

  </div>
</template>

<script>
import axios from "axios"
import moment from 'moment'
import mixin from '../mixin'

import LeaveComp from '../components/LeaveComponent.vue'

const columns = [
  { name: "id", align: "center", label: "ID", field: "id" },
  {
    name: "firstname",
    required: true,
    label: "FIRSTNAME",
    align: "center",
    field: "firstname",
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "lastname", align: "center", label: "LASTNAME", field: "lastname" },
  { name: "email", align: "center", label: "EMAIL", field: "email" },
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
  { name: "action", label: "ACTION", field: "action", align: "center" },
];

export default {
  components: {
    LeaveComp
  },
  mixins:[mixin],
  setup() {
    return {
      // prompt: false,
    };
  }, 
  data() {
    return {
      //table server side
      columns,
      loading: false,
      filter: "",
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
      address:'',
      //form data
      oldNumber: "",
      form: {
        id: "",
        mobile: "",
      },
      leave_type: [
        { label: 'Emergency Leave', value: '1' },
        { label: 'Vacation Leave',  value: '2' },
        { label: 'Sick Leave', value: '3' },
        { label: 'Maternity Leave', value: '4'},
        { label: 'Paternity Leave', value: '5' },
        { label: 'Special Leave Benefits for Women', value: '6' },
        { label: 'Bereavement Leave', value: '7' },
        { label: 'Solo Parent Leave',value: '8' },
      ],
      leave: {
        id:'',
        employee_id: '',
        type: '',
        date_start: '',
        date_end: '',
        reliever: '',
        covered: '',
        date_return:'',
        reason: '',
        status: ''
      },
      leaveDialogData:{
        id: '',
        tableData: [],
        dialog: false,
      },
      leaveTableSingle:[],
      leaveTable:[],
      leave_opt: ['Done','Declined','Pending','Approved'],

      //dialog
      prompt: false,
      leaveDialog:false,
      tableDialog: false,
      leaveSingleDialog: false

    };
  },
  methods: {
    // daterange
    // optionsStartDate (date) {
    //   const current = moment(new Date()).format('YYYY/MM/DD')
    //   return date >= current
    // },

    optionsEndDate (date) {
      const endDate = moment(this.leave.date_start).format('YYYY/MM/DD')
      return date >= endDate
    },

    optionsReturn (date) {
      const endReturn = moment(this.leave.date_end).add(1,'days').format('YYYY/MM/DD')
      return date >= endReturn
    },

    test(){
      this.LeaveComp.$emit('test123')
    },

    getLeave() {
      var form = new FormData();
      form.append("id", this.leaveDialogData.id)
      axios.post("https://hris.sgccserver02.com/api/crud/leave", form, {
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          console.log("leave data", res)
          this.leaveTable = res.data.data
          this.leaveTableSingle = res.data.single
        });
    },

    // get leave data
    getLeaveData(data){
        this.tableDialog = true
        this.leaveDialogData.id = data.id
        this.leaveDialogData.tableData = data
        this.getLeave()
    },

    // show dialog
    showTableDialog(data){
      this.leaveDialog = true
      this.leave.id = data.data.id
      this.leave.employee_id = data.data.employee_id
      this.leave.type = data.data.leave_type_id.toString()
      this.leave.date_start = data.data.date_start
      this.leave.date_end = data.data.date_end
      this.leave.reliever = data.data.reliever
      this.leave.covered = data.data.leave_covered
      this.leave.date_return = data.data.date_of_return
      this.leave.reason = data.data.reason
      this.leave.status = data.data.status
    },

    showSingleDialog(data){
      console.log('single dialog',data)
      this.leaveSingleDialog = true
      this.leave.id = data.data.id
      this.leave.employee_id = data.data.employee_id
      this.leave.type = data.data.leave_type_id.toString()
      // this.leave.date_start = data.data.date_start
      // this.leave.date_end = data.data.date_end
      // this.leave.reliever = data.data.reliever
      this.leave.date_start = data.data.leave_date
      this.leave.covered = data.data.leave_covered
      this.leave.date_return = data.data.date_of_return
      this.leave.reason = data.data.reason
      this.leave.status = data.data.status
    },

    //update leave 
    updateLeave () {
        var form = new FormData()
        form.append('id',this.leave.id)
        form.append('leave_type_id',this.leave.type.toString())
        form.append('date_start',this.leave.date_start)
        form.append('date_end',this.leave.date_end)
        form.append('leave_covered',this.leave.date_return)
        form.append('reason',this.leave.reason)
        form.append('status',this.leave.status)

        axios.post("https://hris.sgccserver02.com/api/crud/leave-update",form,{
            headers:{
              "Content-Type": 'json/application'
            }
        }).then((res) => {
            console.log('update:',res.data)
            this.leaveDialog = false
            this.leaveDialogData.id = this.leave.employee_id
            this.logActions(this.leave,'Update Leave',this.userData.id)
            this.getLeave()
        })
    },

    //update leave single file
    updateSingleFile () {
      var form = new FormData()
      form.append('id',this.leave.id)
      form.append('leave_type_id',this.leave.type.toString())
      form.append('leave_date',this.leave.date_start)
      form.append('reason',this.leave.reason)
      form.append('status',this.leave.status)

      axios.post("https://hris.sgccserver02.com/api/crud/single-file-update",form,{
        headers:{
          "Content-Type": 'json/application'
        }
      }).then((res) => {
        console.log('update single file:',res.data)
        this.leaveSingleDialog = false
        this.leaveDialogData.id = this.leave.employee_id
        this.logActions(this.leave,'Update Single File Leave',this.userData.id)
        this.getLeave()
      })
    },

    //change status button
    changeStatus(rowData) {
      // console.log('test change stat:',rowData)
      console.log("test data", rowData.is_active);
      this.$q
        .dialog({
          title: "Employee Status",
          message: "Change employee status",
          options: {
            type: "radio",
            model: (rowData.is_active == 'active') ? "0" : "1",
            // inline: true,
            items: [
              { label: "Active", value: "0", color: "positive" },
              { label: "Inactive", value: "1", color: "negative" },
            ],
          },
          cancel: true,
          persistent: true,
        }).onOk((data) => {
          var form = new FormData()
          form.append('id',rowData.id)
          form.append('key_val',data)
          form.append('key','is_deleted')
          axios.post('https://hris.sgccserver02.com/api/crud/status/update',form,{
            headers: { "Content-Type": "multipart/form-data" },
          }).then((res) => {
            console.log('employee status:',res)
            var msg = res.data.statusCode == 200 ? "Data updated" : "Error";
            var type = res.data.statusCode == 200 ? "positive" : "negative";
            this.message(msg, type);
              this.onRequest({
                pagination: this.pagination,
                filter: this.filter,
              });
            })
            this.logActions({"id":rowData.id,"employee_id":rowData.employee_id,"is_active":data},'Change Status',this.userData.id)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },  

    editDialog(res) {
      this.prompt = true;
      // this.form.mobile = res.mobile_number
      this.oldNumber = res.mobile_number;
      this.form.id = res.id;
    },

    updateNumber() {
      var form = new FormData();
      form.append("id", this.form.id);
      form.append("key_val", this.form.mobile.split(" - ").join(""));
      form.append("key", "mobile_number");
      axios.post("https://hris.sgccserver02.com/api/crud/mobile/update", form, {
          headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        var msg = res.data.statusCode == 200 ? "Data updated" : "Error";
        var type = res.data.statusCode == 200 ? "positive" : "negative";
        this.logActions(this.form,'Update mobile number',this.userData.id)
        this.message(msg, type);
        this.$refs.myForm.resetValidation();
        this.form.mobile = "";
        this.form.id = "";
        this.prompt = false;
        this.onRequest({
          pagination: this.pagination,
          filter: this.filter,
        });
      });
    },

    message(msg, type) {
      this.$q.notify({
        message: msg,
        type: type,
      });
    },

    resetDialog(res) {
      // this.resetPassPromt = true
      this.$q
        .dialog({
          title: "Alert",
          message:'Are you sure you want to reset the password of this user?\nClick OK to continue, password: "sterling"',
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          var form = new FormData();
          form.append("id", res.id);
          axios.post("https://hris.sgccserver02.com/api/crud/resetpass", form, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((result) => {
              var msg = result.data.statusCode == 200 ? "Password reset" : "Error";
              var type = result.data.statusCode == 200 ? "positive" : "negative";
              this.message(msg, type);
              this.logActions(res,'Reset Password',this.userData.id)
            });
        });
    },


    //============star server side table=========
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
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
      axios
        .post(
          "https://hris.sgccserver02.com/api/crud/employees",
          {
            start: offset,
            countPerPage: limit,
            filter: filter,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log('hris',res)
          this.rows = res.data.data;
        });
    },

    getRowsNumberCount(filter) {
        axios.post("https://hris.sgccserver02.com/api/crud/employees/count",{ filter: filter},{
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => {
          this.pagination.rowsNumber = res.data.data;
        });
    },



    //==================end of serverside table ==============================
  },
  mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
    });

    // if(this.$q.localStorage.getItem('is_auth') != true){
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
