<template>
      <div class="navbar navbar-expand-md bg-dark navbar-dark">
          <div class="container">
              <a href="" class="navbar-brand text-info">Heckerbot</a>

              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainmenu"><span
                      class="navbar-toggler-icon"></span></button>

              <div class="collapse navbar-collapse" id="mainmenu">
                  <ul class="navbar-nav mx-auto">
                      <li class="nav-item"><a href="#Features" class="nav-link">Features</a></li>
                      <li class="nav-item"><a href="#Stats" class="nav-link">Stats</a></li>
                      <li class="nav-item"><a href="#FAQ" class="nav-link">FAQ</a></li>
                      <li class="nav-item dropdown">
                      </li>
                  </ul>
                  <li class="navbar-nav nav-item"><a href="" class="btn btn-outline-info">Login</a></li>
              </div>
          </div>
      </div>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>