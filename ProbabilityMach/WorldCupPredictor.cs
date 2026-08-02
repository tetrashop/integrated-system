using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace ProbabilityMach
{
    public class TeamStanding
    {
        public string Team;
        public int Points;
        public int GD;
        public int GF;
        public int GA;
    }

    public class MatchResult
    {
        public string Home;
        public string Away;
        public int HomeGoals;
        public int AwayGoals;
    }

    public class GroupInfo
    {
        public string Name;
        public string[] Teams;
        public double[] Elo;
    }

    // آمار دقیق یک بازی با توزیع گل و نتایج دقیق
    public class MatchDetailedStats
    {
        public long TotalSims;
        public long SumHomeGoals, SumSqHomeGoals;
        public long SumAwayGoals, SumSqAwayGoals;
        public long WinHome, Draw, WinAway;
        public int[] HomeGoalDist = new int[8]; // 0 تا 6+ گل
        public int[] AwayGoalDist = new int[8];
        public int[,] ScoreMatrix = new int[8, 8]; // [homeGoals][awayGoals], 7+ در ایندکس 7 جمع می‌شود

        public double MeanHome => (double)SumHomeGoals / TotalSims;
        public double MeanAway => (double)SumAwayGoals / TotalSims;
        public double StdDevHome => Math.Sqrt((double)SumSqHomeGoals / TotalSims - MeanHome * MeanHome);
        public double StdDevAway => Math.Sqrt((double)SumSqAwayGoals / TotalSims - MeanAway * MeanAway);
        public double ProbHomeWin => (double)WinHome / TotalSims * 100.0;
        public double ProbDraw => (double)Draw / TotalSims * 100.0;
        public double ProbAwayWin => (double)WinAway / TotalSims * 100.0;

        public void AddResult(int homeGoals, int awayGoals)
        {
            int hi = homeGoals > 6 ? 7 : homeGoals;
            int ai = awayGoals > 6 ? 7 : awayGoals;
            ScoreMatrix[hi, ai]++;
            HomeGoalDist[hi]++;
            AwayGoalDist[ai]++;
            SumHomeGoals += homeGoals;
            SumSqHomeGoals += homeGoals * homeGoals;
            SumAwayGoals += awayGoals;
            SumSqAwayGoals += awayGoals * awayGoals;
            TotalSims++;
            if (homeGoals > awayGoals) WinHome++;
            else if (homeGoals == awayGoals) Draw++;
            else WinAway++;
        }

        public double GetHomeGoalProb(int goals) => (double)HomeGoalDist[goals > 6 ? 7 : goals] / TotalSims * 100.0;
        public double GetAwayGoalProb(int goals) => (double)AwayGoalDist[goals > 6 ? 7 : goals] / TotalSims * 100.0;
        public double GetExactScoreProb(int homeGoals, int awayGoals)
        {
            int hi = homeGoals > 6 ? 7 : homeGoals;
            int ai = awayGoals > 6 ? 7 : awayGoals;
            return (double)ScoreMatrix[hi, ai] / TotalSims * 100.0;
        }

        // بازگرداندن نتایج محتمل (حداکثر ۵ نتیجه) به صورت (هوم گل, مهمان گل, احتمال)
        public List<(int h, int a, double prob)> GetTopScores(int topCount = 5)
        {
            var list = new List<(int h, int a, double prob)>();
            for (int i = 0; i <= 7; i++)
                for (int j = 0; j <= 7; j++)
                {
                    double prob = (double)ScoreMatrix[i, j] / TotalSims * 100.0;
                    if (prob > 0.01)
                        list.Add((i, j, prob));
                }
            return list.OrderByDescending(x => x.prob).Take(topCount).ToList();
        }
    }

    public class WorldCupPredictor
    {
        private static Random rand = new Random();
        private const int SIM_COUNT = 30000;

        public static void Run(string outputHtml)
        {
            var groups = new List<GroupInfo>
            {
                new GroupInfo { Name = "Group A", Teams = new[] { "Mexico", "South Korea", "South Africa", "Czech Republic" }, Elo = new double[] { 1750, 1550, 1480, 1650 } },
                new GroupInfo { Name = "Group B", Teams = new[] { "Canada", "Switzerland", "Qatar", "Bosnia and Herzegovina" }, Elo = new double[] { 1600, 1780, 1500, 1650 } },
                new GroupInfo { Name = "Group C", Teams = new[] { "Brazil", "Morocco", "Scotland", "Haiti" }, Elo = new double[] { 1920, 1650, 1620, 1350 } },
                new GroupInfo { Name = "Group D", Teams = new[] { "USA", "Australia", "Paraguay", "Turkey" }, Elo = new double[] { 1750, 1680, 1600, 1700 } },
                new GroupInfo { Name = "Group E", Teams = new[] { "Germany", "Curacao", "Cote d'Ivoire", "Ecuador" }, Elo = new double[] { 1880, 1300, 1680, 1650 } },
                new GroupInfo { Name = "Group F", Teams = new[] { "Netherlands", "Japan", "Sweden", "Tunisia" }, Elo = new double[] { 1850, 1620, 1700, 1550 } },
                new GroupInfo { Name = "Group G", Teams = new[] { "Belgium", "Iran", "Egypt", "New Zealand" }, Elo = new double[] { 1820, 1600, 1650, 1500 } },
                new GroupInfo { Name = "Group H", Teams = new[] { "Spain", "Uruguay", "Saudi Arabia", "Cabo Verde" }, Elo = new double[] { 1900, 1720, 1550, 1450 } },
                new GroupInfo { Name = "Group I", Teams = new[] { "France", "Senegal", "Norway", "Iraq" }, Elo = new double[] { 1890, 1680, 1720, 1480 } },
                new GroupInfo { Name = "Group J", Teams = new[] { "Argentina", "Austria", "Algeria", "Jordan" }, Elo = new double[] { 1910, 1710, 1630, 1500 } },
                new GroupInfo { Name = "Group K", Teams = new[] { "Portugal", "Colombia", "Uzbekistan", "DR Congo" }, Elo = new double[] { 1830, 1740, 1480, 1580 } },
                new GroupInfo { Name = "Group L", Teams = new[] { "England", "Croatia", "Ghana", "Panama" }, Elo = new double[] { 1870, 1770, 1640, 1520 } }
            };

            var allTeams = groups.SelectMany(g => g.Teams).ToArray();
            var eloDict = new Dictionary<string, double>();
            foreach (var g in groups)
                for (int i = 0; i < g.Teams.Length; i++)
                    eloDict[g.Teams[i]] = g.Elo[i];

            // آمار نهایی
            var advanceStats = new Dictionary<string, int>();
            var championStats = new Dictionary<string, int>();
            var groupWinnerStats = new Dictionary<string, int>();
            var goalsStats = new Dictionary<string, int[]>();
            var thirdPlaceAdvanceStats = new Dictionary<string, int>();
            var knockoutProgress = new Dictionary<string, int[]>();

            var groupMatchStats = new Dictionary<string, Dictionary<string, MatchDetailedStats>>();
            var knockoutMatchStats = new Dictionary<string, Dictionary<string, MatchDetailedStats>>();

            foreach (var team in allTeams)
            {
                advanceStats[team] = 0;
                championStats[team] = 0;
                groupWinnerStats[team] = 0;
                goalsStats[team] = new int[2];
                thirdPlaceAdvanceStats[team] = 0;
                knockoutProgress[team] = new int[5];
                groupMatchStats[team] = new Dictionary<string, MatchDetailedStats>();
                knockoutMatchStats[team] = new Dictionary<string, MatchDetailedStats>();
                foreach (var opp in allTeams)
                    if (opp != team) 
                        groupMatchStats[team][opp] = new MatchDetailedStats();
            }

            for (int sim = 0; sim < SIM_COUNT; sim++)
            {
                var groupStandingsList = new List<List<TeamStanding>>();
                var thirdPlacedTeams = new List<TeamStanding>();

                foreach (var g in groups)
                {
                    var result = SimulateGroupStage(g.Teams, eloDict);
                    List<TeamStanding> standings = result.Item1;
                    List<MatchResult> matches = result.Item2;
                    groupStandingsList.Add(standings);
                    thirdPlacedTeams.Add(standings[2]);

                    foreach (var m in matches)
                    {
                        groupMatchStats[m.Home][m.Away].AddResult(m.HomeGoals, m.AwayGoals);
                    }

                    foreach (var t in standings)
                    {
                        goalsStats[t.Team][0] += t.GF;
                        goalsStats[t.Team][1] += t.GA;
                    }
                }

                var bestThird = thirdPlacedTeams
                    .OrderByDescending(x => x.Points)
                    .ThenByDescending(x => x.GD)
                    .ThenByDescending(x => x.GF)
                    .Take(8)
                    .Select(x => x.Team)
                    .ToList();

                var qualified = new List<string>();
                foreach (var st in groupStandingsList)
                {
                    qualified.Add(st[0].Team);
                    qualified.Add(st[1].Team);
                    groupWinnerStats[st[0].Team]++;
                    advanceStats[st[0].Team]++;
                    advanceStats[st[1].Team]++;
                }
                foreach (var team in bestThird)
                {
                    qualified.Add(team);
                    thirdPlaceAdvanceStats[team]++;
                    advanceStats[team]++;
                }

                var knockoutRes = SimulateKnockout(qualified, eloDict);
                string champion = knockoutRes.Item1;
                List<MatchResult> koMatches = knockoutRes.Item2;
                Dictionary<string, int[]> progress = knockoutRes.Item3;

                championStats[champion]++;
                foreach (var kv in progress)
                    for (int i = 0; i < 5; i++)
                        knockoutProgress[kv.Key][i] += kv.Value[i];

                foreach (var m in koMatches)
                {
                    if (!knockoutMatchStats.ContainsKey(m.Home))
                        knockoutMatchStats[m.Home] = new Dictionary<string, MatchDetailedStats>();
                    if (!knockoutMatchStats[m.Home].ContainsKey(m.Away))
                        knockoutMatchStats[m.Home][m.Away] = new MatchDetailedStats();
                    knockoutMatchStats[m.Home][m.Away].AddResult(m.HomeGoals, m.AwayGoals);

                    if (!knockoutMatchStats.ContainsKey(m.Away))
                        knockoutMatchStats[m.Away] = new Dictionary<string, MatchDetailedStats>();
                    if (!knockoutMatchStats[m.Away].ContainsKey(m.Home))
                        knockoutMatchStats[m.Away][m.Home] = new MatchDetailedStats();
                    knockoutMatchStats[m.Away][m.Home].AddResult(m.AwayGoals, m.HomeGoals);
                }
            }

            var advancePercent = advanceStats.ToDictionary(kv => kv.Key, kv => kv.Value * 100.0 / SIM_COUNT);
            var championPercent = championStats.ToDictionary(kv => kv.Key, kv => kv.Value * 100.0 / SIM_COUNT);
            var groupWinnerPercent = groupWinnerStats.ToDictionary(kv => kv.Key, kv => kv.Value * 100.0 / SIM_COUNT);
            var avgGoals = goalsStats.ToDictionary(kv => kv.Key, kv => (double)kv.Value[0] / SIM_COUNT);
            var avgGoalsAgainst = goalsStats.ToDictionary(kv => kv.Key, kv => (double)kv.Value[1] / SIM_COUNT);
            var thirdAdvancePercent = thirdPlaceAdvanceStats.ToDictionary(kv => kv.Key, kv => kv.Value * 100.0 / SIM_COUNT);
            var knockoutProgressPercent = knockoutProgress.ToDictionary(kv => kv.Key, kv => kv.Value.Select(v => v * 100.0 / SIM_COUNT).ToArray());

            GenerateHtml(groups, advancePercent, championPercent, groupWinnerPercent, thirdAdvancePercent,
                        knockoutProgressPercent, avgGoals, avgGoalsAgainst, groupMatchStats, knockoutMatchStats, outputHtml);
        }

        static Tuple<List<TeamStanding>, List<MatchResult>> SimulateGroupStage(string[] teams, Dictionary<string, double> elo)
        {
            var matches = new List<int[]> { new int[] {0,1}, new int[] {0,2}, new int[] {0,3}, new int[] {1,2}, new int[] {1,3}, new int[] {2,3} };
            int[] points = new int[4];
            int[] gf = new int[4];
            int[] ga = new int[4];
            var matchResults = new List<MatchResult>();

            foreach (var m in matches)
            {
                int h = m[0], a = m[1];
                double expH = ExpectedGoals(elo[teams[h]], elo[teams[a]]);
                double expA = ExpectedGoals(elo[teams[a]], elo[teams[h]]);
                int hg = PoissonSample(expH);
                int ag = PoissonSample(expA);
                gf[h] += hg; ga[h] += ag;
                gf[a] += ag; ga[a] += hg;
                matchResults.Add(new MatchResult { Home = teams[h], Away = teams[a], HomeGoals = hg, AwayGoals = ag });
                if (hg > ag) points[h] += 3;
                else if (hg < ag) points[a] += 3;
                else { points[h] += 1; points[a] += 1; }
            }

            var standings = new List<TeamStanding>();
            for (int i = 0; i < 4; i++)
                standings.Add(new TeamStanding { Team = teams[i], Points = points[i], GD = gf[i] - ga[i], GF = gf[i], GA = ga[i] });
            standings = standings.OrderByDescending(x => x.Points).ThenByDescending(x => x.GD).ThenByDescending(x => x.GF).ToList();
            return Tuple.Create(standings, matchResults);
        }

        static Tuple<string, List<MatchResult>, Dictionary<string, int[]>> SimulateKnockout(List<string> round32, Dictionary<string, double> elo)
        {
            var winners = new List<string>(round32);
            var allMatches = new List<MatchResult>();
            var progress = new Dictionary<string, int[]>();
            foreach (var t in round32) progress[t] = new int[5];

            for (int round = 0; round < 5; round++)
            {
                var next = new List<string>();
                for (int i = 0; i < winners.Count; i += 2)
                {
                    if (i + 1 >= winners.Count) break;
                    string a = winners[i], b = winners[i+1];
                    double expA = ExpectedGoals(elo[a], elo[b]);
                    double expB = ExpectedGoals(elo[b], elo[a]);
                    int ga = PoissonSample(expA);
                    int gb = PoissonSample(expB);
                    string winner = (ga > gb) ? a : ((ga < gb) ? b : (rand.Next(2) == 0 ? a : b));
                    next.Add(winner);
                    allMatches.Add(new MatchResult { Home = a, Away = b, HomeGoals = ga, AwayGoals = gb });
                    progress[winner][round]++;
                }
                winners = next;
            }
            string champion = (winners.Count > 0) ? winners[0] : "Unknown";
            return Tuple.Create(champion, allMatches, progress);
        }

        static double ExpectedGoals(double ratingA, double ratingB) => Math.Exp((ratingA - ratingB) / 400.0);
        static int PoissonSample(double lambda)
        {
            if (lambda <= 0) return 0;
            double L = Math.Exp(-lambda);
            double p = 1.0;
            int k = 0;
            do { k++; p *= rand.NextDouble(); } while (p > L);
            return k - 1;
        }

        static void GenerateHtml(List<GroupInfo> groups, 
            Dictionary<string, double> advance, Dictionary<string, double> champion, 
            Dictionary<string, double> groupWinner, Dictionary<string, double> thirdAdvance,
            Dictionary<string, double[]> knockoutProgress,
            Dictionary<string, double> avgGoals, Dictionary<string, double> avgGoalsAgainst,
            Dictionary<string, Dictionary<string, MatchDetailedStats>> groupMatches,
            Dictionary<string, Dictionary<string, MatchDetailedStats>> koMatches,
            string path)
        {
            var html = new StringBuilder();
            html.AppendLine("<!DOCTYPE html><html lang='fa' dir='rtl'><head><meta charset='UTF-8'><title>پیش‌بینی جام جهانی ۲۰۲۶ - نتایج دقیق بازی‌ها با احتمال</title>");
            html.AppendLine("<script src='https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'></script>");
            html.AppendLine("<style>body{font-family:Tahoma,sans-serif;margin:20px;background:#f0f2f5;}");
            html.AppendLine(".container{max-width:1200px;margin:auto;background:white;padding:20px;border-radius:12px;}");
            html.AppendLine(".summary{display:flex;gap:15px;margin:20px 0;justify-content:space-around;flex-wrap:wrap;}");
            html.AppendLine(".stat-card{background:#f8f9fa;padding:15px;border-radius:12px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,0.1);min-width:200px;}");
            html.AppendLine("table{width:100%;border-collapse:collapse;margin:20px 0;}");
            html.AppendLine("th,td{padding:10px;border:1px solid #ddd;text-align:center;}");
            html.AppendLine("th{background:#2c3e50;color:white;}");
            html.AppendLine(".group-card{background:#f8f9fa;margin:20px 0;padding:15px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);}");
            html.AppendLine(".team-detail{margin-top:15px;padding:10px;background:#e9ecef;border-radius:8px;}");
            html.AppendLine(".progress-bar{background:#e0e0e0;border-radius:10px;overflow:hidden;margin:5px 0;height:20px;}");
            html.AppendLine(".progress-fill{background:#4caf50;height:100%;color:white;text-align:center;line-height:20px;font-size:12px;}");
            html.AppendLine(".badge{padding:3px 8px;border-radius:12px;font-size:12px;font-weight:bold;margin:0 2px;display:inline-block;}");
            html.AppendLine(".badge-gold{background:#ffd700;color:#000;}.badge-silver{background:#c0c0c0;color:#000;}.badge-bronze{background:#cd7f32;color:#fff;}");
            html.AppendLine(".score-box{background:#f0f0f0;border-radius:8px;padding:8px;margin:5px 0;display:inline-block;min-width:80px;text-align:center;}");
            html.AppendLine(".top-score{background:#e8f5e9;border-right:4px solid #4caf50;}");
            html.AppendLine("</style></head><body><div class='container'>");

            html.AppendLine("<h1>🏆 جام جهانی ۲۰۲۶ - پیش‌بینی نتایج دقیق بازی‌ها (۳۰,۰۰۰ شبیه‌سازی)</h1>");
            html.AppendLine($"<p>📊 نمایش محتمل‌ترین نتایج هر بازی به همراه درصد وقوع | فرمت ۴۸ تیم | ۱۲ گروه | ۸ تیم سوم برتر</p>");

            var top3Champion = champion.OrderByDescending(kv => kv.Value).Take(3).ToList();
            var top3Goal = avgGoals.OrderByDescending(kv => kv.Value).Take(3).ToList();
            html.AppendLine("<div class='summary'>");
            html.AppendLine($"<div class='stat-card'><h3>🏆 شانس قهرمانی</h3><p>🥇 {top3Champion[0].Key}: {top3Champion[0].Value:F1}%<br/>🥈 {top3Champion[1].Key}: {top3Champion[1].Value:F1}%<br/>🥉 {top3Champion[2].Key}: {top3Champion[2].Value:F1}%</p></div>");
            html.AppendLine($"<div class='stat-card'><h3>⭐ بهترین خط حمله</h3><p>⚽ {top3Goal[0].Key}: {top3Goal[0].Value:F1} گل/تورنومنت<br/>⚽ {top3Goal[1].Key}: {top3Goal[1].Value:F1} گل/تورنومنت<br/>⚽ {top3Goal[2].Key}: {top3Goal[2].Value:F1} گل/تورنومنت</p></div>");
            html.AppendLine("</div>");

            // جداول گروه‌ها با نتایج دقیق هر بازی
            foreach (var g in groups)
            {
                html.AppendLine($"<div class='group-card'><h2>{g.Name}</h2>");
                // جدول کلی گروه
                html.AppendLine("<table><thead><tr><th>تیم</th><th>Elo</th><th>میانگین گل زده</th><th>میانگین گل خورده</th><th>شانس قهرمان گروه</th><th>شانس صعود</th></tr></thead><tbody>");
                foreach (var team in g.Teams)
                {
                    html.AppendLine($"<tr><td>{team}<td>{g.Elo[Array.IndexOf(g.Teams, team)]:F0}<td>{avgGoals[team]:F2}<td>{avgGoalsAgainst[team]:F2}<td>{groupWinner[team]:F1}%<td><b>{advance[team]:F1}%</b></tr>");
                }
                html.AppendLine("</tbody></table>");

                // نتایج دقیق بازی‌ها
                html.AppendLine("<h3>🎯 محتمل‌ترین نتایج هر بازی</h3>");
                var teamsList = g.Teams.ToList();
                for (int i = 0; i < teamsList.Count; i++)
                {
                    for (int j = i+1; j < teamsList.Count; j++)
                    {
                        string h = teamsList[i], a = teamsList[j];
                        var stat = groupMatches[h][a];
                        if (stat.TotalSims == 0) continue;

                        html.AppendLine($"<div style='margin:15px 0;padding:10px;background:#fafafa;border-radius:8px;'>");
                        html.AppendLine($"<b>{h} vs {a}</b> &nbsp; (میانگین: {h} {stat.MeanHome:F2} - {stat.MeanAway:F2} {a})");
                        html.AppendLine($"<p>برد {h}: {stat.ProbHomeWin:F1}% | مساوی: {stat.ProbDraw:F1}% | برد {a}: {stat.ProbAwayWin:F1}%</p>");
                        html.AppendLine("<div style='display:flex;flex-wrap:wrap;gap:10px;'>");
                        var topScores = stat.GetTopScores(5);
                        foreach (var score in topScores)
                        {
                            string cls = (score.prob == topScores[0].prob) ? "top-score" : "";
                            html.AppendLine($"<div class='score-box {cls}'>{score.h} - {score.a} &nbsp; <b>{score.prob:F1}%</b></div>");
                        }
                        html.AppendLine("</div>");
                        html.AppendLine("</div>");
                    }
                }
                html.AppendLine("</div>");
            }

            // مرحله حذفی - نتایج دقیق
            html.AppendLine("<h2>🏅 مرحله حذفی - محتمل‌ترین نتایج</h2>");
            if (koMatches.Count > 0)
            {
                foreach (var home in koMatches.Keys)
                {
                    foreach (var away in koMatches[home].Keys)
                    {
                        var stat = koMatches[home][away];
                        if (stat.TotalSims < 200) continue;
                        html.AppendLine($"<div style='margin:15px 0;padding:10px;background:#fafafa;border-radius:8px;'>");
                        html.AppendLine($"<b>{home} vs {away}</b> &nbsp; (میانگین: {home} {stat.MeanHome:F2} - {stat.MeanAway:F2} {away})");
                        html.AppendLine($"<p>برد {home}: {stat.ProbHomeWin:F1}% | مساوی: {stat.ProbDraw:F1}% | برد {away}: {stat.ProbAwayWin:F1}%</p>");
                        html.AppendLine("<div style='display:flex;flex-wrap:wrap;gap:10px;'>");
                        var topScores = stat.GetTopScores(5);
                        foreach (var score in topScores)
                        {
                            string cls = (score.prob == topScores[0].prob) ? "top-score" : "";
                            html.AppendLine($"<div class='score-box {cls}'>{score.h} - {score.a} &nbsp; <b>{score.prob:F1}%</b></div>");
                        }
                        html.AppendLine("</div>");
                        html.AppendLine("</div>");
                    }
                }
            }

            // تحلیل ۱۰ تیم برتر
            html.AppendLine("<h2>📊 تحلیل ۱۰ تیم برتر (شانس قهرمانی)</h2>");
            var sortedTeams = champion.OrderByDescending(kv => kv.Value).Take(10).ToList();
            foreach (var team in sortedTeams)
            {
                html.AppendLine($"<div class='team-detail'><h3>⚽ {team.Key}<span class='badge badge-gold'>شانس قهرمانی: {team.Value:F1}%</span></h3>");
                html.AppendLine($"<p><strong>میانگین گل زده:</strong> {avgGoals[team.Key]:F2} | <strong>میانگین گل خورده:</strong> {avgGoalsAgainst[team.Key]:F2}</p>");
                html.AppendLine("<p><strong>پیشرفت در مراحل حذفی:</strong></p>");
                var prog = knockoutProgress[team.Key];
                string[] stages = { "یک‌شانزدهم", "یک‌هشتم", "یک‌چهارم", "نیمه‌نهایی", "فینال" };
                for (int i = 0; i < 5; i++)
                    html.AppendLine($"<div class='progress-bar'><div class='progress-fill' style='width:{prog[i]:F1}%'>{stages[i]}: {prog[i]:F1}%</div></div>");
                html.AppendLine("</div>");
            }

            html.AppendLine("</div></body></html>");
            File.WriteAllText(path, html.ToString());
        }
    }
}
