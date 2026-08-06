"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  Billboard,
  Edges,
  Html,
  OrbitControls,
  Text,
} from "@react-three/drei";
import { useEffect, useMemo, useState, Suspense } from "react";
import type { Coords, Personality } from "@/data/personalities";
import { publishedFigures } from "@/data/personalities";

const SCALE = 0.045; // map ±100 → ±4.5 world units
const HALF = 4.5; // half-extent of the idea cube

function toPos(c: Coords): [number, number, number] {
  return [c.economic * SCALE, c.authority * SCALE, c.cultural * SCALE];
}

function AxisRod({
  rotation,
  color,
}: {
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <mesh rotation={rotation}>
      <cylinderGeometry args={[0.022, 0.022, HALF * 2 + 1.2, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  );
}

function AxisLines() {
  const len = HALF + 0.7;
  return (
    <group>
      <AxisRod rotation={[0, 0, Math.PI / 2]} color="#c45c26" />
      <AxisRod rotation={[0, 0, 0]} color="#2a6f7a" />
      <AxisRod rotation={[Math.PI / 2, 0, 0]} color="#3d5a80" />

      <Html position={[len + 0.2, 0, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--econ">Markets →</span>
      </Html>
      <Html position={[-len - 0.2, 0, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--econ">← Equality</span>
      </Html>
      <Html position={[0, len + 0.2, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--auth">Authority →</span>
      </Html>
      <Html position={[0, -len - 0.2, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--auth">← Liberty</span>
      </Html>
      <Html position={[0, 0, len + 0.2]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--cult">Particular →</span>
      </Html>
      <Html position={[0, 0, -len - 0.2]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--cult">← Cosmopolitan</span>
      </Html>
    </group>
  );
}

/** Eight translucent octants — very light tints so regions separate without hiding nodes. */
function RegionOctants() {
  const h = HALF;
  const s = HALF; // full octant box size along each axis from 0
  const octants: { pos: [number, number, number]; color: string }[] = [
    // +E +A +C  national-conservative-ish
    { pos: [s / 2, s / 2, s / 2], color: "#c45c26" },
    // +E +A -C
    { pos: [s / 2, s / 2, -s / 2], color: "#b08968" },
    // +E -A +C  market traditional
    { pos: [s / 2, -s / 2, s / 2], color: "#d4a373" },
    // +E -A -C  market libertarian
    { pos: [s / 2, -s / 2, -s / 2], color: "#e9c46a" },
    // -E +A +C  authoritarian left / populist
    { pos: [-s / 2, s / 2, s / 2], color: "#9b2226" },
    // -E +A -C
    { pos: [-s / 2, s / 2, -s / 2], color: "#6a4c93" },
    // -E -A +C
    { pos: [-s / 2, -s / 2, s / 2], color: "#2a6f7a" },
    // -E -A -C  progressive redistributive
    { pos: [-s / 2, -s / 2, -s / 2], color: "#3d5a80" },
  ];

  return (
    <group>
      {octants.map((o) => (
        <mesh key={o.color + o.pos.join(",")} position={o.pos}>
          <boxGeometry args={[h - 0.02, h - 0.02, h - 0.02]} />
          <meshBasicMaterial
            color={o.color}
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* Outer wire cube for the ±100 bounds */}
      <mesh>
        <boxGeometry args={[h * 2, h * 2, h * 2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges threshold={15} color="#8a9aab" />
      </mesh>
    </group>
  );
}

function GridPlanes() {
  return (
    <group>
      {/* Floor = Economic × Cultural at Authority=0 */}
      <gridHelper
        args={[HALF * 2, 8, "#b8c4d0", "#dce3ea"]}
        position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[HALF * 2, HALF * 2]} />
        <meshBasicMaterial color="#e8edf2" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  );
}

function DepthStem({ pos }: { pos: [number, number, number] }) {
  const height = Math.max(Math.abs(pos[1]), 0.05);
  const midY = pos[1] / 2;
  return (
    <group>
      {/* Vertical stem toward Authority=0 plane */}
      <mesh position={[pos[0], midY, pos[2]]}>
        <cylinderGeometry args={[0.012, 0.012, height, 6]} />
        <meshBasicMaterial color="#9aabbc" transparent opacity={0.35} />
      </mesh>
      {/* Floor footprint */}
      <mesh position={[pos[0], 0.01, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#0f1c2e" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PersonNode({
  person,
  selected,
  onSelect,
  dimmed,
  showLabel,
}: {
  person: Personality;
  selected: boolean;
  onSelect: (p: Personality) => void;
  dimmed?: boolean;
  showLabel: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = toPos(person.coords);
  const conf =
    person.confidence === "high" ? 0.2 : person.confidence === "medium" ? 0.16 : 0.12;
  const color = selected || hovered ? "#c45c26" : "#0f1c2e";
  const labelOn = showLabel || hovered || selected;

  return (
    <group>
      <DepthStem pos={pos} />
      <group position={pos}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(person);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[conf, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={selected || hovered ? "#c45c26" : "#000000"}
            emissiveIntensity={selected || hovered ? 0.35 : 0}
            transparent
            opacity={dimmed ? 0.22 : 0.95}
            roughness={0.35}
            metalness={0.12}
          />
        </mesh>
        {labelOn && (
          <Billboard follow>
            <Text
              fontSize={hovered || selected ? 0.26 : 0.18}
              color="#0f1c2e"
              anchorX="center"
              anchorY="bottom"
              position={[0, conf + 0.14, 0]}
              outlineWidth={0.018}
              outlineColor="#f4f7fa"
              fillOpacity={dimmed ? 0.35 : 1}
            >
              {person.shortName}
            </Text>
          </Billboard>
        )}
      </group>
    </group>
  );
}

function UserNode({ coords }: { coords: Coords }) {
  const pos = toPos(coords);
  return (
    <group>
      <DepthStem pos={pos} />
      <group position={pos}>
        <mesh>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial
            color="#c45c26"
            emissive="#c45c26"
            emissiveIntensity={0.45}
            roughness={0.25}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial color="#c45c26" transparent opacity={0.14} depthWrite={false} />
        </mesh>
        <Billboard follow>
          <Text
            fontSize={0.3}
            color="#c45c26"
            anchorX="center"
            anchorY="bottom"
            position={[0, 0.5, 0]}
            outlineWidth={0.022}
            outlineColor="#f4f7fa"
          >
            You
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

export type PoliticalGraph3DProps = {
  personalities?: Personality[];
  userCoords?: Coords | null;
  selectedId?: string | null;
  highlightIds?: string[];
  onSelect?: (p: Personality | null) => void;
  className?: string;
};

type ViewPreset = "orbit" | "xy" | "xz" | "yz";

const PRESET_CAMERA: Record<ViewPreset, [number, number, number]> = {
  orbit: [14, 10, 14],
  xy: [0, 0, 22], // Economic × Authority (looking along Cultural)
  xz: [0, 22, 0], // Economic × Cultural (looking along Authority)
  yz: [22, 0, 0], // Authority × Cultural (looking along Economic)
};

function Scene({
  list,
  userCoords,
  selectedId,
  highlightIds,
  onSelect,
  view,
}: {
  list: Personality[];
  userCoords?: Coords | null;
  selectedId?: string | null;
  highlightIds?: string[];
  onSelect?: (p: Personality | null) => void;
  view: ViewPreset;
}) {
  const highlightSet = useMemo(
    () => new Set(highlightIds ?? []),
    [highlightIds],
  );
  const hasHighlight = highlightSet.size > 0;
  const showAllLabels = list.length <= 24 || hasHighlight;

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[8, 10, 5]} intensity={0.95} />
      <directionalLight position={[-5, -2, -6]} intensity={0.3} />
      <RegionOctants />
      <GridPlanes />
      <AxisLines />
      {list.map((p) => (
        <PersonNode
          key={p.id}
          person={p}
          selected={selectedId === p.id}
          dimmed={hasHighlight && !highlightSet.has(p.id) && selectedId !== p.id}
          showLabel={showAllLabels ? !hasHighlight || highlightSet.has(p.id) : false}
          onSelect={(person) => onSelect?.(person)}
        />
      ))}
      {userCoords && <UserNode coords={userCoords} />}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={32}
        maxPolarAngle={Math.PI * 0.92}
        autoRotate={view === "orbit" && !selectedId && !userCoords}
        autoRotateSpeed={0.22}
      />
      <CameraRig view={view} />
    </>
  );
}

function CameraRig({ view }: { view: ViewPreset }) {
  const { camera, controls } = useThree();
  useEffect(() => {
    const [x, y, z] = PRESET_CAMERA[view];
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    // Reset orbit target if controls present
    const c = controls as { target?: { set: (x: number, y: number, z: number) => void }; update?: () => void } | null;
    c?.target?.set(0, 0, 0);
    c?.update?.();
  }, [view, camera, controls]);
  return null;
}

export function PoliticalGraph3D({
  personalities = publishedFigures(),
  userCoords,
  selectedId,
  highlightIds,
  onSelect,
  className,
}: PoliticalGraph3DProps) {
  const [view, setView] = useState<ViewPreset>("orbit");

  return (
    <div className={className ?? "graph-canvas"}>
      <div className="graph-view-bar" role="toolbar" aria-label="Graph views">
        {(
          [
            ["orbit", "3D"],
            ["xy", "E×A"],
            ["xz", "E×C"],
            ["yz", "A×C"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={view === id ? "is-on" : ""}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="graph-hint" aria-hidden>
        Scroll to zoom out · drag to orbit · click a node
      </div>
      <Canvas
        camera={{ position: PRESET_CAMERA.orbit, fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onSelect?.(null)}
      >
        <Suspense fallback={null}>
          <Scene
            list={personalities}
            userCoords={userCoords}
            selectedId={selectedId}
            highlightIds={highlightIds}
            onSelect={onSelect}
            view={view}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
