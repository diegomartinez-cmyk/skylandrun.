import * as THREE from 'three';


const configs = {

  easy: {
    bots: 28,
    animals: 21,
    bosses: 0
  },

  normal: {
    bots: 49,
    animals: 28,
    bosses: 0
  },

  hard: {
    bots: 70,
    animals: 35,
    bosses: 7
  }

};


export function counts(
  difficulty
) {

  return configs[
    difficulty
  ];

}


export function spawnEnemies(
  scene,
  difficulty,
  biomes,
  spawnPoint
) {

  const result = [];

  const config =
    configs[difficulty];


  for (
    let i = 0;
    i < config.bots;
    i++
  ) {

    result.push(
      createEnemy(
        scene,
        spawnPoint(
          biomes[
            i %
            biomes.length
          ]
        ),
        false,
        false
      )
    );

  }


  for (
    let i = 0;
    i < config.animals;
    i++
  ) {

    result.push(
      createEnemy(
        scene,
        spawnPoint(
          biomes[
            i %
            biomes.length
          ]
        ),
        true,
        false
      )
    );

  }


  if (config.bosses) {

    for (
      let i = 0;
      i < 7;
      i++
    ) {

      result.push(
        createEnemy(
          scene,
          spawnPoint(
            biomes[i]
          ),
          false,
          true
        )
      );

    }

  }


  return result;

}


function createEnemy(
  scene,
  position,
  animal,
  boss
) {

  const group =
    new THREE.Group();


  const color =
    boss
      ? 0x8b1e3f
      : animal
        ? 0x8b5a32
        : 0xd94b4b;


  const scale =
    boss ? 3 : 1;


  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        .45 * scale,
        .9 * scale,
        6,
        8
      ),
      new THREE.MeshStandardMaterial({
        color
      })
    );


  body.position.y =
    .8 * scale;


  body.castShadow = true;


  group.add(body);


  group.position.set(
    position.x,
    0,
    position.z
  );


  group.userData = {

    hp:
      boss
        ? 500
        : animal
          ? 80
          : 100,

    animal,

    boss,

    shoot:
      1 +
      Math.random() * 2,

    damage:
      boss
        ? 18
        : animal
          ? 10
          : 7,

    speed:
      boss
        ? 2.2
        : animal
          ? 2.6
          : 2.0

  };


  scene.add(group);

  return group;

}


export function updateEnemies(
  enemies,
  player,
  dt,
  shoot
) {

  for (
    const enemy of enemies
  ) {

    if (
      enemy.userData.hp <= 0
    ) {

      continue;

    }


    const direction =
      player.object.position
        .clone()
        .sub(enemy.position);


    const distance =
      direction.length();


    direction.y = 0;


    if (
      distance > .1
    ) {

      direction.normalize();


      enemy.position.x +=
        direction.x *
        enemy.userData.speed *
        dt;


      enemy.position.z +=
        direction.z *
        enemy.userData.speed *
        dt;


      enemy.rotation.y =
        Math.atan2(
          direction.x,
          direction.z
        );

    }


    if (
      distance < 2.2 &&
      enemy.userData.animal
    ) {

      enemy.userData.attack =
        (
          enemy.userData.attack ||
          0
        ) - dt;


      if (
        enemy.userData.attack <= 0
      ) {

        player.damage(
          enemy.userData.damage
        );

        enemy.userData.attack =
          1;

      }

    }


    if (
      !enemy.userData.animal
    ) {

      enemy.userData.shoot -= dt;


      if (
        distance < 38 &&
        enemy.userData.shoot <= 0
      ) {

        shoot(enemy);


        enemy.userData.shoot =
          1.3 +
          Math.random() * 1.5;

      }

    }

  }

}
