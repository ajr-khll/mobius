
export function chooseCamera(defs, GRID_VALUES, prevAzimuth = 0) {
  const step = Math.max(1, Math.floor(GRID_VALUES.length / 15));
  const xs = GRID_VALUES.filter((_, i) => i % step === 0);
  const ys = GRID_VALUES.filter((_, j) => j % step === 0);
  if (xs.length < 3 || ys.length < 3) return { camera: {eye:{x:1.6,y:1.6,z:1.1}}, azimuth: prevAzimuth };

  const dx = xs[1] - xs[0], dy = ys[1] - ys[0];
  const grads = [];
  for (let j = 1; j < ys.length - 1; j++) for (let i = 1; i < xs.length - 1; i++) {
    const x = xs[i], y = ys[j];
    let fxSum=0, fySum=0, c=0;
    for (const d of defs) {
      const zm = d.evaluator(x-dx, y), zp = d.evaluator(x+dx, y);
      const zn = d.evaluator(x, y-dy), zp2 = d.evaluator(x, y+dy);
      if ([zm,zp,zn,zp2].every(Number.isFinite)) {
        fxSum += (zp - zm)/(2*dx);
        fySum += (zp2 - zn)/(2*dy);
        c++;
      }
    }
    if (c) grads.push([fxSum/c, fySum/c]);
  }
  if (!grads.length) return { camera: {eye:{x:1.6,y:1.6,z:1.1}}, azimuth: prevAzimuth };

  // dominant gradient direction (double-angle average)
  let C=0,S=0;
  for (const [fx,fy] of grads) {
    const th2 = 2*Math.atan2(fy, fx);
    C += Math.cos(th2); S += Math.sin(th2);
  }
  const thetaDom = 0.5*Math.atan2(S, C);

  // candidate azimuths, avoid looking along thetaDom or +/- 90°
  const avoid = [thetaDom, thetaDom+Math.PI/2, thetaDom+Math.PI, thetaDom+3*Math.PI/2];
  const wrap = a => ((a%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  const close = (a,b,eps=15*Math.PI/180)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))<eps;

  const GOLD = Math.PI*(3-Math.sqrt(5));
  const elev = 28*Math.PI/180, R = 1.8;
  const cands = [];
  for (let k=0;k<16;k++){
    const phi = wrap(prevAzimuth + k*GOLD);
    if (!avoid.some(t=>close(phi, wrap(t)))) cands.push(phi);
  }
  const phi = cands[0] ?? wrap(prevAzimuth+GOLD);

  const camera = {
    eye: {
      x: R*Math.cos(phi)*Math.cos(elev),
      y: R*Math.sin(phi)*Math.cos(elev),
      z: R*Math.sin(elev)
    }
  };
  return { camera, azimuth: phi };
}

export function animateCamera(gd, camera, duration=700) {
  if (!gd) return;
  window.Plotly.animate(
    gd,
    { layout: { scene: { camera } } },
    { transition: { duration, easing: "cubic-in-out" }, frame: { duration, redraw: false } }
  );
}

export { chooseCamera, animateCamera };