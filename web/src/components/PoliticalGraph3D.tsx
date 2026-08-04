"use client";

import { Canvas } from "@react-three/fiber";
import {
  Billboard,
  Html,
  OrbitControls,
  Text,
} from "@react-three/drei";
import { useMemo, useState, Suspense } from "react";
import type { Coords, Personality } from "@/data/personalities";
import { personalities as allPersonalities } from "@/data/personalities";

const SCALE = 0.045; // map ±100 → ±4.5 world units

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
      <cylinderGeometry args={[0.018, 0.018, 10.4, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function AxisLines() {
  const len = 5.2;
  return (
    <group>
      <AxisRod rotation={[0, 0, Math.PI / 2]} color="#c45c26" />
      <AxisRod rotation={[0, 0, 0]} color="#2a6f7a" />
      <AxisRod rotation={[Math.PI / 2, 0, 0]} color="#3d5a80" />

      <Html position={[len + 0.35, 0, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--econ">Markets →</span>
      </Html>
      <Html position={[-len - 0.35, 0, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--econ">← Equality</span>
      </Html>
      <Html position={[0, len + 0.35, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--auth">Authority →</span>
      </Html>
      <Html position={[0, -len - 0.35, 0]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--auth">← Liberty</span>
      </Html>
      <Html position={[0, 0, len + 0.35]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--cult">Particular →</span>
      </Html>
      <Html position={[0, 0, -len - 0.35]} center style={{ pointerEvents: "none" }}>
        <span className="axis-tag axis-tag--cult">← Cosmopolitan</span>
      </Html>
    </group>
  );
}

function GridPlanes() {
  return (
    <group>
      <gridHelper args={[10, 10, "#9aabbc", "#d5dde6"]} position={[0, 0, 0]} rotation={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#e8edf2" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function PersonNode({
  person,
  selected,
  onSelect,
  dimmed,
}: {
  person: Personality;
  selected: boolean;
  onSelect: (p: Personality) => void;
  dimmed?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = toPos(person.coords);
  const conf =
    person.confidence === "high" ? 0.22 : person.confidence === "medium" ? 0.17 : 0.13;
  const color = selected || hovered ? "#c45c26" : "#0f1c2e";

  return (
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
          emissive={selected ? "#c45c26" : "#000000"}
          emissiveIntensity={selected ? 0.35 : 0}
          transparent
          opacity={dimmed ? 0.25 : 0.92}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>
      {(hovered || selected) && (
        <Billboard follow>
          <Text
            fontSize={0.28}
            color="#0f1c2e"
            anchorX="center"
            anchorY="bottom"
            position={[0, conf + 0.2, 0]}
            outlineWidth={0.02}
            outlineColor="#f4f7fa"
          >
            {person.shortName}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function UserNode({ coords }: { coords: Coords }) {
  const pos = toPos(coords);
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#c45c26"
          emissive="#c45c26"
          emissiveIntensity={0.45}
          roughness={0.25}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial color="#c45c26" transparent opacity={0.15} />
      </mesh>
      <Billboard follow>
        <Text
          fontSize={0.32}
          color="#c45c26"
          anchorX="center"
          anchorY="bottom"
          position={[0, 0.55, 0]}
          outlineWidth={0.025}
          outlineColor="#f4f7fa"
        >
          You
        </Text>
      </Billboard>
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

function Scene({
  list,
  userCoords,
  selectedId,
  highlightIds,
  onSelect,
}: {
  list: Personality[];
  userCoords?: Coords | null;
  selectedId?: string | null;
  highlightIds?: string[];
  onSelect?: (p: Personality | null) => void;
}) {
  const highlightSet = useMemo(
    () => new Set(highlightIds ?? []),
    [highlightIds],
  );
  const hasHighlight = highlightSet.size > 0;

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} />
      <directionalLight position={[-4, -2, -6]} intensity={0.35} />
      <GridPlanes />
      <AxisLines />
      {list.map((p) => (
        <PersonNode
          key={p.id}
          person={p}
          selected={selectedId === p.id}
          dimmed={hasHighlight && !highlightSet.has(p.id) && selectedId !== p.id}
          onSelect={(person) => onSelect?.(person)}
        />
      ))}
      {userCoords && <UserNode coords={userCoords} />}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={18}
        autoRotate={!selectedId && !userCoords}
        autoRotateSpeed={0.35}
      />
    </>
  );
}

export function PoliticalGraph3D({
  personalities = allPersonalities,
  userCoords,
  selectedId,
  highlightIds,
  onSelect,
  className,
}: PoliticalGraph3DProps) {
  return (
    <div className={className ?? "graph-canvas"}>
      <Canvas
        camera={{ position: [7.5, 5.5, 7.5], fov: 42 }}
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
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
