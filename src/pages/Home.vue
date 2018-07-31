<template>
	<div>
  	<!--<p><v-countup :start-value="startValue" :end-value="endValue" class="countUp"></v-countup></p>-->
  	<froala :config="config" v-model="content"></froala>
  </div>
</template>

<script>
	import VueFroala from 'vue-froala-wysiwyg';
	
	export default {
	  data () {
	    return {
	      startValue: 0,
	      endValue: 491,
	      content: '6666',
	      config: {
			  placeholderText: "Edit Me",
			  imageUploadURL: '/api/news/editor/image',
			  events : {
			  	'froalaEditor.initialized': (e, editor) => {
			      /*editor.html.set('12345');*/
			    },
			    'froalaEditor.html.get' : function(e, editor, html) {
			      console.log(html);
			    }
			  }
			}
	    }
	  },
	 	methods: {
	 		
	 	},
	  mounted () {
  		
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
