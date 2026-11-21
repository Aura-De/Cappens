// Geometría del delfín origami: cada pieza es una CARA REAL del logo, calcada sobre
// logo-cappens-nav-clean.png (804x304) con una cuadrícula. Al animar, cada cara se despliega
// sobre la arista que comparte con su vecina ya colocada, empezando por el centro del cuerpo.

export type Piece = {
  poly: string; // clip-path polygon() en %
  ox: number; // origen de la bisagra (%)
  oy: number;
  ax: number; // eje de giro (vector de la arista, en px de la imagen)
  ay: number;
  order: number; // 0..1 orden de despliegue
  shade: number; // -1..1
};

type Pt = [number, number];

// Vértices (px en la imagen completa 804x304)
const V: Record<string, Pt> = {
  A: [109, 38], B: [128, 26], C: [136, 51], D: [189, 36], E: [144, 65],
  F: [193, 36], G: [274, 22], H: [276, 62], I: [323, 45], J: [337, 72],
  K: [361, 80], Kt: [364, 90], L: [316, 83], M: [283, 99], N: [353, 97],
  O: [185, 92], P: [219, 106], U: [249, 115], Z: [274, 107], Zf: [250, 151],
  T: [230, 140], S: [209, 159], Q: [91, 145], R: [149, 167], Bl: [214, 128],
  Vt: [90, 149], W: [115, 158], X: [102, 252],
  tl1: [93, 222], tl2: [67, 250], tl3: [56, 284],
  tr1: [120, 224], tr2: [142, 240], tr3: [151, 268], tr4: [106, 256],
};

// Caras (polígonos por nombre de vértice)
const FACES: string[][] = [
  ['E', 'O', 'Q'], // centro del cuerpo (empieza aquí)
  ['Q', 'O', 'R'],
  ['O', 'Bl', 'R'],
  ['O', 'P', 'Bl'],
  ['D', 'O', 'E'],
  ['B', 'D', 'E', 'C'],
  ['A', 'B', 'C'],
  ['A', 'C', 'E'],
  ['F', 'H', 'O'],
  ['F', 'G', 'H'],
  ['O', 'H', 'U', 'P'],
  ['H', 'M', 'Z', 'U'],
  ['P', 'U', 'T'],
  ['P', 'T', 'S'],
  ['U', 'Z', 'Zf'],
  ['G', 'I', 'H'],
  ['H', 'I', 'L'],
  ['H', 'L', 'M'],
  ['I', 'J', 'L'],
  ['L', 'N', 'M'],
  ['L', 'J', 'K', 'Kt', 'N'],
  ['Q', 'R', 'W', 'Vt'],
  ['Vt', 'W', 'X', 'tl1'],
  ['W', 'R', 'tr1', 'X'],
  ['tl1', 'X', 'tl2'],
  ['tl2', 'X', 'tl3'],
  ['tr1', 'tr2', 'tr4'],
  ['tr2', 'tr3', 'tr4'],
  ['tr4', 'X', 'tr1'],
];

const centroid = (ps: Pt[]): Pt => [
  ps.reduce((s, p) => s + p[0], 0) / ps.length,
  ps.reduce((s, p) => s + p[1], 0) / ps.length,
];
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

type Frame = { x: number; y: number; w: number; h: number };

function build(frame: Frame): Piece[] {
  const faces = FACES.map((names) => {
    const pts = names.map((n) => V[n]);
    return { names, pts, c: centroid(pts) };
  });
  // Orden: árbol de despliegue desde la primera cara; cada cara cuelga de la vecina
  // (comparte vértices) más cercana que ya esté colocada.
  const placed: number[] = [0];
  const parent: number[] = faces.map(() => -1);
  const depth: number[] = faces.map(() => 0);
  while (placed.length < faces.length) {
    let best = -1;
    let bestP = -1;
    let bestScore = Infinity;
    faces.forEach((f, i) => {
      if (placed.includes(i)) return;
      for (const j of placed) {
        const shared = f.names.filter((n) => faces[j].names.includes(n)).length;
        const score = dist(f.c, faces[j].c) - shared * 40;
        if (score < bestScore) {
          bestScore = score;
          best = i;
          bestP = j;
        }
      }
    });
    placed.push(best);
    parent[best] = bestP;
    depth[best] = depth[bestP] + 1;
  }
  // Orden temporal: onda que sale del centro del cuerpo (distancia), suavizada por la profundidad del árbol
  const root = faces[0].c;
  const dists = faces.map((f) => dist(f.c, root));
  const maxDist = Math.max(...dists);
  const maxDepth = Math.max(...depth);
  const order = faces.map((_, i) => 0.7 * (dists[i] / maxDist) + 0.3 * (maxDepth ? depth[i] / maxDepth : 0));

  return faces.map((f, i) => {
    // Bisagra: arista compartida con el padre, o la más cercana a su centro
    let a = f.pts[0];
    let b = f.pts[1];
    if (parent[i] >= 0) {
      const pc = faces[parent[i]].c;
      let bestD = Infinity;
      for (let e = 0; e < f.pts.length; e++) {
        const p1 = f.pts[e];
        const p2 = f.pts[(e + 1) % f.pts.length];
        const both = [f.names[e], f.names[(e + 1) % f.pts.length]].every((n) => faces[parent[i]].names.includes(n));
        const d = dist([(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2], pc) - (both ? 1000 : 0);
        if (d < bestD) {
          bestD = d;
          a = p1;
          b = p2;
        }
      }
    } else {
      a = f.pts[0];
      b = f.pts[1];
    }
    // Expansión de 2.2px desde el centroide para tapar las líneas de pliegue (sin costuras)
    const grow = (p: Pt): Pt => {
      const dx = p[0] - f.c[0];
      const dy = p[1] - f.c[1];
      const len = Math.hypot(dx, dy) || 1;
      return [p[0] + (dx / len) * 2.2, p[1] + (dy / len) * 2.2];
    };
    const toPct = (p: Pt): Pt => [((p[0] - frame.x) / frame.w) * 100, ((p[1] - frame.y) / frame.h) * 100];
    const poly = f.pts
      .map(grow)
      .map(toPct)
      .map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`)
      .join(', ');
    const [ox, oy] = toPct([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
    return {
      poly: `polygon(${poly})`,
      ox,
      oy,
      ax: b[0] - a[0],
      ay: b[1] - a[1],
      order: order[i],
      shade: Math.sin(f.c[0] * 0.17 + f.c[1] * 0.11),
    };
  });
}

/** Piezas para el delfín solo (logo-cappens-origami-mark.png = recorte 48,14 → 372,292 del logo completo). */
export const markPieces = build({ x: 48, y: 14, w: 324, h: 278 });

/** Piezas para el logotipo completo (logo-cappens-nav-clean.png, 804x304). */
export const fullPieces = build({ x: 0, y: 0, w: 804, h: 304 });

/** Región del texto "cappens" en el logotipo completo. */
export const fullTextClip = 'polygon(36% 40%, 100% 40%, 100% 100%, 36% 100%)';
