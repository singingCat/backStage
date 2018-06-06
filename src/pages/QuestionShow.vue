<template>
	<div>
		<template v-for="item in question" :key="">
			<P>{{item.title}}</P>
			<RadioGroup v-if="item.optionType == 1" class="mt10">
                <Radio v-for="elem in item.options" :key="elem.uid" label="elem.uid">{{elem.content}}</Radio>
            </RadioGroup>
            <CheckboxGroup v-if="item.optionType == 2" class="mt10">
            	<Checkbox v-for="elem in item.options" :key="elem.uid" :label="elem.uid">{{elem.content}}</Checkbox>
            </CheckboxGroup>
            <Input v-if="item.optionType == 3" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="mt10"></Input>
		</template>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				question: this.$route.query.questions
			}
		}
	}
</script>

<style scoped>
	.mt10 {
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>