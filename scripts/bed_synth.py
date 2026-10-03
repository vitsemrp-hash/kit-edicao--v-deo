#!/usr/bin/env python3
"""Trilha de fundo ORIGINAL por síntese (CC0): groove leve de marimba + shaker + kick suave.
Uso: python scripts/bed_synth.py saida.wav --dur 47.5 [--bpm 100] [--seed 3006]
Troque bpm/seed por vídeo para não repetir a mesma trilha.
"""
import numpy as np, wave, argparse
ap=argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--dur',type=float,default=30); ap.add_argument('--bpm',type=float,default=100); ap.add_argument('--seed',type=int,default=3006); A=ap.parse_args()
SR=48000; T=A.dur+0.1; N=int(T*SR); t=np.arange(N)/SR; rng=np.random.default_rng(A.seed)
def wr(x,p):
    w=wave.open(p,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes()); w.close()
def lpf(x,f0):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); return np.fft.irfft(X/np.sqrt(1+(f/f0)**4),len(x))
def hpf(x,f0):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); return np.fft.irfft(X/np.sqrt(1+(f0/np.maximum(f,1e-3))**4),len(x))
BPM=A.bpm; b=60/BPM; s16=b/4
def mar(f,d=0.35):
    k=np.arange(int(d*SR))/SR; return (np.sin(2*np.pi*f*k)+0.25*np.sin(2*np.pi*3.9*f*k)*np.exp(-k/0.015))*np.exp(-k/0.11)
def kick():
    k=np.arange(int(0.3*SR))/SR; return np.sin(2*np.pi*(110*np.exp(-k*25)+45)*k)*np.exp(-k/0.09)
NT={'A2':110,'C3':130.81,'D3':146.83,'E3':164.81,'G3':196.0,'A3':220.0,'C4':261.63,'E4':329.63}
riff=['A2','-','E3','A3','-','C4','A3','E3', 'G3','-','D3','G3','-','A3','G3','D3', 'F','-','C3','F','-','A3','F','C3', 'E3','-','E3','G3','-','E4','C4','A3']
NT['F']=174.61
cache={k:mar(v) for k,v in NT.items()}; K=kick()
osti=np.zeros(N+SR); perc=np.zeros(N+SR); sh=np.zeros(N+SR)
n16=int(T/s16)
for i in range(n16):
    i0=int(i*s16*SR); nt=riff[i%32]
    if nt!='-' and i*s16>0.0: osti[i0:i0+len(cache[nt])]+=cache[nt]*(1.0 if i%2==0 else 0.7)
    if i%8==0: perc[i0:i0+len(K)]+=K*(1.0 if i%16==0 else 0.75)
    m=int(0.04*SR); sh[i0:i0+m]+=hpf(rng.standard_normal(m),5000)*np.exp(-np.arange(m)/SR/0.012)*(0.9 if i%4==2 else 0.45)
osti,perc,sh=osti[:N],perc[:N],sh[:N]
pad=sum(np.sin(2*np.pi*f*t+ph)*(0.5+0.5*np.sin(2*np.pi*t/9+ph)) for f,ph in [(220,0),(261.63,1.3),(329.63,2.1)])
pad=lpf(pad,900)
envm=np.clip(t/0.04,0,1)*np.clip((T-t)/0.1,0,1)
d=int(b*0.75*SR); od=osti.copy(); od[d:]+=0.28*osti[:-d]
L=(0.22*od+0.32*perc+0.05*sh+0.035*pad)*envm; R=(0.22*np.roll(od,int(0.009*SR))+0.30*perc+0.05*np.roll(sh,240)+0.035*pad)*envm
bed=np.stack([L,R],1); bed/=np.abs(bed).max(); wr(bed*0.7,A.out); print('ok ->',A.out)
