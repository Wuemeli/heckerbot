<template>
      <section id="FAQ" class="py-5">
          <div class="container">
              <h2 class="text-center mb-3">
                  Frequently Asked Qusetions
              </h2>
              <div class="accordion accordion-flush" id="your-faq">
                  <div class="accordion-item">
                      <h5 class="accordion-header" id="qusetion-1">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#answer-1">
                              Question One
                          </button>
                      </h5>
                      <div class="accordion-collapse collapse p-3" id="answer-1" data-bs-parent="#your-faq">
                          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae libero cumque, obcaecati soluta voluptatibus in!
                      </div>
                  </div>
                  <div class="accordion-item">
                      <h5 class="accordion-header" id="qusetion-2">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#answer-2">
                              Question Two
                          </button>
                      </h5>
                      <div class="accordion-collapse collapse p-3" id="answer-2" data-bs-parent="#your-faq">
                          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae libero cumque, obcaecati soluta voluptatibus in!
                      </div>
                  </div>
                  <div class="accordion-item">
                      <h5 class="accordion-header" id="qusetion-3">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#answer-3">
                              Question Three
                          </button>
                      </h5>
                      <div class="accordion-collapse collapse p-3" id="answer-3" data-bs-parent="#your-faq">
                          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae libero cumque, obcaecati soluta voluptatibus in!
                      </div>
                  </div>
              </div>
          </div>
      </section>
</template>

<script>
export default {
  name: 'Info',
};
</script>