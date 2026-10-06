import { useEffect, useRef } from 'react'

// The earth as NASA photographed it: Blue Marble for the day side, Black
// Marble for the lights at night, and a map of the clouds. The moon is from
// its Lunar Reconnaissance Orbiter.
import earthClouds from '../images/earth-clouds.jpg'
import earthDay from '../images/earth-day.jpg'
import earthNight from '../images/earth-night.jpg'
import moonSurface from '../images/moon.jpg'

interface StarfieldProps {
  className?: string
}

const STARS = 2600

// Seconds for a star to travel from the far end of the field to the camera.
// Slow enough to read as a drifting camera rather than as flight.
const FLIGHT = 260

// The spot on the earth that faces the camera, in degrees north and east,
// and the seconds the earth takes to fade in once its maps have loaded.
const FACING = { latitude: 40, longitude: 14 }
const DAWN = 2

// Turns a direction as the camera sees it into a direction on the earth,
// so that FACING ends up in the middle of what is in view and the earth
// turns towards the camera and to the right. Laid out column by column, the way WebGL takes a matrix.
function globe() {
  const latitude = (FACING.latitude * Math.PI) / 180
  const longitude = (FACING.longitude * Math.PI) / 180
  const [sinLat, cosLat] = [Math.sin(latitude), Math.cos(latitude)]
  const [sinLon, cosLon] = [Math.sin(longitude), Math.cos(longitude)]

  // Up, east and north at that spot, first as the camera sees them. The
  // earth sits low on the screen, so the middle of it leans back. East is
  // the way the ground moves as the earth turns: to the right and towards
  // the camera, as far as that goes along the ground.
  const length = Math.hypot(-0.1, 0.72, 0.69)
  const up = [-0.1 / length, 0.72 / length, 0.69 / length]
  const aim = [1, -0.6, 0.6]
  const off = aim[0] * up[0] + aim[1] * up[1] + aim[2] * up[2]
  const flat = aim.map((part, axis) => part - off * up[axis])
  const reach = Math.hypot(flat[0], flat[1], flat[2])
  const east = flat.map((part) => part / reach)
  const north = [
    up[1] * east[2] - up[2] * east[1],
    up[2] * east[0] - up[0] * east[2],
    up[0] * east[1] - up[1] * east[0],
  ]

  // And the same three on the earth itself.
  const earthUp = [cosLat * sinLon, sinLat, cosLat * cosLon]
  const earthNorth = [-sinLat * sinLon, cosLat, -sinLat * cosLon]
  const earthEast = [cosLon, 0, -sinLon]

  const matrix = new Float32Array(9)

  for (let column = 0; column < 3; column++) {
    for (let row = 0; row < 3; row++) {
      matrix[column * 3 + row] =
        earthEast[row] * east[column] +
        earthNorth[row] * north[column] +
        earthUp[row] * up[column]
    }
  }

  return matrix
}

// Light given off by the sky as a colour to lay over the black behind it:
// the brighter it is, the more it covers.
const exposure = `
  vec4 expose(vec3 light) {
    float alpha = clamp(max(light.r, max(light.g, light.b)), 0.0, 1.0);

    return vec4(light / max(alpha, 0.001) * alpha, alpha);
  }
`

