import React, { useEffect, useState } from 'react';

const FlowerConfetti = () => {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    const colors = ['#FF69B4', '#FF1493', '#FFA07A', '#FF6347', '#FFD700', '#7FFFD4', '#00FA9A', '#98FB98'];
    const newFlowers = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      animation: `fall-${Math.floor(Math.random() * 3) + 1} ${Math.random() * 3 + 2}s linear infinite`
    }));
    setFlowers(newFlowers);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            width: `${flower.size}px`,
            height: `${flower.size}px`,
            backgroundColor: flower.color,
            borderRadius: '50%',
            animation: flower.animation,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall-1 {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        @keyframes fall-2 {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(-360deg); }
        }
        @keyframes fall-3 {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(720deg); }
        }
      `}</style>
    </div>
  );
};

export default FlowerConfetti;