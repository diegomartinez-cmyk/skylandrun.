import * as THREE from 'three';


export const BIOMES = {

  forest: {
    name: 'Bosque Encantado',
    emoji: '🌲',
    x: -210,
    z: -150,
    color: 0x5f9f55
  },

  desert: {
    name: 'Desierto Dorado',
    emoji: '🏜️',
    x: 210,
    z: -150,
    color: 0xd8bd73
  },

  jungle: {
    name: 'Jungla Salvaje',
    emoji: '🌴',
    x: -210,
    z: 150,
    color: 0x3f8f45
  },

  snow: {
    name: 'Nieve Helada',
    emoji: '❄️',
    x: 210,
    z: 150,
    color: 0xf7f7f7
  },

  volcano: {
    name: 'Volcán Ardiente',
    emoji: '🌋',
    x: 0,
    z: 205,
    color: 0x555555
  },

  ruins: {
    name: 'Ruinas Griegas',
    emoji: '🏛️',
    x: 0,
    z: -205,
    color: 0xb7aa8c
  },

  cave: {
    name: 'Cueva Cristalina',
    emoji: '💎',
    x: 0,
    z: 0,
    color: 0x292b31
  }

};


export const names =
  Object.keys(BIOMES);


export function biomeAt(
  x,
  z
) {

  let best =
    names[0];

  let bestDistance =
    Infinity;


  for (
    const name of names
  ) {

    const biome =
      BIOMES[name];


    const distance =
      (x - biome.x) ** 2 +
      (z - biome.z) ** 2;


    if (
      distance <
      bestDistance
    ) {

      bestDistance =
        distance;

      best =
        name;

    }

  }


  return best;

}


export function buildBiomes(
  scene
) {

  const group =
    new THREE.Group();


  const island =
    new THREE.Mesh(
      new THREE.CircleGeometry(
        390,
        96
      ),
      new THREE.MeshStandardMaterial({
        color: 0x5f7f72
      })
    );


  island.rotation.x =
    -Math.PI / 2;


  island.receiveShadow = true;

  group.add(island);


  for (
    const name of names
  ) {

    const biome =
      BIOMES[name];


    const area =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          82,
          96,
          1.2,
          32
        ),
        new THREE.MeshStandardMaterial({
          color: biome.color
        })
      );


    area.position.set(
      biome.x,
      0,
      biome.z
    );


    area.receiveShadow =
      true;


    group.add(area);


    decorate(
      group,
      name
    );

  }


  scene.add(group);

  return group;

}


function decorate(
  group,
  name
) {

  const biome =
    BIOMES[name];


  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const x =
      biome.x +
      (Math.random() - .5) *
      120;


    const z =
      biome.z +
      (Math.random() - .5) *
      90;


    if (
      name === 'forest' ||
      name === 'jungle'
    ) {

      const trunk =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            name === 'jungle'
              ? 1.4
              : 1,
            1.2,
            name === 'jungle'
              ? 8
              : 5,
            8
          ),
          new THREE.MeshStandardMaterial({
            color: 0x694329
          })
        );


      trunk.position.set(
        x,
        name === 'jungle'
          ? 4
          : 2.5,
        z
      );


      group.add(trunk);


      const crown =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            name === 'jungle'
              ? 4
              : 3,
            8,
            6
          ),
          new THREE.MeshStandardMaterial({
            color:
              name === 'jungle'
                ? 0x176b39
                : 0x276d2f
          })
        );


      crown.position.set(
        x,
        name === 'jungle'
          ? 8
          : 5,
        z
      );


      group.add(crown);

    }

    else if (
      name === 'desert'
    ) {

      const cactus =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            .7,
            1,
            4,
            8
          ),
          new THREE.MeshStandardMaterial({
            color: 0x3e8a43
          })
        );


      cactus.position.set(
        x,
        2,
        z
      );


      group.add(cactus);

    }

    else {

      const rock =
        new THREE.Mesh(
          new THREE.DodecahedronGeometry(
            2 +
            Math.random() * 2
          ),
          new THREE.MeshStandardMaterial({
            color:
              name === 'snow'
                ? 0xbfe8ff
                : 0x777777
          })
        );


      rock.position.set(
        x,
        1.5,
        z
      );


      rock.castShadow = true;

      group.add(rock);

    }

  }

}


export function createSolids() {

  const solids = [];


  for (
    const name of names
  ) {

    const biome =
      BIOMES[name];


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      const x =
        biome.x +
        (Math.random() - .5) *
        110;


      const z =
        biome.z +
        (Math.random() - .5) *
        75;


      const height =
        1 +
        Math.random() * 4;


      solids.push({

        x,
        z,

        hx: 2.5,
        hz: 2.5,

        top: height

      });

    }

  }


  return solids;

}


export function spawnPoint(
  name
) {

  const biome =
    BIOMES[name];


  return new THREE.Vector3(
    biome.x +
      (Math.random() - .5) * 55,

    0,

    biome.z +
      (Math.random() - .5) * 55
  );

}
