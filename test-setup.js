// 简单的Vue 3 setup语法验证
import { defineComponent, ref, reactive, computed } from 'vue'

// 测试基本组件
const testComponent = defineComponent({
  name: 'TestComponent',
  setup() {
    const count = ref(0)
    const data = reactive({
      name: 'test',
      items: []
    })

    const doubleCount = computed(() => count.value * 2)

    return {
      count,
      data,
      doubleCount
    }
  }
})

console.log('Vue 3 setup syntax test passed!')