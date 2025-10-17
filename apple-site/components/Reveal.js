import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Reveal({
  children,
  delay = 0,
  className = '',
  y = 40,
  once = true,
  ...rest
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    margin: '-15% 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
