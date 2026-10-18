"""Render JMA central-pressure observations; no fitted curve or model prediction."""
import csv
from datetime import datetime
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if (ROOT / 'docs/plot-deps').exists():
    sys.path.insert(0, str(ROOT / 'docs/plot-deps'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator

plt.rcParams.update({
    'font.family': 'DejaVu Sans', 'font.size': 12,
    'text.color': '#203b36', 'axes.labelcolor': '#465b53',
    'svg.fonttype': 'path', 'svg.hashsalt': 'ele-jma-observed-pressure',
})
with (ROOT / 'figure-data/jma-khanun-saola.csv').open(encoding='utf-8', newline='') as stream:
    rows = list(csv.DictReader(stream))
fig, axes = plt.subplots(1, 2, figsize=(10.4, 4.4), sharey=True)
fig.patch.set_facecolor('#fafbf8')
for ax, name, color in zip(axes, ('KHANUN', 'SAOLA'), ('#246a69', '#a76136')):
    points = [row for row in rows if row['storm'] == name]
    times = [datetime.fromisoformat(row['time_utc'].replace('Z', '+00:00')) for row in points]
    raw = [float(row['pressure_hpa']) for row in points]
    # JMA absent central pressure is 0. Preserve a gap instead of interpolating.
    pressure = [value if 800 < value < 1100 else float('nan') for value in raw]
    ax.set_facecolor('#fafbf8')
    ax.plot(times, pressure, color=color, lw=1.8, marker='o', ms=2.8, markeredgewidth=0)
    lowest = min((value, i) for i, value in enumerate(raw) if 800 < value < 1100)
    value, index = lowest
    ax.scatter([times[index]], [value], s=55, color=color, edgecolor='#fafbf8', linewidth=1.5, zorder=4)
    ax.annotate(f'{value:.0f} hPa', (times[index], value), xytext=(0, -24), textcoords='offset points', ha='center', fontsize=12, weight='bold', color=color)
    ax.set_title(name.title(), loc='left', color=color, fontsize=18, fontweight='normal', pad=20)
    ax.text(1, 1.08, f'{len(points)} records', transform=ax.transAxes, ha='right', va='bottom', fontsize=11, color='#52655a')
    ax.set_ylim(900, 1020)
    ax.yaxis.set_major_locator(MultipleLocator(30))
    ax.xaxis.set_major_locator(mdates.DayLocator(interval=4 if name == 'KHANUN' else 3))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%d %b'))
    ax.tick_params(axis='both', length=0, pad=9, colors='#52655a', labelsize=11)
    ax.grid(axis='y', color='#dce3da', lw=.7)
    ax.spines[['top', 'right', 'left']].set_visible(False)
    ax.spines['bottom'].set_color('#b6c3b9')
    ax.set_xlabel('2023 · UTC', labelpad=14, fontsize=11)
axes[0].set_ylabel('Central pressure · hPa', labelpad=14, fontsize=12)
fig.subplots_adjust(left=.10, right=.98, bottom=.22, top=.82, wspace=.16)
target = ROOT / 'src/images/typhoon-observed-pressure.svg'
fig.savefig(target, metadata={'Date': None, 'Creator': 'EvolventAI; JMA best-track records; Matplotlib'})
target.write_text('\n'.join(line.rstrip() for line in target.read_text(encoding='utf-8').splitlines()) + '\n', encoding='utf-8', newline='\n')
(ROOT / 'docs').mkdir(exist_ok=True)
fig.savefig(ROOT / 'docs/observed-pressure-review.png', dpi=150)
print(f'{target.name}: {len(rows)} archived records; shared pressure scale; no smoothing')
