import React, { useState } from 'react';
import styles from './AvatarSelector.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '../icons/Icons';

// Definimos las categorías y generamos 5 variantes para cada una
const avatarCategories = [
  { name: 'adventurer', count: 5 },
  { name: 'bottts', count: 5 },
  { name: 'pixel-art', count: 5 },
  { name: 'micah', count: 5 },
  { name: 'fun-emoji', count: 5 },
  { name: 'lorelei', count: 5 },
  { name: 'notionists', count: 5 },
  { name: 'shapes', count: 5 },
].map(category => ({
  ...category,
  urls: Array.from({ length: category.count }, () => 
    `https://api.dicebear.com/7.x/${category.name}/svg?seed=${Math.random().toString(36).substring(7)}`
  )
}));

export default function AvatarSelector({ selectedAvatar, onSelectAvatar }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.selectorContainer}>
      <p className={styles.label}>Elige un avatar</p>
      
      <div className={`${styles.categoriesContainer} ${isExpanded ? styles.expanded : ''}`}>
        {avatarCategories.map(category => (
          <div key={category.name} className={styles.categorySection}>
            <h4 className={styles.categoryTitle}>{category.name.replace('-', ' ')}</h4>
            <div className={styles.avatarGrid}>
              {category.urls.map(url => (
                <div 
                  key={url}
                  className={`${styles.avatarOption} ${selectedAvatar === url ? styles.selected : ''}`}
                  onClick={() => onSelectAvatar(url)}
                >
                  <img src={url} alt={`Avatar estilo ${category.name}`} className={styles.avatarImage} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" 
        onClick={() => setIsExpanded(!isExpanded)} 
        className={styles.toggleButton}
      >
        {isExpanded ? (
          <>
            <ChevronUpIcon />
            Mostrar menos
          </>
        ) : (
          <>
            <ChevronDownIcon />
            Mostrar más
          </>
        )}
      </button>
    </div>
  );
}