"""Reproduce the ELE best-track plate from attributed, checked-in source data.

Requires matplotlib. Example: python scripts/plot-observed-tracks.py
The extraction is recorded in figure-data/README.md; no forecast is invented.
"""
from pathlib import Path
import csv
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
if (ROOT / 'docs/plot-deps').exists():
    sys.path.insert(0, str(ROOT / 'docs/plot-deps'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from matplotlib.ticker import FuncFormatter, MultipleLocator

plt.rcParams.update({'font.family':'DejaVu Sans', 'font.size':12, 'axes.labelcolor':'#374d4a', 'text.color':'#203b36', 'svg.fonttype':'path', 'svg.hashsalt':'earth-last-exam-jma-tracks'})
rows = list(csv.DictReader((ROOT / 'figure-data/jma-khanun-saola.csv').open()))
land = json.loads((ROOT / 'figure-data/western-pacific-land.json').read_text())
fig, ax = plt.subplots(figsize=(6.4,6.4), dpi=220)
fig.patch.set_facecolor('#fff')
ax.set_facecolor('#f3f7f8')
for ring in land:
    ax.add_patch(Polygon(ring, closed=True, facecolor='#e1e5de', edgecolor='#aab5aa', linewidth=.45, zorder=2))
ax.set_xlim(109,141); ax.set_ylim(8,42)
# Plate carrée longitude/latitude axes, corrected to a representative latitude.
ax.set_aspect(1/0.9063)
ax.xaxis.set_major_locator(MultipleLocator(10));ax.yaxis.set_major_locator(MultipleLocator(10))
ax.xaxis.set_major_formatter(FuncFormatter(lambda x,p:f'{x:.0f}°E'))
ax.yaxis.set_major_formatter(FuncFormatter(lambda y,p:f'{y:.0f}°N'))
ax.tick_params(length=0,pad=8,colors='#5c6d68',labelsize=12)
ax.grid(color='#d9e1e0',linewidth=.6,zorder=1)
for spine in ax.spines.values():spine.set_color('#c7d0ca')
colors={'KHANUN':'#246a69','SAOLA':'#a76136'}
for name,color in colors.items():
    points=[r for r in rows if r['storm']==name]
    x=[float(r['longitude']) for r in points];y=[float(r['latitude']) for r in points]
    ax.plot(x,y,color='white',linewidth=3.7,zorder=3)
    ax.plot(x,y,color=color,linewidth=2.0,zorder=4,label=name.title())
    daily=[r for r in points if r['time_utc'].endswith('00:00:00Z')]
    ax.scatter([float(r['longitude']) for r in daily],[float(r['latitude']) for r in daily],s=17,facecolor='white',edgecolor=color,linewidth=1,zorder=5)
    ax.scatter(x[0],y[0],s=45,marker='s',facecolor=color,edgecolor='white',linewidth=.8,zorder=6)
    ax.scatter(x[-1],y[-1],s=50,marker='^',facecolor=color,edgecolor='white',linewidth=.8,zorder=6)
ax.text(114.0,35.2,'EAST ASIA',fontsize=10,color='#758578',ha='center')
ax.text(120.2,26.5,'Khanun',color=colors['KHANUN'],weight='bold',fontsize=12,ha='right')
saola_anchor=next(r for r in rows if r['storm']=='SAOLA' and r['time_utc']=='2023-08-27T00:00:00Z')
ax.annotate('Saola',xy=(float(saola_anchor['longitude']),float(saola_anchor['latitude'])),xytext=(128.8,13.1),color=colors['SAOLA'],weight='bold',fontsize=12,
            arrowprops={'arrowstyle':'-','color':colors['SAOLA'],'linewidth':.8},zorder=7)
fig.subplots_adjust(left=.13,right=.98,bottom=.09,top=.97)
destination=ROOT / 'src/images/typhoon-observed-tracks.svg'
fig.savefig(destination,metadata={'Date':None,'Creator':'EvolventAI; Matplotlib; JMA best-track data; Natural Earth'})
destination.write_text('\n'.join(line.rstrip() for line in destination.read_text(encoding='utf-8').splitlines())+'\n',encoding='utf-8',newline='\n')
(ROOT / 'docs').mkdir(exist_ok=True)
fig.savefig(ROOT / 'docs/observed-tracks-review.png',dpi=140)
print(f'{destination.name}: {len(rows)} observations; square/triangle = first/last archive record; no smoothing')
