<template>
    <span :title="title" style="margin:10px">
    <!-- $attrs 类型 $listeners 事件 -->
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </span>
</template>

<script>
export default {
    name: 'HintButton',
    props:['title'],
    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="scss" scoped>

</style>