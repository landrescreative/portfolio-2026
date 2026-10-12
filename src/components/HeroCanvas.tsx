import {
  useRef,
  useEffect,
  useMemo,
  useState,
  Suspense,
  type PointerEvent as ReactPointerEvent,
} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import type { ChromaticAberrationEffect, GlitchEffect } from "postprocessing";
import { markHeroModelReady } from "@/lib/heroModel";

/**
 * Hero background model.
 *
 * `public/models/low-poly-character.glb` was exported straight out of Blender
 * and contains the full scene: the rigged character plus dozens of rig-control
 * helpers (`cs_*`) and a decorative "Cute chicken" cluster parked far off to
 * one side. We only want the character, so `HeroCharacter`:
 *   1. strips every mesh that is neither a skinned character mesh nor one of
 *      the glass accessories attached to the face,
 *   2. poses the arms out of their T-pose (the rig is a "stretchy" rig whose
 *      arm skin is driven by the `*_stretch` / `*_twist` bones) and adds a
 *      slight elbow bend,
 *   3. normalises scale / centring,
 *   4. adds a subtle idle animation (head, neck, eyes and arms).
 */
const MODEL_URL = "/models/low-poly-character.glb";

// Target height of the character in world units (source scene is ~12.5 units tall).
const MODEL_HEIGHT = 5.6;

// Camera distance: close enough that the whole character reads in the hero.
const CAMERA_Z = 6.3;

// Vertical offset in the hero: negative lowers the character so the face (not the
// whole body) is framed, leaving the body to fall below the viewport.
const HERO_Y_OFFSET = -1.3;

/**
 * three.js sanitises glTF node names on load (`PropertyBinding.sanitizeNodeName`):
 * it replaces whitespace with `_` and strips the reserved chars `[ ] . : /`.
 * So the source name `arm_stretch.l` becomes `arm_stretchl`, `head.x` becomes
 * `headx`, etc. We mirror that here so we can keep writing readable names.
 */
const RESERVED_NODE_CHARS = new RegExp("[\\[\\].:/]", "g");
const sanitizeNodeName = (name: string) =>
  name.replace(/\s/g, "_").replace(RESERVED_NODE_CHARS, "");

// All non-skinned meshes are removed: rig-control helpers, the far-away
// "Cute chicken" prop and the eyeglasses. Only the skinned character stays.

/**
 * Deform bones that actually drive each arm, verified from the GLB skin weights
 * (the plain `arm.l` / `forearm.l` bones carry no weights in this rig). Rotating
 * them together as a rigid body around the shoulder joint lowers the arm.
 */
const ARM_BONES = {
  l: ["arm_stretch.l", "forearm_stretch.l", "forearm_twist.l", "hand.l", "c_arm_twist_offset.l"],
  r: ["arm_stretch.r", "forearm_stretch.r", "forearm_twist.r", "hand.r", "c_arm_twist_offset.r"],
};

// Forearm + hand bones, bent together around the elbow.
const FOREARM_BONES = {
  l: ["forearm_stretch.l", "forearm_twist.l", "hand.l"],
  r: ["forearm_stretch.r", "forearm_twist.r", "hand.r"],
};

// How far to lower the arms from the horizontal T-pose (radians).
const ARM_DOWN_ANGLE = 1.15; // ~66deg, ending in a relaxed A-pose

// Small extra forward tilt of the whole arm so it doesn't hang perfectly stiff.
const ARM_FORWARD_TILT = -0.12;

// Slight elbow bend (forward) so the arms read relaxed instead of stick-straight.
const ELBOW_BEND_ANGLE = -0.35;

// Shoulder joints (world units, from the source scene): the arm pivot.
const SHOULDER_PIVOT = {
  l: new THREE.Vector3(1.48, 5.74, -0.09),
  r: new THREE.Vector3(-1.48, 5.74, -0.09),
};

/**
 * Bones gently animated at runtime. `kind` selects the motion; `sign` flips the
 * direction between the left/right counterparts.
 *
 * Eyes: in this file the white eyeball (`c_eye.l/r`) and the black pupil are two
 * separate pieces, the pupil is skinned to the eyelid bones, not to the eye
 * (the rig is off). So we translate the white eyeball AND those eyelid bones
 * together, which is what makes the pupil visibly move.
 */
const IDLE_BONES: Array<{
  name: string;
  kind: "head" | "neck" | "eye" | "smile" | "chin";
  sign: number;
}> = [
  { name: "head.x", kind: "head", sign: 1 },
  { name: "neck.x", kind: "neck", sign: 1 },
  // Chin / jaw bone (used for the smile / laugh).
  { name: "jawbone.x", kind: "chin", sign: 1 },
  // Mouth corners: pulled slightly out + up for a subtle smile (mouth is mostly
  // texture, so only these corner bones carry visible lip geometry).
  { name: "c_lips_corner_mini.l", kind: "smile", sign: 1 },
  { name: "c_lips_corner_mini.r", kind: "smile", sign: -1 },
  { name: "c_lips_top_01.l", kind: "smile", sign: 1 },
  { name: "c_lips_top_01.r", kind: "smile", sign: -1 },
  // Left eye: white ball + black pupil (pupil lives on the eyelid bones).
  { name: "c_eye.l", kind: "eye", sign: 1 },
  { name: "c_eyelid_top_01.l", kind: "eye", sign: 1 },
  { name: "c_eyelid_bot_01.l", kind: "eye", sign: 1 },
  { name: "c_eyelid_top_02.l", kind: "eye", sign: 1 },
  { name: "c_eyelid_bot_02.l", kind: "eye", sign: 1 },
  // Right eye.
  { name: "c_eye.r", kind: "eye", sign: 1 },
  { name: "c_eyelid_top_01.r", kind: "eye", sign: 1 },
  { name: "c_eyelid_bot_01.r", kind: "eye", sign: 1 },
  { name: "c_eyelid_top_02.r", kind: "eye", sign: 1 },
  { name: "c_eyelid_bot_02.r", kind: "eye", sign: 1 },
];

// Idle motion amplitudes. Head/neck/arm are rotations (radians). The eyes are a
// pure horizontal (world X) translation on the face plane, as seen from the
// front the eyeball just slides left/right, with no depth component at all.
const IDLE_HEAD_NOD = 0.05;
const IDLE_NECK_SWAY = 0.04;
const IDLE_ARM_SWAY = 0.05;
const IDLE_EYE_SHIFT_X = 0.18;
// Subtle smile: pull each mouth corner outward (mirrored) and up (model units).
const SMILE_OUT = 0.07;
const SMILE_UP = 0.06;

