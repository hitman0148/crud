<template>
  <div>
    <q-btn
      size="sm"
      label="Create User"
      right-icon="person_add"
      color="negative"
      class="q-ma-sm"
      rounded
      @click="prompt = !prompt"
    />
    <q-table
      dense
      dark
      flat
      class="text-weight-thin text-grey q-ma-sm"
      ref="tableRef"
      title="User List"
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
          <q-td key="id" :props="props" style="text-align: center;" width="5px">
            <q-avatar size="24px" v-if="props.row.profile != ''">
              <q-img
                circle
                :src="props.row.profile != '' ? props.row.profile : ''"
              />
            </q-avatar>
            <!-- <q-avatar size="24px" v-else :style="styleObject" text-color="white" class="text-weight-bold">{{props.row.fullname.split('')[0].toUpperCase()}}</q-avatar> -->
            <q-avatar
              size="24px"
              v-else
              :style="{
                'background-color': this.randomColor(),
                border: 'solid 1px white',
              }"
              text-color="white"
              class="text-weight-bold"
            >
              <div class="absolute-center">
                {{ props.row.fullname.split("")[0].toUpperCase() }}
              </div>
            </q-avatar>
          </q-td>
          <q-td key="id" :props="props" style="text-align: left;">
            {{ props.row.fullname }}
          </q-td>
          <q-td key="id" :props="props">
            <q-badge color="purple">
              {{ props.row.employee_id }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props" class="q-gutter-sm">
            <q-btn
              round
              glossy
              color="primary"
              size="5px"
              icon="edit"
              @click="editDialog(props.row)"
            >
              <q-tooltip>Edit User</q-tooltip>
            </q-btn>
            <q-btn
              round
              glossy
              color="negative"
              size="5px"
              icon="autorenew"
              @click="resetPassword(props)"
            >
              <q-tooltip>Reset Password</q-tooltip>
            </q-btn>
            <q-btn
              round
              color="warning"
              size="5px"
              icon="delete"
              @click="deleteUser(props.row)"
            >
              <q-tooltip>Delete User</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px;" dark>
        <q-card-section class="bg-blue-grey-8 q-mb-sm">
          <div class="text-h6">User Form</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="user_data.fullname"
            autofocus
            label="Fullname"
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="user_data.employee_id"
            autofocus
            label="Employee ID"
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="user_data.id == ''">
          <q-input
            filled
            dense
            v-model="user_data.password"
            :type="isPwd ? 'password' : 'text'"
            autofocus
            label="Password"
            dark
            clear
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-file
            filled
            dense
            v-model="user_data.profile"
            label="Profile Image"
            stack-label
            dark
            clear
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-8">
          <q-btn
            glossy
            size="sm"
            rounded
            label="Cancel"
            v-close-popup
            color="negative"
          />
          <q-btn
            glossy
            size="sm"
            v-if="user_data.id == ''"
            rounded
            label="Submit"
            @click="createUser"
            color="positive"
          />
          <q-btn
            glossy
            size="sm"
            v-else
            rounded
            label="Update"
            @click="updateUser"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import mixin from "../mixin";
import axios from "axios";

const columns = [
  { name: "id", align: "center", label: "ID", field: "id" },
  { name: "profile", align: "center", label: "PROFILE", field: "profile" },
  {
    name: "fullname",
    required: true,
    label: "FULLNAME",
    align: "center",
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
  { name: "action", label: "ACTION", field: "action", align: "center" },
];
export default {
  mixins: [mixin],
  setup() {},
  data() {
    return {
      users: [],
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

      prompt: false,
      user_data: {
        id: "",
        fullname: "",
        employee_id: "",
        password: "",
        profile: "",
      },
      isPwd: true,
      base64: "",
      // styleObject: {
      //     color: 'red',
      //     'background-color': this.randomColor()
      // },
    };
  },
  watch: {
    "user_data.profile"(newVal) {
      if (newVal) {
        this.createBase64Image(newVal);
      } else {
        this.base64 = null;
      }
    },
  },
  methods: {
    resetPassword(props) {
      this.$q
        .dialog({
          title: "Reset Password",
          message: "Enter New Password(min 4 character)",
          prompt: {
            model: "",
            isValid: (val) => val.length >= 4, // << here is the magic
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
          dark: true,
        })
        .onOk((data) => {
          var formData = new FormData();
          formData.append("id", props.row.id);
          formData.append("password", data);
          axios
            .post(this.apiUrl + "user/resetpass", formData, {
              headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
              if (res.data.status == 200) {
                this.msgAlert(res.data.message, "positive", "task_alt");
              } else {
                this.msgAlert(res.data.message, "negative", "error");
              }
            });
        });
    },

    editDialog(data) {
      console.log("edit data:", data);
      this.prompt = true;
      this.user_data.id = data.id;
      this.user_data.fullname = data.fullname;
      this.user_data.employee_id = data.employee_id;
      this.base64 = data.profile;
    },

    updateUser() {
      let formData = new FormData();
      formData.append("id", this.user_data.id);
      formData.append("fullname", this.user_data.fullname.toUpperCase());
      formData.append("employee_id", this.user_data.employee_id.toUpperCase());
      formData.append("profile", this.base64);

      axios
        .post(this.apiUrl + "user/update", formData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          // console.log('update update',res)
          this.prompt = false;
          this.onRequest({
            pagination: this.pagination,
            filter: this.filter,
          });
          this.msgAlert(res.data.message, "positive", "task_alt");
          this.user_data.employee_id = "";
          this.user_data.fullname = "";
          this.user_data.password = "";
          this.user_data.profile = "";
          this.base64 = "";
        });
    },

    deleteUser(data) {
      this.$q
        .dialog({
          dark: true,
          title: "Delete User",
          message: "Are you sure?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          axios.post(this.apiUrl + "user/delete/" + data.id).then((res) => {
            if (res.data.status == 200) {
              this.onRequest({
                pagination: this.pagination,
                filter: this.filter,
              });
            }
          });
        });
    },

    createBase64Image(FileObject) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
      };
      reader.readAsDataURL(FileObject);
    },

    randomColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    },

    createUser() {
      // var read = new FileReader()
      // console.log('get file',this.user_data.profile)
      // console.log('base 64:',read.readAsDataURL(this.user_data.profile[0]))

      this.user_data.id = "";
      let formData = new FormData();
      formData.append("fullname", this.user_data.fullname.toUpperCase());
      formData.append("employee_id", this.user_data.employee_id.toUpperCase());
      formData.append("password", this.user_data.password);
      formData.append("profile", this.base64);

      axios
        .post(this.apiUrl + "add-user", formData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          var myRes = res.data;
          if (myRes.status == 200) {
            this.prompt = false;
            this.onRequest({
              pagination: this.pagination,
              filter: this.filter,
            });
            this.msgAlert(myRes.message, "positive", "task_alt");
            this.user_data.employee_id = "";
            this.user_data.fullname = "";
            this.user_data.password = "";
            this.user_data.profile = "";
            this.base64 = "";
          } else {
            if (Object.values(myRes.data).length > 0) {
              let myKey = Object.keys(myRes.data);
              myKey.forEach((item) => {
                console.log("msg", myRes.data[item]);
                this.msgAlert(myRes.data[item].toString(), "warning", "error");
              });
            }
          }
        });
    },
    //============star server side table=========
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      this.loading = true;
      var cleanText = props.filter == undefined ? "" : props.filter.trim();

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
          this.apiUrl + "users",
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
          this.rows = res.data;
        });
    },

    getRowsNumberCount(filter) {
      axios
        .post(
          this.apiUrl + "users/count",
          { filter: filter },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          this.pagination.rowsNumber = res.data;
        });
    },
    //==================end of serverside table ==============================
  },
  mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
    });

    if (this.$q.cookies.get("is_auth") != "true") {
      window.location = "#/";
      this.logoutData();
    }
  },
};
</script>
