import * as THREE from 'three';

import { Player } from './player.js';

import {
  BIOMES,
  names,
  biomeAt,
  buildBiomes,
  createSolids,
  spawnPoint
} from './biomes.js';

import {
  spawnEnemies,
  updateEnemies
} from './enemies.js';

import {
  Weapons,
  enemyShot,
  updateEnemyShots
} from './weapons.js';

import {
  chooseEvents,
  EventManager
} from './events.js';


const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87c9ff);

scene.fog = new THREE.Fog(
  0x87c9ff,
  80,
  430
);


const camera = new THREE.PerspectiveCamera(
  70,
  innerWidth / innerHeight,
  .1,
  500
);


const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  innerWidth,
  innerHeight
);

renderer.setPixelRatio(
  Math.min(devicePixelRatio, 1.7)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(
  renderer.domElement
);


scene.add(
  new THREE.HemisphereLight(
    0xffffff,
    0x667788,
    2
  )
);


const sun =
  new THREE.DirectionalLight(
    0xffffff,
    2
  );

sun.position.set(
  80,
  120,
  40
);

sun.castShadow = true;

scene.add(sun);


const player =
  new Player(scene);


const weapons =
  new Weapons(scene);


const solids =
  createSolids();


buildBiomes(scene);


const shots = [];

let enemies = [];

let started = false;
let over = false;

let startTime = 0;

let yaw = 0;
let pitch = 0;

let events = [];


const manager =
  new EventManager(
    scene,
    player,
    BIOMES
  );


const keys = {};


function floor(x, z) {

  let y = 0;

  for (const s of solids) {

    if (
      Math.abs(x - s.x) <
        s.hx + .6 &&
      Math.abs(z - s.z) <
        s.hz + .6
    ) {

      y = Math.max(
        y,
        s.top
      );

    }

  }

  return y;
}


function blocked(
  x,
  z,
  y,
  radius
) {

  if (
    x * x +
    z * z >
    390 * 390
  ) {

    return true;

  }


  for (const s of solids) {

    if (
      Math.abs(x - s.x) <
        s.hx + radius &&
      Math.abs(z - s.z) <
        s.hz + radius &&
      y < s.top - .1
    ) {

      return true;

    }

  }

  return false;
}


blocked.floor = floor;


function notify(text) {

  const msg =
    document.getElementById(
      'msg'
    );

  msg.textContent = text;

  setTimeout(() => {

    msg.textContent = '';

  }, 2800);
}


function start() {

  if (started) return;


  const difficulty =
    document.getElementById(
      'difficulty'
    ).value;


  let selected =
    document.getElementById(
      'spawn'
    ).value;


  if (selected === 'random') {

    selected =
      names[
        Math.floor(
          Math.random() *
          names.length
        )
      ];

  }


  const p =
    spawnPoint(selected);


  player.object.position.set(
    p.x,
    floor(p.x, p.z),
    p.z
  );


  enemies =
    spawnEnemies(
      scene,
      difficulty,
      names,
      spawnPoint
    );


  events =
    chooseEvents();


  started = true;

  over = false;

  startTime =
    performance.now();


  document.getElementById(
    'menu'
  ).style.display = 'none';


  document.getElementById(
    'hud'
  ).style.display = 'block';


  renderer.domElement
    .requestPointerLock?.();

}


function end(win) {

  if (over) return;

  over = true;


  const seconds =
    (performance.now() -
      startTime) / 1000;


  const difficulty =
    document.getElementById(
      'difficulty'
    ).value;


  let times =
    JSON.parse(
      localStorage.getItem(
        'skyland_' +
        difficulty
      ) || '[]'
    );


  if (win) {

    times.push(seconds);

    times.sort(
      (a, b) => a - b
    );

    localStorage.setItem(
      'skyland_' +
      difficulty,
      JSON.stringify(
        times.slice(0, 10)
      )
    );

  }


  notify(
    win
      ? '🏆 ¡VICTORIA! ' +
        seconds.toFixed(1) +
        ' s'
      : '💀 HAS CAÍDO'
  );


  setTimeout(() => {

    location.reload();

  }, 3500);

}


addEventListener(
  'keydown',
  e => {

    const key =
      e.key.toLowerCase();


    if (
      key === 'w' ||
      key === 'a' ||
      key === 's' ||
      key === 'd'
    ) {

      keys[key] = true;

    }


    if (e.code === 'Space') {

      e.preventDefault();

      keys.space = true;

    }


    if (key === 'r') {

      weapons.reload();

    }


    if (
      key === 'm' &&
      started
    ) {

      const map =
        document.getElementById(
          'map'
        );

      map.style.display =
        map.style.display === 'grid'
          ? 'none'
          : 'grid';

      drawMap();

    }

  }
);


addEventListener(
  'keyup',
  e => {

    const key =
      e.key.toLowerCase();

    keys[key] = false;

    if (e.code === 'Space') {

      keys.space = false;

    }

  }
);


renderer.domElement
  .addEventListener(
    'mousemove',
    e => {

      if (!started) return;

      yaw -=
        e.movementX *
        .0025;

      pitch -=
        e.movementY *
        .0025;

      pitch =
        Math.max(
          -1.45,
          Math.min(
            1.45,
            pitch
          )
        );

    }
  );


renderer.domElement
  .addEventListener(
    'mousedown',
    e => {

      if (
        e.button === 0 &&
        started
      ) {

        weapons.shoot(
          camera
        );

      }

    }
  );


document.getElementById(
  'play'
).onclick = start;


function drawMap() {

  const root =
    document.getElementById(
      'mapinner'
    );


  root.innerHTML =
    '<div class="mapworld">' +

    names.map(n => {

      const b =
        BIOMES[n];

      return `
        <div
          class="region"
          style="
            left:${50 + b.x / 7.8}%;
            top:${50 + b.z / 7.8}%;
            width:30%;
            height:24%;
            background:#${b.color
              .toString(16)
              .padStart(6, '0')}
          ">
        </div>

        <span
          class="marker"
          style="
            left:${50 + b.x / 7.8}%;
            top:${50 + b.z / 7.8}%
          ">
          ${b.emoji}
        </span>
      `;

    }).join('') +

    `
      <div
        class="you"
        id="you">
      </div>
    </div>`;


  const you =
    document.getElementById(
      'you'
    );


  you.style.left =
    (
      50 +
      player.object.position.x /
        7.8
    ) + '%';


  you.style.top =
    (
      50 +
      player.object.position.z /
        7.8
    ) + '%';

}


function tick(dt) {

  player.update(
    dt,
    keys,
    blocked
  );


  player.yaw = yaw;
  player.pitch = pitch;


  camera.position.copy(
    player.object.position
  );


  camera.position.y += 2.1;


  camera.rotation.set(
    pitch,
    yaw,
    0,
    'YXZ'
  );


  weapons.update(
    dt,
    enemies
  );


  updateEnemies(
    enemies,
    player,
    dt,
    enemy =>
      enemyShot(
        scene,
        enemy,
        player,
        shots
      )
  );


  updateEnemyShots(
    scene,
    shots,
    player,
    dt
  );


  enemies =
    enemies.filter(
      enemy => {

        if (
          enemy.userData.hp <= 0
        ) {

          scene.remove(enemy);

          return false;

        }

        return true;

      }
    );


  manager.update(
    dt,
    notify
  );


  const current =
    biomeAt(
      player.object.position.x,
      player.object.position.z
    );


  const selectedEvent =
    events.find(
      e =>
        e.biome === current
    );


  if (
    selectedEvent &&
    !manager.done.has(
      selectedEvent.id
    ) &&
    Math.hypot(
      player.object.position.x -
        BIOMES[current].x,

      player.object.position.z -
        BIOMES[current].z
    ) > 25
  ) {

    manager.trigger(
      selectedEvent,
      notify
    );

  }


  document.getElementById(
    'alive'
  ).textContent =
    '👥 ' +
    enemies.length +
    ' rivales';


  document.getElementById(
    'timer'
  ).textContent =
    (
      (performance.now() -
        startTime) /
      1000
    ).toFixed(1) +
    ' s';


  document.getElementById(
    'hpText'
  ).textContent =
    Math.max(
      0,
      Math.ceil(player.hp)
    );


  document.getElementById(
    'shieldText'
  ).textContent =
    Math.max(
      0,
      Math.ceil(player.shield)
    );


  document.getElementById(
    'hp'
  ).style.width =
    Math.max(
      0,
      player.hp
    ) + '%';


  document.getElementById(
    'shield'
  ).style.width =
    Math.max(
      0,
      player.shield * 2
    ) + '%';


  document.getElementById(
    'ammo'
  ).textContent =
    weapons.ammo;


  if (
    player.hp <= 0
  ) {

    end(false);

  }


  const searchEventsDone =
    events
      .filter(
        e => e.type === 'search'
      )
      .every(
        e =>
          manager.done.has(
            e.id
          )
      );


  if (
    enemies.length === 0 &&
    searchEventsDone
  ) {

    end(true);

  }


  if (
    document.getElementById(
      'map'
    ).style.display === 'grid'
  ) {

    drawMap();

  }

}


let last =
  performance.now();


function loop(t) {

  requestAnimationFrame(loop);


  const dt =
    Math.min(
      .033,
      (t - last) / 1000
    );


  last = t;


  if (
    started &&
    !over
  ) {

    tick(dt);

  }


  renderer.render(
    scene,
    camera
  );

}


requestAnimationFrame(
  loop
);


addEventListener(
  'resize',
  () => {

    camera.aspect =
      innerWidth /
      innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight
    );

  }
);