// Hand wave (hello) with one arm: it lifts up and swings side to side for a
// fraction of the cycle, then rests. `sign` flips the mirrored arm.
const WAVE_SIDE: "l" | "r" = "l";
// The other arm (kept in a resting pose; its distance from the body is tunable).
const REST_SIDE: "l" | "r" = WAVE_SIDE === "l" ? "r" : "l";
const WAVE_RAISE = 1.9; // how far the arm lifts from the A-pose (radians)
const WAVE_AMP = 0.35; // side-to-side swing (radians)
const WAVE_FORWARD = 0.6; // tilt the raised arm towards the camera (keeps the hand off the face)
const WAVE_SPEED = 7; // swing speed (rad/s)
const WAVE_PERIOD = 16; // full gesture cycle (s): waves, then a long rest
const WAVE_ACTIVE = 0.35; // fraction of the cycle the arm is raised and waving
// Push the eyeballs slightly forward (out of the socket) as a safety margin, so
// a bigger lateral movement stays visible and never slips behind the eyelids.
// Model units; increase if the pupils still sink, decrease if they bulge too much.
const EYE_OUT_OFFSET = -0.12;

/**
 * Live-tunable parameters. The dev-only `HeroControls` panel (rendered bottom
 * of this file) mutates this object so you can tweak things in the browser and
 * copy the final values back into the constants above.
 */
const heroParams = {
  handTwistRest: -0.083,
  handTwistWave: -2.063,
  restArmOut: 0.25,
  chin: -0.065,
  waveRaise: WAVE_RAISE,
  waveAmp: WAVE_AMP,
  waveForward: WAVE_FORWARD,
  waveSpeed: WAVE_SPEED,
  wavePeriod: WAVE_PERIOD,
  waveActive: WAVE_ACTIVE,
  heroYOffset: HERO_Y_OFFSET,
  eyeShiftX: IDLE_EYE_SHIFT_X,
  eyeShiftY: 0.09,
  eyeOutOffset: EYE_OUT_OFFSET,
  eyeFollow: 0.9,
  headFollowYaw: 0.37,
  headFollowPitch: 0.12,
  modelRotX: 0,
  modelRotY: -0.382,
  // Rim light (fresnel) added on top of the original PBR materials.
  rimStrength: 0.35,
  rimPower: 4.5,
  // Glitch burst intensity on the character's material (0 = off).
  glitchStrength: 0.4,
  // Mobile-only framing (the fixed desktop layout uses `heroYOffset` instead).
  stageScale: 0.72,
  stageX: 0,
  stageY: -0.1,
  // Avatar framing (the link-in-bio profile picture): a bust, framed so the face
  // and the waving arm read inside a small square.
  avatarScale: 0.9,
  avatarX: 0,
  avatarY: -0.6,
  // Scrolled desktop pose: the character follows the cursor like a puppet.
  followScale: 0.8,
  followPan: 0.5,
  followTilt: 0.35,
  smileOut: SMILE_OUT,
  smileUp: SMILE_UP,
  headNod: IDLE_HEAD_NOD,
  neckSway: IDLE_NECK_SWAY,
  armSway: IDLE_ARM_SWAY,
};

// World-space rotation axes for the idle motion.
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

/**
 * Scroll progress through the hero (0..1), shared between the character (which
 * uses it to morph into the cursor-follow pose) and the post-processing (which
 * uses it to switch the glitch off once the hero is scrolled away, so it never
 * reads as a random flash behind the page).
 */
const heroScroll = { value: 0 };

/**
 * Avatar variant state. The visitor can drag the bust to spin it; a moment after
 * they let go it eases back to the default three-quarter view. Written by the
 * pointer handlers *outside* the Canvas and read by the frame loop *inside* it,
 * mirroring the `heroScroll` pattern so nothing has to cross the R3F boundary.
 */
const AVATAR_RETURN_DELAY = 1200; // ms without input before easing back
const AVATAR_RETURN_EASE = 0.05;
const AVATAR_MAX_YAW = 3.2;
const AVATAR_MAX_PITCH = 0.45;
const avatarDrag = { yaw: 0, pitch: 0, dragging: false, lastInput: 0 };

/**
 * Material FX injected into the model's original `MeshStandardMaterial` via
 * `onBeforeCompile`, so the PBR look is untouched:
 *   - rim light (fresnel)  -> thin orange glow on the silhouette,
 *   - glitch               -> banded vertex tearing + a colour split flash,
 * driven by the shared uniforms below. A handful of ALU ops per vertex/fragment
 * and zero extra draw calls.
 */
const RIM_COLOR = "#ff5a1f";
const MATERIAL_FX_MARKER = "__heroMaterialFx";
const materialFxUniforms = {
  uRimColor: { value: new THREE.Color(RIM_COLOR) },
  uRimPower: { value: 4.5 },
  uRimStrength: { value: 0.35 },
  uRimCursor: { value: new THREE.Vector2(0, 0) },
  uGlitch: { value: 0 },
  uGlitchTime: { value: 0 },
};

function applyMaterialFx(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material || material.userData[MATERIAL_FX_MARKER]) continue;
      material.userData[MATERIAL_FX_MARKER] = true;

      material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, materialFxUniforms);

        // Vertex: tearing. Displace bands of the mesh sideways during a burst.
        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
uniform float uGlitch;
uniform float uGlitchTime;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
{
  float glitchBand = floor( position.y * 3.5 );
  float glitchSeed = fract( sin( glitchBand * 12.9898 + floor( uGlitchTime * 14.0 ) * 78.233 ) * 43758.5453 );
  float glitchAmt = step( 1.0 - uGlitch * 0.85, glitchSeed ) * uGlitch;
  transformed.x += ( glitchSeed - 0.5 ) * 0.45 * glitchAmt;
}`,
          );

        // Fragment: rim light + a magenta/cyan flash during the burst.
        shader.fragmentShader = shader.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
uniform vec3 uRimColor;
uniform float uRimPower;
uniform float uRimStrength;
uniform vec2 uRimCursor;
uniform float uGlitch;`,
          )
          .replace(
            "#include <opaque_fragment>",
            `#include <opaque_fragment>
{
  // normal is the view-space normal; vViewPosition points to the camera.
  vec3 rimNormal = normalize( normal );
  vec3 rimView = normalize( vViewPosition );
  float rim = pow( 1.0 - clamp( dot( rimNormal, rimView ), 0.0, 1.0 ), uRimPower );
  float rimSide = 0.5 + 0.5 * rimNormal.x * uRimCursor.x;
  gl_FragColor.rgb += uRimColor * rim * uRimStrength * mix( 0.6, 1.4, rimSide );

  // Glitch colour split + scanlines during the burst.
  if ( uGlitch > 0.001 ) {
    float scan = step( 0.6, fract( gl_FragCoord.y * 0.5 ) );
    gl_FragColor.rgb *= 1.0 - scan * uGlitch * 0.15;
    float split = uGlitch * 0.05;
    gl_FragColor.r += gl_FragColor.g * split;
    gl_FragColor.b = mix( gl_FragColor.b, gl_FragColor.r, split );
    gl_FragColor.rgb += vec3( 0.9, 0.1, 0.7 ) * uGlitch * 0.035;
  }
}`,
          );
      };
      material.needsUpdate = true;
    }
  });
}

