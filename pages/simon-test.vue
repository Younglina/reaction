<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="font-display text-3xl font-bold mb-2">Simon Task</h1>
      <p class="font-body text-muted">出现红色（无论在哪边）点击左边</p>
      <p class="font-body text-muted">出现绿色（无论在哪边）点击右边</p>
    </div>

    <div class="neumorph-card mb-8">
      <div class="flex gap-8 mb-6 justify-around">
        <button
          class="neumorph-inset-deep w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden"
          :class="{ 'shadow-extruded': leftHighlight }"
          @click="handleLeftClick"
        >
          <div
            v-if="leftCue === 'RED'"
            class="absolute inset-2 rounded-full bg-red-500 shadow-inner"
          ></div>
          <div
            v-if="leftCue === 'GREEN'"
            class="absolute inset-2 rounded-full bg-green-500 shadow-inner"
          ></div>
          <span class="font-display font-bold text-lg relative z-10">左边</span>
        </button>

        <button
          class="neumorph-inset-deep w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden"
          :class="{ 'shadow-extruded': rightHighlight }"
          @click="handleRightClick"
        >
          <div
            v-if="rightCue === 'RED'"
            class="absolute inset-2 rounded-full bg-red-500 shadow-inner"
          ></div>
          <div
            v-if="rightCue === 'GREEN'"
            class="absolute inset-2 rounded-full bg-green-500 shadow-inner"
          ></div>
          <span class="font-display font-bold text-lg relative z-10">右边</span>
        </button>
      </div>
    </div>

    <div class="flex justify-center gap-4 mb-8">
      <button
        v-if="!isRunning && !isComplete"
        class="neumorph-button neumorph-button-hover"
        @click="startTest"
      >
        开始测试
      </button>
      <button
        v-if="isComplete"
        class="neumorph-button neumorph-button-hover"
        @click="isComplete = false"
      >
        重新开始
      </button>
      <button class="neumorph-button neumorph-button-hover" @click="clearData">
        清除数据
      </button>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="neumorph-card text-center">
        <p class="font-display text-4xl font-bold text-accent mb-2">{{ trialIndex }}/12</p>
        <p class="font-body text-muted">进度</p>
      </div>
      <div class="neumorph-card text-center">
        <p class="font-display text-4xl font-bold text-accent-secondary mb-2">{{ correctCount }}</p>
        <p class="font-body text-muted">正确</p>
      </div>
      <div class="neumorph-card text-center">
        <p class="font-display text-4xl font-bold text-red-500 mb-2">{{ errorCount }}</p>
        <p class="font-body text-muted">错误</p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="neumorph-card">
        <h3 class="font-display text-lg font-bold mb-4">本次统计</h3>
        <div class="space-y-2 font-body">
          <div class="flex justify-between">
            <span class="text-muted">正确率</span>
            <span class="font-medium">{{ accuracy }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">平均反应时间</span>
            <span class="font-medium">{{ avgRt }} 毫秒</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">总测试次数</span>
            <span class="font-medium">{{ totalSessions }}</span>
          </div>
        </div>
      </div>

      <div class="neumorph-card">
        <h3 class="font-display text-lg font-bold mb-4">反应时间分布</h3>
        <div class="h-40">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
    </div>

    <div v-if="isComplete" class="neumorph-card">
      <h3 class="font-display text-xl font-bold mb-4 text-center">测试完成！</h3>
      <div class="text-center mb-6">
        <p class="font-display text-6xl font-bold text-accent mb-2">{{ accuracy }}%</p>
        <p class="font-body text-muted">正确率</p>
      </div>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="font-display text-2xl font-bold text-accent-secondary">{{ correctCount }}</p>
          <p class="font-body text-sm text-muted">正确</p>
        </div>
        <div>
          <p class="font-display text-2xl font-bold text-red-500">{{ errorCount }}</p>
          <p class="font-body text-sm text-muted">错误</p>
        </div>
        <div>
          <p class="font-display text-2xl font-bold">{{ avgRt }}</p>
          <p class="font-body text-sm text-muted">平均RT(毫秒)</p>
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
  title: 'Simon Task',
  meta: [
    { name: 'description', content: '测试你的注意力。Simon Task，出现红色（无论在哪边）点击左边，出现绿色（无论在哪边）点击右边。Test your attention with the Simon Task. with red and green cues.' }
  ]
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)

const isRunning = ref(false)
const isComplete = ref(false)
const trialIndex = ref(0)
const correctCount = ref(0)
const errorCount = ref(0)

const leftCue = ref<'RED' | 'GREEN' | 'NONE'>('NONE')
const rightCue = ref<'RED' | 'GREEN' | 'NONE'>('NONE')
const leftHighlight = ref(false)
const rightHighlight = ref(false)

let sequence: Array<{ cue: 'RED' | 'GREEN'; position: 'LEFT' | 'RIGHT' }> = []
let trialStartTime = 0
let timerInterval: ReturnType<typeof setInterval> | null = null
let chartInstance: Chart | null = null

const accuracy = computed(() => {
  const total = correctCount.value + errorCount.value
  return total > 0 ? Math.round((correctCount.value / total) * 100) : 0
})

