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
							<FormItem prop="name">
					            <Input type="text" v-model="formValidate.name" placeholder="Username">
					                <Icon type="ivu-icon ivu-icon-person" slot="prepend" style="font-size: 16px"></Icon>
					            </Input>
					        </FormItem>
							<FormItem prop="password">
					            <Input type="password" v-model="formValidate.password" placeholder="Password">
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
	export default {
		data (){
			return {
				show: false,
				formValidate: {
					name: '',
					password: ''
				},
				ruleValidate: {
					name: [
						{
							required: true,
							message: '用户名不能为空',
							trigger: 'blur'
						}
					],
					password: [
						{
							required: true,
							message: '密码不能为空',
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
                    	this.$Loading.finish();
                        this.$Message.success('Success!');
                        this.$router.push({
			                name: 'main'
			            });
                    } else {
                    	this.$Loading.error();
                        this.$Message.error('Fail!');
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