/**
 * Irregular glitch bursts: two overlapping periodic envelopes of different
 * lengths so the rhythm never feels metronomic. Returns 0..1.
 */
function glitchBurst(t: number, period: number, duration: number, phase: number) {
  const p = (t + phase) % period;
  return p >= 0 && p < duration ? Math.sin((p / duration) * Math.PI) : 0;
}

function heroGlitchAmount(t: number) {
  const a = glitchBurst(t, 8.0, 0.18, -3.4);
  const b = glitchBurst(t, 13.0, 0.26, -7.1);
  return Math.min(1, Math.max(a, b * 0.8));
}

type IdleEntry = {
  bone: THREE.Bone;
  parentWorldQuat: THREE.Quaternion;
  parentLinearInverse: THREE.Matrix3;
  baseLocalQuat: THREE.Quaternion;
  baseLocalPos: THREE.Vector3;
  kind: "head" | "neck" | "eye" | "smile" | "chin";
  sign: number;
};

type PreparedScene = THREE.Group & {
  userData: {
    __heroPrepared?: boolean;
    __heroIdle?: IdleEntry[];
    __heroWaveBase?: Map<THREE.Object3D, THREE.Matrix4>;
    __heroWaveSet?: Set<THREE.Object3D>;
    __heroWavePivot?: THREE.Vector3;
    __heroWaveHand?: THREE.Bone;
    __heroHandParentBindQuat?: THREE.Quaternion;
    __heroRestArmSet?: Set<THREE.Object3D>;
    __heroRestArmPivot?: THREE.Vector3;
  };
};

function collectBones(root: THREE.Object3D) {
  const map: Record<string, THREE.Bone> = {};
  root.traverse((obj) => {
    if ((obj as THREE.Bone).isBone) map[obj.name] = obj as THREE.Bone;
  });
  return map;
}

function aboutPivot(pivot: THREE.Vector3, rotation: THREE.Matrix4) {
  return new THREE.Matrix4()
    .makeTranslation(pivot.x, pivot.y, pivot.z)
    .multiply(rotation)
    .multiply(new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z));
}

/**
 * Rigidly rotate `bones` by `rotation` (a world-space matrix) using a snapshot
 * of their world matrices, so bones in the same chain don't get the rotation
 * applied twice.
 */
function rotateBonesRigid(
  worldSnapshot: Map<THREE.Object3D, THREE.Matrix4>,
  bones: Set<THREE.Object3D>,
  rotation: THREE.Matrix4,
) {
  const desired = new THREE.Matrix4();
  const parentResult = new THREE.Matrix4();
  const local = new THREE.Matrix4();

  for (const bone of bones) {
    const restWorldMat = worldSnapshot.get(bone);
    const parent = bone.parent;
    const restParentWorldMat = parent ? worldSnapshot.get(parent) : undefined;
    if (!restWorldMat || !restParentWorldMat) continue;

    if (bones.has(parent as THREE.Object3D)) {
      parentResult.copy(rotation).multiply(restParentWorldMat);
    } else {
      parentResult.copy(restParentWorldMat);
    }

    desired.copy(rotation).multiply(restWorldMat);
    local.copy(parentResult).invert().multiply(desired);
    local.decompose(bone.position, bone.quaternion, bone.scale);
  }
}

function snapshotWorld(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  const snapshot = new Map<THREE.Object3D, THREE.Matrix4>();
  root.traverse((obj) => snapshot.set(obj, obj.matrixWorld.clone()));
  return snapshot;
}

/**
 * Strip helpers/props, pose the arms and capture idle bones. Guarded so React's
 * StrictMode double-invocation (and remounts) can't apply the pose twice.
 */
