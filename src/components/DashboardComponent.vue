<template>
    <q-layout view="lHh Lpr lFf" class="bg-grey-9 text-white">
      <q-header elevated class="bg-grey-6">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            @click="toggleLeftDrawer"
            aria-label="Menu"
            icon="menu"
          />
  
          <q-toolbar-title>
            Quasar App
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        class="bg-grey-8"
      >
        <q-list dark>
            <q-item v-for="link in links1" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
  
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  import { ref } from 'vue'
  export default {
    name: 'MyLayout',
    setup () {
      const leftDrawerOpen = ref(false)
      function toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
      return {
        leftDrawerOpen,
        toggleLeftDrawer
      }
    },
    data(){
        return {
            links1: [
                { icon: 'home', text: 'Home' },
                { icon: 'whatshot', text: 'Trending' },
                { icon: 'subscriptions', text: 'Subscriptions' }
            ],
            links2: [
                { icon: 'folder', text: 'Library' },
                { icon: 'restore', text: 'History' },
                { icon: 'watch_later', text: 'Watch later' },
                { icon: 'thumb_up_alt', text: 'Liked videos' }
            ],
            links3: [
                { icon: 'local_movies', text: 'YouTube Premium' },
                { icon: 'local_movies', text: 'Movies & Shows' },
                { icon: 'videogame_asset', text: 'Gaming' },
                { icon: 'live_tv', text: 'Live' }
            ],
        }
    }
  }
  </script>