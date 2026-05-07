<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../store/chat'

interface Props {
  content: string
  timestamp?: string
  isLoading?: boolean
}
const { isAIReplying } = storeToRefs(useChatStore())

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})


const rawContent = ref('')    // 真实完整内容
const showContent = ref('')   // 显示内容
let timer: number | undefined = undefined

// 监听内容变化
watch(
  () => props.content,
  (newVal) => {
    if (!newVal) return
    rawContent.value = newVal

    // 只有 AI 正在回复时，才用打字机
    if (isAIReplying.value) {
      startTypeWriter()
    } else {
      // 历史消息：直接全部显示
      showContent.value = newVal
    }
  },
  { immediate: true }
)

// 打字机
function startTypeWriter() {
  clearTimeout(timer)
  const tick = () => {
    const total = rawContent.value.length
    const current = showContent.value.length

    if (current < total) {
      showContent.value = rawContent.value.slice(0, current + 1)
      timer = setTimeout(tick, 16)
    }
  }
  tick()
}


const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs code-block"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
      } catch (__) {
        // ignore
      }
    }
    return '<pre class="hljs code-block"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

const renderMarkdown = (content: string): string | void => {
  if (!content) return
  let result = ''

  result = content.split('</think>\n\n')[1] || content.split('</think>')[1]
  if (!result) return//说明还没思考完进入该if

  console.log({ result });
  return md.render(result)
}
</script>

<template>
  <div class="assistant-message">
    <div class="message-content" v-html="renderMarkdown(showContent)"></div>
    <div v-if="isLoading" class="loading-indicator">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div v-if="timestamp" class="message-time">{{ timestamp }}</div>
  </div>
</template>

<style scoped>
.assistant-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 8px 0;
}

.message-content {
  max-width: 80%;
  line-height: 1.6;
  word-break: break-word;
}

.message-content :deep(pre.code-block) {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}

.message-content :deep(code) {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
}

.message-content :deep(p) {
  margin: 8px 0;
}

.message-content :deep(ul),
.message-content :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.message-content :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.message-content :deep(a:hover) {
  text-decoration: underline;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.loading-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.loading-indicator .dot {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: pulse 1.4s infinite ease-in-out both;
}

.loading-indicator .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-indicator .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes pulse {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}
</style>