function prepareScene(scene: THREE.Group) {
  const prepared = scene as PreparedScene;
  if (prepared.userData.__heroPrepared) return;

  const removals: THREE.Object3D[] = [];
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    const isSkinned = (mesh as THREE.SkinnedMesh).isSkinnedMesh === true;

    if (isSkinned) {
      // Skinned meshes get frustum-culled incorrectly because their bounding
      // boxes ignore the skeleton, so keep them always visible.
      mesh.frustumCulled = false;
      return;
    }

    // Everything else (rig helpers, props, eyeglasses) is discarded.
    removals.push(mesh);
  });
  removals.forEach((mesh) => mesh.parent?.remove(mesh));

  // Add the rim light + glitch shader FX on the remaining (character) meshes.
  applyMaterialFx(scene);

  const bones = collectBones(scene);
  const restWorld = snapshotWorld(scene);

  // 1) Lower the arms out of the T-pose.
  for (const side of ["l", "r"] as const) {
    const set = new Set<THREE.Object3D>();
    ARM_BONES[side].forEach((name) => {
      const bone = bones[sanitizeNodeName(name)];
      if (bone) set.add(bone);
    });
    const angle = side === "l" ? -ARM_DOWN_ANGLE : ARM_DOWN_ANGLE;
    const swing = new THREE.Matrix4()
      .makeRotationX(ARM_FORWARD_TILT)
      .multiply(new THREE.Matrix4().makeRotationZ(angle));
    rotateBonesRigid(restWorld, set, aboutPivot(SHOULDER_PIVOT[side], swing));
  }

  // 2) Bend the elbows slightly forward (around the posed elbow position).
  const posedWorld = snapshotWorld(scene);
  for (const side of ["l", "r"] as const) {
    const elbowName = sanitizeNodeName(`forearm_stretch.${side}`);
    const elbowBone = bones[elbowName];
    if (!elbowBone) continue;

    const posedElbowMat = posedWorld.get(elbowBone);
    if (!posedElbowMat) continue;

    const elbowPivot = new THREE.Vector3().setFromMatrixPosition(posedElbowMat);

    const set = new Set<THREE.Object3D>();
    FOREARM_BONES[side].forEach((name) => {
      const bone = bones[sanitizeNodeName(name)];
      if (bone) set.add(bone);
    });

    rotateBonesRigid(
      posedWorld,
      set,
      aboutPivot(elbowPivot, new THREE.Matrix4().makeRotationX(ELBOW_BEND_ANGLE)),
    );
  }

  scene.updateMatrixWorld(true);

  // Capture bones we want to gently animate at runtime. `baseLocalQuat` is taken
  // *after* posing, so arm entries animate on top of the A-pose.
  const idle: IdleEntry[] = [];
  const scratchPos = new THREE.Vector3();
  const scratchScale = new THREE.Vector3();
  for (const def of IDLE_BONES) {
    const bone = bones[sanitizeNodeName(def.name)];
    if (!bone || !bone.parent) continue;
    const parentWorldMat = restWorld.get(bone.parent);
    if (!parentWorldMat) continue;

    const parentWorldQuat = new THREE.Quaternion();
    parentWorldMat.decompose(scratchPos, parentWorldQuat, scratchScale);
    const parentLinearInverse = new THREE.Matrix3().setFromMatrix4(parentWorldMat).invert();

    idle.push({
      bone,
      parentWorldQuat,
      parentLinearInverse,
      baseLocalQuat: bone.quaternion.clone(),
      baseLocalPos: bone.position.clone(),
      kind: def.kind,
      sign: def.sign,
    });
  }

  prepared.userData.__heroIdle = idle;

  // Snapshot the posed world (A-pose) and the waving arm's bones/pivot, so the
  // runtime wave can rigidly rotate the whole arm around the shoulder.
  const waveBase = snapshotWorld(scene);
  const waveSet = new Set<THREE.Object3D>();
  ARM_BONES[WAVE_SIDE].forEach((name) => {
    const bone = bones[sanitizeNodeName(name)];
    if (bone) waveSet.add(bone);
  });
  prepared.userData.__heroWaveBase = waveBase;
  prepared.userData.__heroWaveSet = waveSet;
  prepared.userData.__heroWavePivot = SHOULDER_PIVOT[WAVE_SIDE].clone();

  // The waving hand + its parent's bind rotation, for the live wrist twist.
  const waveHandBone = bones[sanitizeNodeName(`hand.${WAVE_SIDE}`)];
  prepared.userData.__heroWaveHand = waveHandBone;
  const handParentMat = waveHandBone?.parent ? restWorld.get(waveHandBone.parent) : undefined;
  prepared.userData.__heroHandParentBindQuat = handParentMat
    ? new THREE.Quaternion().setFromRotationMatrix(handParentMat)
    : undefined;

  // The resting (non-waving) arm, for the "distance from body" control.
  const restSet = new Set<THREE.Object3D>();
  ARM_BONES[REST_SIDE].forEach((name) => {
    const bone = bones[sanitizeNodeName(name)];
    if (bone) restSet.add(bone);
  });
  prepared.userData.__heroRestArmSet = restSet;
  prepared.userData.__heroRestArmPivot = SHOULDER_PIVOT[REST_SIDE].clone();

  prepared.userData.__heroPrepared = true;
}

