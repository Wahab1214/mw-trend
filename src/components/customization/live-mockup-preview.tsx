'use client';

import * as React from 'react';
import { CustomizationValues, MockupType } from '@/types';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface LiveMockupPreviewProps {
  mockupType?: MockupType;
  customValues: CustomizationValues;
  baseImage?: string;
  className?: string;
}

export function LiveMockupPreview({
  mockupType = 'mug',
  customValues,
  baseImage,
  className,
}: LiveMockupPreviewProps) {
  const customText = customValues.name_text || customValues.message_text || 'YOUR NAME';
  const fontChoice = customValues.font_choice || 'Playfair Serif';
  const textColor = customValues.text_color || 'Pure Gold';

  // Font family mapping
  const getFontFamily = (choice: string) => {
    switch (choice) {
      case 'Playfair Serif':
      case 'Classic Serif':
      case 'Minimal Serif':
      case 'Roman Serif':
        return "'Playfair Display', Georgia, serif";
      case 'Signature Script':
      case 'Script':
      case 'Cursive Script':
      case 'Signature Luxury':
        return "'Brush Script MT', 'Great Vibes', cursive";
      case 'Gothic Bold':
      case 'College Gothic':
      case 'Athletic Bold':
        return "Impact, 'Arial Black', sans-serif";
      case 'Modern Sans':
      case 'Clean Sans':
      case 'Cyber Sans':
      case 'Bold Vertical':
      default:
        return "'Inter', system-ui, sans-serif";
    }
  };

  // Text color mapping
  const getColorStyle = (color: string) => {
    switch (color) {
      case 'Pure Gold':
      case 'Champagne Gold':
      case 'Gold Foil':
      case 'Gold Thread':
        return {
          color: '#E3C877',
          textShadow: '0 1px 4px rgba(201, 164, 76, 0.6), 0 0 10px rgba(227, 200, 119, 0.4)',
        };
      case 'Rose Gold':
      case 'Blush Pink':
        return {
          color: '#F4C6D0',
          textShadow: '0 1px 4px rgba(244, 198, 208, 0.5)',
        };
      case 'Silver Chrome':
      case 'Silver':
        return {
          color: '#E0E0E0',
          textShadow: '0 1px 3px rgba(255, 255, 255, 0.5)',
        };
      case 'Pitch Black':
        return {
          color: '#121212',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.1)',
        };
      case 'Off-White':
      case 'Matte White':
      default:
        return {
          color: '#FAF8F3',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
        };
    }
  };

  const textStyle = {
    fontFamily: getFontFamily(fontChoice),
    ...getColorStyle(textColor),
  };

  return (
    <div className={cn('relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0D0D0D] border border-border select-none shadow-lg group', className)}>
      {/* Live Preview Label Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-gold/40 text-[11px] font-semibold text-gold backdrop-blur-md">
        <Sparkles className="w-3 h-3 text-gold animate-spin" style={{ animationDuration: '4s' }} />
        <span>Live 3D Custom Preview</span>
      </div>

      {/* SVG Canvas Mockup Engine */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle lighting overlay */}
          <radialGradient id="mockupLighting" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.12" />
            <stop offset="60%" stop-color="#000000" stop-opacity="0" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0.6" />
          </radialGradient>

          {/* Curved path for Mugs */}
          <path id="mugCurve" d="M 120 250 Q 250 270 380 250" fill="none" />
          {/* Curved path for Caps */}
          <path id="capCurve" d="M 150 220 Q 250 170 350 220" fill="none" />
        </defs>

        {/* 1. MUG MOCKUP */}
        {mockupType === 'mug' && (
          <g>
            {/* Background Studio Glow */}
            <rect width="500" height="500" fill="#141414" />
            <circle cx="250" cy="230" r="180" fill="#1C1C1C" />

            {/* Mug Body */}
            <path
              d="M 140 130 C 140 130 150 380 180 390 C 210 400 290 400 320 390 C 350 380 360 130 360 130 Z"
              fill="#181818"
              stroke="#2A2A2A"
              strokeWidth="3"
            />
            {/* Mug Rim */}
            <ellipse cx="250" cy="130" rx="110" ry="24" fill="#222222" stroke="#C9A44C" strokeWidth="2" strokeOpacity="0.8" />
            <ellipse cx="250" cy="130" rx="98" ry="18" fill="#0A0A0A" />

            {/* Mug Handle */}
            <path
              d="M 350 170 C 430 170 430 320 340 330"
              fill="none"
              stroke="#1C1C1C"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M 350 170 C 430 170 430 320 340 330"
              fill="none"
              stroke="#2A2A2A"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Gold Geometric Monogram Accent */}
            <polygon points="250,180 270,200 250,220 230,200" fill="none" stroke="#C9A44C" strokeWidth="2" />
            <polygon points="250,192 258,200 250,208 242,200" fill="#E3C877" />

            {/* Live Custom Text Projected along Cylinder */}
            <text
              x="250"
              y="270"
              textAnchor="middle"
              style={textStyle}
              fontSize="24"
              fontWeight="bold"
              letterSpacing="3"
              fill="currentColor"
            >
              {customText}
            </text>

            {/* Secondary Subtitle if provided */}
            <text
              x="250"
              y="300"
              textAnchor="middle"
              fill="#A8A29A"
              fontSize="11"
              letterSpacing="6"
              fontFamily="sans-serif"
            >
              EDITION 2026
            </text>

            {/* Realistic Light Reflection Layer */}
            <rect width="500" height="500" fill="url(#mockupLighting)" pointerEvents="none" />
          </g>
        )}

        {/* 2. PEN MOCKUP */}
        {mockupType === 'pen' && (
          <g>
            <rect width="500" height="500" fill="#111111" />
            {/* Pen Shadow */}
            <ellipse cx="250" cy="310" rx="190" ry="12" fill="#000000" opacity="0.6" />

            {/* Pen Body (Matte Black Brass) */}
            <rect x="70" y="235" width="340" height="30" rx="15" fill="#1A1A1A" stroke="#333333" strokeWidth="2" />
            {/* Pen Clip (Gold) */}
            <rect x="330" y="222" width="60" height="6" rx="2" fill="#C9A44C" />
            <circle cx="390" cy="225" r="5" fill="#E3C877" />

            {/* Gold Trim Rings */}
            <rect x="230" y="234" width="8" height="32" fill="#C9A44C" />
            <rect x="242" y="234" width="4" height="32" fill="#E3C877" />

            {/* Pen Nib Cone */}
            <polygon points="70,235 70,265 25,250" fill="#C9A44C" />
            <polygon points="35,248 35,252 25,250" fill="#111111" />

            {/* Precision Laser Engraved Custom Name */}
            <text
              x="150"
              y="256"
              textAnchor="start"
              style={textStyle}
              fontSize="13"
              fontWeight="600"
              letterSpacing="2"
              fill="currentColor"
            >
              {customText}
            </text>

            <rect width="500" height="500" fill="url(#mockupLighting)" pointerEvents="none" />
          </g>
        )}

        {/* 3. T-SHIRT MOCKUP */}
        {mockupType === 'tshirt' && (
          <g>
            <rect width="500" height="500" fill="#141414" />
            {/* T-Shirt Silhouette */}
            <path
              d="M 170 100 Q 250 140 330 100 L 430 160 L 380 230 L 340 200 L 340 430 L 160 430 L 160 200 L 120 230 L 70 160 Z"
              fill="#1C1C1C"
              stroke="#2B2B2B"
              strokeWidth="3"
            />
            {/* Crewneck Collar */}
            <path d="M 190 105 Q 250 140 310 105" fill="none" stroke="#C9A44C" strokeWidth="3" strokeOpacity="0.4" />

            {/* Printed Custom Chest Graphic */}
            <g transform="translate(250, 260)">
              {/* Graphic Diamond Frame */}
              <polygon points="0,-45 45,0 0,45 -45,0" fill="none" stroke="#C9A44C" strokeWidth="2" strokeOpacity="0.6" />
              <text
                x="0"
                y="6"
                textAnchor="middle"
                style={textStyle}
                fontSize="20"
                fontWeight="bold"
                letterSpacing="4"
                fill="currentColor"
              >
                {customText}
              </text>
            </g>

            <rect width="500" height="500" fill="url(#mockupLighting)" pointerEvents="none" />
          </g>
        )}

        {/* 4. HOODIE MOCKUP */}
        {mockupType === 'hoodie' && (
          <g>
            <rect width="500" height="500" fill="#131313" />
            {/* Hoodie Body */}
            <path
              d="M 160 110 Q 250 160 340 110 L 440 180 L 390 260 L 350 220 L 350 440 L 150 440 L 150 220 L 110 260 L 60 180 Z"
              fill="#1A1A1A"
              stroke="#2C2C2C"
              strokeWidth="3"
            />
            {/* Kangaroo Pocket */}
            <path d="M 190 350 L 310 350 L 330 420 L 170 420 Z" fill="#141414" stroke="#2C2C2C" strokeWidth="2" />

            {/* Hood Overlap & Drawstrings */}
            <path d="M 190 120 C 230 180 270 180 310 120" fill="none" stroke="#0A0A0A" strokeWidth="16" />
            <line x1="225" y1="160" x2="225" y2="230" stroke="#C9A44C" strokeWidth="3" strokeLinecap="round" />
            <line x1="275" y1="160" x2="275" y2="220" stroke="#C9A44C" strokeWidth="3" strokeLinecap="round" />

            {/* Custom Embroidered Monogram on Chest */}
            <text
              x="250"
              y="275"
              textAnchor="middle"
              style={textStyle}
              fontSize="22"
              fontWeight="bold"
              letterSpacing="4"
              fill="currentColor"
            >
              {customText}
            </text>

            <rect width="500" height="500" fill="url(#mockupLighting)" pointerEvents="none" />
          </g>
        )}

        {/* 5. CAP MOCKUP */}
        {mockupType === 'cap' && (
          <g>
            <rect width="500" height="500" fill="#141414" />
            {/* Cap Crown Dome */}
            <path d="M 130 300 C 130 140 370 140 370 300 Z" fill="#1C1C1C" stroke="#2B2B2B" strokeWidth="3" />
            {/* Cap Visor / Brim */}
            <ellipse cx="250" cy="330" rx="160" ry="40" fill="#161616" stroke="#2A2A2A" strokeWidth="3" />
            {/* Button on top */}
            <circle cx="250" cy="140" r="10" fill="#C9A44C" />

            {/* 3D Arched Custom Text on Cap Crown */}
            <text
              x="250"
              y="235"
              textAnchor="middle"
              style={textStyle}
              fontSize="24"
              fontWeight="900"
              letterSpacing="3"
              fill="currentColor"
            >
              {customText}
            </text>

            <rect width="500" height="500" fill="url(#mockupLighting)" pointerEvents="none" />
          </g>
        )}

        {/* 6. PHONE CASE MOCKUP */}
        {mockupType === 'phone_case' && (
          <g>
            <rect width="500" height="500" fill="#141414" />
            {/* Phone Case Outer Shell */}
            <rect x="150" y="80" width="200" height="340" rx="36" fill="#1E1E1E" stroke="#333333" strokeWidth="3" />
            {/* Camera Module */}
            <rect x="170" y="100" width="70" height="70" rx="18" fill="#0A0A0A" stroke="#C9A44C" strokeWidth="1.5" />
            <circle cx="190" cy="120" r="12" fill="#222" stroke="#444" strokeWidth="2" />
            <circle cx="220" cy="150" r="12" fill="#222" stroke="#444" strokeWidth="2" />
            <circle cx="190" cy="150" r="8" fill="#111" />

            {/* Gold Geometric Monogram Diamond */}
            <polygon points="250,230 270,250 250,270 230,250" fill="none" stroke="#C9A44C" strokeWidth="2" />

            {/* Vertical or Horizontal Elegant Text */}
            <text
              x="250"
              y="320"
              textAnchor="middle"
              style={textStyle}
              fontSize="20"
              fontWeight="bold"
              letterSpacing="4"
              fill="currentColor"
            >
              {customText}
            </text>

            <rect width="500" height="500" fill="url(#mockupLighting)" pointerEvents="none" />
          </g>
        )}

        {/* 7. CARD MOCKUP */}
        {mockupType === 'card' && (
          <g>
            <rect width="500" height="500" fill="#151412" />
            {/* Envelope Backdrop */}
            <polygon points="90,140 250,240 410,140 410,380 90,380" fill="#221F1C" stroke="#332D28" strokeWidth="2" />
            <polygon points="90,140 250,250 410,140" fill="#1E1A17" stroke="#332D28" strokeWidth="2" />

            {/* Folded Art Card popping out */}
            <rect x="130" y="110" width="240" height="250" rx="6" fill="#FAF8F3" stroke="#E4DED1" strokeWidth="2" />
            <rect x="140" y="120" width="220" height="230" rx="4" fill="none" stroke="#C9A44C" strokeWidth="1" strokeDasharray="4 4" />

            {/* Gold Foil Monogram Emblem on Card */}
            <polygon points="250,150 265,165 250,180 235,165" fill="#A8832A" />

            {/* Romantic Calligraphy Greeting Text */}
            <text
              x="250"
              y="225"
              textAnchor="middle"
              style={{
                fontFamily: getFontFamily(fontChoice),
                color: '#7A5F1B',
                fill: '#7A5F1B',
              }}
              fontSize="20"
              fontWeight="bold"
            >
              {customText}
            </text>

            {customValues.message_text && (
              <text
                x="250"
                y="265"
                textAnchor="middle"
                fill="#5C564D"
                fontSize="10"
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                {customValues.message_text.slice(0, 35)}...
              </text>
            )}

            {/* Red / Gold Wax Seal Stamp */}
            <circle cx="250" cy="275" r="22" fill="#8B1E1E" stroke="#601212" strokeWidth="2" />
            <text x="250" y="280" textAnchor="middle" fill="#E3C877" fontSize="12" fontWeight="bold">MW</text>

            <rect width="500" height="500" fill="url(#mockupLighting)" pointerEvents="none" />
          </g>
        )}
      </svg>
    </div>
  );
}
