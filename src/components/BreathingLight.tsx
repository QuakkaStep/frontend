import React from 'react';

interface BreathingLightProps {
  color?: string;
  size?: number;
}

const BreathingLight: React.FC<BreathingLightProps> = ({ 
  color = '#4CAF50', // 默认绿色
  size = 12 
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        animation: 'breathing 2s ease-in-out infinite',
        marginRight: '8px',
      }}
    />
  );
};

// 添加全局样式
const style = document.createElement('style');
style.textContent = `
  @keyframes breathing {
    0% {
      opacity: 0.4;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 0.4;
      transform: scale(0.8);
    }
  }
`;
document.head.appendChild(style);

export default BreathingLight; 