function HeroCharacter({ mode }: { mode: "desktop" | "stage" | "avatar" }) {
  const isStage = mode === "stage";
  const isAvatar = mode === "avatar";
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const pointerSeen = useRef(false);
  const announcedReady = useRef(false);
  const scrollRef = useRef(0);
  // Timestamp of the first rendered frame: the wave clock starts here so the
  // character greets as soon as it appears, instead of waiting a full cycle
  // (the first one would be spent while the model is still loading).
  const waveClock = useRef<number | null>(null);

  const { viewport } = useThree();
  const { scene } = useGLTF(MODEL_URL);

  // Strip helpers / props, pose the arms, then work out the normalisation transform.
  const { center, scale } = useMemo(() => {
    prepareScene(scene);

    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const boxCenter = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    return { center: boxCenter, scale: MODEL_HEIGHT / maxDim };
  }, [scene]);

  const idleBones = (scene as PreparedScene).userData.__heroIdle ?? [];
  const waveBase = (scene as PreparedScene).userData.__heroWaveBase;
  const waveSet = (scene as PreparedScene).userData.__heroWaveSet;
  const wavePivot = (scene as PreparedScene).userData.__heroWavePivot;
  const waveHand = (scene as PreparedScene).userData.__heroWaveHand;
  const handParentBindQuat = (scene as PreparedScene).userData.__heroHandParentBindQuat;
  const restArmSet = (scene as PreparedScene).userData.__heroRestArmSet;
  const restArmPivot = (scene as PreparedScene).userData.__heroRestArmPivot;

  useEffect(() => {
    // The avatar is spun by dragging, so it ignores the cursor and the scroll.
    if (isAvatar) return;

    const handleMouseMove = (event: MouseEvent) => {
      pointerSeen.current = true;
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const startScroll = 50;
      const endScroll = window.innerHeight * 0.7;
      const progress = (window.scrollY - startScroll) / (endScroll - startScroll);
      scrollRef.current = Math.max(0, Math.min(progress, 1));
      heroScroll.value = scrollRef.current;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAvatar]);

  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpQuatB = useMemo(() => new THREE.Quaternion(), []);
  const tmpQuatRes = useMemo(() => new THREE.Quaternion(), []);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const { clock } = state;
    const time = clock.getElapsedTime();
    const scroll = scrollRef.current;
    const group = groupRef.current;
    const p = heroParams;

    if (!group) return;

    // Smoothstep of the hero scroll: 0 in the hero, 1 once fully scrolled away.
    const easeScroll = scroll * scroll * (3 - 2 * scroll);

    // Gaze: follow the cursor when there is one (desktop / hybrid), otherwise
    // drift on a slow idle so the eyes still feel alive on touch-only devices.
    const smooth = smoothRef.current;
    smooth.x += (mouse.current.x - smooth.x) * 0.08;
    smooth.y += (mouse.current.y - smooth.y) * 0.08;
    const autoGazeX = Math.sin(time * 0.42) * 0.6 + Math.sin(time * 0.73 + 1.1) * 0.22;
    const autoGazeY = Math.sin(time * 0.31 + 2.0) * 0.45;
    const gazeX = pointerSeen.current ? smooth.x : autoGazeX;
    const gazeY = pointerSeen.current ? smooth.y : autoGazeY;
    const lookX = THREE.MathUtils.clamp(gazeX * p.eyeFollow, -1, 1);
    const lookY = THREE.MathUtils.clamp(gazeY * p.eyeFollow, -1, 1);

    // Rim light: constant strength with a subtle idle pulse, biased towards the
    // cursor side so it feels connected to the gaze.
    materialFxUniforms.uRimPower.value = p.rimPower;
    materialFxUniforms.uRimStrength.value = p.rimStrength * (0.9 + 0.1 * Math.sin(time * 1.3));
    materialFxUniforms.uRimCursor.value.set(lookX, lookY);

    // Character glitch: short, irregular bursts of vertex tearing. Fades out as
    // the hero scrolls away so it never flashes in the background. The avatar
    // keeps it off entirely: it adds nothing at profile-picture size and costs
    // fragment work on every frame.
    materialFxUniforms.uGlitchTime.value = time;
    materialFxUniforms.uGlitch.value = isAvatar
      ? 0
      : heroGlitchAmount(time) * p.glitchStrength * (1 - easeScroll);

    // Hand wave: lift one arm and swing it, then let it rest, on a loop.
    if (waveBase && waveSet && wavePivot && waveSet.size > 0) {
      if (waveClock.current === null) waveClock.current = time;
      const waveTime = time - waveClock.current;
      const cyclePos = (waveTime % p.wavePeriod) / p.wavePeriod;
      const envelope = cyclePos < p.waveActive ? Math.sin((cyclePos / p.waveActive) * Math.PI) : 0;
      const dir = WAVE_SIDE === "l" ? 1 : -1;
      // Slight secondary harmonic so the swing doesn't read as a metronome.
      const swingWave =
        p.waveAmp *
        (Math.sin(waveTime * p.waveSpeed) + 0.3 * Math.sin(waveTime * p.waveSpeed * 1.6 + 0.5));
      const angle = dir * envelope * (p.waveRaise + swingWave);

      // Raise the arm and tilt it towards the camera.
      const swing = new THREE.Matrix4()
        .makeRotationX(p.waveForward * envelope)
        .multiply(new THREE.Matrix4().makeRotationZ(angle));
      const waveRotation = aboutPivot(wavePivot, swing);
      rotateBonesRigid(waveBase, waveSet, waveRotation);

      // Live wrist twist so the palm faces the camera (roll about the arm axis).
      // It eases from a relaxed value at rest to the salute value when raised.
      if (waveHand && handParentBindQuat) {
        const twistAngle = p.handTwistRest + (p.handTwistWave - p.handTwistRest) * envelope;
        const twist = new THREE.Quaternion().setFromAxisAngle(AXIS_X, twistAngle);
        const localTwist = handParentBindQuat
          .clone()
          .invert()
          .multiply(twist)
          .multiply(handParentBindQuat);
        waveHand.quaternion.premultiply(localTwist);
      }
    }

    // Resting (non-waving) arm: keep it posed with a tunable distance from the
    // body plus a subtle sway.
    if (waveBase && restArmSet && restArmPivot && restArmSet.size > 0) {
      const sideSign = REST_SIDE === "l" ? 1 : -1;
      const angle = heroParams.restArmOut + Math.sin(time * 1.1) * heroParams.armSway * sideSign;
      rotateBonesRigid(
        waveBase,
        restArmSet,
        aboutPivot(restArmPivot, new THREE.Matrix4().makeRotationZ(angle)),
      );
    }

    for (const entry of idleBones) {
      // Eyes: horizontal (world X) slide of the whole eyeball, plus the constant
      // forward offset so it can't sink. Both eyes use the same cursor `lookX/
      // lookY` so they always look towards the same point.
      if (entry.kind === "eye") {
        tmpVec
          .set(lookX * heroParams.eyeShiftX, lookY * heroParams.eyeShiftY, heroParams.eyeOutOffset)
          .applyMatrix3(entry.parentLinearInverse);
        entry.bone.position.copy(entry.baseLocalPos).add(tmpVec);
        continue;
      }

      // Smile: static outward + up offset of the mouth corners.
      if (entry.kind === "smile") {
        tmpVec
          .set(entry.sign * heroParams.smileOut, heroParams.smileUp, 0)
          .applyMatrix3(entry.parentLinearInverse);
        entry.bone.position.copy(entry.baseLocalPos).add(tmpVec);
        continue;
      }

      switch (entry.kind) {
        case "head":
          tmpQuat.setFromAxisAngle(AXIS_Y, lookX * heroParams.headFollowYaw);
          tmpQuatB.setFromAxisAngle(
            AXIS_X,
            -lookY * heroParams.headFollowPitch + Math.sin(time * 1.4) * heroParams.headNod,
          );
          tmpQuat.multiply(tmpQuatB);
          break;
        case "neck":
          tmpQuat.setFromAxisAngle(AXIS_Y, lookX * heroParams.headFollowYaw * 0.5);
          tmpQuatB.setFromAxisAngle(
            AXIS_X,
            -lookY * heroParams.headFollowPitch * 0.5 + Math.sin(time * 0.9) * heroParams.neckSway,
          );
          tmpQuat.multiply(tmpQuatB);
          break;
        case "chin":
          tmpQuat.setFromAxisAngle(AXIS_X, heroParams.chin);
          break;
      }

      // local = parentWorldQuat^-1 * q * parentWorldQuat * baseLocal
      tmpQuatRes
        .copy(entry.parentWorldQuat)
        .invert()
        .multiply(tmpQuat)
        .multiply(entry.parentWorldQuat)
        .multiply(entry.baseLocalQuat);
      entry.bone.quaternion.copy(tmpQuatRes);
    }

    // Placement. Desktop: fixed canvas; the character starts anchored to the
    // right of the hero, then, as the hero scrolls away, shrinks, blurs and
    // becomes a little "puppet" that follows the cursor. Mobile: the canvas
    // lives inside a stage in the hero and simply floats in place. Avatar: a
    // small bust the visitor can spin, easing back to its default view.
    const heroX = isAvatar ? p.avatarX : isStage ? p.stageX : viewport.width * 0.25;
    const heroY = isAvatar
      ? p.avatarY + Math.sin(time * 0.7) * 0.05
      : isStage
        ? p.stageY + Math.sin(time * 0.7) * 0.12
        : p.heroYOffset + Math.sin(time * 0.8) * 0.1;

    // Avatar drag: spin the bust, then ease back once the visitor lets go.
    if (
      isAvatar &&
      !avatarDrag.dragging &&
      performance.now() - avatarDrag.lastInput > AVATAR_RETURN_DELAY
    ) {
      avatarDrag.yaw += (0 - avatarDrag.yaw) * AVATAR_RETURN_EASE;
      avatarDrag.pitch += (0 - avatarDrag.pitch) * AVATAR_RETURN_EASE;
    }

    const breathe = 1.0 + Math.sin(time * 1.6) * 0.006;
    let targetX = heroX;
    let targetY = heroY;
    let targetScale = (isAvatar ? p.avatarScale : p.stageScale) * breathe;
    let targetRotX = p.modelRotX + (isAvatar ? avatarDrag.pitch : 0);
    let targetRotY = p.modelRotY + (isAvatar ? avatarDrag.yaw : 0);

    if (!isStage && !isAvatar) {
      // Scrolled pose: follow the cursor like a puppet / custom pointer.
      const followX = mouse.current.x * viewport.width * p.followPan;
      const followY = mouse.current.y * viewport.height * p.followPan;
      const followRotX = -mouse.current.y * p.followTilt;
      const followRotY = mouse.current.x * p.followTilt;

      targetX = THREE.MathUtils.lerp(heroX, followX, easeScroll);
      targetY = THREE.MathUtils.lerp(heroY, followY, easeScroll);
      targetScale = THREE.MathUtils.lerp(1, p.followScale, easeScroll) * breathe;
      targetRotX = THREE.MathUtils.lerp(p.modelRotX, p.modelRotX + followRotX, easeScroll);
      targetRotY = THREE.MathUtils.lerp(p.modelRotY, p.modelRotY + followRotY, easeScroll);
    }

    group.position.x += (targetX - group.position.x) * 0.1;
    group.position.y += (targetY - group.position.y) * 0.1;

    // While dragging the bust follows the finger exactly; the hero eases more
    // slowly, and the avatar's auto-return uses a gentle lerp.
    const rotLerp = isAvatar ? (avatarDrag.dragging ? 1 : 0.14) : 0.05;
    group.rotation.x += (targetRotX - group.rotation.x) * rotLerp;
    group.rotation.y += (targetRotY - group.rotation.y) * rotLerp;
    group.scale.setScalar(targetScale);

    // First fully-rendered frame with the model in place: release the preloader.
    // (The avatar lives on another route, which has no preloader to release.)
    if (!isAvatar && !announcedReady.current) {
      announcedReady.current = true;
      markHeroModelReady();
    }
  });

  return (
    <group ref={groupRef}>
      <group scale={scale}>
        <group position={[-center.x, -center.y, -center.z]}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

/**
 * Live-tuning panel switch (dev only). Set to `true` to bring back the panel
 * that lets you tweak `heroParams` (desktop + mobile) and copy the values.
 */
const SHOW_HERO_TUNER = false;

type HeroParamKey = keyof typeof heroParams;
const HERO_CONTROLS: Array<{ key: HeroParamKey; min: number; max: number; step: number }> = [
  { key: "handTwistRest", min: -Math.PI * 2, max: Math.PI * 2, step: 0.001 },
  { key: "handTwistWave", min: -Math.PI * 2, max: Math.PI * 2, step: 0.001 },
  { key: "restArmOut", min: -1.2, max: 1.2, step: 0.01 },
  { key: "chin", min: -0.8, max: 0.8, step: 0.005 },
  { key: "waveRaise", min: 0, max: 3, step: 0.01 },
  { key: "waveAmp", min: 0, max: 1.5, step: 0.01 },
  { key: "waveForward", min: -1, max: 1.5, step: 0.01 },
  { key: "waveSpeed", min: 0, max: 20, step: 0.1 },
  { key: "wavePeriod", min: 2, max: 20, step: 0.1 },
  { key: "waveActive", min: 0, max: 1, step: 0.01 },
  { key: "heroYOffset", min: -4, max: 2, step: 0.05 },
  { key: "eyeFollow", min: 0, max: 2, step: 0.01 },
  { key: "eyeShiftX", min: 0, max: 0.6, step: 0.01 },
  { key: "eyeShiftY", min: 0, max: 0.4, step: 0.01 },
  { key: "eyeOutOffset", min: -0.4, max: 0.4, step: 0.01 },
  { key: "headFollowYaw", min: -0.5, max: 0.5, step: 0.01 },
  { key: "headFollowPitch", min: -0.5, max: 0.5, step: 0.01 },
  { key: "modelRotX", min: -Math.PI, max: Math.PI, step: 0.01 },
  { key: "modelRotY", min: -Math.PI, max: Math.PI, step: 0.01 },
  { key: "rimStrength", min: 0, max: 2, step: 0.01 },
  { key: "rimPower", min: 0.5, max: 8, step: 0.1 },
  { key: "glitchStrength", min: 0, max: 1.5, step: 0.01 },
  { key: "stageScale", min: 0, max: 1.6, step: 0.01 },
  { key: "stageX", min: -3, max: 3, step: 0.05 },
  { key: "stageY", min: -3, max: 3, step: 0.05 },
  { key: "followScale", min: 0, max: 1.5, step: 0.01 },
  { key: "followPan", min: 0, max: 1.5, step: 0.01 },
  { key: "followTilt", min: 0, max: 1.5, step: 0.01 },
  { key: "smileOut", min: 0, max: 0.3, step: 0.01 },
  { key: "smileUp", min: 0, max: 0.3, step: 0.01 },
  { key: "headNod", min: 0, max: 0.3, step: 0.01 },
  { key: "neckSway", min: 0, max: 0.3, step: 0.01 },
  { key: "armSway", min: 0, max: 0.3, step: 0.01 },
];

/** Dev-only floating panel for live-tuning `heroParams` (see the copy button). */
function HeroControls() {
  const [, force] = useState(0);
  const [copied, setCopied] = useState(false);

  const setParam = (key: HeroParamKey, value: number) => {
    heroParams[key] = value;
    force((n) => n + 1);
  };

  const copy = () => {
    const body = (Object.keys(heroParams) as HeroParamKey[])
      .map((k) => `  ${k}: ${Number(heroParams[k]).toFixed(4)},`)
      .join("\n");
    navigator.clipboard?.writeText(`const heroParams = {\n${body}\n};`).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      },
      () => {},
    );
  };

  return (
    <div className="pointer-events-auto fixed left-4 top-4 z-[100] max-h-[85vh] w-64 overflow-y-auto rounded-xl border border-white/15 bg-black/80 p-4 text-[11px] text-white shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider">Hero tuner</span>
        <button
          type="button"
          onClick={copy}
          className="rounded bg-orange-500 px-2 py-1 text-[10px] font-semibold text-black"
        >
          {copied ? "¡copiado!" : "Copiar"}
        </button>
      </div>
      {HERO_CONTROLS.map((c) => (
        <label key={c.key} className="mb-1.5 block">
          <span className="flex justify-between">
            <span className="text-white/80">{c.key}</span>
            <span className="font-mono text-orange-300">
              {Number(heroParams[c.key]).toFixed(3)}
            </span>
          </span>
          <input
            type="range"
            min={c.min}
            max={c.max}
            step={c.step}
            value={heroParams[c.key]}
            onChange={(e) => setParam(c.key, parseFloat(e.target.value))}
            className="mt-0.5 w-full accent-orange-500"
          />
        </label>
      ))}
      <p className="mt-2 text-[10px] text-white/50">Ajusta, pulsa "Copiar" y pégame el bloque.</p>
    </div>
  );
}

