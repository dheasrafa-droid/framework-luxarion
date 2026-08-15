/**
 * @file AccessRulesPanel.tsx
 * @description Comprehensive visual reference and documentation for Code Encapsulation, Touch Permissions, Impact Analysis, and Naming Taxonomy.
 * Part of Luxarion UI Components.
 */

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Eye, EyeOff, Lock, Unlock, Tag, BookOpen } from 'lucide-react';
import { LuxarionTheme } from '../engine/Luxarion';

interface AccessRulesPanelProps {
  currentTheme: LuxarionTheme;
}

export const AccessRulesPanel: React.FC<AccessRulesPanelProps> = ({ currentTheme }) => {
  const [activeCategory, setActiveCategory] = useState<'touch' | 'encapsulation' | 'naming' | 'lifecycles'>('touch');

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-6 flex flex-col gap-6 overflow-y-auto" style={{ backgroundColor: currentTheme.background, color: currentTheme.textColor }}>
      {/* Title */}
      <div className="border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ borderColor: `${currentTheme.accent}33` }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6" style={{ color: currentTheme.accent }} />
            <h2 className="text-xl font-bold tracking-tight">Code Encapsulation, Permissions & Naming Architecture</h2>
          </div>
          <p className="text-xs opacity-75 max-w-2xl">
            Detailed breakdown of public vs private scopes, user modification boundaries, tampering consequences, and structural taxonomy in Luxarion Engine.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setActiveCategory('touch')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeCategory === 'touch' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Touch vs Forbidden
          </button>
          <button
            onClick={() => setActiveCategory('encapsulation')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeCategory === 'encapsulation' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Private `_` vs Public
          </button>
          <button
            onClick={() => setActiveCategory('naming')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeCategory === 'naming' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Naming Taxonomy
          </button>
          <button
            onClick={() => setActiveCategory('lifecycles')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeCategory === 'lifecycles' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Class Lifecycles
          </button>
        </div>
      </div>

      {/* 1. TOUCH VS FORBIDDEN & CONSEQUENCES OF TAMPERING */}
      {activeCategory === 'touch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Boleh Disentuh / Boleh Dimodifikasi */}
          <div className="p-5 rounded-xl border bg-emerald-950/10 border-emerald-500/30 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-emerald-500/20 pb-3">
              <Unlock className="w-5 h-5" />
              <span>Boleh Dilihat, Disentuh & Dimodifikasi oleh User</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-1">1. Transform Properties (position, rotation, scale)</span>
                <p className="text-slate-300 leading-relaxed">
                  User bebas mengubah <code className="font-mono text-cyan-300">mesh.position.set(x, y, z)</code> atau <code className="font-mono text-cyan-300">mesh.rotation.y = delta</code>. Engine secara otomatis menandai <code className="font-mono text-cyan-300">matrixWorldNeedsUpdate = true</code> dan merekomputasi matriks transformasi dunia pada render loop berikutnya.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-1">2. Material Uniforms & Colors</span>
                <p className="text-slate-300 leading-relaxed">
                  User dapat memodifikasi properti seperti <code className="font-mono text-cyan-300">material.color</code>, <code className="font-mono text-cyan-300">material.opacity</code>, <code className="font-mono text-cyan-300">material.wireframe</code>, atau menambahkan custom uniforms via <code className="font-mono text-cyan-300">material.setUniform()</code>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-1">3. Scenegraph Tree Composition</span>
                <p className="text-slate-300 leading-relaxed">
                  User dapat membuat relasi parent-child via <code className="font-mono text-cyan-300">parent.add(child)</code> atau <code className="font-mono text-cyan-300">parent.remove(child)</code>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-1">4. Camera Parameters & Orbit Settings</span>
                <p className="text-slate-300 leading-relaxed">
                  User dapat mengatur <code className="font-mono text-cyan-300">camera.fov</code> (lalu memanggil <code className="font-mono text-cyan-300">camera.updateProjectionMatrix()</code>), damping factor, atau min/max zoom distance pada OrbitControls.
                </p>
              </div>
            </div>
          </div>

          {/* DILARANG Disentuh & Dampak Fatal Jika Dimodifikasi */}
          <div className="p-5 rounded-xl border bg-rose-950/15 border-rose-500/30 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-rose-500/20 pb-3">
              <AlertTriangle className="w-5 h-5" />
              <span>TIDAK Boleh Disentuh / Dampak Fatal Jika Dimodifikasi</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-rose-500/20">
                <span className="font-bold text-rose-300 block mb-1">1. Mengubah Elemen `worldMatrix` Secara Manual</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Dampak Kerusakan:</strong> Desinkronisasi total hierarki graf. Matriks lokal dan kuaternion akan saling bertabrakan, menyebabkan objek teleportasi liar atau hilang (NaN matrix inversion).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-rose-500/20">
                <span className="font-bold text-rose-300 block mb-1">2. Mengubah Panjang Array Buffer `BufferAttribute.data` Tanpa Re-alokasi VBO</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Dampak Kerusakan:</strong> WebGL error <code className="font-mono text-rose-400">GL_INVALID_OPERATION</code> atau crash driver GPU akibat out-of-bounds vertex memory reading saat <code className="font-mono text-rose-400">glDrawElements</code> dieksekusi.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-rose-500/20">
                <span className="font-bold text-rose-300 block mb-1">3. Memanggil Method Private Internal (Awalan `_`)</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Dampak Kerusakan:</strong> Mengotori cache shader GPU (<code className="font-mono text-rose-400">_programCache</code>) atau merusak cache WebGL state (<code className="font-mono text-rose-400">GLState</code>), mengakibatkan flickering shader hitam atau kebocoran memori VRAM.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-rose-500/20">
                <span className="font-bold text-rose-300 block mb-1">4. Menghapus Instansiasi WebGLContext / VBO Tanpa `dispose()`</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Dampak Kerusakan:</strong> VRAM Leak. Browser tab akan membeku (crash OOM) setelah beberapa kali inisialisasi scene.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRIVATE METHOD `_` VS PUBLIC & ENCAPSULATION */}
      {activeCategory === 'encapsulation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="p-5 rounded-xl border bg-black/30 border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base border-b border-white/10 pb-3">
              <Lock className="w-5 h-5" />
              <span>Bagaimana Method Private `_` Bekerja</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Konvensi prefix underscore (<code className="font-mono text-cyan-300">_methodName()</code>) menandakan bahwa fungsi tersebut merupakan <strong>internal engine kernel</strong>.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside bg-black/20 p-3 rounded-lg">
              <li><strong>Tujuan:</strong> Mengisolasi low-level GPU calls, WebGL texture binding, program linking, dan location caching agar pengguna luar tidak perlu memahami kompleksitas register hardware.</li>
              <li><strong>Mekanisme:</strong> Dipanggil secara otomatis oleh Orchestrator (<code className="font-mono text-cyan-300">WebGLRenderer</code>) saat frame render dieksekusi.</li>
              <li><strong>Proteksi:</strong> User luar tidak boleh dan tidak perlu memanggil method ini secara eksplisit.</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border bg-black/30 border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-white/10 pb-3">
              <Eye className="w-5 h-5" />
              <span>Bagaimana Method Public Bekerja</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Method Public adalah <strong>API Contract resmi</strong> yang diekspor melalui entry point <code className="font-mono text-cyan-300">Luxarion.ts</code>.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside bg-black/20 p-3 rounded-lg">
              <li><strong>Tujuan:</strong> Memberikan kontrol deklaratif, intuitif, dan aman untuk membangun geometri 3D, animasi 2D, sistem partikel, dan pencahayaan.</li>
              <li><strong>Contoh:</strong> <code className="font-mono text-emerald-300">renderer.render(scene, camera)</code>, <code className="font-mono text-emerald-300">geom.computeVertexNormals()</code>, <code className="font-mono text-emerald-300">controls.update()</code>.</li>
              <li><strong>Stabilitas:</strong> Menjamin tipe data TypeScript yang ketat tanpa risiko merusak internal WebGL pipeline.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. NAMING TAXONOMY RULES */}
      {activeCategory === 'naming' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* PascalCase */}
          <div className="p-4 rounded-xl border bg-slate-900/60 border-cyan-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                PascalCase
              </span>
              <h4 className="font-bold text-sm text-white mt-2 mb-2">Class, Interface, Enums & Types</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Digunakan secara eksklusif untuk Blueprint cetak biru class, objek instantiated, atau tipe kontrak.
              </p>
            </div>
            <div className="bg-black/50 p-2 rounded text-[11px] font-mono text-cyan-300 border border-white/5 space-y-0.5">
              <div>• WebGLRenderer</div>
              <div>• BufferGeometry</div>
              <div>• PerspectiveCamera</div>
              <div>• HologramMaterial</div>
            </div>
          </div>

          {/* camelCase */}
          <div className="p-4 rounded-xl border bg-slate-900/60 border-emerald-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                camelCase
              </span>
              <h4 className="font-bold text-sm text-white mt-2 mb-2">Methods, Properties & Instances</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Digunakan untuk instance variabel, properti objek, parameter method, dan fungsi pemanggil.
              </p>
            </div>
            <div className="bg-black/50 p-2 rounded text-[11px] font-mono text-emerald-300 border border-white/5 space-y-0.5">
              <div>• updateWorldMatrix()</div>
              <div>• computeVertexNormals()</div>
              <div>• isMesh, transparent</div>
              <div>• setSize(width, height)</div>
            </div>
          </div>

          {/* UPPER_CASE */}
          <div className="p-4 rounded-xl border bg-slate-900/60 border-amber-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                UPPER_CASE
              </span>
              <h4 className="font-bold text-sm text-white mt-2 mb-2">Constants, Shaders & Bitmasks</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Digunakan untuk konstanta statis immutable, sumber teks GLSL shader, dan nilai matematis tetap.
              </p>
            </div>
            <div className="bg-black/50 p-2 rounded text-[11px] font-mono text-amber-300 border border-white/5 space-y-0.5">
              <div>• DEG2RAD, TWO_PI</div>
              <div>• BASIC_VERTEX</div>
              <div>• PHONG_FRAGMENT</div>
              <div>• LUXARION_VERSION</div>
            </div>
          </div>

          {/* lowercase / kebab-case */}
          <div className="p-4 rounded-xl border bg-slate-900/60 border-purple-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">
                lowercase / kebab-case
              </span>
              <h4 className="font-bold text-sm text-white mt-2 mb-2">Folders, Identifiers & Attributes</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Digunakan untuk nama direktori, identifier tema, dan nama atribut GLSL WebGL binding.
              </p>
            </div>
            <div className="bg-black/50 p-2 rounded text-[11px] font-mono text-purple-300 border border-white/5 space-y-0.5">
              <div>• src/engine/math/</div>
              <div>• examples/</div>
              <div>• theme: 'obsidian'</div>
              <div>• attrib: 'position'</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLASS LIFECYCLES & HIERARCHY */}
      {activeCategory === 'lifecycles' && (
        <div className="p-5 rounded-xl border bg-black/30 border-white/10 flex flex-col gap-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Siklus Hidup (Lifecycle) & Struktur Hierarki Objek Luxarion</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
              <span className="font-bold text-cyan-300 block mb-1">1. Instantiation Phase</span>
              <p className="text-slate-300 leading-relaxed">
                Objek diinisiasi (e.g. <code className="font-mono text-cyan-300">new Object3D(geometry, material)</code>). Geometry menghitung vertex indices dan attribute offsets. Transform menginisiasi koordinat lokal.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
              <span className="font-bold text-purple-300 block mb-1">2. Render & Update Loop</span>
              <p className="text-slate-300 leading-relaxed">
                Orchestrator <code className="font-mono text-purple-300">WebGLRenderer</code> memanggil <code className="font-mono text-purple-300">scene.updateWorldMatrix()</code>, memperbarui view-projection camera, menginjeksi uniform lampu, lalu mengeksekusi draw call.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
              <span className="font-bold text-rose-300 block mb-1">3. Disposal & GPU GC Phase</span>
              <p className="text-slate-300 leading-relaxed">
                Saat objek dihapus, memanggil <code className="font-mono text-rose-300">object.dispose(gl)</code> secara eksplisit melepaskan GPU VBO Buffer, Framebuffer, dan Program dari memori VRAM browser.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
