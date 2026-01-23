<template>
  <div class="min-h-screen bg-background">
    <header class="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-gray-200/50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink v-if="$route.path !== '/'" to="/" class="font-display font-bold text-xl tracking-tight">
            返回
          </NuxtLink>
          <!-- <div class="flex gap-4 ml-auto">
            <NuxtLink to="/color-test" class="neumorph-button text-sm">
              颜色测试
            </NuxtLink>
            <NuxtLink to="/simon-test" class="neumorph-button text-sm">
              Simon Task
            </NuxtLink>
          </div> -->
        </div>
      </nav>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>