/**
 * Caps how often the canvas renders by invalidating on a timer. Used on mobile
 * (paired with `frameloop="demand"`) so the low-poly hero runs at a battery-
 * friendly ~30fps instead of an uncapped 60fps on every device pixel.
 */
function FrameLimiter({ enabled, fps }: { enabled: boolean; fps: number }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => invalidate(), 1000 / fps);
    return () => window.clearInterval(id);
  }, [enabled, fps, invalidate]);

  return null;
}

// ---- Hero backdrop: a slow, soft "aurora" behind the character ----
// One large plane with a cheap value-noise fragment shader (a handful of hash
// ops, no extra render targets). It blends over the page because the canvas is
// transparent.
const BACKDROP_Z = -4;

const backdropVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const backdropFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uAnchorX;
  varying vec2 vUv;

  float hash21( vec2 p ) {
    p = fract( p * vec2( 123.34, 345.45 ) );
    p += dot( p, p + 34.345 );
    return fract( p.x * p.y );
  }

  float valueNoise( vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f * f * ( 3.0 - 2.0 * f );
    return mix(
      mix( hash21( i ), hash21( i + vec2( 1.0, 0.0 ) ), u.x ),
      mix( hash21( i + vec2( 0.0, 1.0 ) ), hash21( i + vec2( 1.0, 1.0 ) ), u.x ),
      u.y
    );
  }

  void main() {
    float t = uTime * 0.055;
    float n = valueNoise( vUv * 2.2 + vec2( t, -t * 0.7 ) );
    n += 0.5 * valueNoise( vUv * 4.6 - vec2( t * 1.4, t * 0.9 ) );
    n *= 0.66;
    n = smoothstep( 0.22, 0.8, n );

    // Radial falloff so the glow stays behind the character and melts out.
    float d = distance( vec2( vUv.x, vUv.y * 0.9 ), vec2( uAnchorX, 0.5 ) );
    float mask = smoothstep( 0.62, 0.02, d );

    vec3 col = mix( uColorA, uColorB, n );
    gl_FragColor = vec4( col, mask * ( 0.06 + 0.2 * n ) );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Animated gradient plane behind the character. Sized to cover the frustum at
 * `BACKDROP_Z` and anchored towards the hero's side of the screen.
 */
function HeroBackdrop({ mode }: { mode: "desktop" | "stage" | "avatar" }) {
  const viewport = useThree((s) => s.viewport);
  const camera = useThree((s) => s.camera);

  const factor = (camera.position.z - BACKDROP_Z) / camera.position.z;
  const width = viewport.width * factor;
  const height = viewport.height * factor;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#ff4d00") },
      uColorB: { value: new THREE.Color("#ffb27a") },
      uAnchorX: { value: 0.5 },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
    const anchor = mode === "stage" ? 0 : viewport.width * 0.25;
    uniforms.uAnchorX.value = 0.5 + anchor / width;
  });

  return (
    <mesh position={[0, 0, BACKDROP_Z]} renderOrder={-1}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={backdropVertex}
        fragmentShader={backdropFragment}
        transparent
        depthWrite={false}
        toneMapped
      />
    </mesh>
  );
}

