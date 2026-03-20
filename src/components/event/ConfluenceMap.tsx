import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Briefcase, DollarSign, Calendar, Linkedin, Instagram, X as XIcon, User, Globe } from "lucide-react";
import { statePathData, stateCentroids } from "./usStatePaths";
import { memberAbbrs, getStateOffice, stateColors, stateIcons, type StateOffice, type IconType } from "./confluenceData";
import { useEditableTextContext } from "../EditableTextProvider";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

/* ── Rich illustrated SVG icons (much larger, detailed) ── */
const ActivityIcon = ({ type, x, y, size = 50 }: { type: IconType; x: number; y: number; size?: number }) => {
  const s = size;
  const hs = s / 2;
  const white = (a: number) => `rgba(255,255,255,${a})`;

  switch (type) {
    case "mountains":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Back mountain */}
          <polygon points={`${s * 0.1},${s} ${s * 0.45},${s * 0.15} ${s * 0.8},${s}`} fill={white(0.25)} />
          {/* Front mountain */}
          <polygon points={`${s * 0.25},${s} ${s * 0.55},${s * 0.05} ${s * 0.95},${s}`} fill={white(0.4)} />
          {/* Snow cap */}
          <polygon points={`${s * 0.55},${s * 0.05} ${s * 0.48},${s * 0.2} ${s * 0.55},${s * 0.18} ${s * 0.62},${s * 0.2}`} fill={white(0.7)} />
          {/* Small snow cap on back mountain */}
          <polygon points={`${s * 0.45},${s * 0.15} ${s * 0.4},${s * 0.25} ${s * 0.45},${s * 0.23} ${s * 0.5},${s * 0.25}`} fill={white(0.55)} />
        </g>
      );
    case "skiing":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Slope */}
          <polygon points={`0,${s * 0.6} ${s},${s} 0,${s}`} fill={white(0.15)} />
          {/* Skier body */}
          <circle cx={s * 0.4} cy={s * 0.3} r={s * 0.07} fill={white(0.6)} />
          <line x1={s * 0.4} y1={s * 0.37} x2={s * 0.4} y2={s * 0.58} stroke={white(0.6)} strokeWidth={2} />
          {/* Legs in ski position */}
          <line x1={s * 0.4} y1={s * 0.58} x2={s * 0.3} y2={s * 0.72} stroke={white(0.6)} strokeWidth={1.8} />
          <line x1={s * 0.4} y1={s * 0.58} x2={s * 0.55} y2={s * 0.72} stroke={white(0.6)} strokeWidth={1.8} />
          {/* Skis */}
          <line x1={s * 0.2} y1={s * 0.72} x2={s * 0.45} y2={s * 0.72} stroke={white(0.5)} strokeWidth={2} />
          <line x1={s * 0.45} y1={s * 0.72} x2={s * 0.7} y2={s * 0.72} stroke={white(0.5)} strokeWidth={2} />
          {/* Poles */}
          <line x1={s * 0.35} y1={s * 0.42} x2={s * 0.2} y2={s * 0.65} stroke={white(0.4)} strokeWidth={1} />
          <line x1={s * 0.45} y1={s * 0.42} x2={s * 0.6} y2={s * 0.65} stroke={white(0.4)} strokeWidth={1} />
        </g>
      );
    case "trees":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Tree 1 (tall) */}
          <polygon points={`${s * 0.3},${s * 0.1} ${s * 0.15},${s * 0.55} ${s * 0.45},${s * 0.55}`} fill={white(0.35)} />
          <polygon points={`${s * 0.3},${s * 0.25} ${s * 0.18},${s * 0.65} ${s * 0.42},${s * 0.65}`} fill={white(0.3)} />
          <rect x={s * 0.27} y={s * 0.65} width={s * 0.06} height={s * 0.15} fill={white(0.4)} />
          {/* Tree 2 (shorter) */}
          <polygon points={`${s * 0.7},${s * 0.25} ${s * 0.55},${s * 0.6} ${s * 0.85},${s * 0.6}`} fill={white(0.3)} />
          <polygon points={`${s * 0.7},${s * 0.38} ${s * 0.58},${s * 0.7} ${s * 0.82},${s * 0.7}`} fill={white(0.25)} />
          <rect x={s * 0.67} y={s * 0.7} width={s * 0.06} height={s * 0.12} fill={white(0.35)} />
        </g>
      );
    case "fishing":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Water waves */}
          <path d={`M0,${s * 0.7} Q${s * 0.15},${s * 0.62} ${s * 0.3},${s * 0.7} Q${s * 0.45},${s * 0.78} ${s * 0.6},${s * 0.7} Q${s * 0.75},${s * 0.62} ${s},${s * 0.7}`} fill="none" stroke={white(0.3)} strokeWidth={2} />
          <path d={`M0,${s * 0.8} Q${s * 0.2},${s * 0.72} ${s * 0.4},${s * 0.8} Q${s * 0.6},${s * 0.88} ${s * 0.8},${s * 0.8} Q${s * 0.9},${s * 0.72} ${s},${s * 0.8}`} fill="none" stroke={white(0.2)} strokeWidth={1.5} />
          {/* Rod */}
          <line x1={s * 0.3} y1={s * 0.65} x2={s * 0.7} y2={s * 0.1} stroke={white(0.5)} strokeWidth={1.5} />
          {/* Line */}
          <path d={`M${s * 0.7},${s * 0.1} Q${s * 0.85},${s * 0.3} ${s * 0.75},${s * 0.55}`} fill="none" stroke={white(0.35)} strokeWidth={0.8} />
          {/* Fish */}
          <ellipse cx={s * 0.75} cy={s * 0.58} rx={s * 0.08} ry={s * 0.04} fill={white(0.45)} />
        </g>
      );
    case "kayak":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Water */}
          <path d={`M0,${s * 0.65} Q${s * 0.25},${s * 0.55} ${s * 0.5},${s * 0.65} Q${s * 0.75},${s * 0.75} ${s},${s * 0.65}`} fill="none" stroke={white(0.25)} strokeWidth={2} />
          {/* Kayak hull */}
          <path d={`M${s * 0.1},${s * 0.5} Q${s * 0.5},${s * 0.38} ${s * 0.9},${s * 0.5} Q${s * 0.5},${s * 0.58} ${s * 0.1},${s * 0.5}`} fill={white(0.35)} />
          {/* Paddler */}
          <circle cx={s * 0.5} cy={s * 0.32} r={s * 0.06} fill={white(0.5)} />
          <line x1={s * 0.5} y1={s * 0.38} x2={s * 0.5} y2={s * 0.48} stroke={white(0.5)} strokeWidth={1.5} />
          {/* Paddle */}
          <line x1={s * 0.3} y1={s * 0.35} x2={s * 0.7} y2={s * 0.55} stroke={white(0.45)} strokeWidth={1.5} />
          <ellipse cx={s * 0.28} cy={s * 0.34} rx={s * 0.04} ry={s * 0.02} fill={white(0.5)} transform={`rotate(-20,${s * 0.28},${s * 0.34})`} />
          <ellipse cx={s * 0.72} cy={s * 0.56} rx={s * 0.04} ry={s * 0.02} fill={white(0.5)} transform={`rotate(-20,${s * 0.72},${s * 0.56})`} />
        </g>
      );
    case "hiking":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Hiker */}
          <circle cx={s * 0.45} cy={s * 0.15} r={s * 0.08} fill={white(0.5)} />
          <line x1={s * 0.45} y1={s * 0.23} x2={s * 0.45} y2={s * 0.5} stroke={white(0.5)} strokeWidth={2} />
          <line x1={s * 0.45} y1={s * 0.5} x2={s * 0.35} y2={s * 0.7} stroke={white(0.5)} strokeWidth={1.8} />
          <line x1={s * 0.45} y1={s * 0.5} x2={s * 0.55} y2={s * 0.7} stroke={white(0.5)} strokeWidth={1.8} />
          {/* Arms */}
          <line x1={s * 0.45} y1={s * 0.32} x2={s * 0.3} y2={s * 0.45} stroke={white(0.45)} strokeWidth={1.5} />
          <line x1={s * 0.45} y1={s * 0.32} x2={s * 0.62} y2={s * 0.42} stroke={white(0.45)} strokeWidth={1.5} />
          {/* Walking stick */}
          <line x1={s * 0.62} y1={s * 0.42} x2={s * 0.7} y2={s * 0.75} stroke={white(0.4)} strokeWidth={1.2} />
          {/* Trail/ground */}
          <path d={`M${s * 0.1},${s * 0.78} Q${s * 0.5},${s * 0.72} ${s * 0.9},${s * 0.78}`} fill="none" stroke={white(0.25)} strokeWidth={1.5} />
        </g>
      );
    case "wildlife":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Deer/elk body */}
          <ellipse cx={s * 0.5} cy={s * 0.5} rx={s * 0.22} ry={s * 0.14} fill={white(0.35)} />
          {/* Head */}
          <circle cx={s * 0.75} cy={s * 0.35} r={s * 0.08} fill={white(0.4)} />
          {/* Neck */}
          <line x1={s * 0.68} y1={s * 0.42} x2={s * 0.72} y2={s * 0.38} stroke={white(0.35)} strokeWidth={3} />
          {/* Antlers */}
          <path d={`M${s * 0.78},${s * 0.28} L${s * 0.82},${s * 0.15} L${s * 0.88},${s * 0.2}`} fill="none" stroke={white(0.5)} strokeWidth={1.2} />
          <path d={`M${s * 0.72},${s * 0.28} L${s * 0.68},${s * 0.15} L${s * 0.62},${s * 0.2}`} fill="none" stroke={white(0.5)} strokeWidth={1.2} />
          {/* Legs */}
          <line x1={s * 0.35} y1={s * 0.6} x2={s * 0.35} y2={s * 0.78} stroke={white(0.35)} strokeWidth={1.5} />
          <line x1={s * 0.45} y1={s * 0.6} x2={s * 0.45} y2={s * 0.78} stroke={white(0.35)} strokeWidth={1.5} />
          <line x1={s * 0.55} y1={s * 0.6} x2={s * 0.55} y2={s * 0.78} stroke={white(0.35)} strokeWidth={1.5} />
          <line x1={s * 0.65} y1={s * 0.6} x2={s * 0.65} y2={s * 0.78} stroke={white(0.35)} strokeWidth={1.5} />
        </g>
      );
    case "surfing":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Wave */}
          <path d={`M0,${s * 0.55} Q${s * 0.2},${s * 0.35} ${s * 0.4},${s * 0.45} Q${s * 0.55},${s * 0.5} ${s * 0.7},${s * 0.4} Q${s * 0.85},${s * 0.32} ${s},${s * 0.45}`} fill={white(0.2)} />
          <path d={`M0,${s * 0.7} Q${s * 0.3},${s * 0.58} ${s * 0.5},${s * 0.65} Q${s * 0.7},${s * 0.72} ${s},${s * 0.62}`} fill="none" stroke={white(0.25)} strokeWidth={2} />
          {/* Surfboard */}
          <ellipse cx={s * 0.5} cy={s * 0.52} rx={s * 0.18} ry={s * 0.03} fill={white(0.45)} transform={`rotate(-10,${s * 0.5},${s * 0.52})`} />
          {/* Surfer */}
          <circle cx={s * 0.5} cy={s * 0.35} r={s * 0.05} fill={white(0.5)} />
          <line x1={s * 0.5} y1={s * 0.4} x2={s * 0.5} y2={s * 0.5} stroke={white(0.5)} strokeWidth={1.5} />
        </g>
      );
    case "lighthouse":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Tower */}
          <polygon points={`${s * 0.4},${s * 0.15} ${s * 0.35},${s * 0.75} ${s * 0.65},${s * 0.75} ${s * 0.6},${s * 0.15}`} fill={white(0.4)} />
          {/* Stripes */}
          <rect x={s * 0.38} y={s * 0.3} width={s * 0.24} height={s * 0.08} fill={white(0.2)} />
          <rect x={s * 0.37} y={s * 0.5} width={s * 0.26} height={s * 0.08} fill={white(0.2)} />
          {/* Light dome */}
          <rect x={s * 0.38} y={s * 0.08} width={s * 0.24} height={s * 0.07} fill={white(0.55)} rx={2} />
          {/* Light beams */}
          <line x1={s * 0.38} y1={s * 0.11} x2={s * 0.15} y2={s * 0.05} stroke={white(0.3)} strokeWidth={1} />
          <line x1={s * 0.62} y1={s * 0.11} x2={s * 0.85} y2={s * 0.05} stroke={white(0.3)} strokeWidth={1} />
          {/* Base */}
          <rect x={s * 0.3} y={s * 0.75} width={s * 0.4} height={s * 0.08} fill={white(0.35)} />
        </g>
      );
    case "canoe":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Canoe */}
          <path d={`M${s * 0.05},${s * 0.5} Q${s * 0.5},${s * 0.35} ${s * 0.95},${s * 0.5} Q${s * 0.5},${s * 0.6} ${s * 0.05},${s * 0.5}`} fill={white(0.35)} />
          {/* Paddler */}
          <circle cx={s * 0.5} cy={s * 0.3} r={s * 0.06} fill={white(0.5)} />
          <line x1={s * 0.5} y1={s * 0.36} x2={s * 0.5} y2={s * 0.46} stroke={white(0.5)} strokeWidth={1.5} />
          {/* Paddle */}
          <line x1={s * 0.35} y1={s * 0.3} x2={s * 0.65} y2={s * 0.55} stroke={white(0.4)} strokeWidth={1.2} />
          {/* Water */}
          <path d={`M0,${s * 0.65} Q${s * 0.25},${s * 0.58} ${s * 0.5},${s * 0.65} Q${s * 0.75},${s * 0.72} ${s},${s * 0.65}`} fill="none" stroke={white(0.2)} strokeWidth={1.5} />
        </g>
      );
    case "desert":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Sun */}
          <circle cx={s * 0.75} cy={s * 0.18} r={s * 0.08} fill={white(0.35)} />
          {/* Cactus */}
          <rect x={s * 0.35} y={s * 0.2} width={s * 0.08} height={s * 0.55} rx={3} fill={white(0.4)} />
          {/* Arms */}
          <path d={`M${s * 0.35},${s * 0.4} L${s * 0.2},${s * 0.4} L${s * 0.2},${s * 0.28}`} fill="none" stroke={white(0.4)} strokeWidth={s * 0.06} strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${s * 0.43},${s * 0.5} L${s * 0.58},${s * 0.5} L${s * 0.58},${s * 0.35}`} fill="none" stroke={white(0.4)} strokeWidth={s * 0.06} strokeLinecap="round" strokeLinejoin="round" />
          {/* Ground */}
          <path d={`M0,${s * 0.82} Q${s * 0.5},${s * 0.75} ${s},${s * 0.82}`} fill="none" stroke={white(0.2)} strokeWidth={1.5} />
        </g>
      );
    case "lake":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Mountains behind lake */}
          <polygon points={`0,${s * 0.5} ${s * 0.3},${s * 0.15} ${s * 0.5},${s * 0.5}`} fill={white(0.2)} />
          <polygon points={`${s * 0.3},${s * 0.5} ${s * 0.65},${s * 0.1} ${s},${s * 0.5}`} fill={white(0.25)} />
          {/* Lake */}
          <ellipse cx={s * 0.5} cy={s * 0.6} rx={s * 0.45} ry={s * 0.15} fill={white(0.2)} />
          {/* Ripples */}
          <path d={`M${s * 0.25},${s * 0.58} Q${s * 0.5},${s * 0.52} ${s * 0.75},${s * 0.58}`} fill="none" stroke={white(0.3)} strokeWidth={1} />
          <path d={`M${s * 0.3},${s * 0.65} Q${s * 0.5},${s * 0.6} ${s * 0.7},${s * 0.65}`} fill="none" stroke={white(0.25)} strokeWidth={0.8} />
        </g>
      );
    case "camping":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Tent */}
          <polygon points={`${s * 0.15},${s * 0.7} ${s * 0.5},${s * 0.2} ${s * 0.85},${s * 0.7}`} fill={white(0.35)} stroke={white(0.5)} strokeWidth={1} />
          {/* Tent opening */}
          <polygon points={`${s * 0.42},${s * 0.7} ${s * 0.5},${s * 0.45} ${s * 0.58},${s * 0.7}`} fill={white(0.15)} />
          {/* Flag */}
          <line x1={s * 0.5} y1={s * 0.2} x2={s * 0.5} y2={s * 0.08} stroke={white(0.5)} strokeWidth={1} />
          <polygon points={`${s * 0.5},${s * 0.08} ${s * 0.62},${s * 0.12} ${s * 0.5},${s * 0.16}`} fill={white(0.45)} />
          {/* Trees beside tent */}
          <polygon points={`${s * 0.05},${s * 0.7} ${s * 0.1},${s * 0.35} ${s * 0.15},${s * 0.7}`} fill={white(0.25)} />
          <polygon points={`${s * 0.85},${s * 0.7} ${s * 0.9},${s * 0.4} ${s * 0.95},${s * 0.7}`} fill={white(0.25)} />
        </g>
      );
    case "biking":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Back wheel */}
          <circle cx={s * 0.28} cy={s * 0.6} r={s * 0.16} fill="none" stroke={white(0.4)} strokeWidth={2} />
          {/* Front wheel */}
          <circle cx={s * 0.72} cy={s * 0.6} r={s * 0.16} fill="none" stroke={white(0.4)} strokeWidth={2} />
          {/* Frame */}
          <polygon points={`${s * 0.28},${s * 0.6} ${s * 0.5},${s * 0.35} ${s * 0.72},${s * 0.6}`} fill="none" stroke={white(0.45)} strokeWidth={1.8} />
          <line x1={s * 0.28} y1={s * 0.6} x2={s * 0.55} y2={s * 0.6} stroke={white(0.45)} strokeWidth={1.8} />
          <line x1={s * 0.55} y1={s * 0.6} x2={s * 0.72} y2={s * 0.6} stroke={white(0.45)} strokeWidth={1.8} />
          {/* Handlebars */}
          <line x1={s * 0.68} y1={s * 0.48} x2={s * 0.75} y2={s * 0.38} stroke={white(0.4)} strokeWidth={1.5} />
          {/* Seat */}
          <line x1={s * 0.48} y1={s * 0.35} x2={s * 0.55} y2={s * 0.32} stroke={white(0.5)} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );
    case "climbing":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Rock wall */}
          <polygon points={`${s * 0.3},${s} ${s * 0.35},${s * 0.05} ${s * 0.7},${s * 0.05} ${s * 0.75},${s}`} fill={white(0.2)} />
          {/* Climber */}
          <circle cx={s * 0.5} cy={s * 0.35} r={s * 0.06} fill={white(0.55)} />
          <line x1={s * 0.5} y1={s * 0.41} x2={s * 0.5} y2={s * 0.58} stroke={white(0.55)} strokeWidth={1.8} />
          <line x1={s * 0.5} y1={s * 0.58} x2={s * 0.42} y2={s * 0.72} stroke={white(0.5)} strokeWidth={1.5} />
          <line x1={s * 0.5} y1={s * 0.58} x2={s * 0.58} y2={s * 0.68} stroke={white(0.5)} strokeWidth={1.5} />
          {/* Arms reaching */}
          <line x1={s * 0.5} y1={s * 0.45} x2={s * 0.6} y2={s * 0.32} stroke={white(0.5)} strokeWidth={1.5} />
          <line x1={s * 0.5} y1={s * 0.45} x2={s * 0.38} y2={s * 0.38} stroke={white(0.5)} strokeWidth={1.5} />
          {/* Holds */}
          <circle cx={s * 0.42} cy={s * 0.25} r={2} fill={white(0.4)} />
          <circle cx={s * 0.62} cy={s * 0.5} r={2} fill={white(0.4)} />
          <circle cx={s * 0.38} cy={s * 0.65} r={2} fill={white(0.4)} />
        </g>
      );
    case "snowboard":
      return (
        <g transform={`translate(${x - hs},${y - hs})`}>
          {/* Slope */}
          <polygon points={`0,${s * 0.5} ${s},${s} 0,${s}`} fill={white(0.12)} />
          {/* Snowboarder body */}
          <circle cx={s * 0.45} cy={s * 0.25} r={s * 0.07} fill={white(0.55)} />
          <line x1={s * 0.45} y1={s * 0.32} x2={s * 0.45} y2={s * 0.52} stroke={white(0.55)} strokeWidth={2} />
          {/* Board */}
          <rect x={s * 0.3} y={s * 0.56} width={s * 0.35} height={s * 0.05} rx={3} fill={white(0.45)} transform={`rotate(-15,${s * 0.45},${s * 0.58})`} />
          {/* Arms out for balance */}
          <line x1={s * 0.45} y1={s * 0.38} x2={s * 0.28} y2={s * 0.32} stroke={white(0.45)} strokeWidth={1.5} />
          <line x1={s * 0.45} y1={s * 0.38} x2={s * 0.62} y2={s * 0.32} stroke={white(0.45)} strokeWidth={1.5} />
          {/* Snow spray */}
          <circle cx={s * 0.65} cy={s * 0.62} r={2} fill={white(0.3)} />
          <circle cx={s * 0.72} cy={s * 0.58} r={1.5} fill={white(0.25)} />
        </g>
      );
    default:
      return null;
  }
};

const ConfluenceMap = () => {
  const [selectedState, setSelectedState] = useState<StateOffice | null>(null);
  const [hoveredAbbr, setHoveredAbbr] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { settings, isAdmin, setSetting } = useEditableTextContext();

  // Click outside to close
  useEffect(() => {
    if (!selectedState) return;
    const handler = (e: MouseEvent) => {
      if (cardRef.current?.contains(e.target as Node)) return;
      const target = e.target as Element;
      if (target.tagName === "path" && target.closest("svg") === svgRef.current) return;
      setSelectedState(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedState]);

  const handleStateClick = useCallback((abbr: string) => {
    const office = getStateOffice(abbr);
    if (office) {
      setSelectedState(prev => prev?.abbr === abbr ? null : office);
    }
  }, []);

  const getVal = useCallback((abbr: string, field: string, fallback?: string) => {
    return settings[`cos_${abbr}_${field}`] || fallback || "";
  }, [settings]);

  const setVal = useCallback(async (abbr: string, field: string, value: string) => {
    await setSetting(`cos_${abbr}_${field}`, value);
  }, [setSetting]);

  // Inline edit helper
  const EditableField = ({ abbr, field, fallback, className = "", label }: {
    abbr: string; field: string; fallback?: string; className?: string; label?: string;
  }) => {
    const val = getVal(abbr, field, fallback);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(val);

    if (isAdmin && editing) {
      return (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { setVal(abbr, field, draft); setEditing(false); }}
          onKeyDown={e => {
            if (e.key === "Enter") { setVal(abbr, field, draft); setEditing(false); }
            if (e.key === "Escape") setEditing(false);
          }}
          className="bg-black/30 border border-events-coral/50 rounded px-1 py-0.5 text-xs text-events-cream w-full"
          placeholder={label || field}
        />
      );
    }

    return (
      <span
        className={`${className} ${isAdmin ? "cursor-pointer hover:underline decoration-dotted" : ""}`}
        onClick={isAdmin ? (e) => { e.preventDefault(); e.stopPropagation(); setDraft(val); setEditing(true); } : undefined}
        title={isAdmin ? `Click to edit ${label || field}` : undefined}
      >
        {val || (isAdmin ? `[${label || field}]` : "")}
      </span>
    );
  };

  // Editable link helper — shows link for non-admins, editable URL for admins
  const EditableLink = ({ abbr, field, fallback, children, className = "", label, icon: Icon }: {
    abbr: string; field: string; fallback?: string; children?: React.ReactNode; className?: string; label?: string; icon?: React.ElementType;
  }) => {
    const val = getVal(abbr, field, fallback);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(val);

    if (isAdmin && editing) {
      return (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { setVal(abbr, field, draft); setEditing(false); }}
          onKeyDown={e => {
            if (e.key === "Enter") { setVal(abbr, field, draft); setEditing(false); }
            if (e.key === "Escape") setEditing(false);
          }}
          className="bg-black/30 border border-events-coral/50 rounded px-1 py-0.5 text-xs text-events-cream w-full"
          placeholder={label || field}
        />
      );
    }

    if (isAdmin) {
      // Admin can see it + click to edit
      return (
        <span
          className={`${className} cursor-pointer hover:underline decoration-dotted inline-flex items-center gap-1`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDraft(val); setEditing(true); }}
          title={`Click to edit ${label || field}`}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {children || val || `[${label || field}]`}
        </span>
      );
    }

    // Non-admin: only show if populated
    if (!val) return null;

    return (
      <a href={val} target="_blank" rel="noopener noreferrer" className={className}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </a>
    );
  };

  // Social icon that only shows if populated (for non-admins)
  const SocialIcon = ({ abbr, field, fallback, icon: Icon, label }: {
    abbr: string; field: string; fallback?: string; icon: React.ElementType; label: string;
  }) => {
    const val = getVal(abbr, field, fallback);

    if (isAdmin) {
      return (
        <EditableLink
          abbr={abbr}
          field={field}
          fallback={fallback}
          icon={Icon}
          label={label}
          className={val ? "text-events-cream/50 hover:text-events-yellow transition-colors" : "text-events-cream/20 hover:text-events-yellow transition-colors"}
        />
      );
    }

    if (!val) return null;
    return (
      <a href={val} target="_blank" rel="noopener noreferrer" className="text-events-cream/50 hover:text-events-yellow transition-colors" title={label}>
        <Icon className="w-4 h-4" />
      </a>
    );
  };

  const getCardPosition = (abbr: string) => {
    const centroid = stateCentroids[abbr];
    if (!centroid || !svgRef.current || !containerRef.current) return { top: 0, left: 0 };
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / 960;
    const scaleY = svgRect.height / 600;
    return {
      top: centroid[1] * scaleY + svgRect.top - containerRect.top,
      left: centroid[0] * scaleX + svgRect.left - containerRect.left,
    };
  };

  const selected = selectedState;
  const cardPos = selected ? getCardPosition(selected.abbr) : null;

  // Compute icon size based on state (larger states get bigger icons)
  const getIconSize = (abbr: string) => {
    const large = ["MT", "CO", "OR", "WA", "UT", "NM", "NV", "WY", "MN", "MI", "NC", "PA", "VA"];
    return large.includes(abbr) ? 55 : 40;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} viewBox="0 0 960 600" className="w-full h-auto">
        <defs>
          {Object.entries(statePathData).map(([abbr, path]) => {
            if (!memberAbbrs.has(abbr)) return null;
            return (
              <clipPath key={`clip-${abbr}`} id={`clip-${abbr}`}>
                <path d={path} />
              </clipPath>
            );
          })}
        </defs>

        {Object.entries(statePathData).map(([abbr, path]) => {
          const isMember = memberAbbrs.has(abbr);
          const isHovered = hoveredAbbr === abbr;
          const isSelected = selected?.abbr === abbr;
          const color = stateColors[abbr] || "#ccc";

          return (
            <g key={abbr}>
              <path
                d={path}
                fill={
                  isMember
                    ? isSelected ? color : isHovered ? color : `${color}CC`
                    : "rgba(245, 230, 211, 0.08)"
                }
                stroke={isMember ? "rgba(255,255,255,0.6)" : "rgba(245, 230, 211, 0.15)"}
                strokeWidth={isMember ? (isSelected || isHovered ? 2.5 : 1.5) : 0.5}
                className={`transition-all duration-200 ${isMember ? "cursor-pointer" : ""}`}
                style={isMember && (isSelected || isHovered) ? { filter: "brightness(1.15) saturate(1.2)" } : undefined}
                onMouseEnter={() => isMember && setHoveredAbbr(abbr)}
                onMouseLeave={() => setHoveredAbbr(null)}
                onClick={() => isMember && handleStateClick(abbr)}
              />
              {/* Large illustrated icons clipped to state */}
              {isMember && stateCentroids[abbr] && stateIcons[abbr] && (
                <g clipPath={`url(#clip-${abbr})`} pointerEvents="none">
                  {stateIcons[abbr].map((icon, i) => {
                    const [cx, cy] = stateCentroids[abbr];
                    const iconSize = getIconSize(abbr);
                    const offset = stateIcons[abbr].length === 1 ? 0 : i === 0 ? -(iconSize * 0.45) : (iconSize * 0.45);
                    return <ActivityIcon key={i} type={icon} x={cx + offset} y={cy - 4} size={iconSize} />;
                  })}
                </g>
              )}
              {/* Large bold state abbreviation */}
              {isMember && stateCentroids[abbr] && (
                <text
                  x={stateCentroids[abbr][0]}
                  y={stateCentroids[abbr][1] + (getIconSize(abbr) * 0.5) + 8}
                  textAnchor="middle"
                  fontSize={18}
                  fontWeight={900}
                  fill="rgba(255,255,255,0.9)"
                  pointerEvents="none"
                  className="font-display"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                >
                  {abbr}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Pinned info card */}
      <AnimatePresence>
        {selected && cardPos && (
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-40 pointer-events-auto"
            style={{
              top: cardPos.top,
              left: Math.min(Math.max(cardPos.left, 170), containerRef.current ? containerRef.current.offsetWidth - 190 : 600),
              transform: "translate(-50%, -110%)",
            }}
          >
            <div className="bg-events-card border border-events-cream/20 rounded-2xl p-5 shadow-2xl min-w-[300px] max-w-[360px] relative">
              <button
                onClick={() => setSelectedState(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-events-cream/10 flex items-center justify-center hover:bg-events-cream/20 transition-colors"
              >
                <XIcon className="w-3.5 h-3.5 text-events-cream/60" />
              </button>

              {/* Director photo + name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  {isAdmin ? (
                    <div
                      className="cursor-pointer group"
                      onClick={() => {
                        const url = prompt("Enter director photo URL:", getVal(selected.abbr, "directorPhoto", selected.directorPhoto));
                        if (url !== null) setVal(selected.abbr, "directorPhoto", url);
                      }}
                    >
                      <Avatar className="w-14 h-14 border-2 border-events-yellow/50">
                        <AvatarImage src={getVal(selected.abbr, "directorPhoto", selected.directorPhoto)} />
                        <AvatarFallback className="bg-events-teal text-events-cream text-sm">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">Edit</span>
                      </div>
                    </div>
                  ) : (
                    <Avatar className="w-14 h-14 border-2 border-events-yellow/50">
                      <AvatarImage src={getVal(selected.abbr, "directorPhoto", selected.directorPhoto)} />
                      <AvatarFallback className="bg-events-teal text-events-cream text-sm">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-display font-bold px-2 py-0.5 rounded-full text-events-cream"
                      style={{ backgroundColor: stateColors[selected.abbr] || "#ED7660" }}>
                      {selected.abbr}
                    </span>
                    <h4 className="font-headline font-bold text-events-cream text-base truncate">
                      {selected.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <EditableField abbr={selected.abbr} field="director" fallback={selected.director} className="text-events-cream/80 text-xs font-body" label="Director name" />
                    <SocialIcon abbr={selected.abbr} field="directorLinkedin" fallback={selected.directorLinkedin} icon={Linkedin} label="Director LinkedIn" />
                  </div>
                </div>
              </div>

              {/* Office name */}
              <div className="text-events-cream/60 text-xs mb-3 leading-relaxed font-body">
                <EditableField abbr={selected.abbr} field="officeName" fallback={selected.officeName} label="Office name" />
              </div>

              {/* Stats grid — removed MapPin row, replaced with nonprofit partner */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <Calendar className="w-3 h-3 text-events-yellow shrink-0" />
                  <span>Joined {selected.yearJoined}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <DollarSign className="w-3 h-3 text-events-yellow shrink-0" />
                  <EditableField abbr={selected.abbr} field="economicImpact" fallback={selected.economicImpact} label="Economic impact" />
                  <span className="text-events-cream/50">impact</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <Briefcase className="w-3 h-3 text-events-yellow shrink-0" />
                  <EditableField abbr={selected.abbr} field="jobs" fallback={selected.jobs} label="Jobs" />
                  <span className="text-events-cream/50">jobs</span>
                </div>
                {/* Nonprofit partner slot */}
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  {(() => {
                    const partnerName = getVal(selected.abbr, "nonprofitPartner", selected.nonprofitPartner);
                    const partnerUrl = getVal(selected.abbr, "nonprofitPartnerUrl", selected.nonprofitPartnerUrl);
                    const partnerLogo = getVal(selected.abbr, "nonprofitPartnerLogo", selected.nonprofitPartnerLogo);

                    if (isAdmin) {
                      return (
                        <div className="flex items-center gap-1 w-full">
                          {partnerLogo && (
                            <img src={partnerLogo} alt="" className="w-4 h-4 rounded-full object-cover cursor-pointer" onClick={() => {
                              const url = prompt("Nonprofit logo URL:", partnerLogo);
                              if (url !== null) setVal(selected.abbr, "nonprofitPartnerLogo", url);
                            }} />
                          )}
                          {!partnerLogo && (
                            <Globe className="w-3 h-3 text-events-yellow shrink-0 cursor-pointer" onClick={() => {
                              const url = prompt("Nonprofit logo URL:");
                              if (url) setVal(selected.abbr, "nonprofitPartnerLogo", url);
                            }} />
                          )}
                          <EditableField abbr={selected.abbr} field="nonprofitPartner" fallback={selected.nonprofitPartner} label="Partner org" className="text-xs" />
                          <span className="text-events-cream/30 text-[10px] cursor-pointer" onClick={() => {
                            const url = prompt("Partner website URL:", partnerUrl);
                            if (url !== null) setVal(selected.abbr, "nonprofitPartnerUrl", url);
                          }} title="Edit partner URL">🔗</span>
                        </div>
                      );
                    }

                    if (!partnerName) return null;
                    return (
                      <div className="flex items-center gap-1.5">
                        {partnerLogo && <img src={partnerLogo} alt="" className="w-4 h-4 rounded-full object-cover" />}
                        {partnerUrl ? (
                          <a href={partnerUrl} target="_blank" rel="noopener noreferrer" className="text-events-yellow hover:text-events-coral transition-colors text-xs">
                            {partnerName}
                          </a>
                        ) : (
                          <span className="text-xs">{partnerName}</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Links row */}
              <div className="flex items-center gap-3 pt-2 border-t border-events-cream/10">
                <EditableLink
                  abbr={selected.abbr}
                  field="website"
                  fallback={selected.website}
                  label="Office website"
                  className="inline-flex items-center gap-1 text-xs text-events-yellow hover:text-events-coral transition-colors font-display font-bold"
                >
                  Visit Office <ExternalLink className="w-3 h-3" />
                </EditableLink>

                <div className="flex items-center gap-2 ml-auto">
                  <SocialIcon abbr={selected.abbr} field="linkedin" fallback={selected.linkedin} icon={Linkedin} label="Office LinkedIn" />
                  <SocialIcon abbr={selected.abbr} field="instagram" fallback={selected.instagram} icon={Instagram} label="Office Instagram" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfluenceMap;
