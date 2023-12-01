<template>
  <section id="Stats" class="py-5 bg-dark text-light">
    <div class="container">
      <div class="py-2 text-center">
        <h2>Statics:</h2>
      </div>
      <div class="row align-items-center justify-content-center text-center -5">
        <div class="col">
          <img src="~/assets/img/statics.svg" alt="" class="img-fluid d-none d-md-block">
        </div>
        <div class="col-sm p-5 h1">
          <i class="bi bi-hdd-stack text-primary"></i>
          <h5>{{ serverCount }}</h5>
          <h5>Server</h5>
        </div>
        <div class="col-sm p-5 h1">
          <i class="bi bi bi-people-fill text-primary"></i>
          <h5>{{ userCount }}</h5>
          <h5>Users</h5>
        </div>
        <div class="col-sm p-5 h1">
          <i class="bi bi bi-hash text-primary"></i>
          <h5>{{ channelCount }}</h5>
          <h5>Channels</h5>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Info',
  data() {
    return {
      serverCount: 0,
      userCount: 0,
      channelCount: 0,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('https://heckerbot.wuemeli.com/stats');
        const data = await response.json();

        this.serverCount = data.guildCount;
        this.userCount = data.userCount;
        this.channelCount = data.channelCount;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>