/**
 * Shared scene: studio lighting tuned for the character's PBR materials.
 *
 * `paused` stops the render loop entirely (the tab is scrolled away from the
 * hero) to avoid burning GPU/battery on an invisible canvas.
 */
/**
 * Post-processing chain. Everything merges into a single effect pass. The glitch
 * drives a shared chromatic-aberration offset (wired via refs) so its RGB split
 * actually shows; bloom is desktop-only because it is the expensive one.
 */
function HeroPost({ mode }: { mode: "desktop" | "stage" | "avatar" }) {
  const isStage = mode === "stage";
  const chromaticRef = useRef<ChromaticAberrationEffect | null>(null);
  const glitchRef = useRef<GlitchEffect | null>(null);

  // The glitch effect modulates the chromatic aberration offset; it must be the
  // very same Vector2 instance, which the JSX props can't share.
  useEffect(() => {
    const chromatic = chromaticRef.current;
    const glitch = glitchRef.current;
    if (chromatic && glitch) glitch.chromaticAberrationOffset = chromatic.offset;
  }, []);

  // Switch the fullscreen glitch off as soon as the hero is scrolled away, so it
  // doesn't read as a random flash behind the rest of the page.
  useFrame(() => {
    const glitch = glitchRef.current;
    if (!glitch) return;
    const mode = heroScroll.value > 0.04 ? GlitchMode.DISABLED : GlitchMode.SPORADIC;
    if (glitch.mode !== mode) glitch.mode = mode;
  });

  return (
    <EffectComposer multisampling={isStage ? 2 : 4} enableNormalPass={false} mergeMode="none">
      {isStage ? null : (
        <Bloom
          mipmapBlur
          intensity={0.7}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.25}
          radius={0.6}
          levels={4}
        />
      )}
      <ChromaticAberration ref={chromaticRef} offset={[0, 0]} radialModulation={false} />
      <Glitch
        ref={glitchRef}
        mode={GlitchMode.SPORADIC}
        delay={[7, 15]}
        duration={[0.1, 0.25]}
        strength={isStage ? [0.03, 0.1] : [0.05, 0.18]}
      />
    </EffectComposer>
  );
}