const avgRt = computed(() => sessionStats.avgRt)
const totalSessions = computed(() => sessionStats.totalSessions)

interface SessionStats {
  totalSessions: number
  totalCorrect: number
  totalErrors: number
  avgRt: number
  rtHistory: number[]
}

const sessionStats = reactive<SessionStats>({
  totalSessions: 0,
  totalCorrect: 0,
  totalErrors: 0,
  avgRt: 0,
  rtHistory: []
})

const loadData = () => {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem('brainTests.simon.results')
  if (stored) {
    const data: SessionStats = JSON.parse(stored)
    sessionStats.totalSessions = data.totalSessions || 0
    sessionStats.totalCorrect = data.totalCorrect || 0
    sessionStats.totalErrors = data.totalErrors || 0
    sessionStats.avgRt = data.avgRt || 0
    sessionStats.rtHistory = data.rtHistory || []
    nextTick(() => updateChart())
  }
}

const saveData = () => {
  localStorage.setItem('brainTests.simon.results', JSON.stringify(sessionStats))
}

const generateSequence = (): Array<{ cue: 'RED' | 'GREEN'; position: 'LEFT' | 'RIGHT' }> => {
  const seq: Array<{ cue: 'RED' | 'GREEN'; position: 'LEFT' | 'RIGHT' }> = []
  const cues: Array<'RED' | 'GREEN'> = ['RED', 'GREEN']
  const positions: Array<'LEFT' | 'RIGHT'> = ['LEFT', 'RIGHT']

  for (let i = 0; i < 12; i++) {
    const cue = cues[Math.floor(Math.random() * cues.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]
    seq.push({ cue, position })
  }

  return seq
}

const updateChart = () => {
  if (!chartCanvas.value) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const rts = sessionStats.rtHistory.slice(-20)

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: rts.map((_, i) => `#${i + 1}`),
      datasets: [{
        label: '反应时间 (毫秒)',
        data: rts,
        backgroundColor: 'rgba(108, 99, 255, 0.6)',
        borderColor: '#6C63FF',
        borderWidth: 1,
        borderRadius: 8
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

const startTest = () => {
  isRunning.value = true
  isComplete.value = false
  trialIndex.value = 0
  correctCount.value = 0
  errorCount.value = 0
  sequence = generateSequence()

  leftCue.value = 'NONE'
  rightCue.value = 'NONE'

  runTrial()
}

const runTrial = () => {
  if (trialIndex.value >= 12) {
    completeTest()
    return
  }

  const trial = sequence[trialIndex.value]
  
  leftCue.value = trial.position === 'LEFT' ? trial.cue : 'NONE'
  rightCue.value = trial.position === 'RIGHT' ? trial.cue : 'NONE'
  
  trialStartTime = performance.now()

  timerInterval = setInterval(() => {
    const elapsed = performance.now() - trialStartTime
    if (elapsed >= 3000) {
      if (timerInterval) clearInterval(timerInterval)
      errorCount.value++
      leftCue.value = 'NONE'
      rightCue.value = 'NONE'
      trialIndex.value++
      runTrial()
    }
  }, 50)
}

const handleLeftClick = () => {
  if (!isRunning.value) return

  const rt = Math.round(performance.now() - trialStartTime)
  const trial = sequence[trialIndex.value]
  const isCorrect = trial.cue === 'RED'

  if (isCorrect) {
    correctCount.value++
    sessionStats.rtHistory.push(rt)
  } else {
    errorCount.value++
  }

  leftHighlight.value = true

  if (timerInterval) clearInterval(timerInterval)
  leftCue.value = 'NONE'
  rightCue.value = 'NONE'

  setTimeout(() => {
    leftHighlight.value = false
    trialIndex.value++
    runTrial()
  }, 500)
}

const handleRightClick = () => {
  if (!isRunning.value) return

  const rt = Math.round(performance.now() - trialStartTime)
  const trial = sequence[trialIndex.value]
  const isCorrect = trial.cue === 'GREEN'

  if (isCorrect) {
    correctCount.value++
    sessionStats.rtHistory.push(rt)
  } else {
    errorCount.value++
  }

  rightHighlight.value = true

  if (timerInterval) clearInterval(timerInterval)
  leftCue.value = 'NONE'
  rightCue.value = 'NONE'

  setTimeout(() => {
    rightHighlight.value = false
    trialIndex.value++
    runTrial()
  }, 500)
}

const completeTest = () => {
  isRunning.value = false
  isComplete.value = true

  sessionStats.totalSessions++
  sessionStats.totalCorrect += correctCount.value
  sessionStats.totalErrors += errorCount.value

  const totalRt = sessionStats.rtHistory.reduce((a, b) => a + b, 0)
  sessionStats.avgRt = sessionStats.rtHistory.length > 0
    ? Math.round(totalRt / sessionStats.rtHistory.length)
    : 0

  saveData()
  updateChart()
}

const clearData = () => {
  if (confirm('清除所有历史数据？')) {
    sessionStats.totalSessions = 0
    sessionStats.totalCorrect = 0
    sessionStats.totalErrors = 0
    sessionStats.avgRt = 0
    sessionStats.rtHistory = []
    saveData()
    updateChart()
  }
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (chartInstance) chartInstance.destroy()
})
</script>