// The far sky, painted per pixel: the band of our own galaxy seen from the
// inside, with dark lanes of dust and a haze of faint stars along it, now
// and then a shooting star, and in front of that the earth and the moon.
const sky = `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uPixelRatio;
  uniform float uSeconds;

  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uClouds;
  uniform sampler2D uMoon;
  uniform mat3 uGlobe;
  uniform float uDawn;

  ${exposure}

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 blend = fract(point);

    blend = blend * blend * (3.0 - 2.0 * blend);

    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
      blend.y
    );
  }

  float clouds(vec2 point) {
    float value = 0.0;
    float weight = 0.5;

    for (int octave = 0; octave < 5; octave++) {
      value += weight * noise(point);
      point = point * 2.03 + vec2(17.3, 9.1);
      weight *= 0.5;
    }

    return value;
  }

  // A shooting star: a small streak that crosses a bit of the sky in about
  // half a second and burns out. Each of the few there are comes back after a wait
  // of its own, from another place and in another direction every time.
  float meteor(vec2 point, vec2 edge, float which) {
    float wait = 25.0 + which * 17.0;
    // None of them is in the sky at the moment the page opens.
    float clock = uSeconds + wait * (0.3 + which * 0.25);
    float run = floor(clock / wait);
    float age = (clock - run * wait) / 0.6;

    if (age > 1.0) return 0.0;

    vec2 seed = vec2(run, which * 7.0 + 1.0);
    // It starts in the upper part of the sky and falls to either side.
    vec2 from = edge * vec2(hash(seed) * 2.0 - 1.0, 0.2 + 0.8 * hash(seed + 3.0));
    float slope = 0.5 + 0.9 * hash(seed + 5.0);
    vec2 way = vec2(cos(slope) * (hash(seed + 9.0) < 0.5 ? -1.0 : 1.0), -sin(slope));
    vec2 head = from + way * (0.22 + 0.15 * hash(seed + 11.0)) * age;

    // How far behind the head a pixel is, and how far off its path.
    vec2 back = point - head;
    float behind = max(-dot(back, way), 0.0);
    float aside = length(back + way * behind);
    float width = 0.9 * uPixelRatio / min(uResolution.x, uResolution.y);
    float tail = smoothstep(0.07, 0.0, behind);

    return exp(-aside * aside / (width * width)) * tail * tail
      * smoothstep(0.0, 0.15, age) * smoothstep(1.0, 0.5, age);
  }

  // Towards the sun, which is up to the left and a little behind the camera.
  const vec3 SUN = vec3(-0.78, 0.56, 0.28);

  const vec3 AIR = vec3(0.3, 0.56, 1.0);

  // Where on a map of a globe a direction from its centre is found.
  vec2 chart(vec3 place) {
    return vec2(
      atan(place.x, place.z) / 6.2831853 + 0.5,
      asin(clamp(place.y, -1.0, 1.0)) / 3.1415927 + 0.5
    );
  }

  // The moon: bare rock, with no air to soften the edge of its shadow. It
  // always shows the earth the same side, so the map needs no turning. The
  // colour comes with how much of the pixel it covers.
  vec4 moon(vec2 point, vec2 centre, float radius) {
    vec2 disc = (point - centre) / radius;
    float reach = length(disc);

    if (reach >= 1.0) return vec4(0.0);

    vec3 normal = vec3(disc, sqrt(1.0 - reach * reach));
    vec3 stone = pow(texture2D(uMoon, chart(normal)).rgb, vec3(2.2));
    float day = smoothstep(0.0, 0.12, dot(normal, SUN)) * clamp(dot(normal, SUN), 0.0, 1.0);
    float pixel = 1.5 / min(uResolution.x, uResolution.y) / radius;

    return vec4(pow(stone * day * 1.6, vec3(1.0 / 2.2)), smoothstep(1.0, 1.0 - pixel, reach));
  }

  // The earth, with its colour already multiplied by how much of the pixel
  // it covers: land and sea by day, cities by night, clouds over both, and
  // the air as a blue haze that thickens towards the edge and glows past it.
  vec4 earth(vec2 point, vec2 centre, float radius) {
    vec2 disc = (point - centre) / radius;
    float reach = length(disc);

    if (reach >= 1.0) {
      // Past the edge there is only the thin shell of air, lit from behind.
      float lit = smoothstep(-0.35, 0.3, dot(vec3(disc / reach, 0.0), SUN));
      float glow = exp((1.0 - reach) / 0.012) * lit * 0.85;

      return vec4(AIR * glow, glow);
    }

    vec3 normal = vec3(disc, sqrt(1.0 - reach * reach));
    // The earth turns very slowly, once in a little over twenty minutes, and the clouds a
    // little faster than the ground under them.
    vec2 at = chart(uGlobe * normal);
    vec2 turn = vec2(uSeconds / 1350.0, 0.0);
    vec3 map = texture2D(uDay, at - turn).rgb;
    vec3 ground = pow(map, vec3(2.2));
    vec3 cities = pow(texture2D(uNight, at - turn).rgb, vec3(2.2));
    float cover = smoothstep(0.08, 0.85, texture2D(uClouds, at - turn * 1.2).r);

    float sun = dot(normal, SUN);
    float day = smoothstep(-0.12, 0.3, sun);
    // Water is the part of the map that is more blue than red.
    float sea = smoothstep(0.02, 0.12, map.b - map.r);
    // The sun mirrored in the sea: a bright spot with a wide sheen around.
    float mirror = max(reflect(-SUN, normal).z, 0.0);
    float glint = (pow(mirror, 70.0) * 0.9 + pow(mirror, 8.0) * 0.07) * sea * (1.0 - cover);

    vec3 lit = mix(ground * 1.25 + glint, vec3(0.92), cover);

    lit *= 0.2 + 0.8 * clamp(sun, 0.0, 1.0);
    // Sunlight turns red where it reaches the ground at a low angle.
    lit *= mix(vec3(1.0, 0.5, 0.3), vec3(1.0), smoothstep(-0.05, 0.3, sun));

    vec3 dark = cities * vec3(1.0, 0.76, 0.46) * 2.2 * (1.0 - cover * 0.8);
    vec3 colour = lit * day + dark * (1.0 - smoothstep(-0.15, 0.05, sun));

    // Looking at the edge is looking through much more air.
    float haze = smoothstep(-0.3, 0.3, sun);

    colour = mix(colour, AIR * haze, haze * (0.1 + 0.75 * pow(1.0 - normal.z, 2.5)));

    return vec4(pow(colour, vec3(1.0 / 2.2)), 1.0);
  }

  void main() {
    float shortest = min(uResolution.x, uResolution.y);
    vec2 point = (gl_FragCoord.xy - 0.5 * uResolution) / shortest;
    // Half the screen in the same units, to place things relative to it.
    vec2 edge = 0.5 * uResolution / shortest;

    vec2 drift = point * 1.5 + vec2(uSeconds * 0.0015, -uSeconds * 0.001);
    float warp = clouds(drift * 1.3 + 4.0);
    float gas = clouds(drift + warp * 1.3);
    float across = point.y * 0.9 - point.x * 0.5 + 0.12 + (warp - 0.5) * 0.5;
    float band = exp(-across * across * 5.0);
    // Dust in front of the band blocks its light.
    float lanes = smoothstep(0.42, 0.72, clouds(drift * 2.4 + warp + 50.0));
    float glow = band * smoothstep(0.25, 0.85, gas) * (1.0 - 0.8 * lanes);

    // Mostly old yellow stars towards the middle, bluer away from it.
    vec3 tint = mix(vec3(0.5, 0.56, 0.75), vec3(0.84, 0.73, 0.6), band * gas);
    vec3 light = tint * glow * 0.3;

    // Faint stars: at most one per small square of the screen, somewhere
    // inside it so they do not line up, and many more along the band.
    vec2 square = gl_FragCoord.xy / (7.0 * uPixelRatio);
    vec2 cell = floor(square);
    vec2 spot = 0.15 + 0.7 * vec2(hash(cell + 3.0), hash(cell + 11.0));
    float reach = length((fract(square) - spot) * 7.0);
    float chance = 0.035 + 0.8 * glow;

    light += vec3(0.85, 0.9, 1.0) * step(1.0 - chance, hash(cell))
      * exp(-reach * reach * 2.2) * hash(cell + 7.0) * 0.75;

    light += vec3(0.9, 0.95, 1.0) * 0.8
      * (meteor(point, edge, 0.0) + meteor(point, edge, 1.0) + meteor(point, edge, 2.0));

    gl_FragColor = expose(light);

    // The earth rises over the bottom of the screen, the moon far behind
    // it. Neither is there until their maps are.
    vec2 home = vec2(edge.x * 0.6, -edge.y - 0.22);
    // The moon goes around the earth very slowly, once an hour: over the
    // top of it to the right, and then out of sight behind it.
    float orbit = -uSeconds / 3600.0 * 6.2831853;
    vec2 away = vec2(edge.x * -0.05, -edge.y + 0.52) - home;
    vec2 around = home + mat2(cos(orbit), sin(orbit), -sin(orbit), cos(orbit)) * away;

    vec4 rock = moon(point, around, 0.026);
    vec4 globe = earth(point, home, 0.62) * uDawn;

    gl_FragColor = mix(gl_FragColor, vec4(rock.rgb, 1.0), rock.a * uDawn);
    gl_FragColor = globe + gl_FragColor * (1.0 - globe.a);
  }
`