function HeroScene({ mode, paused }: { mode: "desktop" | "stage" | "avatar"; paused: boolean }) {
  const isStage = mode === "stage";
  const isAvatar = mode === "avatar";
  const frameloop = isStage || isAvatar ? "demand" : paused ? "never" : "always";

  return (
    <Canvas
      frameloop={frameloop}
      style={{
        pointerEvents: isAvatar ? "auto" : "none",
        touchAction: isAvatar ? "none" : undefined,
      }}
      camera={{ position: [0, 0, CAMERA_Z], fov: 45 }}
      dpr={isAvatar ? 1 : isStage ? [1, 1.5] : [1, 1.6]}
      gl={{
        // The avatar has no composer, so it relies on plain MSAA instead.
        antialias: isAvatar,
        alpha: true,
        powerPreference: isStage || isAvatar ? "default" : "high-performance",
      }}
    >
      {isStage || isAvatar ? <FrameLimiter enabled={!paused} fps={30} /> : null}

      {/* The avatar is the cheapest variant: no animated backdrop, no
          post-processing, dpr 1 and 24 fps, meant for low-end phones. */}
      {isAvatar ? null : <HeroBackdrop mode={mode} />}

      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} />
      <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#9ec0ff" />
      <directionalLight position={[0, 4, -6]} intensity={1.4} color="#ffbe98" />

      <Suspense fallback={null}>
        <HeroCharacter mode={mode} />
      </Suspense>

      {/* Post-processing: one merged effect pass (desktop + mobile stage). */}
      {isAvatar ? null : <HeroPost mode={mode} />}
    </Canvas>
  );
}

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // `null` until the breakpoint is known on the client, so the WebGL canvas is
  // never part of the server-rendered markup.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  // `null` until we can probe the device. When false, the 3D hero is skipped.
  const [canRender3D, setCanRender3D] = useState<boolean | null>(null);
  // When true the render loop stops (canvas scrolled out of view). Shared by the
  // desktop (scroll progress) and mobile (IntersectionObserver) paths.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const applyPaused = (value: boolean) => {
    if (pausedRef.current === value) return;
    pausedRef.current = value;
    setPaused(value);
  };

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Skip the WebGL hero on constrained devices and connections. The page still
  // reads fine without the character, and we release the preloader immediately
  // so it never waits on a model that will not load.
  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = nav.connection?.saveData === true;
    const slowNetwork = ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "");
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    setCanRender3D(!(reducedMotion || saveData || slowNetwork || lowMemory));
  }, []);

  useEffect(() => {
    if (canRender3D === false) markHeroModelReady();
  }, [canRender3D]);

  useEffect(() => {
    if (!isDesktop) return;

    const updateVisuals = () => {
      if (!containerRef.current) return;

      // Desktop: crisp in hero, blurs as user scrolls down.
      const startScroll = 50;
      const endScroll = window.innerHeight * 0.7;
      let progress = (window.scrollY - startScroll) / (endScroll - startScroll);
      progress = Math.max(0, Math.min(progress, 1));

      const blur = progress * 24;
      const opacity = 1 - progress * 0.6;

      containerRef.current.style.filter = `blur(${blur}px)`;
      containerRef.current.style.opacity = `${opacity}`;
    };

    window.addEventListener("scroll", updateVisuals, { passive: true });
    window.addEventListener("resize", updateVisuals, { passive: true });
    updateVisuals();
    return () => {
      window.removeEventListener("scroll", updateVisuals);
      window.removeEventListener("resize", updateVisuals);
    };
  }, [isDesktop]);

  // Mobile: stop rendering the stage once it leaves the viewport.
  useEffect(() => {
    if (isDesktop !== false) return;
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => applyPaused(!entry.isIntersecting), {
      rootMargin: "160px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  if (isDesktop === null || canRender3D === null) return null;
  if (!canRender3D) return null;

  // Dev tuner is portaled too, so `fixed` works regardless of the router's
  // transform context (it lives inside the hero on mobile).
  const tuner =
    import.meta.env.DEV && SHOW_HERO_TUNER
      ? ReactDOM.createPortal(<HeroControls />, document.body)
      : null;

  // Desktop: full-viewport fixed layer behind the page, blurred on scroll.
  // Portaled to escape the router layout's transform contexts.
  if (isDesktop) {
    return (
      <>
        {ReactDOM.createPortal(
          <div
            ref={containerRef}
            className="pointer-events-none fixed inset-0 z-0 h-full w-full will-change-[filter,opacity]"
            aria-hidden="true"
          >
            <HeroScene mode="desktop" paused={paused} />
          </div>,
          document.body,
        )}
        {tuner}
      </>
    );
  }

  // Mobile: an inline stage inside the hero. It scrolls away with the section
  // (no fixed layer, no blur) and frames the character with mobile params.
  return (
    <>
      <div
        ref={stageRef}
        className="relative -mx-6 mb-4 h-[46svh] min-h-[320px] max-h-[540px] md:hidden"
        aria-hidden="true"
      >
        {/* Soft accent glow behind the character. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0">
          <HeroScene mode="stage" paused={paused} />
        </div>
        {/* Fade the legs into the page background. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-canvas to-transparent" />
      </div>
      {tuner}
    </>
  );
}

/**
 * Avatar variant: the character as the link-in-bio profile picture.
 *
 * The visitor can drag the bust to spin it, and it eases back to its default
 * three-quarter view once they let go. This is the cheapest 3D path in the site
 * (dpr 1, 30 fps, no post-processing, no animated backdrop, paused while
 * off-screen) and it degrades to a static frame of the same character on
 * constrained devices and connections.
 */
export function HeroAvatarCanvas({ className, label }: { className?: string; label?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  // `null` until the device is probed, so the canvas never lands in the SSR markup.
  const [canRender3D, setCanRender3D] = useState<boolean | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const applyPaused = (value: boolean) => {
    if (pausedRef.current === value) return;
    pausedRef.current = value;
    setPaused(value);
  };

  // Same gate as the hero: no WebGL on constrained devices or connections.
  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = nav.connection?.saveData === true;
    const slowNetwork = ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "");
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    setCanRender3D(!(reducedMotion || saveData || slowNetwork || lowMemory));
  }, []);

  // Stop rendering while the avatar is scrolled out of view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || canRender3D !== true || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => applyPaused(!entry.isIntersecting), {
      rootMargin: "120px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [canRender3D]);

  // Drag to spin. The pointer handlers live out here and mutate `avatarDrag`,
  // which the frame loop inside the Canvas reads (same trick as `heroScroll`).
  const pointer = useRef({ id: -1, x: 0, y: 0 });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    avatarDrag.dragging = true;
    avatarDrag.lastInput = performance.now();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!avatarDrag.dragging || pointer.current.id !== event.pointerId) return;
    const dx = event.clientX - pointer.current.x;
    const dy = event.clientY - pointer.current.y;
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    avatarDrag.yaw = THREE.MathUtils.clamp(
      avatarDrag.yaw + dx * 0.013,
      -AVATAR_MAX_YAW,
      AVATAR_MAX_YAW,
    );
    avatarDrag.pitch = THREE.MathUtils.clamp(
      avatarDrag.pitch + dy * 0.008,
      -AVATAR_MAX_PITCH,
      AVATAR_MAX_PITCH,
    );
    avatarDrag.lastInput = performance.now();
  };

  const endDrag = () => {
    if (!avatarDrag.dragging) return;
    avatarDrag.dragging = false;
    avatarDrag.lastInput = performance.now();
  };

  // Constrained device: a still frame of the same character, a few KB instead of
  // the whole 3D pipeline.
  if (canRender3D === false) {
    return (
      <img
        src="/uploads/hero-avatar.webp"
        alt={label ?? "Luis Andrés"}
        className={`${className ?? ""} object-cover`}
        draggable={false}
      />
    );
  }

  return (
    <div
      ref={stageRef}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label={label}
    >
      {canRender3D === true ? <HeroScene mode="avatar" paused={paused} /> : null}
    </div>
  );
}
