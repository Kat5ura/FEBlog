<template>
    <div>
        <div>this is template body</div>
    </div>
</template>
<style>
    .<%= componentName%>{
    }
</style>
<script>
  export default {
    data () {
      return {
        name: '<%= componentName%>'
      }
    },
    components: {}
  }
</script>
