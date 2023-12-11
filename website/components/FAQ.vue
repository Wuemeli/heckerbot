<template>
  <section id="FAQ" class="py-5">
    <div class="container">
      <h2 class="text-center mb-3">
        Frequently Asked Questions
      </h2>
      <div class="space-y-4" id="your-faq">
        <div>
          <h5 class="cursor-pointer" @click="show1 = !show1" id="question-1">
            Question One
          </h5>
          <div v-if="show1" class="p-3" id="answer-1">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae libero cumque, obcaecati soluta voluptatibus
            in!
          </div>
        </div>
        <div>
          <h5 class="cursor-pointer" @click="show2 = !show2" id="question-2">
            Question Two
          </h5>
          <div v-if="show2" class="p-3" id="answer-2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae libero cumque, obcaecati soluta voluptatibus
            in!
          </div>
        </div>
        <div>
          <h5 class="cursor-pointer" @click="show3 = !show3" id="question-3">
            Question Three
          </h5>
          <div v-if="show3" class="p-3" id="answer-3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae libero cumque, obcaecati soluta voluptatibus
            in!
          </div>
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
      show1: false,
      show2: false,
      show3: false,
    };
  },
};
</script>