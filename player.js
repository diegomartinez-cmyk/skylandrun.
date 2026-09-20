import * as THREE from 'three';

export class Player {

  constructor(scene) {

    this.object =
      new THREE.Group();

    this.object.position.set(
      0,
      2,
      0
    );

    this.speed = 9;
    this.jump = 10;
    this.vy = 0;
    this.ground = false;

    this.hp = 100;
    this.shield = 50;

    this.yaw = 0;
    this.pitch = 0;

    this.radius = .55;


    const body =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          .45,
          1,
          6,
          10
        ),
        new THREE.MeshStandardMaterial({
          color: 0x2d8cff
        })
      );


    body.position.y = 1;

    body.castShadow = true;

    this.object.add(body);

    scene.add(this.object);

  }


  move(dir, dt, solid) {

    const d =
      dir.clone()
        .applyAxisAngle(
          new THREE.Vector3(
            0,
            1,
            0
          ),
          this.yaw
        );


    if (d.lengthSq()) {

      d.normalize()
        .multiplyScalar(
          this.speed * dt
        );

    }


    const next =
      this.object.position.clone();


    next.x += d.x;
    next.z += d.z;


    if (
      !solid(
        next.x,
        next.z,
        this.object.position.y,
        this.radius
      )
    ) {

      this.object.position.x =
        next.x;

      this.object.position.z =
        next.z;

    }

  }


  update(
    dt,
    keys,
    solid
  ) {

    const forward =
      (keys.w ? 1 : 0) -
      (keys.s ? 1 : 0);


    const right =
      (keys.d ? 1 : 0) -
      (keys.a ? 1 : 0);


    this.move(
      new THREE.Vector3(
        right,
        0,
        -forward
      ),
      dt,
      solid
    );


    if (
      keys.space &&
      this.ground
    ) {

      this.vy =
        this.jump;

      this.ground =
        false;

    }


    this.vy -=
      24 * dt;


    this.object.position.y +=
      this.vy * dt;


    const floor =
      solid.floor(
        this.object.position.x,
        this.object.position.z
      );


    if (
      this.object.position.y <=
      floor
    ) {

      this.object.position.y =
        floor;

      this.vy = 0;

      this.ground =
        true;

    }

  }


  damage(amount) {

    const shieldDamage =
      Math.min(
        this.shield,
        amount
      );


    this.shield -=
      shieldDamage;


    this.hp -=
      amount -
      shieldDamage;


    return this.hp <= 0;

  }

}
