<template>
  <div>
    <q-btn
      size="sm"
      label="Add Domain"
      right-icon="person_add"
      color="negative"
      class="q-ma-sm"
      rounded
      @click="prompt = !prompt"
    />

    <q-btn
      size="sm"
      label="Domain Checker"
      right-icon="person_add"
      color="info"
      rounded
      @click="chekDomain"
    />

    <div class="text-subtitle q-ma-sm text-white">
      Note: Domain checker is only show 1week before expired the renewed ssl
    </div>

    <q-table
      dense
      dark
      flat
      class="text-weight-thin text-grey q-ma-sm"
      ref="tableRef"
      title="Domain List"
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
        <q-tr
          :props="props"
          v-bind:class="[props.row.dt < 5 ? 'bg-white text-red' : '']"
        >
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="id" :props="props" style="text-align: left;">
            {{ props.row.domain }}
          </q-td>
          <q-td key="id" :props="props">
            <q-badge color="purple" v-if="(props.row.ipadd != '')">
              {{ props.row.ipadd }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.issued_on }}
          </q-td>
          <q-td key="id" :props="props">
            <q-badge v-if="props.row.dt >= 5" color="positive">
              {{ props.row.expires_on }}
            </q-badge>
            <q-badge v-else color="negative">
              {{ props.row.expires_on }}
            </q-badge>
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.remarks }}
          </q-td>
          <q-td key="id" :props="props" class="q-gutter-sm">
            <q-btn
              v-if="this.userData.privilege == 1"
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
              v-if="this.userData.privilege == 1"
              round
              color="negative"
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
          <div class="text-h6">Domain Form</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="data.domain"
            autofocus
            label="Domain"
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="data.ipadd"
            autofocus
            label="IP Add."
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="data.issued_on"
            autofocus
            label="Issued On"
            type="date"
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="data.expires_on"
            autofocus
            label="Expires On"
            type="date"
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="data.remarks"
            autofocus
            label="Remarks"
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
            v-if="data.id == ''"
            rounded
            label="Submit"
            @click="addDomain"
            color="positive"
          />
          <q-btn
            glossy
            size="sm"
            v-else
            rounded
            label="Update"
            @click="updateData"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="prompt2" persistent>
      <q-card style="min-width: 350px;" dark>
        <q-card-section class="bg-blue-grey-8 q-mb-sm">
          <div class="text-h6">Domain List</div>
          <div class="text-subtitle">List of domain need to renew</div>
        </q-card-section>

        <q-table dark :rows="rows2" :columns="columns2" row-key="name" />

        <q-card-actions align="right" class="bg-blue-grey-8">
          <q-btn
            glossy
            size="sm"
            rounded
            label="Close"
            v-close-popup
            color="negative"
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
  { name: "domain", align: "center", label: "DOMAIN", field: "domain" },
  { name: "ipadd", align: "center", label: "IP ADD", field: "ipadd" },
  {
    name: "issued_on",
    align: "center",
    label: "ISSUED ON",
    field: "issued_on",
  },
  {
    name: "expires_on",
    align: "center",
    label: "EXPIRES ON",
    field: "expires_on",
  },
  { name: "remarks", label: "REMARKS", field: "remarks", align: "center" },
  { name: "action", label: "ACTION", field: "action", align: "center" },
];
const columns2 = [
  { name: "id", align: "center", label: "ID", field: "id" },
  { name: "domain", align: "center", label: "DOMAIN", field: "domain" },
  { name: "ipadd", align: "center", label: "IP ADD", field: "ipadd" },
  {
    name: "issued_on",
    align: "center",
    label: "ISSUED ON",
    field: "issued_on",
  },
  {
    name: "expires_on",
    align: "center",
    label: "EXPIRES ON",
    field: "expires_on",
  },
];
export default {
  mixins: [mixin],
  data() {
    return {
      columns,
      columns2,
      loading: false,
      filter: "",
      rows: [],
      rows2: [],
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
      prompt2: false,
      data: {
        id: "",
        domain: "",
        ipadd: "",
        issued_on: "",
        expires_on: "",
        remarks: "",
      },
    };
  },
  methods: {
    addDomain() {
      var formData = new FormData();
      formData.append("domain", this.data.domain);
      formData.append("ipadd", this.data.ipadd);
      formData.append("issued_on", this.data.issued_on);
      formData.append("expires_on", this.data.expires_on);
      formData.append("remarks", this.data.remarks);
      formData.append("status", "active");
      formData.append("created_by", this.userData.fullname);

      axios
        .post(this.apiUrl + "domain", formData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          console.log(res);
          this.clearData();
          this.onRequest({
            pagination: this.pagination,
            filter: this.filter,
          });
          this.msgAlert(res.data.msg, "positive", "task_alt");
        });
    },
    editDialog(data) {
      console.log(data);
      this.prompt = true;
      this.data.id = data.id;
      this.data.domain = data.domain;
      this.data.ipadd = data.ipadd;
      this.data.issued_on = data.issued_on;
      this.data.expires_on = data.expires_on;
      this.data.remarks = data.remarks;
    },

    updateData() {
      var formData = new FormData();
      formData.append("id", this.data.id);
      formData.append("domain", this.data.domain);
      formData.append("ipadd", this.data.ipadd);
      formData.append("issued_on", this.data.issued_on);
      formData.append("expires_on", this.data.expires_on);
      formData.append("remarks", this.data.remarks);
      formData.append("status", "active");

      axios
        .post(this.apiUrl + "domain/mod", formData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          console.log(res);
          this.clearData();
          this.onRequest({
            pagination: this.pagination,
            filter: this.filter,
          });
          this.msgAlert(res.data.msg, "positive", "task_alt");
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
          axios
            .post(
              this.apiUrl + "domain/rem",
              { id: data.id },
              {
                headers: { "Content-Type": "application/json" },
              }
            )
            .then((res) => {
              this.onRequest({
                pagination: this.pagination,
                filter: this.filter,
              });
              this.msgAlert(res.data.msg, "positive", "task_alt");
            });
        });
    },
    clearData() {
      this.prompt = false;
      this.data.id = "";
      this.data.domain = "";
      this.data.ipadd = "";
      this.data.issued_on = "";
      this.data.expires_on = "";
      this.data.remarks = "";
    },
    // ============================SERVERSIDE==============================================

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
          this.apiUrl + "domain/fetchall",
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
          this.apiUrl + "domain/count",
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
    // =============================END SERVERSIDE===========================================
    chekDomain() {
      axios
        .get(this.apiUrl + "dom-check", {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          console.log("check domain", res.data.length);
          if (res.data.length <= 0) {
            this.msgAlert("No found domain to renew", "positive", "task_alt");
          } else {
            this.prompt2 = !this.prompt2;
            this.rows2 = res.data;
          }
        });
    },
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

<style></style>
