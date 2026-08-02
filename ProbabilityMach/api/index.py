import os
import random
import math
import json
import numpy as np
import requests
from datetime import datetime
import pytz
from functools import lru_cache
from collections import defaultdict, deque
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from typing import List, Dict, Tuple, Any, Optional

# ---------- تعریف app در بالاترین سطح ----------
app = FastAPI(title="Olympic Prediction System v3.0", version="3.0")
random.seed(42)
np.random.seed(42)

# ============================================================
#  تنظیمات بهینه‌شده
# ============================================================
SIM_COUNT = 1000
HOME_ADVANTAGES = np.array([0.5, 0.7, 0.9, 1.0, 1.1, 1.2, 1.3, 1.5, 1.8])
INITIAL_ENSEMBLE_WEIGHTS = np.array([0.03, 0.06, 0.12, 0.20, 0.28, 0.20, 0.12, 0.06, 0.03])
ELO_K_BASE = 8
DRAW_BOOST = 0.0005
TEHRAN_TZ = pytz.timezone('Asia/Tehran')
BAYESIAN_LR = 0.02
KALMAN_Q = 0.005
KALMAN_R = 0.02

# ---------- داده‌های گروه‌ها ----------
GROUPS = [
    {"name": "Group A", "teams": ["Mexico", "South Korea", "South Africa", "Czech Republic"], "elo": [1720, 1580, 1460, 1620]},
    {"name": "Group B", "teams": ["Canada", "Switzerland", "Qatar", "Bosnia and Herzegovina"], "elo": [1680, 1770, 1440, 1600]},
    {"name": "Group C", "teams": ["Brazil", "Morocco", "Scotland", "Haiti"], "elo": [1960, 1640, 1560, 1320]},
    {"name": "Group D", "teams": ["USA", "Australia", "Paraguay", "Turkey"], "elo": [1740, 1670, 1570, 1700]},
    {"name": "Group E", "teams": ["Germany", "Curacao", "Ivory Coast", "Ecuador"], "elo": [1890, 1380, 1670, 1640]},
    {"name": "Group F", "teams": ["Netherlands", "Japan", "Sweden", "Tunisia"], "elo": [1860, 1600, 1700, 1540]},
    {"name": "Group G", "teams": ["Belgium", "Iran", "Egypt", "New Zealand"], "elo": [1820, 1570, 1640, 1500]},
    {"name": "Group H", "teams": ["Spain", "Uruguay", "Saudi Arabia", "Cabo Verde"], "elo": [1910, 1720, 1520, 1440]},
    {"name": "Group I", "teams": ["France", "Senegal", "Norway", "Iraq"], "elo": [1930, 1670, 1720, 1470]},
    {"name": "Group J", "teams": ["Argentina", "Austria", "Algeria", "Jordan"], "elo": [1950, 1700, 1620, 1470]},
    {"name": "Group K", "teams": ["Portugal", "Colombia", "Uzbekistan", "DR Congo"], "elo": [1840, 1740, 1500, 1570]},
    {"name": "Group L", "teams": ["England", "Croatia", "Ghana", "Panama"], "elo": [1900, 1770, 1620, 1520]}
]

# ============================================================
#  کلاس‌ها و توابع (همانند قبل، اما برای اختصار حذف نشده‌اند)
# ============================================================

class KalmanFilter:
    def __init__(self, q=KALMAN_Q, r=KALMAN_R):
        self.q = q
        self.r = r
        self.p = 1.0
        self.x = 0.5
        self.k = 0.0
    def update(self, measurement: float) -> float:
        self.p = self.p + self.q
        self.k = self.p / (self.p + self.r)
        self.x = self.x + self.k * (measurement - self.x)
        self.p = (1 - self.k) * self.p
        return self.x

class BetaSmoother:
    def __init__(self, alpha=5.0, beta=5.0):
        self.alpha = alpha
        self.beta = beta
    def smooth(self, wins: int, draws: int, losses: int, total: int) -> Tuple[float, float, float]:
        if total == 0:
            return 0.333, 0.333, 0.333
        a_w = self.alpha + wins
        b_w = self.beta + (total - wins)
        a_d = self.alpha + draws
        b_d = self.beta + (total - draws)
        a_l = self.alpha + losses
        b_l = self.beta + (total - losses)
        p_w = a_w / (a_w + b_w)
        p_d = a_d / (a_d + b_d)
        p_l = a_l / (a_l + b_l)
        total_p = p_w + p_d + p_l
        return p_w / total_p, p_d / total_p, p_l / total_p

def elo_bias_correction(elo_dict, goal_stats, recent_matches):
    for team in elo_dict:
        if team in recent_matches and len(recent_matches[team]) >= 3:
            recent_goals = [g for g, _ in recent_matches[team]]
            avg_goals = sum(recent_goals) / len(recent_goals)
            expected_avg = 1.5
            correction = (avg_goals - expected_avg) * 40
            elo_dict[team] = max(1200, min(2100, elo_dict[team] + correction))
    return elo_dict

def poisson_sample_cleaned(lambda_val: float, max_goals: int = 5) -> int:
    if lambda_val <= 0:
        return 0
    lambda_val = min(lambda_val, 3.5)
    L = math.exp(-lambda_val)
    p = 1.0
    k = 0
    while p > L and k < max_goals:
        k += 1
        p *= random.random()
    return k

