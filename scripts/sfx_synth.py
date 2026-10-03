#!/usr/bin/env python3
"""Gera uma biblioteca de SFX ORIGINAIS por síntese (numpy puro) — livres (CC0), sem licença a pedir.

Uso: python scripts/sfx_synth.py sfx/synth_novos [--seed 7]
Troque a --seed para gerar variações novas (diversificar SFX entre vídeos).
Sons: boom, clang1-3, cascade (chapas caindo), whoosh1-12, pop1-8, stamp1-4, roll<N> (contador),
scribble1-2 (caneta), zip1-2, warn, notif, chime, type, riser (loop), swell (tensão).
"""
import numpy as np, wave, os, sys, argparse
ap=argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--seed',type=int,default=1906); A=ap.parse_args()
OUT=A.out; os.makedirs(OUT,exist_ok=True)
SR=48000; rng=np.random.default_rng(A.seed)
def wr(x,p):
    x=np.asarray(x,float)
    if x.ndim==1: x=np.stack([x,x],1)
    x=x/max(1e-9,np.abs(x).max())*0.89
    w=wave.open(os.path.join(OUT,p),'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes()); w.close()
def _fm(x,g):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); return np.fft.irfft(X*g(f),len(x))
def bp(x,lo,hi,o=2): return _fm(x,lambda f:1/np.sqrt(1+(f/hi)**(2*o))/np.sqrt(1+(lo/np.maximum(f,1e-3))**(2*o)))
def lpf(x,f0,o=2): return _fm(x,lambda f:1/np.sqrt(1+(f/f0)**(2*o)))
def hpf(x,f0,o=2): return _fm(x,lambda f:1/np.sqrt(1+(f0/np.maximum(f,1e-3))**(2*o)))
def T(d): n=int(d*SR); return n,np.arange(n)/SR
def tvlpf(x,fc,blocks=64):
    # crude time-varying low-pass via overlapping blocks
    out=np.zeros(len(x)); B=len(x)//blocks+1; win=np.hanning(2*B)
    for b in range(blocks*2):
        i0=b*B//2; seg=x[i0:i0+2*B]
        if len(seg)<16: continue
        y=lpf(seg,fc[min(len(fc)-1,i0+B//2)])*win[:len(seg)]; out[i0:i0+len(seg)]+=y
    return out
def echo(x,dl,g):
    y=x.copy()
    for d,a in zip(dl,g):
        k=int(d*SR); y[k:]+=a*lpf(x,2500)[:len(x)-k]
    return y
def stereo(x,w=0.012):
    k=int(w*SR); return np.stack([x,np.concatenate([np.zeros(k),x[:-k]])*0.92+x*0.08],1)
# --- big boom: crack + sub + rolling tail 3.5 s (impacto grande / explosão)
n,t=T(3.5)
cr=hpf(rng.standard_normal(n),1800)*np.exp(-t/0.006)*1.4
sub=np.sin(2*np.pi*(55*np.exp(-t*1.2))*t)*np.exp(-t/0.35)*1.4
bo=bp(rng.standard_normal(n),80,2500)*np.exp(-t/0.09)*1.2
roll=lpf(rng.standard_normal(n),600)*np.exp(-t/0.9)*np.clip(t/0.05,0,1)*0.5*(1+0.4*np.sin(2*np.pi*3.1*t))
x=echo(cr+sub+bo+roll,[0.18,0.37,0.66,1.0],[0.35,0.22,0.13,0.07]); x*=np.clip((3.5-t)/0.5,0,1)
wr(stereo(x,0.017),'boom.wav')
# --- pan clangs: inharmonic modal bank (thin steel sheet), 3 variants
def clang(name,f0,dec=0.5,n_modes=9,dur=1.2):
    n,t=T(dur); x=np.zeros(n); r=[1,1.58,2.13,2.71,3.44,4.11,4.95,5.62,6.9]
    for i in range(n_modes):
        f=f0*r[i]*(1+0.01*rng.standard_normal()); x+=np.sin(2*np.pi*f*t+rng.uniform(0,6))*np.exp(-t/(dec/(1+0.35*i)))/(1+0.3*i)
    x+=hpf(rng.standard_normal(n),3000)*np.exp(-t/0.003)*0.8
    wr(stereo(x,0.007),name)
clang('clang1.wav',620,0.45); clang('clang2.wav',480,0.6); clang('clang3.wav',830,0.35)
# --- pan cascade (many sheets rattling/falling) 1.4 s
n,t=T(1.4); x=np.zeros(n)
for k in range(26):
    t0=0.03+k*0.035+rng.uniform(0,0.02); i=int(t0*SR); m,tt=T(0.35); f0=rng.uniform(400,1100)
    c=sum(np.sin(2*np.pi*f0*r*tt)*np.exp(-tt/(0.18/(1+0.4*j)))/(1+j) for j,r in enumerate([1,1.6,2.3,3.1]))
    x[i:i+m]+=c[:max(0,min(m,n-i))]*(0.9-0.02*k)
x+=bp(rng.standard_normal(n),200,2000)*np.exp(-t/0.4)*0.3; wr(stereo(x),'cascade.wav')
# --- whooshes v3: "tape zip" sweeps with comb shimmer (6 variants)
def whoosh(name,d,f0,f1,peak=0.6):
    n,t=T(d); nz=rng.standard_normal(n); out=np.zeros(n); B=48
    fc=f0*(f1/f0)**(t/d)
    for b in range(B):
        a,z=b*n//B,(b+1)*n//B+800; seg=nz[a:z]
        if len(seg)<64: continue
        out[a:a+len(seg)]+=bp(seg,fc[a]*0.6,fc[a]*1.6)*np.hanning(len(seg))
    e=np.where(t<peak*d,(t/(peak*d))**2,np.exp(-(t-peak*d)/(0.12*d))); x=out*e
    k=int(0.0031*SR); x[k:]+=0.4*x[:-k]; wr(stereo(x,0.009),name)
for i,(d,a,b,p) in enumerate([(0.32,300,4000,0.6),(0.28,2500,500,0.4),(0.36,200,3000,0.7),(0.25,800,6000,0.55),(0.4,4000,400,0.35),(0.3,500,5000,0.65)]):
    whoosh(f'whoosh{i+1}.wav',d,a,b,p)
# --- wood-block pops (3 pitches)
for i,f in enumerate([880,1170,660]):
    n,t=T(0.18); x=np.sin(2*np.pi*f*t)*np.exp(-t/0.03)+0.5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t/0.012)+hpf(rng.standard_normal(n),3000)*np.exp(-t/0.002)*0.5
    wr(x,f'pop{i+1}.wav')
# --- stamp: kick + clap
n,t=T(0.5); kick=np.sin(2*np.pi*(150*np.exp(-t*18)+48)*t)*np.exp(-t/0.12)
clap=sum(np.roll(bp(rng.standard_normal(n),900,4000)*np.exp(-t/0.05),int(k*0.009*SR)) for k in range(3))*0.5
wr(kick+clap,'stamp.wav')
# --- counter roll ticks: n ticks accelerating then a "lock" blip
def roll(name,nt,d=0.42):
    n,t=T(d+0.2); x=np.zeros(n)
    for k in range(nt):
        tk=d*(1-(1-k/max(1,nt-1))**1.6)*0.98 if nt>1 else 0; i=int(tk*SR); m,tt=T(0.02)
        x[i:i+m]+=np.sin(2*np.pi*(1800+600*k/max(1,nt))*tt)*np.exp(-tt/0.004)
    i=int(d*SR); m,tt=T(0.15); x[i:i+m]+=0.7*np.sin(2*np.pi*2400*tt)*np.exp(-tt/0.04)
    wr(x,name)
roll('roll2.wav',2,0.2); roll('roll19.wav',19); roll('roll13.wav',13); roll('roll23.wav',23); roll('roll31.wav',31,0.45)
# --- marker scribble (draw-on circle) 0.32 s
n,t=T(0.32); x=bp(rng.standard_normal(n),1500,6000)*(0.6+0.4*np.sin(2*np.pi*14*t))*np.exp(-((t-0.15)/0.11)**2); wr(x,'scribble.wav')
# --- bar zip (rising tone) 0.35 s
n,t=T(0.35); f=500+2500*(t/0.35)**1.5; x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.clip(t/0.02,0,1)*np.exp(-np.maximum(0,t-0.3)/0.02)*0.6+bp(rng.standard_normal(n),2000,7000)*0.15; wr(x,'zip.wav')
# --- warning blip (two quick square-ish beeps) 0.3 s
n,t=T(0.3); sq=np.tanh(4*np.sin(2*np.pi*988*t)); x=sq*(((t<0.09)|((t>0.14)&(t<0.23))).astype(float)); x=lpf(x,5000); wr(x*0.6,'warn.wav')
# --- marimba notif (3 notes, C major) & follow chime (G major pentatonic bells)
def mar(f,d=0.4):
    n,t=T(d); return (np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*4*f*t)*np.exp(-t/0.02))*np.exp(-t/0.12)
n=int(0.6*SR); x=np.zeros(n)
for k,f in enumerate([523.25,659.25,783.99]): i=int(k*0.07*SR); y=mar(f); x[i:i+len(y)]+=y[:n-i]
wr(x,'notif.wav')
n=int(1.2*SR); x=np.zeros(n)
for k,f in enumerate([783.99,987.77,1174.66,1567.98]):
    i=int(k*0.06*SR); m,tt=T(0.9); y=sum(np.sin(2*np.pi*f*r*tt)*np.exp(-tt/(0.5/(1+j)))/(1+j) for j,r in enumerate([1,2.76,5.4])); x[i:i+m]+=y[:n-i]
wr(stereo(x),'chime.wav')
# --- typing ticks for 6 words (soft keyboard clicks)
n,t=T(0.9); x=np.zeros(n)
for k in range(7):
    i=int(k*0.13*SR); m,tt=T(0.03); x[i:i+m]+=bp(rng.standard_normal(m),1500,5000)*np.exp(-tt/0.005)
wr(x,'type.wav')
# --- loop riser: reversed .50 tail swelling into frame 0 (0.85 s)
b=np.frombuffer(open(os.path.join(OUT,'boom.wav'),'rb').read()[44:],'<i2').reshape(-1,2)[:,0].astype(float)/32767
r=b[:int(0.85*SR)][::-1]*np.linspace(0.3,1,int(0.85*SR))**2
n,t=T(0.85); r+=np.sin(2*np.pi*np.cumsum(200+900*(t/0.85)**2)/SR)*(t/0.85)**3*0.3
wr(stereo(r),'riser.wav')
# --- tension swell before the .50 (1.0 s): low pulse + noise rising
n,t=T(1.0); x=np.sin(2*np.pi*55*t)*(0.5+0.5*np.sin(2*np.pi*6*t*(1+t)))*(t/1.0)**1.5+tvlpf(rng.standard_normal(n),300+3000*t)*(t/1.0)**2*0.5; wr(stereo(x),'swell.wav')

# --- extra variants so no file is used more than twice
for i,(d,a,b,p) in enumerate([(0.3,250,4500,0.5),(0.26,3000,600,0.45),(0.34,350,2600,0.75),(0.24,900,7000,0.5),(0.38,3500,300,0.4),(0.29,600,4200,0.6)]):
    whoosh(f'whoosh{i+7}.wav',d,a,b,p)
for i,f in enumerate([990,740,1320,560,1050]):
    n,t=T(0.18); x=np.sin(2*np.pi*f*t)*np.exp(-t/0.028)+0.45*np.sin(2*np.pi*f*2.4*t)*np.exp(-t/0.01)+hpf(rng.standard_normal(n),2500)*np.exp(-t/0.002)*0.4
    wr(x,f'pop{i+4}.wav')
for i,(fk,dk) in enumerate([(130,0.10),(170,0.14),(110,0.16)]):
    n,t=T(0.5); kick=np.sin(2*np.pi*(fk*np.exp(-t*18)+44)*t)*np.exp(-t/dk)
    clap=sum(np.roll(bp(rng.standard_normal(n),700+300*i,4200)*np.exp(-t/0.05),int(k*0.008*SR)) for k in range(3))*0.5
    wr(kick+clap,f'stamp{i+2}.wav')
n,t=T(0.3); x=bp(rng.standard_normal(n),1200,5000)*(0.6+0.4*np.sin(2*np.pi*11*t))*np.exp(-((t-0.14)/0.1)**2); wr(x,'scribble2.wav')
print('ok ->',OUT, len(os.listdir(OUT)),'arquivos')
# zip v2: shorter, brighter two-step chirp
n,t=T(0.25); f=900+3200*(t/0.25)**0.7; x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.clip(t/0.01,0,1)*np.exp(-np.maximum(0,t-0.2)/0.015)*0.5*(1+0.5*np.sign(np.sin(2*np.pi*28*t))); wr(x,'zip2.wav')
