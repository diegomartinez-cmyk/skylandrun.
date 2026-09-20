import * as THREE from 'three';


export class Weapons {

  constructor(scene) {

    this.scene = scene;

    this.bullets = [];

    this.ammo = 30;

    this.cool = 0;

  }


  shoot(camera) {

    if (
      this.ammo <= 0 ||
      this.cool > 0
    ) {

      return;

    }


    this.ammo--;

    this.cool = .16;


    const direction =
      new THREE.Vector3(
        0,
        0,
        -1
      )
      .applyQuaternion(
        camera.quaternion
      );


    const bullet =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .11,
          6,
          6
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffff66
        })
      );


    bullet.position.copy(
      camera.position
    );


    bullet.userData = {

      dir: direction,

      life: 0,

      damage: 25

    };


    this.scene.add(
      bullet
    );


    this.bullets.push(
      bullet
    );

  }


  update(
    dt,
    enemies
  ) {

    this.cool =
      Math.max(
        0,
        this.cool - dt
      );


    for (
      const bullet of
      this.bullets
    ) {

      bullet.position.add(
        bullet.userData.dir
          .clone()
          .multiplyScalar(
            45 * dt
          )
      );


      bullet.userData.life +=
        dt;


      for (
        const enemy of
        enemies
      ) {

        if (
          enemy.userData.hp > 0 &&
          bullet.position.distanceTo(
            enemy.position.clone()
              .add(
                new THREE.Vector3(
                  0,
                  1,
                  0
                )
              )
          ) < 1
        ) {

          enemy.userData.hp -=
            bullet.userData.damage;

          bullet.userData.life =
            99;

          break;

        }

      }

    }


    this.bullets =
      this.bullets.filter(
        bullet => {

          if (
            bullet.userData.life >
            2
          ) {

            this.scene.remove(
              bullet
            );

            return false;

          }

          return true;

        }
      );

  }


  reload() {

    this.ammo = 30;

  }

}


export function enemyShot(
  scene,
  enemy,
  player,
  shots
) {

  const direction =
    player.object.position
      .clone()
      .add(
        new THREE.Vector3(
          0,
          1,
          0
        )
      )
      .sub(
        enemy.position
      )
      .normalize();


  const bullet =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        .13,
        6,
        6
      ),
      new THREE.MeshBasicMaterial({
        color: 0xffff44
      })
    );


  bullet.position.copy(
    enemy.position
  );


  bullet.position.y += 1;


  bullet.userData = {

    dir: direction,

    life: 0

  };


  scene.add(
    bullet
  );


  shots.push(
    bullet
  );

}


export function updateEnemyShots(
  scene,
  shots,
  player,
  dt
) {

  for (
    const bullet of
    shots
  ) {

    bullet.position.add(
      bullet.userData.dir
        .clone()
        .multiplyScalar(
          22 * dt
        )
    );


    bullet.userData.life +=
      dt;


    const target =
      player.object.position
        .clone()
        .add(
          new THREE.Vector3(
            0,
            1,
            0
          )
        );


    if (
      bullet.position.distanceTo(
        target
      ) < 1
    ) {

      player.damage(8);

      bullet.userData.life =
        99;

    }

  }


  for (
    let i =
      shots.length - 1;
    i >= 0;
    i--
  ) {

    if (
      shots[i].userData.life >
      4
    ) {

      scene.remove(
        shots[i]
      );

      shots.splice(
        i,
        1
      );

    }

  }

}
