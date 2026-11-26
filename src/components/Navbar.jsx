import React, { useEffect, useState } from 'react';
import StaggeredMenu from './StaggeredMenu';

export default function Navbar({ onOpenSurvey }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const menuItems = [
    { label: 'Le Constat', ariaLabel: '4 Obstacles étudiants', link: '#obstacles' },
    { label: '6 Agents IA', ariaLabel: 'Les agents spécialisés', link: '#agents' },
    { label: 'Parcours', ariaLabel: 'Workflow en 6 étapes', link: '#journey' },
    { label: 'Cas Concret', ariaLabel: 'Cas Sara M1 Informatique', link: '#cas-sara' },
    { label: 'Accompagnement', ariaLabel: 'Les services proposés par AvenirGo', link: '#accompagnement' },
    { label: 'Modèle Éco', ariaLabel: 'Freemium, Premium et B2B', link: '#modele-economique' },
    { label: 'Étude & Bêta', ariaLabel: 'Questionnaire et premiers testeurs', link: '#questionnaire' }
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <StaggeredMenu
        position="right"
        items={menuItems}
        displayItemNumbering={true}
        menuButtonColor="#1e293b"
        openMenuButtonColor="#6366f1"
        changeMenuColorOnOpen={true}
        colors={['#6366f1', '#6366f1', '#E0E7FF']}
        logoUrl="/logo-icon.svg"
        accentColor="#6366f1"
        isFixed={true}
        isScrolled={isScrolled}
        onMenuOpen={() => console.log('Staggered Menu opened')}
        onMenuClose={() => console.log('Staggered Menu closed')}
      />
    </div>
  );
}
