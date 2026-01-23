<template>
  <div class="space-y-12">
    <section class="text-center py-2">
      <h1 class="font-display text-5xl font-extrabold tracking-tight mb-6">
        反应力测试
      </h1>
      <p class="font-body text-muted text-lg max-w-2xl mx-auto">
        通过两个简单的实验测试你的反应速度。
      </p>
    </section>

    <div class="grid md:grid-cols-2 gap-8">
      <NuxtLink to="/color-test" class="neumorph-card neumorph-card-hover group block">
        <div class="neumorph-icon-well w-16 h-16 mx-auto mb-6">
          <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h2 class="font-display text-2xl font-bold mb-4 text-center">颜色反应测试</h2>
        <p class="font-body text-muted text-center">
          等待屏幕从蓝色变为红色，然后尽快点击。测试你的反应时间。
        </p>
        <div class="mt-6 text-center">
          <span class="neumorph-button group-hover:-translate-y-1 inline-block">
            开始测试 →
          </span>
        </div>
      </NuxtLink>

      <NuxtLink to="/simon-test" class="neumorph-card neumorph-card-hover group block">
        <div class="neumorph-icon-well w-16 h-16 mx-auto mb-6">
          <svg class="w-8 h-8 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 class="font-display text-2xl font-bold mb-4 text-center">Simon task</h2>
        <p class="font-body text-muted text-center">
         出现红色点击左边，出现绿色点击右边。 探究刺激-反应兼容性以及个体的反应抑制和认知控制能力。
        </p>
        <div class="mt-6 text-center">
          <span class="neumorph-button group-hover:-translate-y-1 inline-block">
            开始测试 →
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '反应力测试',
  meta: [
    { name: 'description', content: '通过两个简单的实验测试你的反应速度。颜色测试和Simon Task，数据保存在本地设备上。Test your reaction time with two simple experiments. Color Test and Simon Task, data stays on your device.' }
  ]
})
</script>
