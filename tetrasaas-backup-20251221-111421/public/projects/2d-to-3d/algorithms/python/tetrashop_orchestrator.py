
class TetrashopOrchestrator:
    # ... کدهای قبلی ...
    
    def get_system_dashboard(self):
        """گرفتن اطلاعات کامل دشبورد"""
        return TetrashopDashboard(
            self.chess, 
            self.writer, 
            self.natiq
        ).get_real_time_metrics()

# اضافه کردن endpoint برای دشبورد
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    metrics = orchestrator.get_system_dashboard()
    return jsonify(metrics)
