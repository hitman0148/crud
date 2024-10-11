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
          <div class="text-h6">Domain Form</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="user_data.domain"
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
            v-model="user_data.ipadd"
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
            v-model="user_data.daterenew"
            autofocus
            label="Date Renew"
            type="date"
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="user_data.dateexp"
            autofocus
            label="Date Expired"
            type="date"
            dark
            clear
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            filled
            dense
            v-model="user_data.remarks"
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
// import axios from "axios";

const columns = [
  { name: "id", align: "center", label: "ID", field: "id" },
  { name: "domain", align: "center", label: "DOMAIN", field: "domain" },
  { name: "ipadd", align: "center", label: "IP ADD", field: "ipadd" },
  {
    name: "date_renew",
    align: "center",
    label: "DATE RENEW",
    field: "date_renew",
  },
  {
    name: "date_exp",
    align: "center",
    label: "DATE EXPIRED",
    field: "date_exp",
  },
  { name: "remarks", label: "REMARKS", field: "remarks", align: "center" },
  { name: "action", label: "ACTION", field: "action", align: "center" },
];
export default {
  mixins: [mixin],
  data() {
    return {
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
        domain: "",
        ipadd: "",
        daterenew: "",
        dateexp: "",
        remarks: "",
      },
    };
  },
  methods: {},
};
</script>

<style></style>
