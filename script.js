document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const sceneSvg = document.querySelector('.scene-svg');
  if (!sceneSvg) return;

  const cleanTrack = sceneSvg.getElementById('cleanTrack');
  const trail = sceneSvg.getElementById('trail');
  const hose = sceneSvg.getElementById('hose');
  const arm = sceneSvg.getElementById('arm');
  const nozzle = sceneSvg.getElementById('nozzle');
  const foam = sceneSvg.getElementById('foam');

  let progress = 0; // 0..1 across the carpet area width
  let direction = -1; // sweep left
  const trackMinX = 200;
  const trackMaxX = 1000;
  const trackWidth = trackMaxX - trackMinX; // 800

  // Apply subtle idle motion
  function idleMotion(t) {
    const offset = Math.sin(t / 700) * 2;
    arm.setAttribute('transform', `rotate(${-12 + offset} 610 427)`);
  }

  function updateSweep() {
    const x = trackMinX + progress * trackWidth;
    // Expand the cleaned highlight
    cleanTrack.setAttribute('width', String(Math.max(0, x - trackMinX)));

    // Move trail behind nozzle
    const trailWidth = 40;
    trail.setAttribute('x', String(x - trailWidth));
    trail.setAttribute('width', String(trailWidth));

    // Foam pulsing near the nozzle
    foam.setAttribute('opacity', (0.2 + 0.3 * Math.random()).toFixed(2));

    // Slight hose sway
    const hoseD = `M 770 520 C ${720 - progress * 20} 520 ${680 - progress * 10} 520 ${650 - progress * 5} 510 C ${625 - progress * 3} 502 ${616 - progress * 2} 485 610 470`;
    hose.setAttribute('d', hoseD);

    // Nozzle micro-bounce
    const bounce = Math.sin(progress * Math.PI * 2) * 1.5;
    const nozzleY = 500 + bounce;
    nozzle.setAttribute('points', `760,${nozzleY} 800,${nozzleY} 800,${nozzleY+20} 770,${nozzleY+20}`);
  }

  let last = performance.now();
  function animate(now) {
    const dt = Math.min(32, now - last);
    last = now;

    // idle arm motion
    idleMotion(now);

    // advance sweep
    progress += direction * (dt / 7000); // adjust speed
    if (progress <= 0) { progress = 0; direction = 1; }
    if (progress >= 1) { progress = 1; direction = -1; }

    updateSweep();
    requestAnimationFrame(animate);
  }

  // Kick off
  updateSweep();
  requestAnimationFrame(animate);
});
