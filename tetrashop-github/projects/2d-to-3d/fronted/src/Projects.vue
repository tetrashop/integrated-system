<!-- frontend/src/views/Projects.vue -->
<template>
  <div class="projects-page">
    <header class="page-header">
      <h1>پنل مدیریت پروژه‌های هوشمند</h1>
      <p>مدیریت و اجرای پروژه‌های هوش مصنوعی</p>
    </header>
    
    <!-- قرارگیری dashboard در اینجا -->
    <ProjectDashboard />
    
    <footer class="page-footer">
      <p>سیستم مدیریت یکپارچه v2.0</p>
    </footer>
  </div>
</template>

<script>
import ProjectDashboard from '@/components/Dashboard.vue';

export default {
  name: 'ProjectsPage',
  components: {
    ProjectDashboard
  }
}
</script>
