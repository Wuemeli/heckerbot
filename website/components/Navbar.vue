<template>
      <div class="navbar navbar-expand-md bg-dark navbar-dark">
          <div class="container">
              <a href="" class="navbar-brand text-info">Aris Bot</a>

              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainmenu"><span
                      class="navbar-toggler-icon"></span></button>

              <div class="collapse navbar-collapse" id="mainmenu">
                  <ul class="navbar-nav mx-auto">
                      <li class="nav-item"><a href="#Features" class="nav-link">Features</a></li>
                      <li class="nav-item"><a href="#Statics" class="nav-link">Statics</a></li>
                      <li class="nav-item"><a href="#FAQ" class="nav-link">Ask me</a></li>
                      <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="linksdrop" role="button"
                              data-bs-toggle="dropdown" aria-expanded="false">Links</a>
                          <ul class="dropdown-menu bg-dark" aria-labelledby="linksdrop">
                              <li><a class="dropdown-item text-muted" href="">Invite</a></li>
                              <li><a class="dropdown-item text-muted" href="">Github</a></li>
                              <li><a class="dropdown-item text-muted" href="">Support Server</a></li>
                          </ul>
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