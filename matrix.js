const canvas = document.getElementById("matrix-bg");

if (canvas) {
  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phrases = [
    "BUILD::PUBLISH::DEPLOY",
    "CREATE::SOLVE::SHIP",
    "VALIDATE::PACKAGE::RELEASE",
    "AWS::DOCKER::LINUX",
    "GIT::PUSH::MAIN",
    "CODE::TEST::RELEASE",
    "AUTOMATE::OPERATE::IMPROVE",
    "0101::{CODE}::<>"
  ];
  const columnWidth = 32;
  const lineHeight = 18;
  const frameInterval = 1000 / 30;
  let streams = [];
  let frameId;
  let lastFrame = 0;

  function createStream(column, scatter = true) {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const length = 8 + Math.floor(Math.random() * 10);
    return {
      x: column * columnWidth + Math.random() * 5,
      y: scatter
        ? Math.random() * (window.innerHeight + length * lineHeight)
        : -length * lineHeight - Math.random() * window.innerHeight * 0.65,
      speed: 17 + Math.random() * 27,
      length,
      phrase,
      offset: Math.floor(Math.random() * phrase.length),
      opacity: 0.46 + Math.random() * 0.42,
      pink: Math.random() < 0.16
    };
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const columns = Math.ceil(window.innerWidth / columnWidth);
    streams = Array.from({ length: columns }, (_, column) =>
      Math.random() < 0.74 ? createStream(column) : null
    ).filter(Boolean);
  }

  function drawStream(stream, elapsed) {
    stream.y += stream.speed * elapsed;
    const headStep = Math.floor(stream.y / lineHeight) + stream.offset;
    const [red, green, blue] = stream.pink ? [255, 102, 204] : [0, 232, 242];

    for (let trail = stream.length - 1; trail >= 0; trail -= 1) {
      const y = stream.y - trail * lineHeight;
      if (y < -lineHeight || y > window.innerHeight + lineHeight) continue;

      const strength = 1 - trail / stream.length;
      const alpha = Math.pow(strength, 1.65) * stream.opacity;
      const characterIndex =
        (headStep - trail + stream.phrase.length * 2) % stream.phrase.length;
      const character = stream.phrase[characterIndex];

      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      context.shadowBlur = trail === 0 ? 11 : 0;
      context.shadowColor = `rgba(${red}, ${green}, ${blue}, 0.8)`;
      context.fillText(character, stream.x, y);
    }

    if (stream.y - stream.length * lineHeight > window.innerHeight) {
      Object.assign(stream, createStream(Math.round(stream.x / columnWidth), false));
    }
  }

  function render(timestamp = 0) {
    const elapsed = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.08) : 0;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.font = '600 12px "Cascadia Code", Consolas, monospace';
    context.textBaseline = "middle";
    streams.forEach((stream) => drawStream(stream, reduceMotion ? 0 : elapsed));
    context.shadowBlur = 0;
    lastFrame = timestamp;
  }

  function animate(timestamp) {
    if (timestamp - lastFrame >= frameInterval) render(timestamp);
    frameId = window.requestAnimationFrame(animate);
  }

  resizeCanvas();
  render();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  if (!reduceMotion) {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameId);
      } else {
        lastFrame = performance.now();
        frameId = window.requestAnimationFrame(animate);
      }
    });
    frameId = window.requestAnimationFrame(animate);
  }
}
