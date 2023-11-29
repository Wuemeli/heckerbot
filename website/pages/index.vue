<template>
  <div class="max-w-4xl px-10 mx-auto space-y-8 text-center animate-fade-up">
    <div class="flex flex-col items-center">
      <p class="text-light-gray">Welcome to Heckerbot</p>
      <p class="text-lg font-semibold text-light-gray">
        An advanced Discord Bot for your server. Built with Bun.sh, Discord.js, and MongoDB.
      </p>
      <p class="text-light-gray">
        Explore the features and learn more about the bot.
      </p>
      <nuxt-link to="/about" class="btn btn-primary">About</nuxt-link>
      <nuxt-link to="/features" class="btn btn-secondary">Features</nuxt-link>
      <p class="text-light-gray">
        I ❤️ creating Discord Bots and Websites
      </p>
      <img
        src="https://spotify-github-profile.vercel.app/api/view?uid=d1ytrh3gx9xa7mzw79h2mbeqi&cover_image=true&theme=novatorem&show_offline=false&background_color=121212&interchange=false&bar_color=53b14f&bar_color_cover=false"
        alt="Spotify Stats" class="w-30 h-auto-center" />
    </div>
  </div>
</template>