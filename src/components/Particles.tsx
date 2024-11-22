import React, { useCallback } from 'react';
import { Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';
import { useSettingsStore } from '../store/settingsStore';

export default function ParticleEffect() {
  const { particlesEnabled } = useSettingsStore();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  if (!particlesEnabled) return null;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#ffffff',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.5,
            random: false,
          },
          size: {
            value: 3,
            random: true,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
        },
        retina_detect: true,
      }}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}