export const dustVertexShader = `
  uniform float uTime;
  uniform float uActivity;
  uniform float uChaos;
  uniform float uFlow;
  uniform float uPointSize;
  uniform float uExplodeIntensity;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform float uMouseDown;
  attribute float aRandom;
  attribute vec3 aNormal;
  varying float vRandom;
  varying float vFacing;
  varying float vDisplacement;
  varying float vEdgeFade;

  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vRandom = aRandom;
    float phase = aRandom * 6.283;
    float drivenTime = uTime * uFlow;
    vec3 pos = position;
    vec3 normal = normalize(aNormal);
    vFacing = dot(normalize(normalMatrix * normal), vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
    vDisplacement = 0.0;

    float noise1 = snoise(pos * uChaos + drivenTime * 0.5);
    float noise2 = snoise(pos * (uChaos * 2.0) - drivenTime * 0.3);
    float combinedNoise = (noise1 + noise2 * 0.5);
    vDisplacement = pow(max(0.0, combinedNoise), 1.5) * uActivity;
    float valley = min(0.0, combinedNoise) * uActivity * 0.5;
    pos += normal * (vDisplacement + valley);

    float flowTime = drivenTime * 3.5;
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 tangent1 = cross(normal, up);
    if (length(tangent1) < 0.001) tangent1 = cross(normal, vec3(1.0, 0.0, 0.0));
    tangent1 = normalize(tangent1);
    vec3 tangent2 = normalize(cross(normal, tangent1));
    float flow1 = sin(flowTime + phase * 2.0 + pos.y * 3.0) * 0.5 + 0.5;
    float flow2 = sin(flowTime * 2.3 + phase * 4.0 + pos.x * 5.0) * 0.5 + 0.5;
    float flow3 = cos(flowTime * 1.7 + phase * 3.0 + pos.z * 4.0) * 0.5 + 0.5;
    float flowMagnitude = (flow1 * 0.5 + flow2 * 0.3 + flow3 * 0.2) * 0.08;
    float angle = flowTime * 0.5 + phase * 6.283;
    vec3 flowDir = tangent1 * cos(angle) + tangent2 * sin(angle);
    vec3 flowOffset = flowDir * flowMagnitude * 0.6;
    float settle = sin(flowTime * 0.8 + phase * 5.0) * 0.6 * 0.15 * 0.08;
    flowOffset += normal * settle;
    pos += flowOffset;

    float slowTime = drivenTime * 0.5;
    float wavePulse = smoothstep(0.9, 1.0, sin(slowTime));
    float activityLevel = 0.1 + wavePulse * 0.9;
    vec3 currentBobAmount = vec3(0.005, 0.005, 0.005) * activityLevel * 0.5;
    pos.x += sin(drivenTime * 4.0 + phase) * currentBobAmount.x;
    pos.y += sin(drivenTime * 4.0 * 0.8 + phase + 2.094) * currentBobAmount.y;
    pos.z += sin(drivenTime * 4.0 * 1.2 + phase + 4.189) * currentBobAmount.z;

    vec4 previewPosition = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vec2 ndc = previewPosition.xy / previewPosition.w;
    vec2 mouseDelta = ndc - uMouse;
    float mouseDistance = length(mouseDelta);
    float hover = smoothstep(0.42, 0.0, mouseDistance) * uMouseActive;
    vec2 mouseDir = normalize(mouseDelta + vec2(0.0001));
    pos.xy += mouseDir * hover * (0.16 + aRandom * 0.12);
    pos += normal * hover * (0.08 + uMouseDown * 0.5) * (0.3 + aRandom);

    if (uExplodeIntensity > 0.0 || uMouseDown > 0.0) {
      float explodeDir = (aRandom - 0.5) * 2.0;
      float boom = max(uExplodeIntensity, hover * uMouseDown);
      pos.z += boom * (0.5 + aRandom * 0.5) * explodeDir * 0.5;
      pos.xy += vec2(aRandom - 0.5, aRandom - 0.5) * boom * 0.3;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vec2 screen = gl_Position.xy / gl_Position.w;
    vEdgeFade = smoothstep(1.28, 0.72, max(abs(screen.x), abs(screen.y)));
    float sizeBoost = 0.8 + 0.4 * vFacing + vDisplacement * 2.0 + aRandom * 0.3 + hover * 0.45;
    gl_PointSize = uPointSize * sizeBoost * (1.0 / -mvPosition.z);
  }
`;

