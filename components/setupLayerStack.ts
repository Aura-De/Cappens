function ensureWrap(panel: HTMLElement) {
  const first = panel.firstElementChild;
  if (first?.classList.contains('wrap')) return;
  const inner = document.createElement('div');
  inner.className = 'wrap';
  while (panel.firstChild) inner.appendChild(panel.firstChild);
  panel.appendChild(inner);
}

function measureSceneHeight(card: HTMLElement, vh: number): number {
  const content = card.offsetHeight;
  const runway = vh * 0.9;
  return Math.max(vh + runway, content + runway * 0.35);
}

function bindLayerStackMotion(stack: HTMLElement): () => void {
  const update = () => {
    const scenes = Array.from(stack.querySelectorAll<HTMLElement>('.layer-stack__scene'));
    const vh = window.innerHeight;

    scenes.forEach((scene, i) => {
      const card = scene.querySelector<HTMLElement>('.layer-stack__card');
      if (!card) return;

      const rect = scene.getBoundingClientRect();
      const pinned = rect.top <= 1 && rect.bottom > vh * 0.35;
      card.classList.toggle('layer-stack__card--pinned', pinned);

      const next = scenes[i + 1];
      let dim = 0;
      if (next) {
        const nrect = next.getBoundingClientRect();
        dim = Math.min(1, Math.max(0, (vh - nrect.top) / vh));
      }
      card.style.setProperty('--layer-dim', dim.toFixed(4));

      if (pinned) {
        card.querySelectorAll('.reveal.pre').forEach((el) => el.classList.remove('pre'));
      }
    });
  };

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      update();
    });
  };

  const onResize = () => {
    stack.querySelectorAll<HTMLElement>('.layer-stack__scene').forEach((scene) => {
      const card = scene.querySelector<HTMLElement>('.layer-stack__card');
      if (!card) return;
      const panel = scene.querySelector<HTMLElement>('.layer-stack__card > *');
      const vh = window.innerHeight;
      let sceneH = measureSceneHeight(card, vh);
      if (panel?.id === 'servicios') sceneH = Math.max(sceneH, vh * 1.85);
      scene.style.height = `${sceneH}px`;
    });
    update();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  onResize();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (raf) cancelAnimationFrame(raf);
  };
}

/** Secciones sticky que se superponen al bajar y se deshacen al subir. */
export function setupLayerStack(reducedMotion: boolean): (() => void) | undefined {
  if (reducedMotion) return undefined;

  const main = document.getElementById('inicio');
  if (!main) return undefined;

  const existing = main.querySelector('.layer-stack');
  if (existing instanceof HTMLElement) {
    document.documentElement.classList.add('layer-stack-on');
    return bindLayerStackMotion(existing);
  }

  const wrap = main.querySelector('.wrap');
  if (!wrap) return undefined;

  const panels: HTMLElement[] = [];
  const hero = wrap.querySelector('.hero');
  if (hero instanceof HTMLElement) panels.push(hero);
  wrap.querySelectorAll(':scope > section').forEach((el) => {
    if (el instanceof HTMLElement) panels.push(el);
  });
  // No meter #contacto: lo renderiza React y mover el nodo rompe la reconciliación.
  if (panels.length < 2) return undefined;

  const stack = document.createElement('div');
  stack.className = 'layer-stack';
  main.insertBefore(stack, wrap);

  const vh = window.innerHeight;
  panels.forEach((panel, index) => {
    const scene = document.createElement('div');
    scene.className = 'layer-stack__scene';
    scene.dataset.layerIndex = String(index);

    const sticky = document.createElement('div');
    sticky.className = 'layer-stack__sticky';

    const card = document.createElement('div');
    card.className = 'layer-stack__card';
    card.style.zIndex = String(20 + index);
    if (panel.classList.contains('hero')) card.classList.add('layer-stack__card--hero');
    if (panel.id) card.classList.add(`layer-stack__card--${panel.id}`);
    if (panel.classList.contains('close')) card.classList.add('layer-stack__card--close');
    if (panel.classList.contains('contact-section')) card.classList.add('layer-stack__card--contacto');

    ensureWrap(panel);
    card.appendChild(panel);
    sticky.appendChild(card);
    scene.appendChild(sticky);
    stack.appendChild(scene);

    let sceneH = measureSceneHeight(card, vh);
    if (panel.id === 'servicios') {
      sceneH = Math.max(sceneH, vh * 1.85);
    }
    scene.style.height = `${sceneH}px`;
  });

  wrap.remove();
  document.documentElement.classList.add('layer-stack-on');

  const unbind = bindLayerStackMotion(stack);
  return () => {
    document.documentElement.classList.remove('layer-stack-on');
    unbind();
    if (!main.isConnected || !stack.isConnected) return;

    const freshWrap = document.createElement('div');
    freshWrap.className = 'wrap';
    panels.forEach((panel) => {
      if (panel.isConnected) freshWrap.appendChild(panel);
    });
    main.insertBefore(freshWrap, stack);
    stack.remove();
  };
}
