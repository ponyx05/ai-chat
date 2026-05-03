<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface Props {
  content: string
  timestamp?: string
}

defineProps<Props>()

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

const renderMarkdown = (content: string): string => {
  let skipMode = false
  let result = ''
  let i = 0

  while (i < content.length) {
    if (skipMode) {
      const endTagIndex = content.indexOf('</think>', i)
      if (endTagIndex !== -1) {
        i = endTagIndex + '</think>'.length
        skipMode = false
      } else {
        break
      }
    } else {
      const startTagIndex = content.indexOf('<think>', i)
      if (startTagIndex === -1) {
        result += content.slice(i)
        break
      } else if (startTagIndex === i) {
        i += '<think>'.length
        skipMode = true
      } else {
        result += content.slice(i, startTagIndex)
        i = startTagIndex + '<think>'.length
        skipMode = true
      }
    }
  }

  return md.render(result)
}
</script>

<template>
  <div class="assistant-message">
    <div class="message-content" v-html="renderMarkdown(content)"></div>
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
</style>