export const dustFragmentShader = `
  uniform vec3 uColor;
  uniform float uRGBSplit;
  uniform float uTime;
  uniform float uGlowIntensity;
  uniform vec2 uResolution;
  uniform float uCRTfrequency;
  uniform float uCRTvertical;
  uniform float uCRTspeed;
  uniform float uCRTspeed2;
  uniform float uCRTintensity;
  uniform vec3 uCRTcolor;

  varying float vRandom;
  varying float vFacing;
  varying float vDisplacement;
  varying float vEdgeFade;

  float dither(vec2 position) {
    return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float angle = uTime * 0.5 + vRandom * 3.14;
    vec2 splitDir = vec2(cos(angle), sin(angle));
    vec2 redCenter = center + splitDir * uRGBSplit;
    vec2 greenCenter = center;
    vec2 blueCenter = center - splitDir * uRGBSplit;
    float redDist = length(redCenter);
    float greenDist = length(greenCenter);
    float blueDist = length(blueCenter);
    float redAlpha = smoothstep(0.5, 0.15, redDist);
    float greenAlpha = smoothstep(0.5, 0.15, greenDist);
    float blueAlpha = smoothstep(0.5, 0.15, blueDist);
    float redGlow = exp(-redDist * 6.0) * 0.5;
    float greenGlow = exp(-greenDist * 6.0) * 0.5;
    float blueGlow = exp(-blueDist * 6.0) * 0.5;
    vec3 goldLift = vec3(1.0, 0.78, 0.35) * (0.12 + vDisplacement * 0.32);
    float r = (redAlpha + redGlow * 0.6) * uColor.r + redGlow * 0.15 + goldLift.r;
    float g = (greenAlpha + greenGlow * 0.6) * uColor.g + greenGlow * 0.15 + goldLift.g;
    float b = (blueAlpha + blueGlow * 0.6) * uColor.b + blueGlow * 0.15 + goldLift.b;
    float maxAlpha = max(max(redAlpha, greenAlpha), blueAlpha);
    float maxGlow = max(max(redGlow, greenGlow), blueGlow);
    if (maxAlpha < 0.01 && maxGlow < 0.01) discard;
    vec3 finalColor = vec3(r, g, b) * (0.62 + vFacing * 0.48);
    float edgeNoise = dither(gl_FragCoord.xy + vRandom * 31.0);
    float finalAlpha = max(maxAlpha, maxGlow * 0.8) * uGlowIntensity * vEdgeFade;
    finalAlpha *= smoothstep(0.02, 0.2, vEdgeFade + edgeNoise * 0.05);

    vec2 st = gl_FragCoord.xy / uResolution;
    float wave1 = sin(st.x * uCRTfrequency + uTime * uCRTspeed) * 0.5 + 0.5;
    float wave2 = sin(st.y * uCRTvertical + uTime * uCRTspeed2) * 0.5 + 0.5;
    float scanline = sin(st.y * uResolution.y * 1.45) * 0.5 + 0.5;
    float crtInterference = (wave1 + wave2) * 0.5 * (0.75 + scanline * 0.25);
    vec3 crtColor = uCRTcolor * crtInterference;
    finalColor = mix(finalColor, crtColor, crtInterference * uCRTintensity);
    finalColor += crtColor * crtInterference * uCRTintensity * 0.3;
    finalColor += (edgeNoise - 0.5) * 0.018;

    gl_FragColor = vec4(finalColor, min(finalAlpha, 1.0));
  }
`;
