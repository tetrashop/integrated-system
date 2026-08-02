<!-- dashboard/components/ProjectDashboard.vue -->
<template>
  <div class="dashboard-container">
    <!-- Chess Engine Section -->
    <div class="project-card">
      <h2>🎯 Chess Engine</h2>
      <div class="status-badge completed">تکمیل شده</div>
      
      <div class="controls">
        <button 
          @click="executeChessEngine" 
          :class="['btn', 'btn-execute', { loading: chessLoading }]"
          :disabled="chessLoading"
        >
          <span v-if="!chessLoading">🏃 تأیید و اجرای پروژه</span>
          <span v-else>در حال اجرا...</span>
        </button>
        
        <button class="btn btn-confirm" @click="confirmProject('chess')">
          ✅ تأیید
        </button>
      </div>
      
      <div v-if="chessResult" class="result-section">
        <h4>نتایج تحلیل:</h4>
        <pre>{{ chessResult }}</pre>
      </div>
    </div>

    <!-- Intelligent Writer Section -->
    <div class="project-card">
      <h2>✍️ Intelligent Writer</h2>
      <div class="status-badge completed">تکمیل شده</div>
      
      <div class="controls">
        <button 
          @click="executeWriter" 
          :class="['btn', 'btn-execute', { loading: writerLoading }]"
          :disabled="writerLoading"
        >
          <span v-if="!writerLoading">🏃 تأیید و اجرای پروژه</span>
          <span v-else>در حال تولید محتوا...</span>
        </button>
        
        <button class="btn btn-confirm" @click="confirmProject('writer')">
          ✅ تأیید
        </button>
      </div>

      <div v-if="writerResult" class="result-section">
        <h4>محتوای تولید شده:</h4>
        <div class="generated-content">
          {{ writerResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IntelligentChessEngine } from '../core/chess_engine';
import { IntelligentContentWriter } from '../core/intelligent_writer';

export default {
  name: 'ProjectDashboard',
  data() {
    return {
      chessLoading: false,
      writerLoading: false,
      chessResult: null,
      writerResult: null,
      chessEngine: null,
      contentWriter: null
    }
  },
  mounted() {
    this.initializeEngines();
  },
  methods: {
    initializeEngines() {
      this.chessEngine = new IntelligentChessEngine();
      this.contentWriter = new IntelligentContentWriter();
    },

    async executeChessEngine() {
      this.chessLoading = true;
      try {
        const bestMove = this.chessEngine.get_best_move();
        const evaluation = this.chessEngine._evaluate_board();
        
        this.chessResult = {
          best_move: bestMove,
          board_evaluation: evaluation,
          legal_moves: Array.from(this.chessEngine.board.legal_moves).length,
          game_status: this.chessEngine.board.status()
        };
        
        await this.$router.push('/chess-results');
      } catch (error) {
        console.error('خطا در اجرای موتور شطرنج:', error);
        this.chessResult = { error: 'خطا در پردازش' };
      } finally {
        this.chessLoading = false;
      }
    },

    async executeWriter() {
      this.writerLoading = true;
      try {
        const article = await this.contentWriter.generate_article(
          "هوش مصنوعی و آینده تکنولوژی"
        );
        
        this.writerResult = article;
        await this.$router.push('/writer-results');
      } catch (error) {
        console.error('خطا در تولید محتوا:', error);
        this.writerResult = { error: 'خطا در تولید محتوا' };
      } finally {
        this.writerLoading = false;
      }
    },

    confirmProject(projectType) {
      this.$emit('project-confirmed', projectType);
      this.$toast.success(`پروژه ${projectType} تأیید شد`);
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.status-badge.completed {
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
}

.controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-execute {
  background: #3b82f6;
  color: white;
}

.btn-execute:hover:not(:disabled) {
  background: #2563eb;
}

.btn-execute.loading {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-confirm {
  background: #10b981;
  color: white;
}

.btn-confirm:hover {
  background: #059669;
}

.result-section {
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-right: 4px solid #3b82f6;
}

.generated-content {
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>
