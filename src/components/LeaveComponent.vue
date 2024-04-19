<template>
    <q-card class="text-negative" style="width: 700px; max-width: 80vw;">

        <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ emp_data.lastname + "," + emp_data.firstname }}</q-item-label>
          <q-item-label caption>
            {{ emp_data.employee_id }}
          </q-item-label>
        </q-item-section>
        
      </q-item>
      

      <q-card-section class="q-pt-none">

        <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="dark bg-orange rounded-borders"
            indicator-color="negative"
            align="justify"
        >
          <q-tab name="w_day" label="Employee Leave" />
          <q-tab name="h_day" label="Single File" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-brown-5 rounded-borders" >
          <q-tab-panel name="w_day">
            <q-table
                dark
                title="Employee Leave"
                :rows="leaveTable"
                :columns="columns"
                row-key="name"
            >
                <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="id" :props="props">
                        {{ props.row.id }}
                    </q-td>
                    <q-td key="id" :props="props">{{ leaveType(props.row.leave_type_id) }}</q-td>
                    <q-td key="id" :props="props">{{ props.row.date_start }}</q-td>
                    <q-td key="id" :props="props">{{ props.row.date_end }}</q-td>
                    <q-td key="id" :props="props">{{ props.row.date_of_return }}</q-td>
                    <q-td key="id" :props="props">{{ props.row.leave_covered }}</q-td>
                    <q-td key="id" :props="props" class="ellipsis">{{ props.row.reason }}</q-td>
                    <q-td key="id" :props="props">
                      <q-badge :color="
                          (props.row.status.toLowerCase() == 'done') ? 'positive' :
                          (props.row.status.toLowerCase() == 'declined') ? 'negative' :
                          (props.row.status.toLowerCase() == 'pending') ? 'warning' : 'primary'
                        ">
                        {{ props.row.status }}
                      </q-badge>
                    </q-td>

                    <q-td key="id" :props="props" class="q-gutter-sm">
                    <q-btn
                        round
                        glossy
                        color="positive"
                        size="xs"
                        icon="edit"
                        @click="showDialog(props.row)"
                        >
                        <q-tooltip>Edit Leave</q-tooltip>
                        </q-btn>
                    </q-td>
                </q-tr>
            </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="h_day">
            <q-table
                dark
                title="Single File"
                :rows="leaveTableSingle"
                :columns="columns2"
                row-key="name"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }} <span class="text-primary">{{props.row.leave_applications_entry_id }}</span>
                  </q-td>
                  <q-td key="id" :props="props">{{ leaveType(props.row.leave_type_id) }}</q-td>
                  <q-td key="id" :props="props">{{ props.row.leave_date }}</q-td>
<!--                  <q-td key="id" :props="props">{{ props.row.date_end }}</q-td>-->
<!--                  <q-td key="id" :props="props">{{ props.row.date_of_return }}</q-td>-->
                  <q-td key="id" :props="props">{{ props.row.leave_covered }}</q-td>
                  <q-td key="id" :props="props" class="ellipsis">{{ props.row.reason }}</q-td>
                  <q-td key="id" :props="props">
                    <q-badge :color="
                          (props.row.status.toLowerCase() == 'done') ? 'positive' :
                          (props.row.status.toLowerCase() == 'declined') ? 'negative' :
                          (props.row.status.toLowerCase() == 'pending') ? 'warning' : 'primary'
                        ">
                      {{ props.row.status }}
                    </q-badge>
                  </q-td>

                  <q-td key="id" :props="props" class="q-gutter-sm">
                    <q-btn
                        round
                        glossy
                        color="positive"
                        size="xs"
                        icon="edit"
                        @click="showSingleDialog(props.row)"
                    >
                      <q-tooltip>Edit Leave</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-dark">
        <q-btn rounded label="Close" size="sm" color="negative" v-close-popup/>
        <!-- <q-btn rounded label="Submit" size="sm" color="primary" /> -->
      </q-card-actions>
    </q-card>
</template>

<script>

const columns = [
  {
    name: "id",
    align: "center",
    label: "ID",
    field: "id",
    sortable: true,
  },
  { name: "leave_type_id",align: "center", label: "Leave Type", field: "leave_type_id", sortable: true },
  { name: "date_start",align: "center", label: "Date Start", field: "date_start" },
  { name: "date_end",align: "center", label: "Date End", field: "date_end" },
  { name: "date_of_return",align: "center", label: "Date of Return", field: "date_of_return" },
  { name: "leave_covered",align: "center", label: "Leave Covered", field: "leave_covered" },
  { name: "reason",align: "center", label: "Reason", field: "reason" },
  { name: "status",align: "center", label: "Status", field: "status" },
  { name: "action",align: "center", label: "Action" },

];
const columns2 = [
  {
    name: "id",
    align: "center",
    label: "ID",
    field: "id",
    sortable: true,
  },
  { name: "leave_type_id",align: "center", label: "Leave Type", field: "leave_type_id", sortable: true },
  { name: "date_start",align: "center", label: "Leave Date", field: "date_start" },
  // { name: "date_end",align: "center", label: "Date End", field: "date_end" },
  // { name: "date_of_return",align: "center", label: "Date of Return", field: "date_of_return" },
  { name: "leave_covered",align: "center", label: "Leave Covered", field: "leave_covered" },
  { name: "reason",align: "center", label: "Reason", field: "reason" },
  { name: "status",align: "center", label: "Status", field: "status" },
  { name: "action",align: "center", label: "Action" },

]
export default {
  props: {
    id: Number,
    tableData: Object,
    dialog: Boolean,
    leaveTable: Array,
    leaveTableSingle:Array
  },
  emits:['showDialog','getLeave'],
  data() {
    return {
      tableDialog: this.dialog,
      data: [],
      emp_data: this.tableData,
      emp_id: this.id,
      columns,
      columns2,
      tab:'w_day'
    };
  },
  methods: {
    showDialog(data){
        this.$emit('showDialog',{data})
    },
    showSingleDialog(data){
      this.$emit('singleDialog',{data})
    },
    leaveType(type){
        var lType = ''
        switch(type){
          case 1:
              lType = 'Emergency Leave'
              break
          case 2:
              lType = 'Vacation Leave'
              break
          case 3:
            lType = 'Sick Leave'
            break
          case 4:
            lType = 'Maternity Leave'
            break
          case 5:
            lType = 'Paternity Leave'
            break
          case 6:
            lType = 'Special Leave Benefits for Women'
            break
          case 7:
            lType = 'Bereavement Leave'
            break
          case 8:
            lType = 'Solo Parent Leave'
            break
          default:
            lType = 'Others'
            break
        }
        return lType;
    }
  }
};
</script>
