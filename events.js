export const EVENTS = [

  {
    id: 'pyramid',
    biome: 'desert',
    type: 'search',
    text:
      '🏜️ ¡Ha aparecido una pirámide!'
  },

  {
    id: 'mineral',
    biome: 'cave',
    type: 'search',
    text:
      '💎 ¡Ha aparecido un mineral en la Cueva Cristalina!'
  },

  {
    id: 'monkeys',
    biome: 'jungle',
    type: 'danger',
    text:
      '🐒 ¡Zona Salvaje! Han aparecido más monos.'
  },

  {
    id: 'avalanche',
    biome: 'snow',
    type: 'danger',
    text:
      '❄️ ¡Avalancha! La nieve se desplaza hacia ti.'
  },

  {
    id: 'eruption',
    biome: 'volcano',
    type: 'danger',
    text:
      '🌋 ¡Erupción! La lava está cayendo por la isla.'
  },

  {
    id: 'earthquake',
    biome: 'ruins',
    type: 'danger',
    text:
      '🏛️ ¡Terremoto! Las ruinas se están derrumbando.'
  },

  {
    id: 'forestfall',
    biome: 'forest',
    type: 'danger',
    text:
      '🌲 ¡Derrumbe del bosque! El terreno se vuelve peligroso.'
  }

];


export function chooseEvents() {

  return [
    ...EVENTS
  ]
    .sort(
      () =>
        Math.random() - .5
    )
    .slice(
      0,
      3 +
      Math.floor(
        Math.random() * 2
      )
    );

}


export class EventManager {

  constructor(
    scene,
    player,
    biomes
  ) {

    this.scene = scene;

    this.player = player;

    this.biomes = biomes;

    this.active = [];

    this.done = new Set();

  }


  update(
    dt,
    notify
  ) {

    for (
      const event of
      this.active
    ) {

      event.t -= dt;

      if (
        event.t <= 0
      ) {

        event.done = true;

      }

    }


    this.active =
      this.active.filter(
        event =>
          !event.done
      );

  }


  trigger(
    event,
    notify
  ) {

    if (
      this.done.has(
        event.id
      )
    ) {

      return;

    }


    this.done.add(
      event.id
    );


    notify(
      event.text
    );


    this.active.push({

      id: event.id,

      t:
        event.type === 'danger'
          ? 12
          : 8

    });


    if (
      event.id === 'eruption'
    ) {

      this.lava();

    }


    if (
      event.id === 'earthquake'
    ) {

      this.shake = 3;

    }


    if (
      event.id === 'avalanche'
    ) {

      this.avalanche = 4;

    }

  }


  lava() {

    for (
      let i = 0;
      i < 12;
      i++
    ) {

      const mesh =
        this.scene.children.find(
          object =>
            object.isMesh &&
            object.material &&
            object.material.color &&
            object.material.color.getHex?.() ===
              0x555555
        );


      if (mesh) {

        mesh.position.y +=
          .02;

      }

    }

  }

}
