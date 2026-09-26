import React from 'react';

interface SvgQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

/**
 * High-clarity vector QR Code element for Thermal Labels and Luxury Cards
 */
export const SvgQrCode: React.FC<SvgQrCodeProps> = ({
  value,
  size = 64,
  className = '',
  darkColor = '#000000',
  lightColor = '#ffffff',
}) => {
  const gridSize = 25; // 25x25 matrix
  const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  // Helper to draw square finder patterns (7x7) at (top-left, top-right, bottom-left)
  const drawFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInnerCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[startRow + r][startCol + c] = isOuterBorder || isInnerCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, gridSize - 7);
  drawFinder(gridSize - 7, 0);

  // Timing patterns
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Pseudo-random data distribution based on value hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder zones
      const inFinderTL = r < 8 && c < 8;
      const inFinderTR = r < 8 && c >= gridSize - 8;
      const inFinderBL = r >= gridSize - 8 && c < 8;
      if (inFinderTL || inFinderTR || inFinderBL) continue;
      if (r === 6 || c === 6) continue;

      // Seed bit
      const bitVal = Math.sin(hash + r * 19 + c * 31 + value.length);
      matrix[r][c] = bitVal > 0.15;
    }
  }

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        width={size}
        height={size}
        style={{ background: lightColor }}
        shapeRendering="crispEdges"
      >
        <rect width={gridSize} height={gridSize} fill={lightColor} />
        {matrix.map((row, r) =>
          row.map((isDark, c) =>
            isDark ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width={1}
                height={1}
                fill={darkColor}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