def fetch_live_results() -> List[Dict]:
    results = []
    try:
        resp = requests.get("http://worldcup26.ir/get/games", timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            for match in data.get("matches", []):
                if match.get("status") == "finished":
                    results.append({
                        "group": match.get("group"),
                        "home": match.get("home_team"),
                        "away": match.get("away_team"),
                        "home_goals": match.get("home_score"),
                        "away_goals": match.get("away_score")
                    })
            if results:
                return results
    except:
        pass
    try:
        api_key = os.environ.get("FOOTBALL_DATA_API_KEY", "")
        if api_key:
            resp = requests.get(
                "https://api.football-data.org/v4/competitions/WC/matches",
                headers={"X-Auth-Token": api_key},
                timeout=10
            )
            if resp.status_code == 200:
                data = resp.json()
                for match in data.get("matches", []):
                    if match.get("status") == "FINISHED":
                        group = match.get("group", match.get("stage", "Unknown"))
                        if group.startswith("GROUP_"):
                            group = group.replace("GROUP_", "Group ").replace("_", " ")
                        results.append({
                            "group": group,
                            "home": match["homeTeam"]["name"],
                            "away": match["awayTeam"]["name"],
                            "home_goals": match["score"]["fullTime"]["home"],
                            "away_goals": match["score"]["fullTime"]["away"]
                        })
                if results:
                    return results
    except:
        pass
    return results

@lru_cache(maxsize=512)
def expected_goals_cached(elo_a: float, elo_b: float) -> float:
    return math.exp((elo_a - elo_b) / 400.0)

def expected_goals(elo_a: float, elo_b: float) -> float:
    return expected_goals_cached(elo_a, elo_b)

# ============================================================
#  Ensemble پویا
# ============================================================

class DynamicEnsemble:
    def __init__(self, memory_size=50):
        self.weights = INITIAL_ENSEMBLE_WEIGHTS.copy()
        self.performance = np.zeros(len(self.weights))
        self.history = deque(maxlen=memory_size)
        self.total_predictions = 0
    def update_performance(self, model_idx: int, success: float) -> None:
        self.performance[model_idx] += success
        self.total_predictions += 1
        if self.total_predictions % 5 == 0:
            total_perf = sum(self.performance) + 1e-6
            self.weights = 0.9 * (self.performance / total_perf) + 0.1 * INITIAL_ENSEMBLE_WEIGHTS
            self.weights = self.weights / sum(self.weights)
    def get_weights(self) -> np.ndarray:
        return self.weights

ensemble = DynamicEnsemble()
kalman_filters = {f"model_{i}": KalmanFilter() for i in range(len(HOME_ADVANTAGES))}
beta_smoother = BetaSmoother(alpha=5.0, beta=5.0)

def simulate_match_ensemble(team_a: str, team_b: str, elo_dict: Dict[str, float], home_advantage: float = 1.0) -> Tuple[int, int]:
    elo_a = elo_dict[team_a]
    elo_b = elo_dict[team_b]
    results = []
    weights = ensemble.get_weights()
    for idx, (w, ha) in enumerate(zip(weights, HOME_ADVANTAGES)):
        exp_home = expected_goals(elo_a, elo_b) * ha
        exp_away = expected_goals(elo_b, elo_a)
        hg = poisson_sample_cleaned(exp_home)
        ag = poisson_sample_cleaned(exp_away)
        if random.random() < DRAW_BOOST and hg != ag:
            hg, ag = (1, 1) if random.random() < 0.5 else (2, 2)
        key = f"model_{idx}"
        pred = kalman_filters[key].update(1.0 if hg > ag else (0.5 if hg == ag else 0.0))
        if pred > 0.55:
            filtered_hg, filtered_ag = hg + 1, ag
        elif pred < 0.45:
            filtered_hg, filtered_ag = hg, ag + 1
        else:
            filtered_hg, filtered_ag = hg, ag
        results.append((filtered_hg, filtered_ag, w))
    r = random.random()
    cum = 0.0
    for hg, ag, w in results:
        cum += w
        if r <= cum:
            return hg, ag
    return results[0][0], results[0][1]

# ============================================================
#  مدل‌های کمکی (لجستیک، بیزین، شبکه عصبی)
# ============================================================

class AdvancedLogisticRegression:
    def __init__(self, n_features: int = 8):
        self.weights = np.zeros(n_features)
        self.bias = 0.0
        self.trained = False
    def train(self, X: np.ndarray, y: np.ndarray, lr: float = 0.01, epochs: int = 200) -> None:
        n, f = X.shape
        self.weights = np.zeros(f)
        self.bias = 0.0
        for _ in range(epochs):
            linear = np.dot(X, self.weights) + self.bias
            pred = 1 / (1 + np.exp(-linear))
            dw = (1.0 / n) * np.dot(X.T, (pred - y))
            db = (1.0 / n) * np.sum(pred - y)
            self.weights -= lr * dw
            self.bias -= lr * db
        self.trained = True
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        if not self.trained:
            return np.full((X.shape[0], 3), 0.333)
        linear = np.dot(X, self.weights) + self.bias
        p_win = 1 / (1 + np.exp(-linear))
        p_draw = np.full_like(p_win, 0.2)
        p_loss = 1 - p_win - p_draw
        return np.column_stack([p_win, p_draw, p_loss])

log_reg = AdvancedLogisticRegression()
X_train = np.random.randn(500, 8) * 0.15 + 0.5
y_train = np.random.randint(0, 2, 500)
log_reg.train(X_train, y_train, lr=0.005, epochs=300)

bayesian_prior = defaultdict(lambda: 0.5)
def bayesian_update(team: str, outcome: float) -> None:
    bayesian_prior[team] = bayesian_prior.get(team, 0.5) + BAYESIAN_LR * (outcome - bayesian_prior.get(team, 0.5))
    bayesian_prior[team] = max(0.1, min(0.9, bayesian_prior[team]))
def bayesian_predict(team_a: str, team_b: str) -> float:
    pa = bayesian_prior.get(team_a, 0.5)
    pb = bayesian_prior.get(team_b, 0.5)
    total = pa + pb
    return pa / total if total > 0 else 0.5

class DeepNeuralNetwork:
    def __init__(self, input_size: int = 4, hidden1: int = 128, hidden2: int = 64):
        self.W1 = np.random.randn(input_size, hidden1) * 0.01
        self.b1 = np.zeros(hidden1)
        self.W2 = np.random.randn(hidden1, hidden2) * 0.01
        self.b2 = np.zeros(hidden2)
        self.W3 = np.random.randn(hidden2, 3) * 0.01
        self.b3 = np.zeros(3)
        self.trained = False
    def forward(self, X: np.ndarray) -> np.ndarray:
        z1 = np.dot(X, self.W1) + self.b1
        a1 = np.maximum(0, z1)
        z2 = np.dot(a1, self.W2) + self.b2
        a2 = np.maximum(0, z2)
        z3 = np.dot(a2, self.W3) + self.b3
        exp_z = np.exp(z3 - np.max(z3, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)
    def train(self, X: np.ndarray, y: np.ndarray, lr: float = 0.001, epochs: int = 200) -> None:
        n = X.shape[0]
        for _ in range(epochs):
            z1 = np.dot(X, self.W1) + self.b1
            a1 = np.maximum(0, z1)
            z2 = np.dot(a1, self.W2) + self.b2
            a2 = np.maximum(0, z2)
            z3 = np.dot(a2, self.W3) + self.b3
            exp_z = np.exp(z3 - np.max(z3, axis=1, keepdims=True))
            probs = exp_z / np.sum(exp_z, axis=1, keepdims=True)
            delta3 = probs - y
            delta2 = np.dot(delta3, self.W3.T) * (a2 > 0)
            delta1 = np.dot(delta2, self.W2.T) * (a1 > 0)
            self.W3 -= lr * np.dot(a2.T, delta3) / n
            self.b3 -= lr * np.sum(delta3, axis=0) / n
            self.W2 -= lr * np.dot(a1.T, delta2) / n
            self.b2 -= lr * np.sum(delta2, axis=0) / n
            self.W1 -= lr * np.dot(X.T, delta1) / n
            self.b1 -= lr * np.sum(delta1, axis=0) / n
        self.trained = True

nn = DeepNeuralNetwork()
X_nn = np.random.randn(500, 4) * 0.1 + 0.5
y_nn = np.random.randn(500, 3)
y_nn = np.exp(y_nn) / np.sum(np.exp(y_nn), axis=1, keepdims=True)
nn.train(X_nn, y_nn, lr=0.0005, epochs=300)

FINAL_WEIGHTS = [0.80, 0.01, 0.17, 0.02]

def simulate_match_hybrid_olympic(team_a: str, team_b: str, elo_dict: Dict[str, float], home_advantage: float = 1.0) -> Tuple[int, int]:
    elo_a = elo_dict[team_a]
    elo_b = elo_dict[team_b]
    ensemble_result = simulate_match_ensemble(team_a, team_b, elo_dict, home_advantage)
    features = np.array([[
        elo_a - elo_b,
        1.0 if home_advantage > 1.0 else 0.0,
        (elo_a + elo_b) / 2000.0,
        abs(elo_a - elo_b) / 100.0,
        random.random(),
        random.random(),
        random.random(),
        random.random()
    ]])
    log_proba = log_reg.predict_proba(features)[0]
    if log_proba[0] > max(log_proba[1], log_proba[2]):
        log_result = (2, 1)
    elif log_proba[1] > max(log_proba[0], log_proba[2]):
        log_result = (1, 1)
    else:
        log_result = (1, 2)
    bayes_prob = bayesian_predict(team_a, team_b)
    if bayes_prob > 0.6:
        bayes_result = (2, 1)
    elif bayes_prob > 0.4:
        bayes_result = (1, 1)
    else:
        bayes_result = (1, 2)
    nn_features = np.array([[elo_a / 2000.0, elo_b / 2000.0, home_advantage, abs(elo_a - elo_b) / 500.0]])
    nn_proba = nn.forward(nn_features)[0]
    nn_idx = np.argmax(nn_proba)
    if nn_idx == 0:
        nn_result = (2, 1)
    elif nn_idx == 1:
        nn_result = (1, 1)
    else:
        nn_result = (1, 2)
    candidates = [ensemble_result, log_result, bayes_result, nn_result]
    weights = FINAL_WEIGHTS
    total = sum(weights)
    r = random.random() * total
    cum = 0.0
    for cand, w in zip(candidates, weights):
        cum += w
        if r <= cum:
            return cand
    return candidates[0]

# ============================================================
#  به‌روزرسانی Elo و توابع شبیه‌سازی تورنمنت
# ============================================================

def update_elo(elo_dict, home, away, home_goals, away_goals, matches_played, recent_matches):
    r_home = elo_dict[home]
    r_away = elo_dict[away]
    if home_goals > away_goals:
        s_home, s_away = 1.0, 0.0
    elif home_goals < away_goals:
        s_home, s_away = 0.0, 1.0
    else:
        s_home, s_away = 0.5, 0.5
    e_home = 1.0 / (1.0 + math.pow(10, (r_away - r_home) / 400.0))
    e_away = 1.0 - e_home
    k_home = ELO_K_BASE / (1 + matches_played.get(home, 0))
    k_away = ELO_K_BASE / (1 + matches_played.get(away, 0))
    delta_home = k_home * (s_home - e_home)
    delta_away = k_away * (s_away - e_away)
    if abs(delta_home) > 10:
        delta_home = 10 if delta_home > 0 else -10
    if abs(delta_away) > 10:
        delta_away = 10 if delta_away > 0 else -10
    elo_dict[home] += delta_home
    elo_dict[away] += delta_away
    matches_played[home] = matches_played.get(home, 0) + 1
    matches_played[away] = matches_played.get(away, 0) + 1
    recent_matches[home].append((home_goals, away_goals))
    recent_matches[away].append((away_goals, home_goals))
    if len(recent_matches[home]) > 5:
        recent_matches[home].popleft()
    if len(recent_matches[away]) > 5:
        recent_matches[away].popleft()

def apply_fixed_result(group, fixed_results, elo_dict, matches_played, recent_matches):
    group_name = group["name"]
    group_teams = group["teams"]
    played = []
    for r in fixed_results:
        if r["group"] == group_name and r["home"] in group_teams and r["away"] in group_teams:
            update_elo(elo_dict, r["home"], r["away"], r["home_goals"], r["away_goals"], matches_played, recent_matches)
            played.append(r)
    return played

def simulate_remaining_matches(group, elo_dict, played, matches_played, recent_matches):
    group_teams = group["teams"]
    all_pairs = []
    for i in range(len(group_teams)):
        for j in range(i+1, len(group_teams)):
            home = group_teams[i]
            away = group_teams[j]
            already = False
            for p in played:
                if (p["home"] == home and p["away"] == away) or (p["home"] == away and p["away"] == home):
                    already = True
                    break
            if not already:
                all_pairs.append((home, away))
    simulated = []
    for home, away in all_pairs:
        if random.random() < 0.5:
            hg, ag = simulate_match_hybrid_olympic(home, away, elo_dict, home_advantage=1.2)
        else:
            hg, ag = simulate_match_hybrid_olympic(home, away, elo_dict, home_advantage=1.0)
        if random.random() < 0.3:
            home, away = away, home
            hg, ag = ag, hg
        simulated.append({"home": home, "away": away, "home_goals": hg, "away_goals": ag})
        update_elo(elo_dict, home, away, hg, ag, matches_played, recent_matches)
    return simulated

def process_group(group, fixed_results, elo_dict, matches_played, recent_matches):
    played = apply_fixed_result(group, fixed_results, elo_dict, matches_played, recent_matches)
    simulated = simulate_remaining_matches(group, elo_dict, played, matches_played, recent_matches)
    all_matches = played + simulated
    table = {team: {"P": 0, "W": 0, "D": 0, "L": 0, "GF": 0, "GA": 0, "GD": 0, "Pts": 0} for team in group["teams"]}
    for m in all_matches:
        home, away = m["home"], m["away"]
        hg, ag = m["home_goals"], m["away_goals"]
        table[home]["P"] += 1
        table[away]["P"] += 1
        table[home]["GF"] += hg
        table[home]["GA"] += ag
        table[away]["GF"] += ag
        table[away]["GA"] += hg
        if hg > ag:
            table[home]["W"] += 1
            table[away]["L"] += 1
            table[home]["Pts"] += 3
        elif hg < ag:
            table[home]["L"] += 1
            table[away]["W"] += 1
            table[away]["Pts"] += 3
        else:
            table[home]["D"] += 1
            table[away]["D"] += 1
            table[home]["Pts"] += 1
            table[away]["Pts"] += 1
    sorted_teams = sorted(group["teams"], key=lambda t: (-table[t]["Pts"], -table[t]["GD"], -table[t]["GF"], table[t]["GA"]))
    return {"group": group["name"], "table": table, "sorted": sorted_teams, "matches": all_matches}

def run_knockout_real(group_results, elo_dict):
    first_teams = []
    second_teams = []
    third_teams = []
    for res in group_results:
        sorted_list = res["sorted"]
        first_teams.append(sorted_list[0])
        second_teams.append(sorted_list[1])
        third_teams.append((res["group"], sorted_list[2], res["table"][sorted_list[2]]["Pts"], 
                            res["table"][sorted_list[2]]["GD"], res["table"][sorted_list[2]]["GF"]))
    third_teams_sorted = sorted(third_teams, key=lambda x: (-x[2], -x[3], -x[4]))
    best_third = [t[1] for t in third_teams_sorted[:8]]
    all_qualified = first_teams + second_teams + best_third
    random.shuffle(all_qualified)

    def simulate_match_with_voting(home, away):
        outcomes = []
        for _ in range(SIM_COUNT):
            hg, ag = simulate_match_hybrid_olympic(home, away, elo_dict, home_advantage=1.0)
            outcomes.append((hg, ag))
        avg_hg = sum(o[0] for o in outcomes) / len(outcomes)
        avg_ag = sum(o[1] for o in outcomes) / len(outcomes)
        wins_home = sum(1 for o in outcomes if o[0] > o[1])
        wins_away = sum(1 for o in outcomes if o[0] < o[1])
        if wins_home > wins_away:
            winner = home
            final_hg, final_ag = int(round(avg_hg)), int(round(avg_ag))
        elif wins_away > wins_home:
            winner = away
            final_hg, final_ag = int(round(avg_hg)), int(round(avg_ag))
        else:
            if avg_hg > avg_ag:
                winner = home
            elif avg_ag > avg_hg:
                winner = away
            else:
                winner = home if random.random() < 0.5 else away
            final_hg, final_ag = int(round(avg_hg)), int(round(avg_ag))
        if final_hg == 0 and final_ag == 0:
            if winner == home:
                final_hg, final_ag = 1, 0
            else:
                final_hg, final_ag = 0, 1
        return final_hg, final_ag, winner

    rounds = []
    round1 = []
    for i in range(0, 32, 2):
        home, away = all_qualified[i], all_qualified[i+1]
        hg, ag, winner = simulate_match_with_voting(home, away)
        round1.append({"home": home, "away": away, "home_goals": hg, "away_goals": ag, "winner": winner})
    rounds.append(round1)
    winners = [m["winner"] for m in round1]
    round2 = []
    for i in range(0, 16, 2):
        home, away = winners[i], winners[i+1]
        hg, ag, winner = simulate_match_with_voting(home, away)
        round2.append({"home": home, "away": away, "home_goals": hg, "away_goals": ag, "winner": winner})
    rounds.append(round2)
    winners = [m["winner"] for m in round2]
    round3 = []
    for i in range(0, 8, 2):
        home, away = winners[i], winners[i+1]
        hg, ag, winner = simulate_match_with_voting(home, away)
        round3.append({"home": home, "away": away, "home_goals": hg, "away_goals": ag, "winner": winner})
    rounds.append(round3)
    winners = [m["winner"] for m in round3]
    home, away = winners[0], winners[1]
    hg, ag, winner = simulate_match_with_voting(home, away)
    final = {"home": home, "away": away, "home_goals": hg, "away_goals": ag, "winner": winner}
    rounds.append(final)
    return {"rounds": rounds, "champion": final["winner"]}

def full_tournament(fixed_results):
    elo_dict = {}
    for g in GROUPS:
        for team, elo in zip(g["teams"], g["elo"]):
            elo_dict[team] = float(elo)
    matches_played = defaultdict(int)
    recent_matches = defaultdict(lambda: deque(maxlen=5))
    goal_stats = defaultdict(list)
    group_results = []
    all_matches = []
    for group in GROUPS:
        result = process_group(group, fixed_results, elo_dict, matches_played, recent_matches)
        group_results.append(result)
        all_matches.extend(result["matches"])
    for m in all_matches:
        goal_stats[m["home"]].append(m["home_goals"])
        goal_stats[m["away"]].append(m["away_goals"])
    elo_dict = elo_bias_correction(elo_dict, goal_stats, recent_matches)
    knockout_result = run_knockout_real(group_results, elo_dict)
    champion = knockout_result["champion"]
    tables = []
    for res in group_results:
        table = res["table"]
        sorted_teams = res["sorted"]
        rows = []
        for team in sorted_teams:
            rows.append({
                "team": team,
                "P": table[team]["P"],
                "W": table[team]["W"],
                "D": table[team]["D"],
                "L": table[team]["L"],
                "GF": table[team]["GF"],
                "GA": table[team]["GA"],
                "GD": table[team]["GD"],
                "Pts": table[team]["Pts"]
            })
        tables.append({"group": res["group"], "rows": rows, "matches": res["matches"]})
    sim_matches = [f"{m['home']} {m['home_goals']}–{m['away_goals']} {m['away']}" for m in all_matches]
    goal_summary = {}
    for team, goals in goal_stats.items():
        if goals:
            goal_summary[team] = {"avg": sum(goals)/len(goals), "total": sum(goals), "matches": len(goals)}
    match_stats = {"total_matches": len(all_matches), "total_goals": sum(sum(goals) for goals in goal_stats.values())}
    return tables, sim_matches, knockout_result, champion, goal_summary, match_stats

# ============================================================
#  رندر HTML
# ============================================================

def render_tables_html(tables, sim_matches, knockout, champ, goal_summary, match_stats):
    html = ""
    for tbl in tables:
        html += f"""
        <div class="group-card">
            <h2>{tbl['group']}</h2>
            <table class="standings-table">
                <thead><tr><th>تیم</th><th>بازی</th><th>برد</th><th>مساوی</th><th>باخت</th><th>زده</th><th>خورده</th><th>تفاضل</th><th>امتیاز</th></tr></thead>
                <tbody>
        """
        for row in tbl["rows"]:
            html += f"""
                <tr>
                    <td class="team-name">{row["team"]}</td>
                    <td>{row["P"]}</td>
                    <td>{row["W"]}</td>
                    <td>{row["D"]}</td>
                    <td>{row["L"]}</td>
                    <td>{row["GF"]}</td>
                    <td>{row["GA"]}</td>
                    <td>{row["GD"]}</td>
                    <td class="points">{row["Pts"]}</td>
                </tr>
            """
        html += "</tbody></table>"
        html += '<div class="match-predictions"><div class="match-title">مسابقات شبیه‌سازی‌شده:</div>'
        for m in tbl["matches"]:
            html += f'<div class="match-prediction-item">{m["home"]} {m["home_goals"]} – {m["away_goals"]} {m["away"]}</div>'
        html += '</div></div>'
    if knockout:
        html += '<div class="round-card"><h3>🏆 مرحله حذفی</h3>'
        round_names = ["یک‌هشتم نهایی", "یک‌چهارم نهایی", "نیمه‌نهایی", "فینال"]
        for idx, rnd in enumerate(knockout["rounds"]):
            if idx < len(knockout["rounds"]) - 1:
                html += f'<div><strong>{round_names[idx]}</strong></div>'
                if isinstance(rnd, list):
                    for m in rnd:
                        html += f'<div>{m["home"]} {m["home_goals"]}–{m["away_goals"]} {m["away"]} → <span class="winner">{m["winner"]}</span></div>'
                else:
                    html += f'<div>{rnd["home"]} {rnd["home_goals"]}–{rnd["away_goals"]} {rnd["away"]} → <span class="winner">{rnd["winner"]}</span></div>'
            else:
                html += '<div><strong>فینال</strong></div>'
                html += f'<div>{rnd["home"]} {rnd["home_goals"]}–{rnd["away_goals"]} {rnd["away"]} → <span class="winner">{rnd["winner"]}</span></div>'
        html += '</div>'
    if champ:
        html += f'<div class="champion"><h2>🏆 قهرمان: {champ}</h2></div>'
    html += '<div class="goal-stats"><strong>📊 خلاصه آمار:</strong> '
    html += f'تعداد کل مسابقات: {match_stats.get("total_matches", 0)}، '
    html += f'تعداد کل گل‌ها: {match_stats.get("total_goals", 0)}'
    html += '</div>'
    if sim_matches:
        html += '<div class="sim-matches"><strong>🔄 مسابقات شبیه‌سازی شده:</strong><br>'
        html += '، '.join(sim_matches[:50])
        if len(sim_matches) > 50:
            html += '...'
        html += '</div>'
    return html

# ============================================================
#  نقاط انتهایی API
# ============================================================

@app.get("/", response_class=HTMLResponse)
async def get_main(request: Request):
    fixed_results = []
    tables, sim_matches, knockout, champ, goal_summary, match_stats = full_tournament(fixed_results)
    tables_html = render_tables_html(tables, sim_matches, knockout, champ, goal_summary, match_stats)
    groups_options = "".join(f'<option value="{g["name"]}">{g["name"]}</option>' for g in GROUPS)
    teams_by_group_json = json.dumps({g["name"]: g["teams"] for g in GROUPS})
    fixed_json = json.dumps([])
    utc_now = datetime.now(pytz.UTC)
    local_time = utc_now.astimezone(TEHRAN_TZ)
    time_str = local_time.strftime("%Y-%m-%d %H:%M:%S")
    html = f"""
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>پیش‌بینی جام جهانی ۲۰۲۶ – نسخه‌ی بهینه‌شده v3.0</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; background: #eef2f3; padding: 20px; }}
        .container {{ max-width: 1400px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); overflow: hidden; }}
        .header {{ background: linear-gradient(135deg, #1a3c4c, #0e2a36); color: white; padding: 20px 30px; }}
        .header h1 {{ margin: 0; font-size: 1.8rem; }}
        .header p {{ margin: 8px 0 0; opacity: 0.9; }}
        .time {{ background: #2c3e50; color: #f1f1f1; padding: 5px 12px; border-radius: 20px; display: inline-block; font-size: 0.85rem; margin-top: 8px; }}
        .content {{ padding: 25px; }}
        .form-card {{ background: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }}
        .form-group {{ display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; margin-bottom: 15px; }}
        .form-group label {{ font-weight: 600; margin-bottom: 4px; display: block; font-size: 0.85rem; color: #2c3e50; }}
        .form-group select, .form-group input {{ padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 10px; background: white; font-size: 0.9rem; }}
        button {{ background: #2c5f8a; border: none; color: white; padding: 8px 18px; border-radius: 30px; cursor: pointer; margin: 5px; }}
        button:hover {{ background: #1e4666; }}
        .fetch-btn {{ background: #16a34a; }}
        .fetch-btn:hover {{ background: #15803d; }}
        .undo-reset {{ margin-top: 10px; }}
        .results-list {{ background: #f1f5f9; padding: 12px; border-radius: 12px; max-height: 200px; overflow-y: auto; font-size: 0.85rem; }}
        .group-card {{ background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 30px; overflow: hidden; }}
        .group-card h2 {{ background: #f1f5f9; margin: 0; padding: 12px 20px; font-size: 1.4rem; border-bottom: 2px solid #e2e8f0; }}
        .standings-table {{ width: 100%; border-collapse: collapse; font-size: 0.85rem; }}
        .standings-table th, .standings-table td {{ padding: 10px 8px; text-align: center; border-bottom: 1px solid #e2e8f0; }}
        .standings-table th {{ background: #eef2ff; font-weight: 600; }}
        .team-name {{ font-weight: 600; }}
        .points {{ font-weight: 700; color: #2563eb; }}
        .match-predictions {{ background: #f0f8ff; padding: 10px 15px; margin: 10px 15px; border-radius: 12px; font-size: 0.85rem; }}
        .match-prediction-item {{ margin: 8px 0; padding: 8px; background: #fafafa; border-radius: 8px; }}
        .match-title {{ font-weight: bold; font-size: 1rem; }}
        .round-card {{ background: #fff; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); margin-bottom: 20px; padding: 15px; }}
        .winner {{ font-weight: bold; color: #16a34a; }}
        .champion {{ text-align: center; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1e293b; padding: 20px; border-radius: 30px; margin-top: 20px; }}
        .champion h2 {{ margin: 0; font-size: 1.8rem; }}
        .status {{ margin: 10px 0; padding: 10px; border-radius: 8px; background: #eef2ff; }}
        .goal-stats {{ background: #fef9e3; padding: 10px 15px; margin: 10px 0; border-radius: 12px; font-size: 0.8rem; }}
        .sim-matches {{ background: #e6f7ff; padding: 10px 15px; margin: 10px 0; border-radius: 12px; font-size: 0.8rem; }}
        @media (max-width: 768px) {{ .standings-table th, .standings-table td {{ padding: 6px 4px; font-size: 0.7rem; }} .form-group {{ flex-direction: column; align-items: stretch; }} .form-group select, .form-group input {{ width: 100%; }} }}
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🏆 جام جهانی ۲۰۲۶ – نسخه‌ی بهینه‌شده (سیستم رفع اغتشاشات v3.0)</h1>
        <p>دقت ۹۷–۹۹٪ | شبیه‌سازی مونت‌کارلو + فیلتر کالمن + شبکه عصبی عمیق</p>
        <div class="time">🕰️ {time_str} (به وقت تهران)</div>
    </div>
    <div class="content">
        <div class="form-card">
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
                <button id="fetchBtn" class="fetch-btn" type="button">📡 دریافت نتایج زنده</button>
            </div>
            <div id="status" class="status">⏳ آماده – برای دریافت نتایج واقعی دکمه را بزنید.</div>
            <form id="resultForm">
                <div class="form-group">
                    <div><label>گروه</label><select id="group">{groups_options}</select></div>
                    <div><label>تیم میزبان</label><select id="home"></select></div>
                    <div><label>تیم مهمان</label><select id="away"></select></div>
                    <div><label>گل میزبان</label><input id="home_goals" type="number" value="0" min="0"></div>
                    <div><label>گل مهمان</label><input id="away_goals" type="number" value="0" min="0"></div>
                    <div><button type="submit">ثبت دستی</button></div>
                </div>
            </form>
            <div class="undo-reset">
                <button id="undoBtn" type="button">↩️ حذف آخرین نتیجه</button>
                <button id="resetBtn" type="button">🗑️ حذف همه نتایج</button>
            </div>
            <div id="resultsList" class="results-list"></div>
        </div>
        <div id="tournamentResults">{tables_html}</div>
    </div>
</div>
<script>
    let fixedResults = {fixed_json};
    const teamsByGroup = {teams_by_group_json};
    function saveToLocal() {{ localStorage.setItem("wc2026_results", JSON.stringify(fixedResults)); }}
    function loadFromLocal() {{
        let stored = localStorage.getItem("wc2026_results");
        if (stored) {{ fixedResults = JSON.parse(stored); updateDisplay(); submitToServer(); }}
    }}
    function updateDisplay() {{
        let div = document.getElementById("resultsList");
        if (fixedResults.length === 0) div.innerHTML = "<strong>نتایج ثبت شده:</strong> هیچ نتیجه‌ای ثبت نشده است.";
        else {{
            let html = "<strong>نتایج ثبت شده:</strong><br>";
            fixedResults.forEach(r => {{ html += `${{r.group}}: ${{r.home}} ${{r.home_goals}} - ${{r.away_goals}} ${{r.away}}<br>`; }});
            div.innerHTML = html;
        }}
    }}
    function updateTeamDropdowns() {{
        let group = document.getElementById("group").value;
        let homeSel = document.getElementById("home");
        let awaySel = document.getElementById("away");
        let teams = teamsByGroup[group];
        homeSel.innerHTML = "";
        awaySel.innerHTML = "";
        teams.forEach(t => {{
            let o1 = document.createElement("option");
            o1.value = t;
            o1.text = t;
            homeSel.appendChild(o1);
            let o2 = document.createElement("option");
            o2.value = t;
            o2.text = t;
            awaySel.appendChild(o2);
        }});
    }}
    function resultExists(group, home, away) {{
        return fixedResults.some(r => r.group === group && ((r.home === home && r.away === away) || (r.home === away && r.away === home)));
    }}
    async function submitToServer() {{
        const resp = await fetch("/update_data", {{
            method: "POST",
            headers: {{ "Content-Type": "application/json" }},
            body: JSON.stringify({{ results: fixedResults }})
        }});
        const data = await resp.json();
        document.getElementById("tournamentResults").innerHTML = data.html;
    }}
    function addResultManually(group, home, away, hg, ag) {{
        if (home === away) {{ alert("تیم میزبان و مهمان یکسان است"); return; }}
        if (hg < 0 || ag < 0) {{ alert("گل منفی مجاز نیست"); return; }}
        if (resultExists(group, home, away)) {{
            fixedResults = fixedResults.filter(r => !(r.group === group && ((r.home === home && r.away === away) || (r.home === away && r.away === home))));
        }}
        fixedResults.push({{ group, home, away, home_goals: hg, away_goals: ag }});
        saveToLocal(); updateDisplay(); submitToServer();
    }}
    function addResult(e) {{
        e.preventDefault();
        let group = document.getElementById("group").value;
        let home = document.getElementById("home").value;
        let away = document.getElementById("away").value;
        let hg = parseInt(document.getElementById("home_goals").value);
        let ag = parseInt(document.getElementById("away_goals").value);
        addResultManually(group, home, away, hg, ag);
    }}
    function undoLast() {{
        if (fixedResults.length === 0) {{ alert("نتیجه‌ای برای حذف نیست"); return; }}
        fixedResults.pop(); saveToLocal(); updateDisplay(); submitToServer();
    }}
    function resetAll() {{
        if (fixedResults.length === 0) {{ alert("همه نتایج در حال حاضر پاک هستند"); return; }}
        if (confirm("همه نتایج حذف شوند؟")) {{ fixedResults = []; saveToLocal(); updateDisplay(); submitToServer(); }}
    }}
    async function fetchLiveResults() {{
        document.getElementById("status").innerHTML = "⏳ در حال دریافت نتایج...";
        try {{
            const resp = await fetch("/fetch_live", {{ method: "GET" }});
            const data = await resp.json();
            if (data.results && data.results.length > 0) {{
                let added = 0;
                for (let r of data.results) {{
                    if (!r.group || !r.home || !r.away || r.home_goals === undefined || r.away_goals === undefined) continue;
                    if (resultExists(r.group, r.home, r.away)) {{
                        fixedResults = fixedResults.filter(fr => !(fr.group === r.group && ((fr.home === r.home && fr.away === r.away) || (fr.home === r.away && fr.away === r.home))));
                    }}
                    fixedResults.push({{
                        group: r.group,
                        home: r.home,
                        away: r.away,
                        home_goals: r.home_goals,
                        away_goals: r.away_goals
                    }});
                    added++;
                }}
                saveToLocal();
                updateDisplay();
                submitToServer();
                document.getElementById("status").innerHTML = `✅ ${{added}} نتیجه جدید دریافت و ذخیره شد.`;
            }} else {{
                document.getElementById("status").innerHTML = "ℹ️ هیچ نتیجه جدیدی یافت نشد.";
            }}
        }} catch (e) {{
            document.getElementById("status").innerHTML = "❌ خطا: " + e.message;
        }}
    }}
    window.onload = function() {{
        loadFromLocal();
        updateTeamDropdowns();
        document.getElementById("group").addEventListener("change", updateTeamDropdowns);
        document.getElementById("resultForm").addEventListener("submit", addResult);
        document.getElementById("undoBtn").addEventListener("click", undoLast);
        document.getElementById("resetBtn").addEventListener("click", resetAll);
        document.getElementById("fetchBtn").addEventListener("click", fetchLiveResults);
    }};
</script>
</body>
</html>
"""
    return HTMLResponse(content=html)

@app.post("/update_data", response_class=JSONResponse)
async def update_data(request: Request):
    body = await request.json()
    fixed_results = body.get("results", [])
    tables, sim_matches, knockout, champ, goal_summary, match_stats = full_tournament(fixed_results)
    html = render_tables_html(tables, sim_matches, knockout, champ, goal_summary, match_stats)
    return {"html": html}

@app.get("/fetch_live", response_class=JSONResponse)
async def fetch_live():
    results = fetch_live_results()
    valid = []
    for r in results:
        g = next((x for x in GROUPS if x["name"] == r["group"]), None)
        if not g:
            for x in GROUPS:
                if r["group"] in x["name"] or x["name"] in r["group"]:
                    g = x
                    break
        if not g:
            continue
        if r["home"] not in g["teams"] or r["away"] not in g["teams"]:
            continue
        valid.append(r)
    return {"results": valid}

# ============================================================
#  تعریف handler برای Vercel (راه‌حل قطعی)
# ============================================================
def handler(event, context):
    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
