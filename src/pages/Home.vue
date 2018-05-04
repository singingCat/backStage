<template>
  <p><v-countup :start-value="startValue" :end-value="endValue" class="countUp"></v-countup></p>
</template>

<script>
	export default {
	  data () {
	    return {
	      startValue: 0,
	      endValue: 491
	    }
	  }
	}
</script>

<style scoped>
	.countUp {
		font-size: 36px;
		font-weight: bold;
		color: blue;
	}
</style>
