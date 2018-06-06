<template>
	<div>
		<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
	        <FormItem label="数币简称:" prop="symbolName">
	            <Input v-model="formValidate.symbolName" placeholder="请输入数币简称"></Input>
	        </FormItem>
	        <FormItem label="名称(英文):" prop="nameEnUs">
	            <Input v-model="formValidate.nameEnUs" placeholder="请输入英文名称"></Input>
	        </FormItem>
	        <FormItem label="名称(中文):" prop="nameZhCn">
	            <Input v-model="formValidate.nameZhCn" placeholder="请输入中文名称"></Input>
	        </FormItem>
	        <FormItem label="状态:" prop="status">
	            <Select v-model="formValidate.status">
	            	<Option value="1">已上市</Option>
	            	<Option value="2">ICO</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="空投状态:" prop="airdropStatus">
	            <Select v-model="formValidate.airdropStatus">
	            	<Option value="1">无空投</Option>
	            	<Option value="2">正在空投</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="数币简介:">
	            <Input v-model="formValidate.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入数币简介"></Input>
	        </FormItem>
	        <FormItem label="流通量:">
	            <Input v-model="formValidate.circulatingSupply" placeholder="请输入流通量"></Input>
	        </FormItem>
	        <FormItem label="总供应量:">
	            <Input v-model="formValidate.totalSupply" placeholder="请输入总供应量"></Input>
	        </FormItem>
	        <FormItem label="最大供应量:">
	            <Input v-model="formValidate.maxSupply" placeholder="请输入最大供应量"></Input>
	        </FormItem>
	        <FormItem label="logoUrl:">
	            <Input v-model="formValidate.logoUrl" placeholder="请输入logoUrl"></Input>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
	        </FormItem>
		</Form>
	</div>
</template>

<script>
	import qs from 'qs'
	
	export default {
		data () {
			return {
				formValidate: {
					symbolName: '',			
					nameEnUs: '',			
					nameZhCn: '',			
					status: '',				
					airdropStatus: '',		
					introduction: '',		
					circulatingSupply: '',	
					totalSupply: '',		
					maxSupply: '',			
					logoUrl: ''				
				},
				ruleValidate: {
					symbolName: [
                        { required: true, message: '数币简称不能为空', trigger: 'blur' }
                    ],
                    nameEnUs: [
                        { required: true, message: '英文名称不能为空', trigger: 'blur' }
                    ],
                    nameZhCn: [
                        { required: true, message: '中文名称不能为空', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '状态不能为空', trigger: 'blur' }
                    ],
                    airdropStatus: [
                        { required: true, message: '空投状态不能为空', trigger: 'blur' }
                    ]
				}
			}
		},
		methods: {
            handleSubmit (name) {
            	this.$refs[name].validate((valid) => {
                    if (valid) {
                    	let routeName = this.$route.name;
                    	if (routeName == 'coinEdit') {
                    		this.editConfirm();
                    	} else if (routeName == 'coinAdd') {
                    		this.addConfirm();
                    	}
                    }
                })
            },
            addConfirm () {
            	this.formValidate['adminUuid'] = localStorage.adminUuid;
                    	
            	this.$axios.post('coin/add', qs.stringify(this.formValidate), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            	.then((response) => {
            		if (response.data.result == 'success') {
                        this.$Notice.success({ title: '操作成功' });
                        this.$router.push({ path: 'coinList' });
            		} else {
            			this.$Notice.error({ title: response.data.message });
            		}
            	})
            	.catch((error) => {
            		this.$router.push({ path: '/500' });
            	})
            },
            editConfirm () {
            	this.formValidate['uid'] = this.$route.params.uid;
            	this.formValidate['adminUuid'] = localStorage.adminUuid;
            	
            	this.$axios.post('coin/update', qs.stringify(this.formValidate), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            	.then((response) => {
            		if (response.data.result == 'success') {
                        this.$Notice.success({ title: '操作成功' });
                        this.$router.push({ path: 'coinList' });
            		} else {
            			this.$Notice.error({ title: response.data.message });
            		}
            	})
            	.catch((error) => {
            		this.$router.push({ path: '/500' });
            	})
            }
        },
        mounted () {
        	console.log(this.$route.query);
        	if(this.$route.name == 'coinEdit') {	//假如是编辑
        		let row = this.$route.query.row;
	        	for (let key in row) {
	        		for (let formKey in this.formValidate) {
	        			if (key == formKey) {
	        				this.formValidate[formKey] = row[key];
	        			}
	        		}
	        	}
        	}
        }
	}
</script>

<style scoped>
	
</style>