const starVertex = `
  attribute vec3 aPosition;
  attribute float aSize;
  attribute float aWarmth;
  attribute float aPhase;

  uniform float uSeconds;
  uniform float uFlight;
  uniform float uAspect;
  uniform float uPixelRatio;

  varying float vLight;
  varying float vBright;
  varying vec3 vColor;

  void main() {
    // Stars come towards the camera and start over at the far end.
    float z = fract(aPosition.z - uSeconds / uFlight);
    float depth = mix(0.25, 5.0, z);

    float angle = uSeconds * 0.003;
    mat2 roll = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
    // Fill the long side of the screen, whichever that is.
    vec2 fit = uAspect > 1.0 ? vec2(1.0, uAspect) : vec2(1.0 / uAspect, 1.0);

    gl_Position = vec4(roll * aPosition.xy / depth * fit, 0.0, 1.0);

    // The point is the star and the glow around it.
    float core = aSize * uPixelRatio / depth;

    gl_PointSize = max(core * 6.0, 2.0);

    float twinkle = 0.82 + 0.18 * sin(uSeconds * (0.8 + aPhase * 2.0) + aPhase * 40.0);

    // Fade in at the far end and out just before passing the camera.
    vLight = smoothstep(1.0, 0.75, z) * smoothstep(0.0, 0.08, z) * twinkle
      * clamp(core * 0.9, 0.25, 1.0);
    vBright = smoothstep(2.6, 4.2, aSize);

    // From orange dwarfs over white to hot blue stars.
    vColor = aWarmth < 0.5
      ? mix(vec3(1.0, 0.7, 0.45), vec3(1.0), aWarmth * 2.0)
      : mix(vec3(1.0), vec3(0.68, 0.8, 1.0), aWarmth * 2.0 - 1.0);
  }
`

