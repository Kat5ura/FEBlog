<template>
    <div>
        <div>this is template body</div>
    </div>
</template>
<style>
  .<%= pageName%> {

  }
</style>
<script>
  export default {
    data () {
      return {
        name: '<%= pageName%>'
      }
    },
    components: {}
  }
</script>
