<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface Props {
  content: string
  timestamp?: string
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

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

  result = content.split('</think>\n\n')[1]
  if (!result) content.split('</think>')[1]
  if (!result) return//说明还没思考完进入该if

  return md.render(result)
}
</script>

<template>
  <div class="assistant-message">
    <div class="message-content" v-html="renderMarkdown(content)"></div>
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