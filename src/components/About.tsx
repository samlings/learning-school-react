import React from 'react'
import './About.css'
import { useLanguage } from '../contexts/LanguageContext'

const About: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <h1>{t('about.title')}</h1>
          <p className="about-subtitle">{t('about.subtitle')}</p>
        </header>

        <section className="about-section">
          <h2>{t('about.mission.title')}</h2>
          <p>{t('about.mission.description')}</p>
        </section>

        <section className="about-section">
          <h2>{t('about.features.title')}</h2>
          <ul className="features-list">
            <li>{t('about.features.multilingual')}</li>
            <li>{t('about.features.educational')}</li>
            <li>{t('about.features.interactive')}</li>
            <li>{t('about.features.free')}</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>{t('about.team.title')}</h2>
          <p>{t('about.team.description')}</p>
        </section>

        <section className="about-section contact-section">
          <h2>{t('about.contact.title')}</h2>
          <div className="contact-info">
            <p>
              <span className="contact-icon">📧</span>
              <span>{t('about.contact.email')}: </span>
              <a href="mailto:contact@aventuraescolar.pt">contact@aventuraescolar.pt</a>
            </p>
            <p>
              <span className="contact-icon">🌐</span>
              <span>{t('about.contact.website')}: </span>
              <a href="#" target="_blank" rel="noopener noreferrer">www.aventuraescolar.pt</a>
            </p>
          </div>
        </section>

        <footer className="about-footer">
          <p>{t('about.footer.made.with.love')}</p>
        </footer>
      </div>
    </div>
  )
}

export default About