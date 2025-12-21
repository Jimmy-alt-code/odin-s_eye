import React from 'react';
import './BenefitsCarousel.css';

const BenefitsCarousel = () => {
  const benefits = [
    {
      id: 1,
      icon: '🚀',
      title: 'Fast Performance',
      description: 'Lightning-fast loading times and optimized performance for the best user experience.'
    },
    {
      id: 2,
      icon: '🛡️',
      title: 'Secure & Safe',
      description: 'Enterprise-grade security with end-to-end encryption and data protection.'
    },
    {
      id: 3,
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Fully responsive design that works perfectly on all devices and screen sizes.'
    },
    {
      id: 4,
      icon: '💡',
      title: 'Easy to Use',
      description: 'Intuitive interface designed for users of all skill levels and backgrounds.'
    },
    {
      id: 5,
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Stay connected with instant notifications and real-time data synchronization.'
    },
    {
      id: 6,
      icon: '🎯',
      title: 'Targeted Solutions',
      description: 'Customized features and tools tailored to meet your specific business needs.'
    },
    {
      id: 7,
      icon: '🌍',
      title: 'Global Support',
      description: '24/7 worldwide customer support in multiple languages and time zones.'
    },
    {
      id: 8,
      icon: '💰',
      title: 'Cost Effective',
      description: 'Affordable pricing plans with excellent value and no hidden fees or charges.'
    }
  ];

  // Duplicate benefits for seamless infinite loop
  const duplicatedBenefits = [...benefits, ...benefits];

  return (
    <div className="benefits-section">
      <div className="benefits-header">
        <h2>Why Choose Our Platform</h2>
        <p>Discover the key benefits that make us the preferred choice</p>
      </div>
      
      <div className="carousel-container">
        <div className="carousel-track">
          {duplicatedBenefits.map((benefit, index) => (
            <div key={`${benefit.id}-${index}`} className="benefit-box">
              <div className="benefit-icon">
                {benefit.icon}
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsCarousel;
