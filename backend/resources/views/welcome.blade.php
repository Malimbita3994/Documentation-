<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="IDAP Intelligent Documentation Analysis Platform - Comprehensive software documentation and requirements management system">

        <title>IDAP - Intelligent Documentation Analysis Platform</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
        
        <!-- Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

        <!-- Styles -->
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Instrument Sans', sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }

            /* Header */
            .header {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 1rem 0;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }

            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .logo {
                font-size: 1.8rem;
                font-weight: 700;
                color: #667eea;
                text-decoration: none;
            }

            .nav-links {
                display: flex;
                gap: 2rem;
                list-style: none;
            }

            .nav-links a {
                text-decoration: none;
                color: #1a1a1a;
                font-weight: 500;
                transition: color 0.3s ease;
            }

            .nav-links a:hover {
                color: #667eea;
            }

            .cta-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: transform 0.3s ease;
            }

            .cta-button:hover {
                transform: translateY(-2px);
            }

            /* Hero Section */
            .hero {
                padding: 120px 0 80px;
                text-align: center;
                color: white;
            }

            .hero h1 {
                font-size: 3.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }

            .hero p {
                font-size: 1.3rem;
                margin-bottom: 2rem;
                opacity: 0.9;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }

            .hero-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .btn {
                padding: 1rem 2rem;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }

            .btn-primary {
                background: white;
                color: #667eea;
            }

            .btn-secondary {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }

            /* Services Section */
            .services {
                padding: 80px 0;
                background: white;
            }

            .section-title {
                text-align: center;
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 3rem;
                color: #1a1a1a;
            }

            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-top: 3rem;
            }

            .service-card {
                background: white;
                padding: 2rem;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid #f0f0f0;
            }

            .service-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }

            .service-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 1.5rem;
                color: white;
                font-size: 1.5rem;
            }

            .service-card h3 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #1a1a1a;
            }

            .service-card p {
                color: #666;
                line-height: 1.6;
            }

            /* Features Section */
            .features {
                padding: 80px 0;
                background: #f8f9fa;
            }

            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin-top: 3rem;
            }

            .feature-item {
                text-align: center;
                padding: 2rem;
            }

            .feature-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                color: white;
                font-size: 2rem;
            }

            .feature-item h4 {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #1a1a1a;
            }

            .feature-item p {
                color: #666;
            }

            /* CTA Section */
            .cta-section {
                padding: 80px 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }

            .cta-section h2 {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
            }

            .cta-section p {
                font-size: 1.2rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }

            /* Footer */
            .footer {
                background: #1a1a1a;
                color: white;
                padding: 3rem 0 1rem;
                text-align: center;
            }

            .footer-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }

            .footer-section h3 {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #667eea;
            }

            .footer-section p, .footer-section a {
                color: #ccc;
                text-decoration: none;
                line-height: 1.6;
            }

            .footer-section a:hover {
                color: #667eea;
            }

            .footer-bottom {
                border-top: 1px solid #333;
                padding-top: 1rem;
                color: #999;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .hero h1 {
                    font-size: 2.5rem;
                }

                .hero p {
                    font-size: 1.1rem;
                }

                .nav-links {
                    display: none;
                }

                .services-grid, .features-grid {
                    grid-template-columns: 1fr;
                }

                .hero-buttons {
                    flex-direction: column;
                    align-items: center;
                }

                .btn {
                    width: 100%;
                    max-width: 300px;
                    justify-content: center;
                }
            }

            /* Animations */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out;
            }

            /* Ocean Waves Background */
            .ocean-bg {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                z-index: -1;
            }

            .wave {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 200%;
                height: 100px;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="%23ffffff"></path><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="%23ffffff"></path><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="%23ffffff"></path></svg>') repeat-x;
                animation: wave 10s linear infinite;
            }

            .wave:nth-child(2) {
                animation-delay: -5s;
                opacity: 0.5;
            }

            @keyframes wave {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <a href="#" class="logo">IDAP</a>
                    <ul class="nav-links">
                        <li><a href="#services">Services</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <a href="http://localhost:3000/login" class="cta-button">Get Started</a>
                </nav>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="hero">
            <div class="ocean-bg">
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
            <div class="container">
                <h1 class="animate-fade-in-up">Intelligent Documentation Analysis Platform</h1>
                <p class="animate-fade-in-up">Transform your software development process with AI-powered documentation, requirements management, and comprehensive analysis tools.</p>
                <div class="hero-buttons animate-fade-in-up">
                    <a href="http://localhost:3000/login" class="btn btn-primary">
                        <i class="fas fa-rocket"></i>
                        Start Your Project
                    </a>
                    <a href="#services" class="btn btn-secondary">
                        <i class="fas fa-play"></i>
                        Explore Services
                    </a>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="services">
            <div class="container">
                <h2 class="section-title">Our Comprehensive Services</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <h3>SRS Development</h3>
                        <p>Comprehensive Software Requirements Specification following IEEE 830-1998 standards with AI-powered generation and validation.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <h3>System Design Documents</h3>
                        <p>Detailed Software Design Documents (SDD) with UML diagrams, architecture patterns, and technical specifications.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <h3>Test Case Management</h3>
                        <p>Comprehensive test case generation, management, and traceability with automated test planning and execution.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>User Manual Creation</h3>
                        <p>Professional user manuals and documentation with step-by-step guides and interactive tutorials.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>Project Progress Reports</h3>
                        <p>Automated progress tracking, milestone management, and comprehensive project status reporting.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <h3>Concept Notes & Feasibility Studies</h3>
                        <p>Detailed concept development and feasibility analysis with market research and technical assessment.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3>Requirements Traceability</h3>
                        <p>Advanced requirements traceability matrix with impact analysis and change management.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-handshake"></i>
                        </div>
                        <h3>Stakeholder Management</h3>
                        <p>Comprehensive stakeholder identification, communication planning, and engagement tracking.</p>
                    </div>

                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Requirements Validation</h3>
                        <p>Automated requirements validation engine with consistency checking and quality assurance.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features">
            <div class="container">
                <h2 class="section-title">Advanced Features</h2>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h4>AI-Powered Generation</h4>
                        <p>Intelligent document generation using advanced AI algorithms for faster, more accurate documentation.</p>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-users-cog"></i>
                        </div>
                        <h4>Role-Based Access Control</h4>
                        <p>Comprehensive user management with granular permissions and role-based access control.</p>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-draw-polygon"></i>
                        </div>
                        <h4>UML Modeling Tools</h4>
                        <p>Advanced UML diagram creation including Use Case, Sequence, State Transition, and Data Flow diagrams.</p>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <h4>Multi-Format Export</h4>
                        <p>Export documents in PDF, Word, HTML, Excel, JSON, and XML formats with professional formatting.</p>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-plug"></i>
                        </div>
                        <h4>Third-Party Integration</h4>
                        <p>Seamless integration with Jira, Confluence, TestRail, GitHub, and other development tools.</p>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h4>Collaboration & Review</h4>
                        <p>Real-time collaboration features with commenting, review workflows, and approval processes.</p>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <h4>Analytics & Insights</h4>
                        <p>Comprehensive analytics dashboard with project metrics, progress tracking, and performance insights.</p>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h4>Responsive Design</h4>
                        <p>Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <h2>Ready to Transform Your Documentation Process?</h2>
                <p>Join thousands of developers and teams who trust IDAP for their documentation needs.</p>
                <div class="hero-buttons">
                    <a href="http://localhost:3000/register" class="btn btn-primary">
                        <i class="fas fa-user-plus"></i>
                        Create Free Account
                    </a>
                    <a href="http://localhost:3000/login" class="btn btn-secondary">
                        <i class="fas fa-sign-in-alt"></i>
                        Sign In
                    </a>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>IDAP Platform</h3>
                        <p>Intelligent Documentation Analysis Platform - The complete solution for software documentation and requirements management.</p>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <p><a href="#services">Services</a></p>
                        <p><a href="#features">Features</a></p>
                        <p><a href="http://localhost:3000/login">Login</a></p>
                        <p><a href="http://localhost:3000/register">Register</a></p>
                    </div>
                    <div class="footer-section">
                        <h3>Support</h3>
                        <p><a href="#contact">Contact Us</a></p>
                        <p><a href="#help">Help Center</a></p>
                        <p><a href="#docs">Documentation</a></p>
                        <p><a href="#api">API Reference</a></p>
                    </div>
                    <div class="footer-section">
                        <h3>Connect</h3>
                        <p><a href="#"><i class="fab fa-twitter"></i> Twitter</a></p>
                        <p><a href="#"><i class="fab fa-linkedin"></i> LinkedIn</a></p>
                        <p><a href="#"><i class="fab fa-github"></i> GitHub</a></p>
                        <p><a href="#"><i class="fas fa-envelope"></i> Email</a></p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 IDAP Intelligent Documentation Analysis Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <!-- Smooth Scrolling -->
        <script>
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add scroll effect to header
            window.addEventListener('scroll', function() {
                const header = document.querySelector('.header');
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                }
            });

            // Add animation on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all service cards and feature items
            document.querySelectorAll('.service-card, .feature-item').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        </script>
    </body>
</html>
