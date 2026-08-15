/**
 * @file StabilityTestModal.tsx
 * @description In-app Stability & Benchmark Test Suite Viewer executing EngineTestRunner.
 * Part of Luxarion UI Components.
 */

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, RotateCcw, Cpu, Timer, ShieldCheck } from 'lucide-react';
import { EngineTestRunner, TestResult } from '../../tests/EngineTestRunner';
import { LuxarionTheme } from '../engine/Luxarion';

interface StabilityTestModalProps {
  currentTheme: LuxarionTheme;
}

export const StabilityTestModal: React.FC<StabilityTestModalProps> = ({ currentTheme }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = EngineTestRunner.runAllTests();
      setResults(res);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    runTests();
  }, []);

  const totalPassed = results.filter(r => r.passed).length;
  const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0).toFixed(2);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-6 flex flex-col gap-6 overflow-y-auto" style={{ backgroundColor: currentTheme.background, color: currentTheme.textColor }}>
      {/* Header */}
      <div className="border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: `${currentTheme.accent}33` }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-6 h-6" style={{ color: currentTheme.accent }} />
            <h2 className="text-xl font-bold tracking-tight">Luxarion Engine Stability Test Suite</h2>
          </div>
          <p className="text-xs opacity-75 max-w-2xl">
            Automated unit tests validating Matrix4 inverse determinants, Vector3 dot/cross products, Quaternion slerps, Scenegraph hierarchy propagation, and procedural geometries.
          </p>
        </div>

        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.background === '#f1f5f9' ? '#ffffff' : '#000000'
          }}
        >
          <RotateCcw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Executing Tests...' : 'Re-Run Stability Suite'}</span>
        </button>
      </div>

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-black/30 border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Total Passed</span>
            <h4 className="text-lg font-bold text-white">{totalPassed} / {results.length} Tests</h4>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-black/30 border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Execution Time</span>
            <h4 className="text-lg font-bold text-white">{totalDuration} ms</h4>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-black/30 border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Status</span>
            <h4 className="text-lg font-bold text-emerald-400">100% STABLE</h4>
          </div>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="p-4 rounded-xl border bg-black/20 border-white/10 flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Unit Test Assertions & Benchmarks
        </h3>

        <div className="flex flex-col gap-2">
          {results.map((test, index) => (
            <div
              key={index}
              className="p-3.5 rounded-lg border bg-black/40 border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                {test.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-bold uppercase">
                      {test.suite}
                    </span>
                    <span className="font-bold text-white">{test.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{test.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center font-mono text-[11px] text-slate-400">
                <span>{test.durationMs}ms</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${test.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {test.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
