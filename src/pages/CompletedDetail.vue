<template>
	<div>
		<template v-for="item in questions" :key="">
			<P>{{item.title}}</P>
			<RadioGroup v-if="item.optionType == 1" v-model="item.optionId" class="mt10">
                <Radio v-for="elem in item.options" :key="elem.uid" :label="elem.uid">{{elem.content}}</Radio>
            </RadioGroup>
            <CheckboxGroup v-if="item.optionType == 2" v-model="item.optionId" class="mt10">
            	<Checkbox v-for="elem in item.options" :key="elem.uid" :label="elem.uid">{{elem.content}}</Checkbox>
            </CheckboxGroup>
            <Input v-if="item.optionType == 3" type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="item.content" class="mt10"></Input>
		</template>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				questions: this.$route.query.questions,							//问题
				userQuestionAnswers: this.$route.query.userQuestionAnswers		//答案
			}
		},
		methods: {
			initData () {
				let questions = this.$route.query.questions;
				let userQuestionAnswers = this.$route.query.userQuestionAnswers;
				questions.forEach((item, index) => {
					let questionId = item.uid;
					let checkBoxValue = [];
					for (let i in userQuestionAnswers) {
						if(questionId == userQuestionAnswers[i].questionId) {
							if (item.optionType == 1) {
								item.optionId = userQuestionAnswers[i].optionId;
							} else if (item.optionType == 2) {
								checkBoxValue.push(userQuestionAnswers[i].optionId);
								item.optionId = checkBoxValue;
							} else {
								item.content = userQuestionAnswers[i].content;
							}
						}
					}
				});
			}
		},
		created () {
			this.initData();
		}
	}
</script>

<style scoped>
	.mt10 {
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>