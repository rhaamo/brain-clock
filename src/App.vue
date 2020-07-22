<template>
  <div id="app">
    <header id="appHeader">
      <b-container fluid>
        <b-row>
          <b-col cols="4">
            <textarea name="taskText" id="taskText" cols="20" rows="3" placeholder="OwO ?"></textarea>
          </b-col>
          <b-col>
            Started: <span id="timerStartDate">not yet.</span><br />
            Spent: <span id="timerSpentTime">0ns.</span>
          </b-col>
          <b-col cols="2">
            <b-button variant="primary" id="btTimer"><i class="fa fa-play" aria-hidden="true"></i></b-button>
          </b-col>
        </b-row>
      </b-container>
    </header>

    <div id="nav">
      <b-nav tabs justified>
        <b-nav-item :active='$route.name =="home"' :to="{ name: 'home' }">Tasks</b-nav-item>
        <b-nav-item :active='$route.name =="settings"' :to="{ name: 'settings' }">Settings</b-nav-item>
        <b-nav-item :active='$route.name =="about"' :to="{ name: 'about' }">About</b-nav-item>
      </b-nav>
    </div>

    <router-view/>
  </div>
</template>

<style lang="scss" src="./App.scss"></style>
