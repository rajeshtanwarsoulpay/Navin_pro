import { useState, useEffect } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader ${visible ? '' : 'hidden'}`}>
      <div className="preloader-spinner"></div>
    </div>
  );
}
