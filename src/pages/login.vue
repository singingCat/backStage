<template>
	<div class="login">
		<loginBox></loginBox>
	</div>
</template>

<script>
	import LoginBox from '../components/LoginBox'
	export default {
		name: 'login',
		data() {
			return {
				
			}
		},
		components: {
			LoginBox
		}
	}
</script>

<style>
	html,body {
		height: 100%;
	}
	.login {
	    width: 100%;
	    height: 100%;
	    background-image: url(https://file.iviewui.com/iview-admin/login_bg.jpg);
	    background-size: cover;
	    background-position: center;
	    position: relative;
	}
</style>