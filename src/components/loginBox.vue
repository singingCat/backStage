<template>
	<transition enter-active-class="animated bounceIn">
		<div class="login-box" v-if="show">
			<div class="ivu-card">
				<div class="ivu-card-head">
					<p><i class="ivu-icon ivu-icon-log-in"></i> 欢迎登录</p>
				</div>
				<div class="ivu-card-body">
					<div class="form-con">
						<Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
							<FormItem prop="email">
					            <Input type="text" v-model="formValidate.email" placeholder="请输入邮箱">
					                <Icon type="ivu-icon ivu-icon-person" slot="prepend" style="font-size: 16px"></Icon>
					            </Input>
					        </FormItem>
							<FormItem prop="password">
					            <Input type="password" v-model="formValidate.password" placeholder="请输入密码">
					                <Icon type="ivu-icon ivu-icon-locked" slot="prepend" style="font-size: 14px"></Icon>
					            </Input>
					       </FormItem>
							<FormItem>
								<Button type="primary" @click="handleSubmit('formValidate')" long>登录</Button>
							</FormItem>
						</Form>
						<p class="login-tip">管理系统后台登录</p>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import qs from 'qs'
	
	export default {
		data (){
			return {
				show: false,
				formValidate: {
					email: '',
					password: ''
				},
				ruleValidate: {
					email: [
						{
							required: true,
							message: '邮箱不能为空',
							trigger: 'blur'
						},
						{
							type: 'email',
							message: '邮箱格式不正确',
							trigger: 'blur'
						}
					],
					password: [
						{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							min: 6,
							message: '密码最少6位',
							trigger: 'blur'
						}
					]
				}
			}
		},
		mounted (){
			this.show = true
		},
		methods: {
			 handleSubmit (name) {
			 	this.$Loading.start();
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	this.$axios.post('user/login', qs.stringify(this.formValidate), 
                    	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                    	.then((response) => {
                    		console.log(response);
                    		if (response.data.result == 'success') {
                    			this.cookieHandler.setCookie('token', response.data.token);	//设置token
	                    		this.storageHandler.setStorage('nickName', response.data.currentUser.user.nickName);
	                    		this.$Loading.finish();
		                        this.$Message.success('登录成功!');
		                        this.$router.push({
					                name: 'main'
					            });
                    		} else {
                    			this.$Message.error('账号&密码错误!');
                    			this.$Loading.error();
                    		}
                    	})
                    	.catch((error) => {
                    		console.log(error);
                    		this.$Loading.error();
                    	})
                    } else {
                    	this.$Loading.error();
                    }
                })
            }
		}
	}
</script>

<style scoped>
	.login-box {
		position: absolute;
		right: 160px;
		top: 50%;
		margin-top: -140px;
		width: 300px;
	}
	.form-con {
		padding-top: 10px;
	}
	.login-tip {
	    font-size: 10px;
		text-align: center;
		color: #c3c3c3;
	}
</style>