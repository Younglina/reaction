<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="font-display text-3xl font-bold mb-2">颜色反应测试</h1>
      <p class="font-body text-muted">等待屏幕变为红色，然后尽快点击。</p>
    </div>

    <div class="neumorph-card mb-8">
      <div
        class="relative w-full h-80 rounded-inner cursor-pointer flex items-center justify-center transition-colors duration-75"
        :class="backgroundColor"
        @pointerdown="handleClick"
      >
        <div class="text-center select-none">
          <p class="font-display text-2xl font-bold mb-2 text-white pointer-events-none">
            {{ displayStatus }}
          </p>
          <p class="font-body text-white pointer-events-none">
            {{ displayInstruction }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-center gap-4 mb-8">
      <button class="neumorph-button neumorph-button-hover" @click="startTest">
        开始测试
      </button>
      <button class="neumorph-button neumorph-button-hover" @click="clearData">
        清除数据
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="neumorph-card">
        <h3 class="font-display text-lg font-bold mb-4">本次统计</h3>
        <div class="space-y-2 font-body">
          <div class="flex justify-between">
            <span class="text-muted">测试次数</span>
            <span class="font-medium">{{ stats.attempts }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">平均反应时间</span>
            <span class="font-medium">{{ stats.avgRt }} 毫秒</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">最快反应时间</span>
            <span class="font-medium text-accent-secondary">{{ stats.bestRt }} 毫秒</span>
          </div>
        </div>
      </div>

    <div class="neumorph-card">
      <h3 class="font-display text-lg font-bold mb-4">历史记录</h3>
      <div class="h-48">
        <canvas ref="chartCanvasRef"></canvas>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { nextTick } from 'vue'

Chart.register(...registerables)

useHead({
  title: '颜色反应测试',
  meta: [
    { name: 'description', content: '测试你的视觉反应时间。等待颜色变化，然后尽快点击。Test your visual reaction time. Wait for the color change, then click as fast as you can.' }
  ]
})

const backgroundColor = ref('bg-blue-500')
const displayStatus = ref('准备')
const displayInstruction = ref('点击下方按钮 "开始测试"')

const chartCanvasRef = ref<HTMLCanvasElement | null>(null)

let chartInstance: Chart | null = null
let changeTimer: ReturnType<typeof setTimeout> | null = null
let changeTimestamp = 0
let isRunning = false

const stats = reactive({
  attempts: 0,
  avgRt: 0,
  bestRt: 0
})

const reactionTimes: number[] = []

function loadStats() {
  if (typeof window === 'undefined') return
  
  const stored = localStorage.getItem('brainTests.color.results')
  if (stored) {
    try {
      const data = JSON.parse(stored)
      if (data.reactionTimes && Array.isArray(data.reactionTimes)) {
        reactionTimes.length = 0
        reactionTimes.push(...data.reactionTimes)
        recalcStats()
        nextTick(() => renderChart())
      }
    } catch (e) {
      console.error('Failed to load data:', e)
    }
  }
}

function saveStats() {
  const data = {
    timestamp: Date.now(),
    reactionTimes: [...reactionTimes],
    totalAttempts: stats.attempts
  }
  localStorage.setItem('brainTests.color.results', JSON.stringify(data))
}

function recalcStats() {
  stats.attempts = reactionTimes.length
  if (reactionTimes.length > 0) {
    const sum = reactionTimes.reduce((a, b) => a + b, 0)
    stats.avgRt = Math.round(sum / reactionTimes.length)
    stats.bestRt = Math.min(...reactionTimes)
  } else {
    stats.avgRt = 0
    stats.bestRt = 0
  }
}

function renderChart() {
  const canvas = chartCanvasRef.value
  if (!canvas) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  if (reactionTimes.length === 0) return

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: reactionTimes.map((_, i) => `#${i + 1}`),
      datasets: [{
        label: '反应时间 (毫秒)',
        data: reactionTimes,
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#6C63FF',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(163, 177, 198, 0.3)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

function startTest() {
  if (isRunning) return
  isRunning = true
  changeTimestamp = 0
  backgroundColor.value = 'bg-blue-500'
  displayStatus.value = '等待...'
  displayInstruction.value = '等待变红'

  const delay = Math.floor(Math.random() * 3000) + 1000

  changeTimer = setTimeout(() => {
    changeTimestamp = performance.now()
    backgroundColor.value = 'bg-red-500'
    displayStatus.value = '点击!'
    displayInstruction.value = ''
  }, delay)
}

function handleClick() {
  if (!isRunning) return

  if (changeTimestamp === 0) {
    displayStatus.value = '过早点击!'
    displayInstruction.value = '点击 "开始测试" 重新开始'
    if (changeTimer) {
      clearTimeout(changeTimer)
      changeTimer = null
    }
    isRunning = false
    return
  }

  const rt = Math.round(performance.now() - changeTimestamp)
  isRunning = false
  changeTimestamp = 0
  backgroundColor.value = 'bg-blue-500'
  
  displayStatus.value = `${rt} 毫秒`
  displayInstruction.value = '点击 "开始测试" 进行下一次测试'
  
  reactionTimes.push(rt)
  recalcStats()
  saveStats()
  nextTick(() => renderChart())
}

function clearData() {
  if (confirm('清除所有历史数据？')) {
    reactionTimes.length = 0
    recalcStats()
    saveStats()
    nextTick(() => renderChart())
  }
}

onMounted(() => {
  loadStats()
})

onUnmounted(() => {
  if (changeTimer) {
    clearTimeout(changeTimer)
    changeTimer = null
  }
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