const starFragment = `
  precision highp float;


  varying float vLight;
  varying float vBright;
  varying vec3 vColor;

  ${exposure}

  void main() {
    vec2 point = (gl_PointCoord - 0.5) * 2.0;
    float distance = dot(point, point);

    // A sharp core with a soft glow, and on the brightest stars the spikes
    // a telescope draws.
    float glow = exp(-distance * 22.0) + 0.3 * exp(-distance * 5.0);
    float spikes = exp(-abs(point.x) * 26.0) * exp(-abs(point.y) * 3.5)
      + exp(-abs(point.y) * 26.0) * exp(-abs(point.x) * 3.5);

    gl_FragColor = expose(vColor * vLight * (glow + spikes * vBright * 0.6));
  }
`

function link(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const program = gl.createProgram()!

  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type)!

    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    gl.attachShader(program, shader)
  }

  gl.linkProgram(program)

  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null
}

// The night sky behind the not found page, drawn with WebGL: a field of
// stars the camera drifts through, and the far sky, the earth and the moon
// as one shader over the whole screen. Without WebGL the canvas simply stays empty.
export default function Starfield({ className }: StarfieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', { antialias: false })

    if (!canvas || !gl) return

    const skyProgram = link(
      gl,
      'attribute vec2 aCorner; void main() { gl_Position = vec4(aCorner, 0.0, 1.0); }',
      sky,
    )
    const starProgram = link(gl, starVertex, starFragment)

    if (!skyProgram || !starProgram) return

    // One triangle that covers the screen.
    const corners = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, corners)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )

    // Six numbers per star: where it is, how large, how warm its colour is
    // and where it is in its twinkle.
    const stars = new Float32Array(STARS * 6)

    for (let index = 0; index < STARS; index++) {
      stars[index * 6] = (Math.random() * 2 - 1) * 5.5
      stars[index * 6 + 1] = (Math.random() * 2 - 1) * 5.5
      stars[index * 6 + 2] = Math.random()
      // Most stars are faint, a few are bright.
      stars[index * 6 + 3] = 0.5 + Math.pow(Math.random(), 7) * 4
      stars[index * 6 + 4] = Math.random()
      stars[index * 6 + 5] = Math.random()
    }

    const points = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, points)
    gl.bufferData(gl.ARRAY_BUFFER, stars, gl.STATIC_DRAW)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // The maps each keep a texture slot of their own. The earth and the
    // moon are left out until all of them have arrived.
    const maps = {
      uDay: earthDay,
      uNight: earthNight,
      uClouds: earthClouds,
      uMoon: moonSurface,
    }
    const sharpest = gl.getExtension('EXT_texture_filter_anisotropic')
    let waiting = Object.keys(maps).length
    let arrived = 0
    let gone = false

    Object.values(maps).forEach((source, slot) => {
      const image = new Image()

      image.onload = () => {
        if (gone) return

        gl.activeTexture(gl.TEXTURE0 + slot)
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
        // Maps have north at the top, textures start at the bottom.
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR,
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // Keeps the ground sharp where it is seen at a low angle.
        if (sharpest) {
          gl.texParameterf(
            gl.TEXTURE_2D,
            sharpest.TEXTURE_MAX_ANISOTROPY_EXT,
            gl.getParameter(sharpest.MAX_TEXTURE_MAX_ANISOTROPY_EXT),
          )
        }

        if (--waiting == 0) {
          arrived = performance.now()
          // A sky that holds still is not drawn again by itself.
          if (still.matches) draw()
        }
      }

      image.src = source
    })

    gl.useProgram(skyProgram)
    Object.keys(maps).forEach((name, slot) => {
      gl.uniform1i(gl.getUniformLocation(skyProgram, name), slot)
    })
    gl.uniformMatrix3fv(
      gl.getUniformLocation(skyProgram, 'uGlobe'),
      false,
      globe(),
    )

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const start = performance.now()
    let frame = 0

    function attribute(
      program: WebGLProgram,
      name: string,
      size: number,
      stride: number,
      offset: number,
    ) {
      const location = gl!.getAttribLocation(program, name)

      gl!.enableVertexAttribArray(location)
      gl!.vertexAttribPointer(location, size, gl!.FLOAT, false, stride, offset)
    }

    function uniforms(program: WebGLProgram, values: Record<string, number>) {
      for (const [name, value] of Object.entries(values)) {
        gl!.uniform1f(gl!.getUniformLocation(program, name), value)
      }
    }

    function draw() {
      const ratio = Math.min(window.devicePixelRatio, 2)
      const width = Math.round(canvas!.clientWidth * ratio)
      const height = Math.round(canvas!.clientHeight * ratio)

      if (canvas!.width != width || canvas!.height != height) {
        canvas!.width = width
        canvas!.height = height
        gl!.viewport(0, 0, width, height)
      }

      const shared = {
        uSeconds: (performance.now() - start) / 1000,
        uPixelRatio: ratio,
      }

      gl!.clearColor(0, 0, 0, 0)
      gl!.clear(gl!.COLOR_BUFFER_BIT)

      // The stars go first, so that the planet covers the ones behind it.
      gl!.useProgram(starProgram)
      gl!.bindBuffer(gl!.ARRAY_BUFFER, points)
      attribute(starProgram!, 'aPosition', 3, 24, 0)
      attribute(starProgram!, 'aSize', 1, 24, 12)
      attribute(starProgram!, 'aWarmth', 1, 24, 16)
      attribute(starProgram!, 'aPhase', 1, 24, 20)
      uniforms(starProgram!, {
        ...shared,
        uFlight: FLIGHT,
        uAspect: width / height,
      })
      gl!.drawArrays(gl!.POINTS, 0, STARS)

      gl!.useProgram(skyProgram)
      gl!.bindBuffer(gl!.ARRAY_BUFFER, corners)
      attribute(skyProgram!, 'aCorner', 2, 0, 0)
      uniforms(skyProgram!, {
        ...shared,
        uDawn:
          waiting || still.matches
            ? Number(!waiting)
            : Math.min((performance.now() - arrived) / 1000 / DAWN, 1),
      })
      gl!.uniform2f(
        gl!.getUniformLocation(skyProgram!, 'uResolution'),
        width,
        height,
      )
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)

      // A sky that holds still needs to be drawn only once.
      if (!still.matches) frame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      gone = true
      cancelAnimationFrame(frame)
      // Browsers only allow a handful of WebGL contexts at a time.
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={ref} className={className} />
}
